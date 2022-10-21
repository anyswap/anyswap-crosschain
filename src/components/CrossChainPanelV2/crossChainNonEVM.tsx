import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'

// import {isAddress} from 'multichain-bridge'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown, Plus, Minus } from 'react-feather'
// import {  useWallet, ConnectType } from '@terra-money/wallet-provider'

import SelectChainIdInputPanel from './selectChainID'
import Reminder from './reminder'

import {useActiveReact} from '../../hooks/useActiveReact'
import {useTerraCrossBridgeCallback} from '../../hooks/useBridgeCallback'
import { useNebBridgeCallback, useCurrentWNASBalance } from '../../nonevm/nas'
import { useNearSendTxns } from '../../nonevm/near'
import { useXlmCrossChain } from '../../nonevm/stellar'
import {useTrxCrossChain} from '../../nonevm/trx'
import {useAdaCrossChain} from '../../nonevm/cardano'
import {useNonevmAllowances} from '../../nonevm/allowances'
import {useSolCrossChain} from '../../nonevm/solana'
import {useAptCrossChain} from '../../nonevm/apt'

import {useConnectWallet} from '../../hooks/useWallet'
import { ApprovalState } from '../../hooks/useApproveCallback'
// import { WrapType } from '../../hooks/useWrapCallback'

import SelectCurrencyInputPanel from '../CurrencySelect/selectCurrency'
import { AutoColumn } from '../Column'
// import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../Button'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../Button'
import { AutoRow } from '../Row'
// import Loader from '../Loader'
import AddressInputPanel from '../AddressInputPanel'
import { ArrowWrapper, BottomGrouping } from '../swap/styleds'
import ModalContent from '../Modal/ModalContent'

import { useWalletModalToggle } from '../../state/application/hooks'
// import { tryParseAmount } from '../../state/swap/hooks'
// import { useMergeBridgeTokenList } from '../../state/lists/hooks'
import { useAllMergeBridgeTokenList } from '../../state/lists/hooks'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'
import { ChainId } from '../../config/chainConfig/chainId'
import { isAddress } from '../../utils/isAddress'

// import {getNodeTotalsupply} from '../../utils/bridge/getBalanceV2'
// import {formatDecimal, thousandBit} from '../../utils/tools/tools'

// import TokenLogo from '../TokenLogo'
// import LiquidityPool from '../LiquidityPool'
import ConfirmView from './confirmModal'
import ErrorTip from './errorTip'
import {
  // LogoBox,
  ConfirmContent,
  // TxnsInfoText,
  ConfirmText,
  FlexEC,
} from '../../pages/styled'

import {
  outputValue,
  useInitSelectCurrency,
  useDestChainid,
  useDestCurrency
} from './hooks'
// import useInterval from '../../hooks/useInterval'

