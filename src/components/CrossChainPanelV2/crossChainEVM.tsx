import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'

import {isAddress} from 'multichain-bridge'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown, Plus, Minus } from 'react-feather'
import { useConnectedWallet } from '@terra-money/wallet-provider'

import SelectChainIdInputPanel from './selectChainID'
import Reminder from './reminder'

import {useActiveReact} from '../../hooks/useActiveReact'

import {useBridgeCallback, useBridgeUnderlyingCallback, useBridgeNativeCallback, useCrossBridgeCallback} from '../../hooks/useBridgeCallback'
// import { WrapType } from '../../hooks/useWrapCallback'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { useLocalToken } from '../../hooks/Tokens'

import SelectCurrencyInputPanel from '../CurrencySelect/selectCurrency'
import { AutoColumn } from '../Column'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../Button'
import { AutoRow } from '../Row'
import Loader from '../Loader'
import AddressInputPanel from '../AddressInputPanel'
import { ArrowWrapper, BottomGrouping } from '../swap/styleds'
import ModalContent from '../Modal/ModalContent'

import { useWalletModalToggle } from '../../state/application/hooks'
import { tryParseAmount } from '../../state/swap/hooks'
// import { useMergeBridgeTokenList } from '../../state/lists/hooks'
import { useAllMergeBridgeTokenList } from '../../state/lists/hooks'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'

import {getNodeTotalsupply} from '../../utils/bridge/getBalanceV2'
// import {formatDecimal, thousandBit} from '../../utils/tools/tools'

import TokenLogo from '../TokenLogo'
import LiquidityPool from '../LiquidityPool'

import ConfirmView from './confirmModal'
import ErrorTip from './errorTip'

import {
  LogoBox,
  ConfirmContent,
  TxnsInfoText,
  ConfirmText,
  FlexEC,
} from '../../pages/styled'

import {
  outputValue,
  useInitSelectCurrency,
  useDestChainid,
  useDestCurrency,
  getFTMSelectPool
} from './hooks'

