import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useAppState } from '../../state/application/hooks'
import { ButtonPrimary } from '../../components/Button'

// fetch main config data
import { useMulticall } from '../../utils/tools/multicall'
import { abi as MAINCONFIG_ABI } from '../../constants/abis/app/RouterConfig.json'
import { abi as CHAINCONFIG_ABI } from '../../constants/abis/app/AnyswapV6Router.json'
import { abi as CCTOKEN_ABI } from '../../constants/abis/app/AnyswapV6ERC20.json'
import { Interface as AbiInterface } from '@ethersproject/abi'

const MAINCONFIG_INTERFACE = new AbiInterface(MAINCONFIG_ABI)
const CHAINCONFIG_INTERFACE = new AbiInterface(CHAINCONFIG_ABI)
const CCTOKEN_INTERFACE = new AbiInterface(CCTOKEN_ABI)
const ERC20_INTERFACE = new AbiInterface(ERC20_ABI)

enum FetchConfigDataSteps {
  NONE = 0,                 // No Fetching
  MAIN_DATA = 1,            // Fetch exists chainIds and tokenIds
  CHAINS_AND_CCTOKENS = 2,  // Fetch chain routers and cc token routers
  UNDERLYNG_DATA = 3,       // Fetch underlying for each chain
}
// -- fetch main config data

