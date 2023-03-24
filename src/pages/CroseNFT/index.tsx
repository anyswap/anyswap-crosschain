import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {ArrowRight} from 'react-feather'
import JSBI from 'jsbi'
import { transparentize } from 'polished'

import {useNFT721Callback, useNFT1155Callback, useAnycallNFT721Callback} from '../../hooks/useNFTCallback'
import {useApproveCallback, useApprove1155Callback, ApprovalState} from '../../hooks/useNFTApproveCallback'
import { useActiveWeb3React } from '../../hooks'
// import { useNFT721Contract } from '../../hooks/useContract'

import { useWalletModalToggle } from '../../state/application/hooks'
import {
  ERC_TYPE,
  useNftListState,
  useNftInfo
} from '../../state/nft/hooks'

import { BottomGrouping } from '../../components/swap/styleds'
import { ButtonLight, ButtonConfirmed } from '../../components/Button'
import Title from '../../components/Title'
import Input from '../../components/NumericalInput'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import ErrorTip from '../../components/CrossChainPanelV2/errorTip'
import {
  useDestChainid,
  useDestCurrency
} from '../../components/CrossChainPanelV2/hooks'

import AppBody from '../AppBody'
import SelectChainIDPanel from './selectChainId'
import SelectCurrencyPanel from './selectCurrency'

import config from '../../config'
import {spportChainArr} from '../../config/chainConfig'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'
import {VALID_BALANCE} from '../../config/constant'

// import {fromWei} from '../../utils/tools/tools'
import { BigAmount } from '../../utils/formatBignumber'
// import {isAddress} from '../../utils/isAddress'

// import NFT_DATA from './nftdata.js'
// import { getUrlData } from '../../utils/tools/axios'


const SUPPORT_CHAIN = spportChainArr
// console.log(SUPPORT_CHAIN)
// const nftData = NFT_DATA as any

const FlexWrapBox = styled.div`
  ${({ theme }) => theme.flexBC};
  flex-wrap: wrap;
  width: 100%;
  // max-width: 360px;
  margin:auto;
`

const FeeBox = styled.div`
  width: 100%;
  object-fit: contain;
  border-radius: 0.5625rem;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding: 0.8rem 1rem;
  margin: 5px 0;
  font-size: 12px;
  color: ${({ theme }) => theme.tipColor};
`

const ContentBody = styled.div`
  background-color: ${({ theme }) => theme.contentBg};
  box-shadow: 0 0.25rem 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
  padding: 60px 50px 60px;
  width: 100%;
  max-width: 480px;
  margin: auto;
  border-radius: 20px;
`

const NftImageView = styled.div`
  ${({ theme }) => theme.flexC};
  width:100%;
  height: 300px;
  img {
    max-width: 100%;
    max-height: 100%;
    display:block;
  }
`

// const SelectNFTTokenLabel = 'SelectNFTTokenLabel'

function getInitToken () {
  const urlParams = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  // const localParams = sessionStorage.getItem(SelectNFTTokenLabel) ? sessionStorage.getItem(SelectNFTTokenLabel) : ''
  // let initBridgeToken:any = urlParams ? urlParams : localParams
  let initBridgeToken:any = urlParams ? urlParams : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''
  if (initBridgeToken) {
    return initBridgeToken
  } else {
    return false
  }
}


