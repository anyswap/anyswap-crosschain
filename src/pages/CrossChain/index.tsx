import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
// import { TokenAmount } from 'anyswap-sdk'
// import { createBrowserHistory } from 'history'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown, Plus, Minus } from 'react-feather'

import Reminder from './reminder'

import { useActiveWeb3React } from '../../hooks'
import {useBridgeCallback, useBridgeUnderlyingCallback, useBridgeNativeCallback} from '../../hooks/useBridgeCallback'
import { WrapType } from '../../hooks/useWrapCallback'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { useLocalToken } from '../../hooks/Tokens'

import SelectChainIdInputPanel from '../../components/CrossChainPanel/selectChainID'
import SelectCurrencyInputPanel from '../../components/CurrencySelect/selectCurrency'
import { AutoColumn } from '../../components/Column'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ArrowWrapper, BottomGrouping } from '../../components/swap/styleds'
import Title from '../../components/Title'
import ModalContent from '../../components/Modal/ModalContent'

// import { useWalletModalToggle, useToggleNetworkModal } from '../../state/application/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { tryParseAmount } from '../../state/swap/hooks'
import { useBridgeTokenList } from '../../state/lists/hooks'
import { useBetaMessageManager } from '../../state/user/hooks'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'

import {getNodeTotalsupply} from '../../utils/bridge/getBalanceV2'
import {formatDecimal, thousandBit} from '../../utils/tools/tools'
import { isAddress } from '../../utils'

import AppBody from '../AppBody'
import TokenLogo from '../../components/TokenLogo'
import LiquidityPool from '../../components/LiquidityPool'
import WarningTip from '../../components/WarningTip'
import {
  LogoBox,
  ConfirmContent,
  TxnsInfoText,
  ConfirmText,
  FlexEC
} from '../styled'

let intervalFN:any = ''

const BRIDGETYPE = 'routerTokenList'

