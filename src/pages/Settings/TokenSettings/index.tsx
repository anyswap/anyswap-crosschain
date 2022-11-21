import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../../hooks'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { getWeb3Library } from '../../../utils/getLibrary'

import { ZERO_ADDRESS, EVM_ADDRESS_REGEXP } from '../../../constants'
import { ERC20_ABI } from '../../../constants/abis/erc20'
import { chainInfo } from '../../../config/chainConfig'

import { AppSettingsData, CrossChainTokenData } from '../../../state/application/actions'

import { ButtonPrimary } from '../../../components/Button'
import Lock from '../../../components/Lock'
import { Notice } from '../index'
import OptionLabel from '../OptionLabel'
import SwapSettings from '../SwapSettings'
import DeployCrosschainToken from '../DeployCrosschainToken'
import { Title, OptionWrapper, Input, Select, SelectOption } from '../Contracts'
import Accordion from '../../../components/Accordion'

export default function TokenSettings({
    appSettings,
    routerConfig,
    routerAddress,
    routerConfigSigner,
    onConfigNetwork,
    SwitchToConfigButton,
    updateUnderlyingToken,
    onDeployCrosschainTokenCallback,
  }: {
    appSettings: AppSettingsData,
    routerConfig: any,
    routerAddress: string
    routerConfigSigner: any
    onConfigNetwork: boolean
    SwitchToConfigButton: JSX.Element
    updateUnderlyingToken: (tokenInfo: any) => void
    onDeployCrosschainTokenCallback: any
  }) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()

  const [underlyingNetworkId, setUnderlyingNetworkId] = useState(`${chainId}`)
  const [underlyingAddress, setUnderlyingAddress] = useState('')
  const [underlyingName, setUnderlyingName] = useState('')
  const [underlyingSymbol, setUnderlyingSymbol] = useState('')
  const [underlyingDecimals, setUnderlyingDecimals] = useState(-1)
  const [crosschainTokenAddress, setCrosschainTokenAddress] = useState('')
  const [crosschainTokenChainId, setCrosschainTokenChainId] = useState(`${chainId}`)

  const [isUnderlyingTokenInfoLoading, setIsUnderlyingTokenInfoLoading] = useState(false)

  const [underlyingTokenInfo, setUnderlyingTokenInfo] = useState<CrossChainTokenData['underlying']>({
    networkId: underlyingNetworkId,
    address: underlyingAddress,
    name: underlyingName,
    symbol: underlyingSymbol,
    decimals: Number(underlyingDecimals)
  })

  const [hasUnderlyingInfo, setHasUnderlyingInfo] = useState(false)

  useEffect(() => {
    setHasUnderlyingInfo(Boolean(underlyingNetworkId && underlyingName && underlyingSymbol))
  }, [underlyingNetworkId, underlyingName, underlyingSymbol])

  useEffect(() => {
    const fetchUnderlyingInfo = async () => {
      try {
        if (!underlyingAddress?.match(EVM_ADDRESS_REGEXP) || !underlyingNetworkId) return

        const underlyingNetworkConfig = chainInfo[underlyingNetworkId]

        if (!underlyingNetworkConfig) return

        const { nodeRpc } = underlyingNetworkConfig
        const web3 = getWeb3Library(nodeRpc)
        //@ts-ignore
        const underlyingErc20 = new web3.eth.Contract(ERC20_ABI, underlyingAddress)
        setIsUnderlyingTokenInfoLoading(true)

        const name = await underlyingErc20.methods.name().call()
        const symbol = await underlyingErc20.methods.symbol().call()
        const decimals = await underlyingErc20.methods.decimals().call()

        updateUnderlyingToken({
            networkId: underlyingNetworkId,
            address: underlyingAddress,
            decimals,
            symbol,
            name,
        })

        setUnderlyingTokenInfo({
          networkId: underlyingNetworkId,
          address: underlyingAddress,
          name,
          symbol,
          decimals: Number(decimals)
        })

        if (routerConfig) {
          const tokenConfig = await routerConfig.methods
            .getTokenConfig(symbol.toUpperCase(), underlyingNetworkId)
            .call()

          if (tokenConfig.ContractAddress !== ZERO_ADDRESS) {
            const { ContractAddress } = tokenConfig

            setCrosschainTokenChainId(underlyingNetworkId)
            setCrosschainTokenAddress(ContractAddress)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsUnderlyingTokenInfoLoading(false)
      }
    }

    if (underlyingNetworkId && underlyingAddress) {
      fetchUnderlyingInfo()
    }
  }, [underlyingAddress, chainId, underlyingNetworkId])

  const [activeTokenGroup, setActiveTokenGroup] = useState(`CreateNewTokenGroup`)
  const [ownTokenGroup, setOwnTokenGroup] = useState(``)
  const [ownTokenGroupError, setOwnTokenGroupError] = useState(false)

  const onChangeOwnTokenGroup = (newOwnTokenGroup: string) => {
    setOwnTokenGroup(newOwnTokenGroup)
    setOwnTokenGroupError(false)
  }

  const setTokenGroup = (tokenGroup: string) => {
    setActiveTokenGroup(tokenGroup)
  }


  const setCrosschainTokenData = (selectedContract: any) => {
    if (selectedContract !== `-`) {
      const {
        chainId,
        contractAddress,
        underlying
      } = appSettings.crosschainTokens[selectedContract]

      setCrosschainTokenChainId(`${chainId}`)
      setCrosschainTokenAddress(contractAddress)

      setUnderlyingNetworkId(underlying.networkId)
      setUnderlyingAddress(underlying.address)
      setUnderlyingDecimals(underlying.decimals)
      setUnderlyingName(underlying.name)
      setUnderlyingSymbol(underlying.symbol)

      setUnderlyingTokenInfo(underlying)

      const hasTokenGroup = appSettings.tokenGroups.filter((tokenGroup) => {
        return (tokenGroup == underlying.symbol)
      })
      if (hasTokenGroup.length > 0) {
        setTokenGroup(underlying.symbol)
      } else {
        setTokenGroup(`CreateNewTokenGroup`)
      }
      setOwnTokenGroup(underlying.symbol)

    } else {
      setCrosschainTokenChainId(``)
      setCrosschainTokenAddress(``)

      setUnderlyingNetworkId(`${chainId}`)
      setUnderlyingAddress(``)
      setUnderlyingDecimals(-1)
      setUnderlyingName(``)
      setUnderlyingSymbol(``)
      setTokenGroup(`CreateNewTokenGroup`)
      setOwnTokenGroup(``)

      setUnderlyingTokenInfo({
        networkId: `${chainId}`,
        address: '',
        decimals: -1,
        symbol: '',
        name: '',
    })
    }
  }

  const setTokenConfig = async () => {
    if (!routerConfigSigner || !underlyingSymbol || !crosschainTokenAddress || !crosschainTokenChainId) return

    if (activeTokenGroup == `CreateNewTokenGroup` && ownTokenGroup == ``) return setOwnTokenGroupError(true)

    const usedTokenGroup = (activeTokenGroup == `CreateNewTokenGroup`) ? ownTokenGroup.toUpperCase() : activeTokenGroup.toUpperCase()
    const VERSION = 6

    try {

      const tx = await routerConfigSigner.setTokenConfig(usedTokenGroup, crosschainTokenChainId, {
        Decimals: underlyingDecimals,
        ContractAddress: crosschainTokenAddress,
        ContractVersion: VERSION
      })
      const receipt = await tx.wait()

      if (receipt.status) {
        addTransaction(
          { hash: receipt.transactionHash },
          {
            summary: `Crosschain token config ${crosschainTokenAddress} for chain ${crosschainTokenChainId} saved to main router`
          }
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [isSavedTokenExists, setIsSavedTokenExists] = useState(false)
  const [isCheckCrosschainTokenButtonDisable, setIsCheckCrosschainTokenButtonDisable] = useState(!routerConfigSigner || !crosschainTokenChainId || !crosschainTokenAddress || !ownTokenGroup)

  useEffect(() => {
    const usedTokenGroup = (activeTokenGroup == `CreateNewTokenGroup`) ? ownTokenGroup.toUpperCase() : activeTokenGroup.toUpperCase()
    setIsCheckCrosschainTokenButtonDisable(!routerConfigSigner || !crosschainTokenChainId || !crosschainTokenAddress || !usedTokenGroup)
  }, [routerConfigSigner, crosschainTokenChainId, crosschainTokenAddress, ownTokenGroup, activeTokenGroup])

  const checkCrosschainTokenInRouterConfig = async () => {
    try {
      if (!routerConfigSigner) throw new Error("Need to connect to main config network")
      if (!crosschainTokenChainId) throw new Error("Fill crosschain chain id")
      if (!crosschainTokenAddress) throw new Error("Fill crosschain token address")
      if (!crosschainTokenAddress?.match(EVM_ADDRESS_REGEXP)) throw new Error("Fill correct crosschain token address")
      if (!ownTokenGroup) throw new Error("Fill crosschain token group id")

      const usedTokenGroup = (activeTokenGroup == `CreateNewTokenGroup`) ? ownTokenGroup.toUpperCase() : activeTokenGroup.toUpperCase()

      const multichainTokenAddress = await routerConfigSigner.getMultichainToken(usedTokenGroup, crosschainTokenChainId)

      setIsSavedTokenExists(multichainTokenAddress === crosschainTokenAddress)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setIsSavedTokenExists(false)
  }, [crosschainTokenChainId, crosschainTokenAddress, ownTokenGroup, routerConfigSigner, activeTokenGroup])

  const removeCrosschainTokenFromRouterConfig = async () => {
    try {
      if (!isSavedTokenExists) throw new Error("Firstly, check if the crosschain token exists in the router config")

      const tx = await routerConfigSigner.removeMultichainToken(ownTokenGroup.toUpperCase(), crosschainTokenChainId)
      const receipt = await tx.wait()

      if (receipt.status) {
        addTransaction(
          { hash: receipt.transactionHash },
          {
            summary: `Crosschain token config ${crosschainTokenAddress} for chain ${crosschainTokenChainId} removed from main router`
          }
        )

        setCrosschainTokenData("-")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Title>{t('erc20Token')}</Title>
      <Lock enabled={!routerAddress} reason={!routerAddress && t('deployRouterFirst')}>
        <Notice margin="0.4rem 0">{t('youNeedCrosschainTokenForEachErc20TokenOnEachNetwork')}</Notice>
        <Notice margin="0.4rem 0">{t('crosschainTokenUseDeployed')}</Notice>
        <OptionWrapper>
          <OptionLabel displayChainsLink>
            {t('erc20ChainId')}
            <Input
              type="number"
              min="1"
              value={underlyingNetworkId || chainId}
              onChange={event => setUnderlyingNetworkId(event.target.value)}
            />
            {t('erc20TokenAddress')}
            <Input
              type="text"
              placeholder="0x..."
              value={underlyingAddress}
              onChange={event => setUnderlyingAddress(event.target.value)}
            />
          </OptionLabel>
        </OptionWrapper>

        <DeployCrosschainToken
          routerAddress={routerAddress}
          underlying={underlyingTokenInfo}
          isLoading={isUnderlyingTokenInfoLoading}
          onDeploymentCallback={(contractAddress, chainId) => {
            setCrosschainTokenChainId(`${chainId}`)
            setCrosschainTokenAddress(contractAddress)
            onDeployCrosschainTokenCallback(contractAddress, chainId, underlyingTokenInfo)
          }}
        />

        <Accordion title={t('tokenConfig')} margin="0.5rem 0">
          <OptionWrapper>
            <OptionLabel>
              <Select onChange={event => setCrosschainTokenData(event.target.value)}>
                <SelectOption value="-">{t('crosschainTokenSelectDeployedOption')}</SelectOption>
                {Object.keys(appSettings.crosschainTokens).map((ccTokenKey, i) => {
                  const ccTokenInfo = appSettings.crosschainTokens[ccTokenKey]

                  return (
                    <SelectOption key={i} value={ccTokenKey}>
                      Chain {ccTokenInfo.chainId} ({ccTokenInfo.underlying.symbol}) {ccTokenInfo.contractAddress}
                    </SelectOption>
                  )
                })}
              </Select>
            </OptionLabel>
            <OptionLabel>
              {t('idOfCrosschainGroup')}
              <Select value={activeTokenGroup} onChange={event => setTokenGroup(event.target.value)}>
                <SelectOption value={`CreateNewTokenGroup`}>{t('idOfCrosschainGroupNewGroup')}</SelectOption>
                {appSettings.tokenGroups.map((tokenGroupKey, i) => <SelectOption key={i} value={tokenGroupKey}>{tokenGroupKey}</SelectOption>)}
              </Select>
              {activeTokenGroup === `CreateNewTokenGroup` && (
                <Input
                  className={(ownTokenGroupError) ? `hasError` : ``}
                  value={ownTokenGroup}
                  placeholder={t('idOfCrosschainGroupNewGroupPlaceholder')}
                  onChange={event => onChangeOwnTokenGroup(event.target.value)}
                />
              )}
              {t('idOfCrosschainTokenNetwork')}
              <Input
                value={crosschainTokenChainId}
                type="number"
                min="1"
                step="1"
                onChange={event => setCrosschainTokenChainId(event.target.value)}
              />
              {t('crosschainTokenAddress')}
              <Input
                value={crosschainTokenAddress}
                type="text"
                placeholder="0x..."
                onChange={event => setCrosschainTokenAddress(event.target.value)}
              />
              {onConfigNetwork ? (
                <>
                  <ButtonPrimary onClick={setTokenConfig} disabled={!hasUnderlyingInfo || !onConfigNetwork}>
                    {t(!hasUnderlyingInfo ? 'fillUnderlyingInfo' : 'setTokenConfig')}
                  </ButtonPrimary>
                  {!isSavedTokenExists
                    ?
                      <ButtonPrimary onClick={checkCrosschainTokenInRouterConfig} disabled={isCheckCrosschainTokenButtonDisable}>
                        {t('checkCrosschainTokenInRouterConfig')}
                      </ButtonPrimary>
                    :
                      <ButtonPrimary onClick={removeCrosschainTokenFromRouterConfig} disabled={isCheckCrosschainTokenButtonDisable}>
                        {t('removeCrosschainTokenFromRouterConfig')}
                      </ButtonPrimary>
                  }
                </>
              ) : SwitchToConfigButton
              }
            </OptionLabel>
          </OptionWrapper>
        </Accordion>

        <SwapSettings
          underlying={underlyingTokenInfo}
          usedTokenGroup={(activeTokenGroup == `CreateNewTokenGroup`) ? ownTokenGroup.toUpperCase() : activeTokenGroup.toUpperCase()}
          onConfigNetwork={onConfigNetwork}
          SwitchToConfigButton={SwitchToConfigButton}
        />
      </Lock>
    </>
  )
}