export default function CroseNFT () {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  const nftInfo = useNftInfo()

  // const [inputValue, setInputValue] = useState<any>('')
  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()
  const [selectTokenId, setSelectTokenId] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const [delayAction, setDelayAction] = useState<boolean>(false)
  const [tokenList, setTokenList] = useState<any>({})
  const nftList = useNftListState(chainId)

  const initBridgeToken = getInitToken()

  useEffect(() => {
    setSelectTokenId('')
  }, [chainId, selectCurrency, account])

  useEffect(() => {
    // console.log(nftList)
    const list:any = {}
    if (nftList && chainId) {
      let t = []
      if (initBridgeToken) {
        t = [initBridgeToken]
      } else if (config.getCurChainInfo(chainId)?.nftInitToken) {
        t.push(config.getCurChainInfo(chainId)?.nftInitToken?.toLowerCase())
      }
      // console.log(urlParams)
      let useToken = ''
      let noMatchInitToken = ''
      for (const tokenKey in nftList) {
        const obj = nftList[tokenKey]
        const token = obj.address
        if(!obj.name || !obj.symbol) continue
        list[token] = {
          ...obj,
          key: tokenKey,
        }
        if (!noMatchInitToken) noMatchInitToken = token
        if ( !useToken ) {
          if (
            t.includes(token?.toLowerCase())
            || t.includes(list[token]?.symbol?.toLowerCase())
          ) {
            useToken = token
          }
        }
      }
      // console.log(useToken)
      // console.log(noMatchInitToken)
      if (useToken) {
        setSelectCurrency(list[useToken])
      } else if (noMatchInitToken) {
        setSelectCurrency(list[noMatchInitToken])
      }
    }
    setTokenList(list)
  }, [nftList, chainId])

  const destConfig = useMemo(() => {
    console.log(selectDestCurrency)
    if (selectDestCurrency) {
      return selectDestCurrency
    }
    return false
  }, [selectDestCurrency])
  
  const fee = useMemo(() => {
    // console.log(destConfig)
    if (destConfig) {
      const feePerTransaction = destConfig?.feePerTransaction ? JSBI.BigInt(destConfig.feePerTransaction) : ''
      const feePerUnitInBatch = destConfig?.feePerUnitInBatch ? JSBI.BigInt(destConfig.feePerUnitInBatch) : ''
      if (destConfig.nfttype === ERC_TYPE.erc1155) {
        if (feePerTransaction && feePerUnitInBatch) {
          return JSBI.add(feePerTransaction, feePerUnitInBatch)?.toString()
        } else if (feePerTransaction && !feePerUnitInBatch) {
          return feePerTransaction
        } else if (!feePerTransaction && feePerUnitInBatch) {
          return feePerUnitInBatch
        }
      } else {
        // console.log(feePerTransaction)
        // console.log(feePerTransaction?.toString())
        return feePerTransaction ? feePerTransaction?.toString() : ''
      }
    }
    return 
  }, [destConfig])

  const routerToken = useMemo(() => {
    if (destConfig) {
      return destConfig.router
    }
    return
  }, [destConfig])

  const useSwapMethods = useMemo(() => {
    return destConfig.routerABI
  }, [destConfig])

  const nfttype = useMemo(() => {
    return destConfig.nfttype
  }, [destConfig])

  const {initChainId, initChainList} = useDestChainid(selectCurrency, selectChain, chainId)

  useEffect(() => {
    setSelectChain(initChainId)
  }, [initChainId])

  useEffect(() => {
    setSelectChainList(initChainList)
  }, [initChainList])

  const {
    initDestCurrency,
  } = useDestCurrency(selectCurrency, selectCurrency?.destChains?.[selectChain])

  useEffect(() => {
    setSelectDestCurrency(initDestCurrency)
  }, [initDestCurrency])

  
  function onDelay () {
    setDelayAction(true)
  }
  function onClear () {
    setDelayAction(false)
  }
  
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useNFT721Callback(
    routerToken,
    nfttype === ERC_TYPE.erc721 ? selectCurrency : undefined,
    account,
    selectTokenId?.tokenid,
    selectChain,
    fee,
    destConfig
  )
  const { wrapType: wrapType1155, execute: onWrap1155, inputError: wrapInputError1155 } = useNFT1155Callback(
    routerToken,
    nfttype === ERC_TYPE.erc1155 ? selectCurrency : undefined,
    account,
    selectTokenId?.tokenid,
    selectChain,
    fee,
    inputBridgeValue,
    destConfig
  )
  const { wrapType: wrapTypeAnycall, execute: onWrapAnycall, inputError: wrapInputErrorAnycall } = useAnycallNFT721Callback(
    routerToken,
    nfttype === ERC_TYPE.erc721 ? selectCurrency : undefined,
    account,
    selectTokenId?.tokenid,
    selectChain,
    fee,
    destConfig,
    nfttype,
    inputBridgeValue,
  )

  const handleSwap = useCallback(() => {
    onDelay()
    // console.log(useSwapMethods)
    if (useSwapMethods) {
      if (useSwapMethods.indexOf('nft721SwapOut') !== -1) {
        console.log('nft721SwapOut')
        if (onWrap) onWrap().then(() => {
          onClear()
        })
      } else if (useSwapMethods.indexOf('nft1155SwapOut') !== -1) {
        console.log('nft1155SwapOut')
        if (onWrap1155) onWrap1155().then(() => {
          // console.log(hash)
          onClear()
        })
      } else if (useSwapMethods.indexOf('Swapout_no_fallback') !== -1) {
        console.log('Swapout_no_fallback')
        if (onWrapAnycall) onWrapAnycall().then(() => {
          onClear()
        })
      }
    }
  }, [onWrap, onWrap1155, onWrapAnycall, useSwapMethods])

  const isWrapInputError = useMemo(() => {
    if (useSwapMethods) {
      if (useSwapMethods.indexOf('nft721SwapOut') !== -1) {
        if (wrapInputError) {
          return wrapInputError
        } else {
          return false
        }
      } else if (useSwapMethods.indexOf('nft1155SwapOut') !== -1) {
        if (wrapInputError1155) {
          return wrapInputError1155
        } else {
          return false
        }
      } else if (useSwapMethods.indexOf('Swapout_no_fallback') !== -1) {
        if (wrapInputErrorAnycall) {
          return wrapInputErrorAnycall
        } else {
          return false
        }
      }
    }
    return false
  }, [useSwapMethods, wrapInputError, wrapInputError1155, wrapInputErrorAnycall])

  const isInputError = useMemo(() => {
    // console.log(isWrapInputError)
    if (!selectCurrency) {
      return {
        state: 'Error',
        tip: t('selectToken')
      }
    } else if (!selectChain) {
      return {
        state: 'Error',
        tip: t('selectChainId')
      }
    } else if (!selectTokenId) {
      return {
        state: 'Error',
        tip: t('selectTokenId')
      }
    } else if (
      nfttype === ERC_TYPE.erc1155
      && (inputBridgeValue !== '' || inputBridgeValue === '0')
    ) {
      if (isNaN(inputBridgeValue)) {
        return {
          state: 'Error',
          tip: t('inputNotValid')
        }
      } else if (inputBridgeValue === '0') {
        return {
          state: 'Error',
          tip: t('noZero')
        }
      } else if (isWrapInputError) {
        if (VALID_BALANCE) {
          return {
            state: 'Error',
            tip: isWrapInputError
          }
        } else {
          return undefined
        }
      } else if (destConfig.MinimumSwap && Number(inputBridgeValue) < Number(destConfig.MinimumSwap)) {
        return {
          state: 'Error',
          tip: t('ExceedMinLimit', {
            amount: destConfig.MinimumSwap,
            symbol: selectCurrency.symbol
          })
        }
      } else if (destConfig.MaximumSwap && Number(inputBridgeValue) > Number(destConfig.MaximumSwap)) {
        return {
          state: 'Error',
          tip: t('ExceedMaxLimit', {
            amount: destConfig.MaximumSwap,
            symbol: selectCurrency.symbol
          })
        }
      }
    }
    return undefined
  }, [selectCurrency, selectChain, isWrapInputError, inputBridgeValue, destConfig, selectTokenId])

  const errorTip = useMemo(() => {
    // const isAddr = isAddress( recipient, selectChain)
    // console.log(isAddr)
    if (!account || !chainId) {
      return undefined
    } else if (isInputError) {
      return isInputError
    }
    return undefined
  }, [isInputError, selectChain, account, chainId])

  const isCrossBridge = useMemo(() => {
    if (
      errorTip
      || (!inputBridgeValue && nfttype === ERC_TYPE.erc1155)
    ) {
      if (
         errorTip
        && errorTip.state === 'Warning'
      ) {
      // if (selectCurrency && selectCurrency.chainId === '56' && selectCurrency.symbol === "USDC") {
        return false
      }
      return true
    }
    return false
  }, [errorTip, selectCurrency, inputBridgeValue, nfttype])

  const {approvalState: approval721, approve: approveCallback721} = useApproveCallback(nfttype === ERC_TYPE.erc721 ? selectCurrency : undefined, routerToken, selectTokenId?.tokenid)
  const {approvalState: approval1155, approve: approveCallback1155} = useApprove1155Callback(nfttype === ERC_TYPE.erc1155 ? selectCurrency : undefined, routerToken)
    // console.log(tokenidUri)

  const approval = useMemo(() => {
    if (nfttype === ERC_TYPE.erc721) {
      return approval721
    } else {
      return approval1155
    }
  }, [approval721, approval1155, nfttype])

  const btnTxt = useMemo(() => {
    return t('swap')
  }, [t,  wrapType, wrapType1155, wrapInputError1155, wrapTypeAnycall])

  return (
    <>
      <AppBody>
        <Title
          title={''}
        ></Title>
        <ContentBody>
          <FlexWrapBox>
            <SelectChainIDPanel
              chainList={SUPPORT_CHAIN}
              selectChainId={chainId}
              onChainSelect={(value) => {
                selectNetwork(value).then((res:any) => {
                  if (res.msg === 'Error') {
                    alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(value).networkName}))
                  }
                })
              }}
              label={'From '}
              type="CURRENT"
            />
            <ArrowRight style={{marginTop: '30px'}} />
            <SelectChainIDPanel
              chainList={selectChainList}
              selectChainId={selectChain}
              onChainSelect={(value) => {
                console.log(value)
                setSelectChain(value)
              }}
              label={'To '}
            />

            <SelectCurrencyPanel
              tokenlist={tokenList}
              selectCurrency={selectCurrency}
              selectTokenId={selectTokenId}
              onSelectCurrency={(value) => {
                setSelectCurrency(value)
              }}
              onSelectTokenId={(value) => {
                console.log(value)
                setSelectTokenId(value)
              }}
            />
            {
              nfttype === ERC_TYPE.erc1155 ? (
                <Input
                  value={inputBridgeValue}
                  onUserInput={(value) => {
                    setInputBridgeValue(value)
                  }}
                  style={{marginRight: '0'}}
                />
              ) : ''
            }
            {
              selectCurrency && selectTokenId ? (
                <>
                  <NftImageView>
                    <img src={nftInfo?.[selectCurrency?.address]?.[selectTokenId?.tokenid]?.imageUrl} />
                  </NftImageView>
                </>
              ) : ''
            }
            {
              fee ? (
                <FeeBox>
                  {t('fee')}: {BigAmount.format(18, fee).toExact()} {config.getCurChainInfo(chainId).symbol}
                </FeeBox>
              ) : ''
            }
            <ErrorTip errorTip={errorTip} />
          </FlexWrapBox>
          

          <BottomGrouping>
            {
              !account ? (
                <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
              ) : (
                (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) && selectTokenId?.tokenid ? (
                  <ButtonConfirmed
                    onClick={() => {
                      onDelay()
                      if (nfttype === ERC_TYPE.erc721) {
                        if (approveCallback721) approveCallback721().then(() => {
                          setApprovalSubmitted(true)
                          onClear()
                        }).catch(() => {
                          onClear()
                        })
                      } else {
                        if (approveCallback1155) approveCallback1155().then(() => {
                          setApprovalSubmitted(true)
                          onClear()
                        }).catch(() => {
                          onClear()
                        })
                      }
                    }}
                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
                  >
                    {approval === ApprovalState.PENDING || approvalSubmitted ? (
                      <AutoRow gap="6px" justify="center">
                        {t('Approving')} <Loader stroke="white" />
                      </AutoRow>
                    ) : t('Approve') + ' ' + selectCurrency?.symbol + ' ' + selectTokenId?.tokenid}
                  </ButtonConfirmed>
                ) : (
                  <ButtonConfirmed disabled={isCrossBridge || delayAction} onClick={() => {
                    handleSwap()
                  }}>
                    {btnTxt}
                  </ButtonConfirmed>
                )
              )
            }
          </BottomGrouping>
        </ContentBody>
      </AppBody>
    </>
  )
}