export default function CrossChain() {
  // const { account, chainId, library } = useActiveWeb3React()
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const allTokensList:any = useBridgeTokenList(BRIDGETYPE, chainId)
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  const [showBetaMessage] = useBetaMessageManager()
  

  const [inputBridgeValue, setInputBridgeValue] = useState('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [recipient, setRecipient] = useState<any>(account ?? '')
  const [swapType, setSwapType] = useState('swap')
  // const [count, setCount] = useState<number>(0)
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
  // console.log(selectCurrency)

  const destConfig = useMemo(() => {
    // console.log(selectCurrency)
    if (selectCurrency && selectCurrency?.destChains && selectCurrency?.destChains[selectChain]) {
      return selectCurrency?.destChains[selectChain]
    }
    return false
  }, [selectCurrency, selectChain])

  // console.log(selectCurrency)
  // console.log(destConfig)
  
  const isNativeToken = useMemo(() => {
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
  }, [selectCurrency, selectChain])

  
  const isDestUnderlying = useMemo(() => {
    if (selectCurrency && selectCurrency?.destChains && selectCurrency?.destChains[selectChain] && selectCurrency?.destChains[selectChain]?.underlying) {
      return true
    }
    return false
  }, [selectCurrency, selectChain])

  const formatCurrency = useLocalToken(selectCurrency)
  // const formatInputBridgeValue = inputBridgeValue && Number(inputBridgeValue) ? tryParseAmount(inputBridgeValue, formatCurrency ?? undefined) : ''
  const formatInputBridgeValue = tryParseAmount(inputBridgeValue, formatCurrency && !isNativeToken ? formatCurrency : undefined)
  const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, destConfig?.routerToken)

  useEffect(() => {
    // console.log(approval)
    // console.log(ApprovalState)
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted, selectCurrency])

  // console.log(selectCurrency)

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
    if (selectCurrency && chainId) {
      
      const CC:any = await getNodeTotalsupply(
        selectCurrency?.underlying?.address,
        chainId,
        selectCurrency?.decimals,
        account,
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
          ts: selectCurrency?.destChains[selectChain]?.underlying?.address ? DC[selectCurrency?.destChains[selectChain]?.underlying.address]?.ts : DC[selectCurrency?.destChains[selectChain].address]?.anyts,
          bl: selectCurrency?.destChains[selectChain]?.underlying?.address ? DC[selectCurrency?.destChains[selectChain]?.underlying?.address]?.balance : ''
        })
      }
      // console.log(CC)
      // console.log(DC)
      if (intervalFN) clearTimeout(intervalFN)
      intervalFN = setTimeout(() => {
        setIntervalCount(intervalCount + 1)
      }, 1000 * 10)
    }
  }, [selectCurrency, chainId, account, selectChain, intervalCount])


  useEffect(() => {
    getSelectPool()
  }, [getSelectPool])
  
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useBridgeCallback(
    destConfig?.routerToken,
    formatCurrency?formatCurrency:undefined,
    isUnderlying ? selectCurrency?.underlying?.address : selectCurrency?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency
  )

  const { wrapType: wrapTypeNative, execute: onWrapNative, inputError: wrapInputErrorNative } = useBridgeNativeCallback(
    destConfig?.routerToken,
    formatCurrency?formatCurrency:undefined,
    isUnderlying ? selectCurrency?.underlying?.address : selectCurrency?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type
  )

  const { wrapType: wrapTypeUnderlying, execute: onWrapUnderlying, inputError: wrapInputErrorUnderlying } = useBridgeUnderlyingCallback(
    destConfig?.routerToken,
    formatCurrency?formatCurrency:undefined,
    isUnderlying ? selectCurrency?.underlying?.address : selectCurrency?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency
  )

  const outputBridgeValue = useMemo(() => {
    if (inputBridgeValue && destConfig) {
      const fee = Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion) / 100
      let value = Number(inputBridgeValue) - fee
      if (fee < Number(destConfig.MinimumSwapFee)) {
        value = Number(inputBridgeValue) - Number(destConfig.MinimumSwapFee)
      } else if (fee > destConfig.MaximumSwapFee) {
        value = Number(inputBridgeValue) - Number(destConfig.MaximumSwapFee)
      }
      if (!destConfig?.swapfeeon) {
        value = Number(inputBridgeValue)
      }
      if (value && Number(value) && Number(value) > 0) {
        return thousandBit(formatDecimal(value, Math.min(6, selectCurrency.decimals)), 'no')
      }
      return ''
    } else {
      return ''
    }
  }, [inputBridgeValue, destConfig, selectChain])

  const isWrapInputError = useMemo(() => {
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
    
  }, [isNativeToken, wrapInputError, wrapInputErrorUnderlying, wrapInputErrorNative, selectCurrency])

  const isCrossBridge = useMemo(() => {
    if (
      account
      && destConfig
      && selectCurrency
      && inputBridgeValue
      && !isWrapInputError
      && isAddress(recipient)
      && !showBetaMessage
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
  }, [selectCurrency, account, destConfig, inputBridgeValue, recipient, destChain, isWrapInputError, showBetaMessage])

  const isInputError = useMemo(() => {
    // console.log(account)
    // console.log(destConfig)
    // console.log(selectCurrency)
    // console.log(inputBridgeValue)
    // console.log(isCrossBridge)
    // console.log(isWrapInputError)
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
    } else if (wrapType === WrapType.WRAP || wrapTypeNative === WrapType.WRAP || wrapTypeUnderlying === WrapType.WRAP) {
      return t('swap')
    }
    return t('swap')
  }, [t, isWrapInputError, inputBridgeValue, destConfig, destChain, wrapType, wrapTypeNative, wrapTypeUnderlying, isDestUnderlying])

  

  useEffect(() => {
    const t = selectCurrency && selectCurrency.chainId?.toString() === chainId?.toString() ? selectCurrency.address : (initBridgeToken ? initBridgeToken : config.getCurChainInfo(chainId).bridgeInitToken)

    const list:any = {}
    if (Object.keys(allTokensList).length > 0) {
      for (const token in allTokensList) {
        if (!isAddress(token)) continue
        list[token] = {
          ...allTokensList[token].tokenInfo,
        }
        // console.log(selectCurrency)
        if (!selectCurrency || selectCurrency.chainId?.toString() !== chainId?.toString()) {
          if (
            t === token
            || list[token]?.symbol?.toLowerCase() === t
            || list[token]?.underlying?.symbol?.toLowerCase() === t
          ) {
            setSelectCurrency(list[token])
          }
        }
      }
    } else {
      setSelectCurrency('')
    }
  }, [chainId, allTokensList])

  useEffect(() => {
    if (swapType == 'swap' && account) {
      setRecipient(account)
    }
  }, [account, swapType])

  useEffect(() => {
    // console.log(selectCurrency)
    if (selectCurrency) {
      // const arr = []
      // for (const c in selectCurrency?.destChains) {
      //   if (
      //     c?.toString() === chainId?.toString()
      //     || !config.chainInfo[c]
      //   ) continue
      //   arr.push(c)
      // }
      // let useChain:any = selectChain ? selectChain : config.getCurChainInfo(chainId).bridgeInitChain
      // if (arr.length > 0) {
      //   if (
      //     !useChain
      //     || (useChain && !arr.includes(useChain))
      //   ) {
      //     for (const c of arr) {
      //       if (config.getCurConfigInfo()?.hiddenChain?.includes(c)) continue
      //       useChain = c
      //       break
      //     }
      //   }
      // }
      let initChainId:any = '',
        initChainList:any = []
      if (selectCurrency) {
        const arr = []
        for (const c in selectCurrency?.destChains) {
          if (c?.toString() === chainId?.toString() || !config.chainInfo[c]) continue
          arr.push(c)
        }
        // console.log(arr)
        let useChain:any = selectChain ? selectChain : config.getCurChainInfo(selectChain).bridgeInitChain
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
        // console.log('useChain', useChain)
        // setSelectChain(useChain)
        initChainId = useChain
        initChainList = arr
        // setSelectChainList(arr)
      }
      setSelectChain(initChainId)
      setSelectChainList(initChainList)
    }
  }, [selectCurrency])

  const handleMaxInput = useCallback((value) => {
    if (value) {
      setInputBridgeValue(value)
    } else {
      setInputBridgeValue('')
    }
    // setSwapType('send')
  }, [setInputBridgeValue])
  // console.log(isUnderlying)
  // console.log(isDestUnderlying)
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
          <TxnsInfoText>{inputBridgeValue + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId)}</TxnsInfoText>
          {
            isUnderlying && isDestUnderlying ? (
              <ConfirmText>
                {
                  t('swapTip', {
                    symbol: config.getBaseCoin(selectCurrency?.underlying?.symbol, chainId),
                    symbol1: config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId),
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
                      t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId)
                    )}
                  </ButtonConfirmed>
                ) : (
                  <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
                  // <ButtonPrimary disabled={delayAction} onClick={() => {
                    onDelay()
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
                  }}>
                    {t('Confirm')}
                  </ButtonPrimary>
                )
              )
            }
          </BottomGrouping>
        </ConfirmContent>
      </ModalContent>
      <AppBody>
        <Title
          title={config.getCurConfigInfo().isOpenBridge ? t('router') : t('swap')}
          
          isNavLink={config.getCurConfigInfo().isOpenBridge ? true : false}
          tabList={config.getCurConfigInfo().isOpenBridge ? [
            {
              name: config.getCurConfigInfo().isOpenBridge ? t('router') : t('swap'),
              path: config.getCurConfigInfo().isOpenBridge ? '/v1/router' : '/swap',
              regex: config.getCurConfigInfo().isOpenBridge ? /\/v1\/router/ : /\/swap/,
              iconUrl: require('../../assets/images/icon/deposit.svg'),
              iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
            },
            {
              name: t('pool'),
              path: '/pool',
              regex: /\/pool/,
              iconUrl: require('../../assets/images/icon/pool.svg'),
              iconActiveUrl: require('../../assets/images/icon/pool-purpl.svg')
            }
          ] : []}
        ></Title>
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
            currency={formatCurrency}
            disableCurrencySelect={false}
            showMaxButton={true}
            isViewNetwork={true}
            onOpenModalView={(value) => {
              console.log(value)
              setModalOpen(value)
            }}
            isViewModal={modalOpen}
            id="selectCurrency"
            isError={isInputError}
            isNativeToken={isNativeToken}
            // isViewMode={false}
            // modeConent={{txt: swapType === 'send' ? t('Simple') : t('Advance'), isFlag: swapType === 'send'}}
            // onChangeMode={(value) => {
            //   if (value) {
            //     setSwapType('send')
            //   } else {
            //     setSwapType('swap')
            //     if (account) {
            //       setRecipient(account)
            //     }
            //   }
            // }}
            allTokens={allTokensList}
            bridgeKey={BRIDGETYPE}
            // allBalances={allBalances}
          />
          {
            account && chainId && isUnderlying ? (
              <LiquidityPool
                curChain={curChain}
                // destChain={destChain}
                isUnderlying={isUnderlying}
                selectCurrency={selectCurrency}
                // isDestUnderlying={isDestUnderlying}
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
            account && chainId && isDestUnderlying ? (
              <LiquidityPool
                // curChain={curChain}
                destChain={destChain}
                // isUnderlying={isUnderlying}
                isDestUnderlying={isDestUnderlying}
                selectCurrency={destConfig}
              />
            ) : ''
          }

          {swapType == 'swap' ? '' : (
            <AddressInputPanel id="recipient" label={t('Recipient')} labelTip={'( ' + t('receiveTip') + ' )'} value={recipient} onChange={setRecipient} />
          )}
        </AutoColumn>
        <WarningTip />

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
                    <>
                      <ButtonConfirmed
                        onClick={() => {
                          // onDelay()
                          // approveCallback()
                          setModalTipOpen(true)
                        }}
                        disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
                        width="45%"
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
      </AppBody>
    </>
  )
}