let intervalFN:any = ''

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {
  // const { account, chainId, library } = useActiveWeb3React()
  // const { account, chainId } = useActiveWeb3React()
  const { chainId, evmAccount } = useActiveReact()
  const { t } = useTranslation()
  const connectedWallet = useConnectedWallet()

  const allTokensList:any = useAllMergeBridgeTokenList(bridgeKey, chainId)
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  

  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()
  const [selectDestCurrencyList, setSelectDestCurrencyList] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [recipient, setRecipient] = useState<any>(evmAccount ?? '')
  const [swapType, setSwapType] = useState('swap')
  
  const [intervalCount, setIntervalCount] = useState<number>(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipOpen, setModalTipOpen] = useState(false)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)

  const [curChain, setCurChain] = useState<any>({
    chain: chainId,
    ts: '',
    bl: ''
  })
  const [destChain, setDestChain] = useState<any>({
    chain: config.getCurChainInfo(chainId).bridgeInitChain,
    ts: '',
    bl: ''
  })

  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  const destConfig = useMemo(() => {
    if (selectDestCurrency) {
      return selectDestCurrency
    }
    return false
  }, [selectDestCurrency])
  // console.log(destConfig)
  const isRouter = useMemo(() => {
    // console.log(destConfig)
    if (['swapin', 'swapout'].includes(destConfig?.type)) {
      return false
    }
    return true
  }, [destConfig])

  const useDestAddress = useMemo(() => {
    if (isRouter) {
      return destConfig?.routerToken
    }
    return destConfig?.DepositAddress
  }, [destConfig, isRouter])

  const isNativeToken = useMemo(() => {
    console.log(selectCurrency)
    if (
      selectCurrency
      && selectCurrency.address
      && chainId
      && config.getCurChainInfo(chainId)
      && config.getCurChainInfo(chainId).nativeToken
      && config.getCurChainInfo(chainId).nativeToken.toLowerCase() === selectCurrency.address.toLowerCase()
    ) {
      return true
    }
    return false
  }, [selectCurrency, chainId])
  // console.log(isNativeToken)

  const isUnderlying = useMemo(() => {
    if (selectCurrency && selectCurrency?.underlying) {
      return true
    }
    return false
  }, [selectCurrency])

  const isDestUnderlying = useMemo(() => {
    // console.log(destConfig)
    // console.log(destConfig?.underlying)
    if (destConfig?.underlying) {
      return true
    }
    return false
  }, [destConfig])
  // console.log(isDestUnderlying)

  const formatCurrency0 = useLocalToken(
  selectCurrency?.underlying ? {
    ...selectCurrency,
    address: selectCurrency.underlying.address,
    name: selectCurrency.underlying.name,
    symbol: selectCurrency.underlying?.symbol,
    decimals: selectCurrency.underlying.decimals
  } : selectCurrency)
  const formatCurrency = useLocalToken(selectCurrency ?? undefined)
  const formatInputBridgeValue = tryParseAmount(inputBridgeValue, (formatCurrency && isRouter) ? formatCurrency : undefined)
  const [approval, approveCallback] = useApproveCallback((formatInputBridgeValue && isRouter) ? formatInputBridgeValue : undefined, isRouter ? useDestAddress : formatCurrency0?.address)
  useEffect(() => {
    // console.log(isRouter)
    // console.log(formatInputBridgeValue)
    // console.log((formatInputBridgeValue && isRouter) ? formatInputBridgeValue : undefined)
    // console.log(approval)
    // console.log(ApprovalState)
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  function onDelay () {
    setDelayAction(true)
  }
  function onClear (type?:any) {
    setDelayAction(false)
    setModalTipOpen(false)
    if (!type) {
      setInputBridgeValue('')
    }
  }

  function changeNetwork (chainID:any) {
    selectNetwork(chainID).then((res: any) => {
      console.log(res)
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(chainID).networkName}))
      }
    })
  }

  useEffect(() => {
    setDestChain('')
  }, [selectChain, selectCurrency])
  const {curChain: curFTMChain, destChain: destFTMChain} = getFTMSelectPool(selectCurrency, isUnderlying, isDestUnderlying, chainId, selectChain, destConfig)
  // console.log(curChain)
  // console.log(destChain)
  const getSelectPool = useCallback(async() => {
    if (selectCurrency?.address === 'FTM' || destConfig?.address === 'FTM') {
      // console.log(curFTMChain)
      // console.log(destFTMChain)
      // console.log(selectCurrency)
      // console.log(destConfig)
      setCurChain({
        ...curFTMChain
      })
      setDestChain({
        ...destFTMChain
      })
      return
    }
    // console.log(11111)
    if (selectCurrency && chainId && (isRouter || selectCurrency?.address === 'FTM')) {
      if (selectCurrency?.underlying?.address && (isRouter || selectCurrency?.address === 'FTM')) {
        const CC:any = await getNodeTotalsupply(
          selectCurrency?.underlying?.address,
          chainId,
          selectCurrency?.decimals,
          evmAccount,
          selectCurrency?.address
        )
        // console.log(CC)
        // console.log(selectCurrency)
        if (CC) {
          setCurChain({
            chain: chainId,
            ts: selectCurrency?.underlying ? CC[selectCurrency?.underlying?.address]?.ts : CC[selectCurrency?.address]?.anyts,
            bl: selectCurrency?.underlying ? CC[selectCurrency?.underlying?.address]?.balance : ''
          })
        } else {
          setCurChain({
            chain: chainId,
            ts: '',
            bl: ''
          })
        }
      } else {
        setCurChain({
          chain: chainId,
          ts: '',
          bl: ''
        })
      }
      if (destConfig.underlying?.address) {
        const DC:any = await getNodeTotalsupply(
          destConfig.underlying?.address,
          selectChain,
          destConfig.decimals,
          evmAccount,
          destConfig.address
        )
        // console.log(selectCurrency)
        // console.log(DC)
        if (DC) {
          setDestChain({
            chain: selectChain,
            ts: destConfig?.underlying ? DC[destConfig?.underlying.address]?.ts : DC[destConfig?.address]?.anyts,
            bl: destConfig?.underlying ? DC[destConfig?.underlying.address]?.balance : ''
          })
        } else {
          setDestChain({
            chain: selectChain,
            ts: '',
            bl: ''
          })
        }
      } else {
        setDestChain({
          chain: selectChain,
          ts: '',
          bl: ''
        })
      }
      // console.log(CC)
      // console.log(DC)
      if (intervalFN) clearTimeout(intervalFN)
      intervalFN = setTimeout(() => {
        setIntervalCount(intervalCount + 1)
      }, 1000 * 10)
    } else {
      setCurChain({
        chain: chainId,
        ts: '',
        bl: ''
      })
      setDestChain({
        chain: selectChain,
        ts: '',
        bl: ''
      })
    }
  }, [selectCurrency, chainId, evmAccount, selectChain, intervalCount, destConfig, isRouter, curFTMChain, destFTMChain])


  useEffect(() => {
    getSelectPool()
  }, [getSelectPool])
  
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useBridgeCallback(
    isRouter ? useDestAddress : undefined,
    formatCurrency ? formatCurrency : undefined,
    isUnderlying ? selectCurrency?.underlying?.address : selectCurrency?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type
  )

  const { wrapType: wrapTypeNative, execute: onWrapNative, inputError: wrapInputErrorNative } = useBridgeNativeCallback(
    isRouter ? useDestAddress : undefined,
    formatCurrency ? formatCurrency : undefined,
    isUnderlying ? selectCurrency?.underlying?.address : selectCurrency?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type
  )

  const { wrapType: wrapTypeUnderlying, execute: onWrapUnderlying, inputError: wrapInputErrorUnderlying } = useBridgeUnderlyingCallback(
    isRouter ? useDestAddress : undefined,
    formatCurrency ? formatCurrency : undefined,
    isUnderlying ? selectCurrency?.underlying?.address : selectCurrency?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type
  )

  const { wrapType: wrapTypeCrossBridge, execute: onWrapCrossBridge, inputError: wrapInputErrorCrossBridge } = useCrossBridgeCallback(
    formatCurrency ? formatCurrency : undefined,
    destConfig?.type === 'swapin' ? useDestAddress : recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency?.address,
    destConfig?.pairid,
    recipient,
    selectCurrency
  )

  const {outputBridgeValue, fee} = outputValue(inputBridgeValue, destConfig, selectCurrency)

  const isWrapInputError = useMemo(() => {
    if (isRouter) {
      if (!isUnderlying && !isNativeToken) {
        if (wrapInputError) {
          return wrapInputError
        } else {
          return false
        }
      } else {
        if (isUnderlying && !isNativeToken) {
          if (wrapInputErrorUnderlying) {
            return wrapInputErrorUnderlying
          } else {
            return false
          }
        } else if (isUnderlying && isNativeToken) {
          if (wrapInputErrorNative) {
            return wrapInputErrorNative
          } else {
            return false
          }
        }
        return false
      }
    } else {
      if (wrapInputErrorCrossBridge) {
        return wrapInputErrorCrossBridge
      } else {
        return false
      }
    }
  }, [isNativeToken, wrapInputError, wrapInputErrorUnderlying, wrapInputErrorNative, selectCurrency, isRouter, wrapInputErrorCrossBridge])
  // console.log(selectCurrency)
  const isInputError = useMemo(() => {
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
    } else if (inputBridgeValue !== '' || inputBridgeValue === '0') {
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
        return {
          state: 'Error',
          tip: isWrapInputError
        }
      } else if (Number(inputBridgeValue) < Number(destConfig.MinimumSwap)) {
        return {
          state: 'Error',
          tip: t('LessThanLimit')
        }
      } else if (Number(inputBridgeValue) > Number(destConfig.MaximumSwap)) {
        return {
          state: 'Error',
          tip: t('MoreThanLimit')
        }
      } else if (
        (isDestUnderlying && destChain && Number(inputBridgeValue) > Number(destChain.ts))
        || (isDestUnderlying && !destChain)
      ) {
        return {
          state: 'Error',
          tip: t('insufficientLiquidity')
        }
      }
    }
    return undefined
  }, [selectCurrency, selectChain, isWrapInputError, inputBridgeValue, destConfig, isDestUnderlying, destChain])

  const errorTip = useMemo(() => {
    const isAddr = isAddress( recipient, selectChain)
    if (!evmAccount || !chainId) {
      return undefined
    } else if (isInputError) {
      return isInputError
    } else if (recipient && !Boolean(isAddr)) {
      return {
        state: 'Error',
        tip: t('invalidRecipient')
      }
    }
    return undefined
  }, [isInputError, selectChain, recipient, evmAccount, chainId])

  const isCrossBridge = useMemo(() => {
    if (errorTip || !inputBridgeValue) {
      return true
    }
    return false
  }, [errorTip, inputBridgeValue])

  const btnTxt = useMemo(() => {
    // if (errorTip) {
    //   return errorTip?.tip
    // } else if (wrapType === WrapType.WRAP || wrapTypeNative === WrapType.WRAP || wrapTypeUnderlying === WrapType.WRAP || wrapTypeCrossBridge === WrapType.WRAP) {
    //   return t('swap')
    // }
    return t('swap')
  }, [errorTip, wrapType, wrapTypeNative, wrapTypeUnderlying, wrapTypeCrossBridge])

  const {initCurrency} = useInitSelectCurrency(allTokensList, chainId, initBridgeToken)

  useEffect(() => {
    // console.log(initCurrency)
    setSelectCurrency(initCurrency)
  }, [initCurrency])

  useEffect(() => {
    if (swapType == 'swap' && evmAccount && !isNaN(selectChain)) {
      setRecipient(evmAccount)
    } else if (isNaN(selectChain) && destConfig?.type === 'swapout') {
      if (selectChain === 'TERRA' && connectedWallet?.walletAddress) {
        setRecipient(connectedWallet?.walletAddress)
      } else {
        setRecipient('')
      }
    }
  }, [evmAccount, swapType, selectChain, destConfig])

  const {initChainId, initChainList} = useDestChainid(selectCurrency, selectChain, chainId)

  useEffect(() => {
    // console.log(selectCurrency)
    setSelectChain(initChainId)
  }, [initChainId])

  useEffect(() => {
    setSelectChainList(initChainList)
  }, [initChainList])
  
  const {initDestCurrency, initDestCurrencyList} = useDestCurrency(selectCurrency, selectChain)

  useEffect(() => {
    setSelectDestCurrency(initDestCurrency)
  }, [initDestCurrency])

  useEffect(() => {
    setSelectDestCurrencyList(initDestCurrencyList)
  }, [initDestCurrencyList])

  const handleMaxInput = useCallback((value) => {
    if (value) {
      setInputBridgeValue(value)
    } else {
      setInputBridgeValue('')
    }
  }, [setInputBridgeValue])

  return (
    <>
      <ModalContent
        isOpen={modalTipOpen}
        title={'Cross-chain Router'}
        onDismiss={() => {
          setModalTipOpen(false)
        }}
        padding={'10px 2rem 20px'}
      >
        <ConfirmContent>
          {
            !isNativeToken && selectCurrency && isUnderlying && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) ? (
              <>
                <LogoBox>
                  <TokenLogo symbol={selectCurrency?.symbol ?? selectCurrency?.symbol} logoUrl={selectCurrency?.logoUrl} size={'1rem'}></TokenLogo>
                </LogoBox>
                <TxnsInfoText>{config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId)}</TxnsInfoText>
                <ConfirmText>
                  {
                    t('approveTip', {
                      symbol: config.getBaseCoin(selectCurrency?.symbol, chainId),
                    })
                  }
                </ConfirmText>
              </>
            ) : (
              <>
                <ConfirmView
                  fromChainId={chainId}
                  value={inputBridgeValue}
                  toChainId={selectChain}
                  swapvalue={outputBridgeValue}
                  recipient={recipient}
                  destConfig={destConfig}
                  selectCurrency={selectCurrency}
                  fee={fee}
                />
                {
                  isUnderlying && isDestUnderlying ? (
                    <>
                      <ConfirmText>
                        {
                          t('swapTip', {
                            symbol: config.getBaseCoin(selectCurrency?.underlying?.symbol, chainId),
                            symbol1: config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId),
                            chainName: config.getCurChainInfo(selectChain).name
                          })
                        }
                      </ConfirmText>
                    </>
                  ) : (
                    <></>
                  )
                }
              </>
            )
          }
          <BottomGrouping>
            {!evmAccount ? (
                <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
              ) : (
                !isNativeToken && selectCurrency && isUnderlying && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)? (
                  <ButtonConfirmed
                    onClick={() => {
                      onDelay()
                      approveCallback().then(() => {
                        onClear(1)
                      })
                    }}
                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
                    width="48%"
                    altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                    // confirmed={approval === ApprovalState.APPROVED}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        {t('Approving')} <Loader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted ? (
                      t('Approved')
                    ) : (
                      t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId)
                    )}
                  </ButtonConfirmed>
                ) : (
                  <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
                  // <ButtonPrimary disabled={delayAction} onClick={() => {
                    onDelay()
                    if (isRouter) {
                      if (!selectCurrency || !isUnderlying) {
                        console.log('onWrap')
                        if (onWrap) onWrap().then(() => {
                          onClear()
                        })
                      } else {
                        if (isNativeToken) {
                          console.log('onWrapNative')
                          if (onWrapNative) onWrapNative().then(() => {
                            onClear()
                          })
                        } else {
                          console.log('onWrapUnderlying')
                          if (onWrapUnderlying) onWrapUnderlying().then((hash) => {
                            console.log(hash)
                            onClear()
                          })
                        }
                      }
                    } else {
                      console.log('onWrapCrossBridge')
                      if (onWrapCrossBridge) onWrapCrossBridge().then(() => {
                        onClear()
                      })
                    }
                  }}>
                    {t('Confirm')}
                  </ButtonPrimary>
                )
              )
            }
          </BottomGrouping>
        </ConfirmContent>
      </ModalContent>

      <AutoColumn gap={'sm'}>

        <SelectCurrencyInputPanel
          label={t('From')}
          value={inputBridgeValue}
          onUserInput={(value) => {
            // console.log(value)
            setInputBridgeValue(value)
          }}
          onCurrencySelect={(inputCurrency) => {
            // console.log(inputCurrency)
            setSelectCurrency(inputCurrency)
          }}
          onMax={(value) => {
            handleMaxInput(value)
          }}
          currency={formatCurrency ? formatCurrency : selectCurrency}
          disableCurrencySelect={false}
          showMaxButton={true}
          isViewNetwork={true}
          customChainId={chainId}
          onOpenModalView={(value) => {
            // console.log(value)
            setModalOpen(value)
          }}
          isViewModal={modalOpen}
          id="selectCurrency"
          isError={Boolean(isInputError)}
          isNativeToken={isNativeToken}
          bridgeKey={bridgeKey}
          allTokens={allTokensList}
          isRouter={isRouter}
        />
        {
          evmAccount && chainId && (isUnderlying || selectCurrency?.address === 'FTM' || destConfig?.address === 'FTM') && (isRouter || selectCurrency?.address === 'FTM' || destConfig?.address === 'FTM') ? (
            <>
              <LiquidityPool
                curChain={curChain}
                // destChain={destChain}
                isUnderlying={isUnderlying}
                selectCurrency={selectCurrency}
                // isDestUnderlying={isDestUnderlying}
              />
            </>
          ) : ''
        }

        <AutoRow justify="center" style={{ padding: '0 1rem' }}>
          <ArrowWrapper clickable={false} style={{cursor:'pointer'}} onClick={() => {
            // toggleNetworkModal()
            changeNetwork(selectChain)
          }}>
            <ArrowDown size="16" color={theme.text2} />
          </ArrowWrapper>
          {
            destConfig?.type !== 'swapin' && !isNaN(selectChain) ? (
              <ArrowWrapper clickable={false} style={{cursor:'pointer', position: 'absolute', right: 0}} onClick={() => {
                if (swapType === 'swap') {
                  setSwapType('send')
                } else {
                  setSwapType('swap')
                  if (evmAccount) {
                    setRecipient(evmAccount)
                  }
                }
              }}>
                {
                  swapType === 'swap' ? (
                    <FlexEC>
                      <Plus size="16" color={theme.text2} /> <span style={{fontSize: '12px', lineHeight:'12px'}}>{t('sendto')}</span>
                    </FlexEC>
                  ) : (
                    <FlexEC>
                      <Minus size="16" color={theme.text2} /> <span style={{fontSize: '12px', lineHeight:'12px'}}>{t('sendto')}</span>
                    </FlexEC>
                  )
                }
              </ArrowWrapper>
            ) : ''
          }
        </AutoRow>

        <SelectChainIdInputPanel
          label={t('to')}
          value={outputBridgeValue.toString()}
          onUserInput={(value) => {
            setInputBridgeValue(value)
          }}
          onChainSelect={(chainID) => {
            setSelectChain(chainID)
          }}
          selectChainId={selectChain}
          id="selectChainID"
          onCurrencySelect={(inputCurrency) => {
            console.log(inputCurrency)
            setSelectDestCurrency(inputCurrency)
          }}
          bridgeConfig={selectCurrency}
          intervalCount={intervalCount}
          isNativeToken={isNativeToken}
          selectChainList={selectChainList}
          selectDestCurrency={selectDestCurrency}
          selectDestCurrencyList={selectDestCurrencyList}
          bridgeKey={bridgeKey}
        />
        {
          evmAccount && chainId && (isDestUnderlying || destConfig?.address === 'FTM') ? (
            <LiquidityPool
              // curChain={curChain}
              destChain={destChain}
              // isUnderlying={isUnderlying}
              isDestUnderlying={isDestUnderlying}
              selectCurrency={destConfig}
            />
          ) : ''
        }
        {
          swapType == 'send' || (isNaN(selectChain) && destConfig?.type === 'swapout') || isNaN(chainId) ? (
            <AddressInputPanel id="recipient" value={recipient} label={t('Recipient')} labelTip={'( ' + t('receiveTip') + ' )'} onChange={setRecipient} isValid={false} selectChainId={selectChain} isError={!Boolean(isAddress(recipient, selectChain))} />
          ) : ''
        }
      </AutoColumn>

      <Reminder destConfig={destConfig} bridgeType='bridgeAssets' currency={selectCurrency} selectChain={selectChain}/>

      <ErrorTip errorTip={errorTip} />
      {
        config.isStopSystem ? (
          <BottomGrouping>
            <ButtonLight disabled>{t('stopSystem')}</ButtonLight>
          </BottomGrouping>
        ) : (
          <BottomGrouping>
            {!evmAccount ? (
                <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
              ) : (
                !isNativeToken && selectCurrency && isUnderlying && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)? (
                  <>
                    <ButtonConfirmed
                      onClick={() => {
                        setModalTipOpen(true)
                      }}
                      disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
                      width="48%"
                      altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          {t('Approving')} <Loader stroke="white" />
                        </AutoRow>
                      ) : approvalSubmitted ? (
                        t('Approved')
                      ) : (
                        t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId)
                      )}
                    </ButtonConfirmed>
                    <ButtonConfirmed disabled={true} width="45%" style={{marginLeft:'10px'}}>
                        {t('swap')}
                      </ButtonConfirmed>
                  </>
                ) : (
                  <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
                    setModalTipOpen(true)
                  }}>
                    {btnTxt}
                  </ButtonPrimary>
                )
              )
            }
          </BottomGrouping>
        )
      }
    </>
  )
}