// let intervalFN:any = ''

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {
  
  const { account, chainId, evmAccount } = useActiveReact()
  const { t } = useTranslation()
  
  // const { connect } = useWallet()
  const connectWallet = useConnectWallet()
  
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
  
  // const [intervalCount, setIntervalCount] = useState<number>(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipOpen, setModalTipOpen] = useState(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)

  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  const destConfig = useMemo(() => {
    console.log(selectCurrency)
    if (selectDestCurrency) {
      return selectDestCurrency
    }
    return false
  }, [selectDestCurrency])

  const isApprove = useMemo(() => {
    return destConfig.isApprove
  }, [destConfig])

  const anyToken = useMemo(() => {
    if (destConfig?.fromanytoken) {
      return destConfig.fromanytoken
    }
    return undefined
  }, [destConfig.fromanytoken])

  const isLiquidity = useMemo(() => {
    return destConfig.isLiquidity
  }, [destConfig])

  const isDestUnderlying = useMemo(() => {
    if (destConfig?.underlying) {
      return true
    }
    return false
  }, [destConfig])
  
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

  const {allowance, loading, setNonevmAllowance} = useNonevmAllowances(isApprove, selectCurrency, destConfig?.spender, chainId, account, inputBridgeValue)

  const approveState = useMemo(() => {
    // console.log(trxAllowance)
    if (inputBridgeValue && isApprove) {
      if ((allowance || allowance === 0) && Number(inputBridgeValue) > Number(allowance)) {
      // if (trxAllowance && Number(inputBridgeValue) < Number(trxAllowance)) {
        if (loading) {
          return ApprovalState.PENDING
        } else {
          return ApprovalState.NOT_APPROVED
        }
      }
      return ApprovalState.UNKNOWN
    }
    return ApprovalState.UNKNOWN
    // return ApprovalState.NOT_APPROVED
  }, [chainId, allowance, inputBridgeValue, isApprove, loading])

  const { balanceBig: nasBalance } = useCurrentWNASBalance(selectCurrency?.address)

  const { inputError: wrapInputErrorNeb, wrapType: wrapNebType, execute: onNebWrap } = useNebBridgeCallback({
    inputCurrency: selectCurrency,
    DepositAddress: destConfig.DepositAddress,
    typedValue: inputBridgeValue,
    chainId,
    selectChain,
    recipient,
    pairid: destConfig?.pairid,
    isLiquidity,
    destConfig
  })

  const { balance: terraBalance, wrapType: wrapTerraType, execute: onTerraWrap, inputError: wrapInputErrorTerra } = useTerraCrossBridgeCallback(
    selectCurrency,
    destConfig.DepositAddress,
    inputBridgeValue,
    selectChain,
    selectCurrency?.address,
    destConfig?.pairid,
    recipient,
    selectCurrency?.unit,
    chainId,
    isLiquidity,
    destConfig
  )

  const { balance: nearBalance, execute: onNearWrap, inputError: wrapInputErrorNear } = useNearSendTxns(
    destConfig?.router,
    selectCurrency,
    anyToken?.address,
    selectCurrency?.address,
    inputBridgeValue,
    recipient,
    chainId,
    selectChain,
    destConfig
  )

  const {balance: xlmBalance,execute: onXlmWrap, inputError: wrapInputErrorXlm} = useXlmCrossChain(
    chainId,
    selectCurrency,
    selectChain,
    recipient,
    destConfig?.router,
    inputBridgeValue,
    destConfig
  )
  const {balance: trxBalance,execute: onTrxWrap, inputError: wrapInputErrorTrx} = useTrxCrossChain(
    destConfig?.router,
    anyToken?.address,
    chainId,
    selectCurrency,
    selectChain,
    recipient,
    inputBridgeValue,
    destConfig
  )
  const {balance: adaBalance,execute: onAdaWrap, inputError: wrapInputErrorAda} = useAdaCrossChain(
    destConfig?.router,
    anyToken?.address,
    chainId,
    selectCurrency,
    selectChain,
    recipient,
    inputBridgeValue,
    destConfig
  )
  const {execute: onSolWrap, inputError: wrapInputErrorSol} = useSolCrossChain(
    destConfig?.router,
    anyToken?.address,
    selectCurrency,
    selectChain,
    recipient,
    inputBridgeValue,
    destConfig
  )

  const {execute: onAptWrap, inputError: wrapInputErrorApt} = useAptCrossChain(
    destConfig?.router,
    anyToken?.address,
    selectCurrency,
    selectChain,
    recipient,
    inputBridgeValue,
    destConfig
  )

  const {outputBridgeValue, fee} = outputValue(inputBridgeValue, destConfig, selectCurrency)

  const useBalance = useMemo(() => {
    // console.log(xlmBalance)
    // console.log(chainId)
    // console.log(ChainId.NEAR)
    if (chainId === ChainId.NAS) {
      if (nasBalance) {
        const nasBalanceFormat = nasBalance?.toExact()
        return nasBalanceFormat
      } else if (!nasBalance && account) {
        return 0
      }
    } else if (chainId === ChainId.TERRA) {
      if (terraBalance) {
        return terraBalance?.toExact()
      } else if (!terraBalance && account) {
        return 0
      }
    } else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {
      if (nearBalance) {
        return nearBalance?.toExact()
      } else if (!nearBalance && account) {
        return 0
      }
    } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(chainId)) {
      if (xlmBalance) {
        return xlmBalance?.toExact()
      } else if (!xlmBalance && account) {
        return '0'
      }
    } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
      if (trxBalance) {
        return trxBalance?.toExact()
      } else if (!trxBalance && account) {
        return '0'
      }
    } else if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId)) {
      if (adaBalance) {
        return adaBalance?.toExact()
      } else if (!adaBalance && account) {
        return '0'
      }
    }
    
    return ''
  }, [terraBalance,chainId,nasBalance, nearBalance, xlmBalance, account, trxBalance, adaBalance])
  // console.log(useBalance)
  const isWrapInputError = useMemo(() => {
    if (wrapInputErrorTerra && chainId === ChainId.TERRA) {
      return wrapInputErrorTerra
    } else if (wrapInputErrorNeb && chainId === ChainId.NAS) {
      return wrapInputErrorNeb
    } else if (wrapInputErrorNear && [ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {
      return wrapInputErrorNear
    } else if (wrapInputErrorXlm && [ChainId.XLM, ChainId.XLM_TEST].includes(chainId)) {
      return wrapInputErrorXlm
    } else if (wrapInputErrorTrx && [ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
      return wrapInputErrorTrx
    } else if (wrapInputErrorAda && [ChainId.ADA, ChainId.ADA_TEST].includes(chainId)) {
      return wrapInputErrorAda
    } else if (wrapInputErrorSol && [ChainId.SOL, ChainId.SOL_TEST].includes(chainId)) {
      return wrapInputErrorSol
    } else if (wrapInputErrorApt && [ChainId.SOL, ChainId.SOL_TEST].includes(chainId)) {
      return wrapInputErrorApt
    } else {
      return false
    }
  }, [wrapInputErrorTerra, chainId, wrapInputErrorNeb, wrapInputErrorNear, wrapInputErrorXlm, wrapInputErrorTrx, wrapInputErrorAda, wrapInputErrorSol, wrapInputErrorApt])
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
          tip: t('ExceedMinLimit', {
            amount: destConfig.MinimumSwap,
            symbol: selectCurrency.symbol
          })
        }
      } else if (Number(inputBridgeValue) > Number(destConfig.MaximumSwap)) {
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
  }, [selectCurrency, selectChain, isWrapInputError, inputBridgeValue, destConfig])

  const errorTip = useMemo(() => {
    const isAddr = isAddress( recipient, selectChain)
    if (!account) {
      return undefined
    } else if (isInputError) {
      return isInputError
    } else if (!Boolean(isAddr)) {
      return {
        state: 'Error',
        tip: t('invalidRecipient')
      }
    }
    return undefined
  }, [isInputError, selectChain, recipient, account])

  const isCrossBridge = useMemo(() => {
    if (errorTip || !inputBridgeValue) {
      return true
    }
    return false
  }, [errorTip, inputBridgeValue])

  const btnTxt = useMemo(() => {
    return t('swap')
  }, [wrapTerraType, wrapNebType])

  const {initCurrency} = useInitSelectCurrency(allTokensList, chainId, initBridgeToken)

  useEffect(() => {
    setSelectCurrency(initCurrency)
  }, [initCurrency])
  
  useEffect(() => {
    // console.log(evmAccount)
    if (evmAccount) {
      setRecipient(evmAccount)
    } else {
      setRecipient('')
    }
  }, [evmAccount])

  const {initChainId, initChainList} = useDestChainid(selectCurrency, selectChain, chainId)

  useEffect(() => {
    // console.log(selectCurrency)
    setSelectChain(initChainId)
  }, [initChainId])

  useEffect(() => {
    setSelectChainList(initChainList)
  }, [initChainList])

  const {initDestCurrency, initDestCurrencyList} = useDestCurrency(selectCurrency, selectCurrency?.destChains?.[selectChain])

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
        {/* <LogoBox>
          <TokenLogo symbol={selectCurrency?.symbol ?? selectCurrency?.symbol} size={'1rem'}></TokenLogo>
        </LogoBox> */}
        <ConfirmContent>
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
            isDestUnderlying ? (
              <>
                <ConfirmText>
                  {
                    t('swapTip', {
                      symbol: anyToken?.symbol,
                      symbol1: selectCurrency?.symbol,
                      chainName: config.getCurChainInfo(selectChain).name
                    })
                  }
                </ConfirmText>
              </>
            ) : (
              <></>
            )
          }
          <BottomGrouping>
            {!account ? (
                <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
              ) : (
                <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
                // <ButtonPrimary disabled={delayAction} onClick={() => {
                  onDelay()
                  if (onTerraWrap && chainId === ChainId.TERRA) {
                    onTerraWrap().then(() => {
                      onClear()
                    })
                  } else if (onNebWrap && chainId === ChainId.NAS) {
                    console.log('onNebWrap')
                    onNebWrap().then(() => {
                      onClear()
                    })
                  } else if (onNearWrap && [ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {
                    console.log('onNebWrap')
                    onNearWrap().then(() => {
                      onClear()
                    })
                  } else if (onXlmWrap && [ChainId.XLM, ChainId.XLM_TEST].includes(chainId)) {
                    console.log('onXlmWrap')
                    onXlmWrap().then(() => {
                      onClear()
                    })
                  } else if (onTrxWrap && [ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
                    console.log('onTrxWrap')
                    onTrxWrap().then(() => {
                      onClear()
                    })
                  } else if (onAdaWrap && [ChainId.ADA, ChainId.ADA_TEST].includes(chainId)) {
                    console.log('onAdaWrap')
                    onAdaWrap().then(() => {
                      onClear()
                    })
                  } else if (onSolWrap && [ChainId.SOL, ChainId.SOL_TEST].includes(chainId)) {
                    console.log('onSolWrap')
                    onSolWrap().then(() => {
                      onClear()
                    })
                  } else if (onAptWrap && [ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
                    console.log('onAptWrap')
                    onAptWrap().then(() => {
                      onClear()
                    })
                  }
                  
                }}>
                  {t('Confirm')}
                </ButtonPrimary>
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
          currency={selectCurrency}
          disableCurrencySelect={false}
          showMaxButton={true}
          isViewNetwork={true}
          onOpenModalView={(value) => {
            // console.log(value)
            setModalOpen(value)
          }}
          isViewModal={modalOpen}
          id="selectCurrency"
          isError={Boolean(isInputError)}
          bridgeKey={bridgeKey}
          allTokens={allTokensList}
          customChainId={chainId}
          customBalance={useBalance}
        />
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
                }
                if (evmAccount) {
                  setRecipient(evmAccount)
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
          // intervalCount={intervalCount}
          selectChainList={selectChainList}
          selectDestCurrency={selectDestCurrency}
          selectDestCurrencyList={selectDestCurrencyList}
          bridgeKey={bridgeKey}
        />
        {
          swapType == 'send' || (isNaN(selectChain) && destConfig?.type === 'swapout') || isNaN(chainId) ? (
            <AddressInputPanel id="recipient" value={recipient} label={t('Recipient')} labelTip={'( ' + t('receiveTip') + ' )'} onChange={setRecipient} isValid={false} selectChainId={selectChain} isError={!Boolean(isAddress( recipient, selectChain))} />
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
          <>
          {
            approveState === ApprovalState.NOT_APPROVED ? (
              <>
                <BottomGrouping>

                  <ButtonConfirmed
                    onClick={() => {
                      onDelay()
                      // setTrxAllowance({token: selectCurrency?.address, spender: destConfig?.spender}).then(() => {
                      setNonevmAllowance().then(() => {
                        setDelayAction(false)
                      })
                    }}
                    disabled={delayAction}
                    width="48%"
                    // altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                  >
                    {t('Approve')}
                  </ButtonConfirmed>
                  <ButtonConfirmed disabled={true} width="45%" style={{marginLeft:'10px'}}>
                    {t('swap')}
                  </ButtonConfirmed>
                </BottomGrouping>
              </>
            ) : (
                <BottomGrouping>
                  {!account ? (
                      <>
                        <ButtonLight onClick={() => {
                          connectWallet()
                        }}>{t('ConnectWallet')}</ButtonLight>
                      </>
                    ) : (
                      <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
                        setModalTipOpen(true)
                      }}>
                        {btnTxt}
                      </ButtonPrimary>
                    )
                  }
                </BottomGrouping>
            )
          }
          </>
        )
      }
    </>
  )
}