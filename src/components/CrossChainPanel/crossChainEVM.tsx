import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'

import {isAddress} from 'multichain-bridge'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown, Plus, Minus } from 'react-feather'

import SelectChainIdInputPanel from './selectChainID'
import Reminder from './reminder'

import { useActiveWeb3React } from '../../hooks'
import {useBridgeCallback, useBridgeUnderlyingCallback, useBridgeNativeCallback, useCrossBridgeCallback} from '../../hooks/useBridgeCallback'
import { WrapType } from '../../hooks/useWrapCallback'
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
import { useUserSelectChainId } from '../../state/user/hooks'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'

import {getNodeTotalsupply} from '../../utils/bridge/getBalanceV2'
import {formatDecimal, thousandBit} from '../../utils/tools/tools'

import TokenLogo from '../TokenLogo'
import LiquidityPool from '../LiquidityPool'

import {
  LogoBox,
  ConfirmContent,
  TxnsInfoText,
  ConfirmText,
  FlexEC,
} from '../../pages/styled'

let intervalFN:any = ''

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {
  // const { account, chainId, library } = useActiveWeb3React()
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [selectNetworkInfo] = useUserSelectChainId()
  
  const useChainId = useMemo(() => {
    if (selectNetworkInfo?.chainId) {
      return selectNetworkInfo?.chainId
    }
    return chainId
  }, [selectNetworkInfo, chainId])

  // const allTokensList:any = useMergeBridgeTokenList(useChainId)
  const allTokensList:any = useAllMergeBridgeTokenList(bridgeKey, useChainId)
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  

  const [inputBridgeValue, setInputBridgeValue] = useState('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [recipient, setRecipient] = useState<any>(account ?? '')
  const [swapType, setSwapType] = useState('swap')
  
  const [intervalCount, setIntervalCount] = useState<number>(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipOpen, setModalTipOpen] = useState(false)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)

  const [curChain, setCurChain] = useState<any>({
    chain: useChainId,
    ts: '',
    bl: ''
  })
  const [destChain, setDestChain] = useState<any>({
    chain: config.getCurChainInfo(useChainId).bridgeInitChain,
    ts: '',
    bl: ''
  })

  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  const destConfig = useMemo(() => {
    // console.log(selectCurrency)
    if (selectCurrency && selectCurrency?.destChains && selectCurrency?.destChains[selectChain]) {
      return selectCurrency?.destChains[selectChain]
    }
    return false
  }, [selectCurrency, selectChain])

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
    if (
      selectCurrency
      && selectCurrency.address
      && useChainId
      && config.getCurChainInfo(useChainId)
      && config.getCurChainInfo(useChainId).nativeToken
      && config.getCurChainInfo(useChainId).nativeToken.toLowerCase() === selectCurrency.address.toLowerCase()
    ) {
      return true
    }
    return false
  }, [selectCurrency, useChainId])

  const isUnderlying = useMemo(() => {
    if (selectCurrency && selectCurrency?.underlying) {
      return true
    }
    return false
  }, [selectCurrency, selectChain])

  const isDestUnderlying = useMemo(() => {
    if (selectCurrency && selectCurrency?.destChains && selectCurrency?.destChains[selectChain] && selectCurrency?.destChains[selectChain]?.underlying) {
      return true
    }
    return false
  }, [selectCurrency, selectChain])

  const formatCurrency0 = useLocalToken(
  selectCurrency?.underlying ? {
    ...selectCurrency,
    address: selectCurrency.underlying.address,
    name: selectCurrency.underlying.name,
    symbol: selectCurrency.underlying?.symbol,
    decimals: selectCurrency.underlying.decimals
  } : selectCurrency)
  const formatCurrency = useLocalToken(selectNetworkInfo?.chainId ? undefined : selectCurrency)
  const formatInputBridgeValue = tryParseAmount(inputBridgeValue, formatCurrency ?? undefined)
  const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, isRouter ? useDestAddress : formatCurrency0?.address)

  useEffect(() => {
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

  const getSelectPool = useCallback(async() => {
    if (selectCurrency && useChainId) {
      
      const CC:any = await getNodeTotalsupply(
        selectCurrency?.underlying?.address,
        useChainId,
        selectCurrency?.decimals,
        account,
        selectCurrency?.address
      )
      // console.log(CC)
      // console.log(selectCurrency)
      if (CC) {
        setCurChain({
          chain: useChainId,
          ts: selectCurrency?.underlying ? CC[selectCurrency?.underlying?.address]?.ts : CC[selectCurrency?.address]?.anyts,
          bl: CC[selectCurrency?.address]?.balance
        })
      }
      
      const DC:any = await getNodeTotalsupply(
        selectCurrency?.destChains[selectChain]?.underlying?.address,
        selectChain,
        selectCurrency?.destChains[selectChain]?.decimals,
        account,
        selectCurrency?.destChains[selectChain]?.address
      )
      // console.log(DC)
      if (DC) {
        setDestChain({
          chain: selectChain,
          ts: selectCurrency?.underlying ? DC[selectCurrency?.destChains[selectChain]?.underlying.address]?.ts : DC[selectCurrency?.destChains[selectChain].token]?.anyts,
          bl: DC[selectCurrency?.destChains[selectChain].address]?.balance
        })
      }
      // console.log(CC)
      // console.log(DC)
      if (intervalFN) clearTimeout(intervalFN)
      intervalFN = setTimeout(() => {
        setIntervalCount(intervalCount + 1)
      }, 1000 * 10)
    }
  }, [selectCurrency, useChainId, account, selectChain, intervalCount])


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
    isUnderlying ? selectCurrency?.underlying?.address : selectCurrency?.address,
    destConfig?.pairid
  )

  const outputBridgeValue = useMemo(() => {
    if (inputBridgeValue && destConfig) {
      const baseFee = destConfig.BaseFeePercent ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100 : 0
      const fee = Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion) / 100
      let value = Number(inputBridgeValue) - fee
      if (fee < Number(destConfig.MinimumSwapFee)) {
        value = Number(inputBridgeValue) - Number(destConfig.MinimumSwapFee)
      } else if (fee > destConfig.MaximumSwapFee) {
        value = Number(inputBridgeValue) - Number(destConfig.MaximumSwapFee)
      } else {
        value = Number(inputBridgeValue) - fee - baseFee
      }
      if (value && Number(value) && Number(value) > 0) {
        return thousandBit(formatDecimal(value, Math.min(6, selectCurrency.decimals)), 'no')
      }
      return ''
    } else {
      return ''
    }
  }, [inputBridgeValue, destConfig])

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
  const isCrossBridge = useMemo(() => {
    const isAddr = isAddress( recipient, selectChain)
    if (
      account
      && destConfig
      && selectCurrency
      && inputBridgeValue
      && !isWrapInputError
      && isAddr
      && (
        (isDestUnderlying && destChain)
        || (!isDestUnderlying && !destChain)
      )
    ) {
      if (
        Number(inputBridgeValue) < Number(destConfig.MinimumSwap)
        || Number(inputBridgeValue) > Number(destConfig.MaximumSwap)
        || (isDestUnderlying && Number(inputBridgeValue) > Number(destChain.ts))
      ) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }, [selectCurrency, account, destConfig, inputBridgeValue, recipient, destChain, isWrapInputError, selectChain])

  const isInputError = useMemo(() => {
    if (
      account
      && destConfig
      && selectCurrency
      && inputBridgeValue
      && isCrossBridge
    ) {
      if (
        Number(inputBridgeValue) < Number(destConfig.MinimumSwap)
        || Number(inputBridgeValue) > Number(destConfig.MaximumSwap)
        || (isDestUnderlying && Number(inputBridgeValue) > Number(destChain.ts))
        || isWrapInputError
        || isCrossBridge
      ) {
        // console.log(1)
        return true
      } else {
        // console.log(2)
        return false
      }
    } else {
      // console.log(3)
      return false
    }
  }, [account, destConfig, selectCurrency, inputBridgeValue, isCrossBridge, isWrapInputError])

  const btnTxt = useMemo(() => {
    // console.log(isWrapInputError)
    if (isWrapInputError && inputBridgeValue) {
      return isWrapInputError
    } else if (
      destConfig
      && inputBridgeValue
      && (
        Number(inputBridgeValue) < Number(destConfig.MinimumSwap)
        || Number(inputBridgeValue) > Number(destConfig.MaximumSwap)
      )
    ) {
      return t('ExceedLimit')
    } else if (isDestUnderlying && Number(inputBridgeValue) > Number(destChain.ts)) {
      return t('nodestlr')
    } else if (wrapType === WrapType.WRAP || wrapTypeNative === WrapType.WRAP || wrapTypeUnderlying === WrapType.WRAP || wrapTypeCrossBridge === WrapType.WRAP) {
      return t('swap')
    }
    return t('swap')
  }, [t, isWrapInputError, inputBridgeValue, destConfig, destChain, wrapType, wrapTypeNative, wrapTypeUnderlying, isDestUnderlying, wrapTypeCrossBridge, isRouter])

  useEffect(() => {
    const t = selectCurrency && selectCurrency.chainId?.toString() === useChainId?.toString() ? selectCurrency.address : (initBridgeToken ? initBridgeToken : config.getCurChainInfo(useChainId).bridgeInitToken)

    const list:any = {}
    // console.log(bridgeKey)
    // console.log(allTokensList)
    if (Object.keys(allTokensList).length > 0) {
      let useToken = selectCurrency ? selectCurrency?.address : ''
      for (const token in allTokensList) {
        if (!isAddress(token) && token !== config.getCurChainInfo(useChainId).symbol) continue
        list[token] = {
          ...allTokensList[token],
        }
        // console.log(selectCurrency)
        if (!useToken || useToken.chainId?.toString() !== useChainId?.toString()) {
          if (
            t === token
            || list[token]?.symbol?.toLowerCase() === t
            || list[token]?.underlying?.symbol?.toLowerCase() === t
          ) {
            useToken = token
          }
        }
      }
      // console.log(list)
      setSelectCurrency(list[useToken])
    } else {
      setSelectCurrency('')
    }
  }, [useChainId, allTokensList])

  useEffect(() => {
    if (swapType == 'swap' && account && !isNaN(selectChain)) {
      setRecipient(account)
    } else if (isNaN(selectChain) && destConfig?.type === 'swapout') {
      setRecipient('')
    }
  }, [account, swapType, selectChain, destConfig])

  useEffect(() => {
    // console.log(selectCurrency)
    if (selectCurrency) {
      const arr = []
      for (const c in selectCurrency?.destChains) {
        if (c?.toString() === useChainId?.toString()) continue
        arr.push(c)
      }
      let useChain:any = selectChain ? selectChain : config.getCurChainInfo(useChainId).bridgeInitChain
      if (arr.length > 0) {
        if (
          !useChain
          || (useChain && !arr.includes(useChain))
        ) {
          for (const c of arr) {
            if (config.getCurConfigInfo()?.hiddenChain?.includes(c)) continue
            useChain = c
            break
          }
        }
      }
      setSelectChain(useChain)
      setSelectChainList(arr)
    }
  }, [selectCurrency])

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
      >
        <LogoBox>
          <TokenLogo symbol={selectCurrency?.symbol ?? selectCurrency?.symbol} size={'1rem'}></TokenLogo>
        </LogoBox>
        <ConfirmContent>
          <TxnsInfoText>{inputBridgeValue + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, useChainId)}</TxnsInfoText>
          {
            isUnderlying && isDestUnderlying ? (
              <ConfirmText>
                {
                  t('swapTip', {
                    symbol: config.getBaseCoin(selectCurrency?.underlying?.symbol, useChainId),
                    symbol1: config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, useChainId),
                    chainName: config.getCurChainInfo(selectChain).name
                  })
                }
              </ConfirmText>
            ) : ''
          }
          <BottomGrouping>
            {!account ? (
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
                      t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, useChainId)
                    )}
                  </ButtonConfirmed>
                ) : (
                  <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
                  // <ButtonPrimary disabled={delayAction} onClick={() => {
                    onDelay()
                    if (isRouter) {
                      if (!selectCurrency || !isUnderlying) {
                        if (onWrap) onWrap().then(() => {
                          onClear()
                        })
                      } else {
                        // if (onWrapUnderlying) onWrapUnderlying()
                        if (isNativeToken) {
                          if (onWrapNative) onWrapNative().then(() => {
                            onClear()
                          })
                        } else {
                          if (onWrapUnderlying) onWrapUnderlying().then(() => {
                            onClear()
                          })
                        }
                      }
                    } else {
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
          onOpenModalView={(value) => {
            // console.log(value)
            setModalOpen(value)
          }}
          isViewModal={modalOpen}
          id="selectCurrency"
          isError={isInputError}
          isNativeToken={isNativeToken}
          bridgeKey={bridgeKey}
          allTokens={allTokensList}
        />
        {
          account && useChainId && isUnderlying && isDestUnderlying ? (
            <LiquidityPool
              curChain={curChain}
              destChain={destChain}
              isUnderlying={isUnderlying}
              isDestUnderlying={isDestUnderlying}
            />
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
            account && destConfig?.type !== 'swapin' && !isNaN(selectChain) ? (
              <ArrowWrapper clickable={false} style={{cursor:'pointer', position: 'absolute', right: 0}} onClick={() => {
                if (swapType === 'swap') {
                  setSwapType('send')
                } else {
                  setSwapType('swap')
                  if (account) {
                    setRecipient(account)
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
          onOpenModalView={(value) => {
            console.log(value)
            setModalOpen(value)
          }}
          bridgeConfig={selectCurrency}
          intervalCount={intervalCount}
          isNativeToken={isNativeToken}
          selectChainList={selectChainList}
        />
        {
          swapType == 'send' || (isNaN(selectChain) && destConfig?.type === 'swapout') || isNaN(useChainId) ? (
            <AddressInputPanel id="recipient" value={recipient} onChange={setRecipient} selectChainId={selectChain} />
          ) : ''
        }
      </AutoColumn>

      <Reminder bridgeConfig={selectCurrency} bridgeType='bridgeAssets' currency={selectCurrency} selectChain={selectChain}/>
      {
        config.isStopSystem ? (
          <BottomGrouping>
            <ButtonLight disabled>{t('stopSystem')}</ButtonLight>
          </BottomGrouping>
        ) : (
          <BottomGrouping>
            {!account ? (
                <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
              ) : (
                !isNativeToken && selectCurrency && isUnderlying && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)? (
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
                      t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, useChainId)
                    )}
                  </ButtonConfirmed>
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