export default function FetchMainConfig({
  onFetchCallback
}: {
  onFetchCallback: (appSettings: any) => void
}) {
  const { t } = useTranslation()
  const {
    appSettings: stateAppSettings,
  } = useAppState()

  const [appSettings] = useState( stateAppSettings )
  const [mainConfigChainId] = useState<string>(`${appSettings.mainConfigChainId}` || '')
  const [mainConfigAddress] = useState(appSettings.mainConfigAddress)

  const componentMounted = useRef(true)

  useEffect(() => {
    return () => {
      componentMounted.current = false
    }
  }, [])

  const [isFetchingConfigData, setIsFetchingConfigData] = useState(false)
  const [fetchConfigStep, setFetchConfigStep] = useState(FetchConfigDataSteps.NONE)
  
  const fetchConfigData = async () => {
    setIsFetchingConfigData(true)
    setFetchConfigStep(FetchConfigDataSteps.MAIN_DATA)
    const mainConfigDataList = ['getAllChainIDs', 'getAllTokenIDs'].map((contractMethod) => {
      return {
        data: MAINCONFIG_INTERFACE.encodeFunctionData(contractMethod, []),
        method: contractMethod,
        to: mainConfigAddress,
      }
    })
    let allChainIds: Array<any> = []
    let allTokenIds: Array<any> = []
    // First step - fetch all tokenIds and all chainIds
    useMulticall(mainConfigChainId, mainConfigDataList)
      .then((contractAnswer) => {
        setFetchConfigStep(FetchConfigDataSteps.CHAINS_AND_CCTOKENS)
        // @ts-ignore
        contractAnswer.map((answerData, answerKey) => {
          if (mainConfigDataList[answerKey].method == 'getAllChainIDs') {
            const d = MAINCONFIG_INTERFACE.decodeFunctionResult(mainConfigDataList[answerKey].method, answerData)
            allChainIds = d[0].map((chainIdBigNumber: any) => {
              return chainIdBigNumber.toNumber()
            })
          }
          if (mainConfigDataList[answerKey].method == 'getAllTokenIDs') {
            const d = MAINCONFIG_INTERFACE.decodeFunctionResult(mainConfigDataList[answerKey].method, answerData)
            allTokenIds = d[0]
          }
        })

        // fetch getTokenConfig for allChainIds
        const multicallDataTokenConfigs: any = []
        allChainIds.forEach((tokenChainId) => {
          //
          multicallDataTokenConfigs.push({
            data: MAINCONFIG_INTERFACE.encodeFunctionData('getChainConfig', [tokenChainId]),
            method: 'getChainConfig',
            tokenChainId,
            to: mainConfigAddress,
          })
          allTokenIds.forEach((tokenId) => {
            ['getTokenConfig', 'getSwapConfig'].forEach((contractMethod) => {
              multicallDataTokenConfigs.push({
                data: MAINCONFIG_INTERFACE.encodeFunctionData(contractMethod, [tokenId, tokenChainId]),
                method: contractMethod,
                tokenId,
                tokenChainId,
                to: mainConfigAddress,
              })
            })
          })
        })

        // @ts-ignore
        const crosschainTokens: any = {}
        const chainRouters: any = {}

        useMulticall(mainConfigChainId, multicallDataTokenConfigs)
          .then((contractTokenConfigs) => {
            // @ts-ignore
            contractTokenConfigs.map((answerData, answerKey) => {
              const callData = multicallDataTokenConfigs[answerKey]
              const method = callData.method
              const d = MAINCONFIG_INTERFACE.decodeFunctionResult(multicallDataTokenConfigs[answerKey].method, answerData)
              const aData = d[0]
              switch (method) {
                case `getChainConfig`:
                  chainRouters[callData.tokenChainId] = aData.RouterContract
                  break;
                case `getTokenConfig`:
                  const {
                    tokenId,
                    tokenChainId,
                  } = callData
                  crosschainTokens[`${tokenChainId}:${tokenId}`] = {
                    tokenId,
                    tokenChainId,
                    contract: aData.ContractAddress,
                    decimals: aData.Decimals
                  }
                  break;
                case `getSwapConfig`:
                /*
                case `getSwapConfig`:
                default:
                  throw new Error('Unknown method', method)
                */
              }
            })
            
            setFetchConfigStep(FetchConfigDataSteps.UNDERLYNG_DATA)
            const fetchDataByChains: any = []
            const fetchDataByChainsIds: any = []
            const fetchDataForChainSource: any = {}
            Object.keys(chainRouters).forEach((routerChainId) => {
              const routerChainContract = chainRouters[routerChainId]
              fetchDataForChainSource[routerChainId] = []
              // Fetch wNative address 
              fetchDataForChainSource[routerChainId].push({
                data: CHAINCONFIG_INTERFACE.encodeFunctionData('wNATIVE', []),
                method: 'wNATIVE',
                routerChainId,
                to: routerChainContract,
              })
              // Fetch Underlyng address
              Object.keys(crosschainTokens).forEach((ccTokenKey) => {
                const ccToken = crosschainTokens[ccTokenKey]
                if (`${ccToken.tokenChainId}` == routerChainId) {
                  fetchDataForChainSource[routerChainId].push({
                    data: CCTOKEN_INTERFACE.encodeFunctionData('underlying', []),
                    method: 'underlying',
                    routerChainId,
                    ccTokenKey,
                    to: ccToken.contract
                  })
                }
              })

              // Push to Promise for this chainId
              fetchDataByChains.push(useMulticall(routerChainId, fetchDataForChainSource[routerChainId]))
              fetchDataByChainsIds.push(routerChainId)
            })

            Promise.all(fetchDataByChains).then((byChainsAnswer) => {
              const erc20byChains: any = {}
              byChainsAnswer.forEach((answerForChain: any, chainIndex) => {
                const chainId = fetchDataByChainsIds[chainIndex]
                erc20byChains[chainId] = {}
                const sourceData = fetchDataForChainSource[chainId]
                sourceData.forEach((sourceDataItem: any, answerForTokenIndex: number) => {
                  const answerForToken = answerForChain[answerForTokenIndex]
                  switch (sourceDataItem.method) {
                    case 'wNATIVE':
                      const wNativeAddress = CHAINCONFIG_INTERFACE.decodeFunctionResult('wNATIVE', answerForToken)[0]
                      erc20byChains[chainId][wNativeAddress] = {}
                      break;
                    case 'underlying':
                      const underlyingAddress = CCTOKEN_INTERFACE.decodeFunctionResult('underlying', answerForToken)[0]
                      crosschainTokens[sourceDataItem.ccTokenKey].underlying = underlyingAddress
                      erc20byChains[chainId][underlyingAddress] = {}
                      break;
                  }
                })
              })
              // fetch erc20 info
              const erc20fetchData: any[] = []
              const erc20fetchChains: any[] = []
              const erc20SourceCallData: any[] = []
              Object.keys(erc20byChains).forEach((chainId) => {
                const erc20fetchByChains: any[] = []
                Object.keys(erc20byChains[chainId]).forEach((ercAddress) => {
                  ['symbol','name','decimals'].forEach((contractMethod) => {
                    erc20fetchByChains.push({
                      data: ERC20_INTERFACE.encodeFunctionData(contractMethod, []),
                      method: contractMethod,
                      chainId,
                      ercAddress,
                      to: ercAddress
                    })
                  })
                })
                if (Object.keys(erc20byChains[chainId]).length > 0) {
                  erc20fetchData.push(useMulticall(chainId, erc20fetchByChains))
                  erc20fetchChains.push(chainId)
                  erc20SourceCallData.push(erc20fetchByChains)
                }
              })
              Promise.all(erc20fetchData).then((erc20FetchedData) => {
                erc20FetchedData.forEach((erc20ChainData, erc20ChainIndex) => {
                  erc20ChainData.forEach((erc20Data: any, erc20Index: any) => {
                    const erc20Source = erc20SourceCallData[erc20ChainIndex][erc20Index]
                    const dataAtContract = ERC20_INTERFACE.decodeFunctionResult(erc20Source.method, erc20Data)[0]
                    erc20byChains[erc20Source.chainId][erc20Source.ercAddress][erc20Source.method] = dataAtContract
                  })
                })
                // Save fetched data to localStorage
                const updatedCrosschainTokens: any = {}
                Object.keys(crosschainTokens).forEach((ccKey) => {
                  const ccToken = crosschainTokens[ccKey]
                  const ccUnderlyng = erc20byChains[ccToken.tokenChainId][ccToken.underlying]
                  updatedCrosschainTokens[`${ccToken.tokenChainId}:${ccToken.contract}`] = {
                    chainId: ccToken.tokenChainId,
                    contractAddress: ccToken.contract,
                    underlying: {
                      networkId: ccToken.tokenChainId,
                      address: ccToken.underlying,
                      name: ccUnderlyng.name,
                      symbol: ccUnderlyng.symbol,
                      decimals: ccUnderlyng.decimals
                    }
                  }
                })
                const updatedErc20Tokens: any = {}
                Object.keys(erc20byChains).forEach((chainId) => {
                  Object.keys(erc20byChains[chainId]).forEach((tokenAddress) => {
                    updatedErc20Tokens[`${chainId}:${tokenAddress}`] = {
                      address: tokenAddress,
                      chainId,
                      icon: '',
                      ...erc20byChains[chainId][tokenAddress]
                    }
                  })
                })
                const updatedRouterConfigs: any = {}
                Object.keys(chainRouters).forEach((chainId) => {
                  const chainRouterAddress = chainRouters[chainId]
                  updatedRouterConfigs[`${chainId}:${chainRouterAddress}`] = {
                    address: chainRouterAddress,
                    chainId
                  }
                })

                const newAppSettings = {
                  crosschainTokens: {
                    ...appSettings.crosschainTokens,
                    ...updatedCrosschainTokens,
                  },
                  routerConfigs: {
                    ...appSettings.routerConfigs,
                    ...updatedRouterConfigs,
                  },
                  erc20Tokens: {
                    ...appSettings.erc20Tokens,
                    ...updatedErc20Tokens,
                  },
                }
                setFetchConfigStep(FetchConfigDataSteps.NONE)
                setIsFetchingConfigData(false)
                onFetchCallback(newAppSettings)
              })
            })
          })
      })
  }

  return (
    <ButtonPrimary onClick={fetchConfigData} disabled={isFetchingConfigData}>
      {fetchConfigStep == FetchConfigDataSteps.NONE && (
        <>{t('mainConfig_FetchData')}</>
      )}
      {fetchConfigStep == FetchConfigDataSteps.MAIN_DATA && (
        <>{t('mainConfig_FetchMainData')}</>
      )}
      {fetchConfigStep == FetchConfigDataSteps.CHAINS_AND_CCTOKENS && (
        <>{t('mainConfig_FetchChain_And_CCTokenData')}</>
      )}
      {fetchConfigStep == FetchConfigDataSteps.UNDERLYNG_DATA && (
        <>{t('mainConfig_FetchUnderlyngData')}</>
      )}
    </ButtonPrimary>
  )
}
