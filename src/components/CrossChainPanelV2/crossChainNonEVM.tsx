import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import { JSBI, Fraction } from 'anyswap-sdk'
import { isAddress } from 'multichain-bridge'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown, Plus, Minus } from 'react-feather'
import { useWallet, ConnectType } from '@terra-money/wallet-provider'

import SelectChainIdInputPanel from './selectChainID'
import Reminder from './reminder'

import { useActiveReact } from '../../hooks/useActiveReact'
import { useTerraCrossBridgeCallback } from '../../hooks/useBridgeCallback'
// import { WrapType } from '../../hooks/useWrapCallback'

import SelectCurrencyInputPanel from '../CurrencySelect/selectCurrency'
import { AutoColumn } from '../Column'
// import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../Button'
import { ButtonLight, ButtonPrimary } from '../Button'
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
import { getParams } from '../../config/tools/getUrlParams'
import { selectNetwork } from '../../config/tools/methods'

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
  FlexEC
} from '../../pages/styled'

import { outputValue, useInitSelectCurrency, useDestChainid, useDestCurrency } from './hooks'

import { useCurrentNasBalance } from '../../hooks/nebulas'

// let intervalFN:any = ''

export default function CrossChain({ bridgeKey }: { bridgeKey: any }) {
  const { account, chainId, evmAccount } = useActiveReact()
  const { t } = useTranslation()

  const { connect } = useWallet()
  // const connectedWallet = useConnectedWallet()

  const allTokensList: any = useAllMergeBridgeTokenList(bridgeKey, chainId)
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

  let initBridgeToken: any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  const destConfig = useMemo(() => {
    console.log(selectCurrency)
    if (selectDestCurrency) {
      return selectDestCurrency
    }
    return false
  }, [selectDestCurrency])

  const isUnderlying = useMemo(() => {
    if (selectCurrency && selectCurrency?.underlying) {
      return true
    }
    return false
  }, [selectCurrency])

  const isDestUnderlying = useMemo(() => {
    if (destConfig?.underlying) {
      return true
    }
    return false
  }, [destConfig])

  function onDelay() {
    setDelayAction(true)
  }
  function onClear(type?: any) {
    setDelayAction(false)
    setModalTipOpen(false)
    if (!type) {
      setInputBridgeValue('')
    }
  }

  function changeNetwork(chainID: any) {
    selectNetwork(chainID).then((res: any) => {
      console.log(res)
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', { label: config.getCurChainInfo(chainID).networkName }))
      }
    })
  }

  const {
    balance: terraBalance,
    wrapType: wrapTerraType,
    execute: onTerraWrap,
    inputError: wrapInputErrorTerra
  } = useTerraCrossBridgeCallback(
    selectCurrency,
    destConfig.DepositAddress,
    inputBridgeValue,
    selectChain,
    selectCurrency?.address,
    destConfig?.pairid,
    recipient,
    destConfig?.Unit,
    chainId
  )

  const { balance: nasBalance } = useCurrentNasBalance()

  const { outputBridgeValue, fee } = outputValue(inputBridgeValue, destConfig, selectCurrency)

  const useBalance = useMemo(() => {
    // console.log(terraBalance)
    if (terraBalance) {
      return terraBalance?.toSignificant(3)
    }
    if (chainId === 'NEBULAS') {
      if (nasBalance) {
        const nasBalanceFormat = new Fraction(
          JSBI.BigInt(nasBalance),
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
        )?.toSignificant(3)
        // console.log('nasBalance', nasBalanceFormat)
        return nasBalanceFormat
      }
    }

    return ''
  }, [terraBalance, nasBalance])
  // console.log(terraBalance)
  const isWrapInputError = useMemo(() => {
    if (wrapInputErrorTerra) {
      return wrapInputErrorTerra
    } else {
      return false
    }
  }, [wrapInputErrorTerra])
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
    const isAddr = isAddress(recipient, selectChain)
    if (!account) {
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
  }, [isInputError, selectChain, recipient])

  const isCrossBridge = useMemo(() => {
    if (errorTip || !inputBridgeValue) {
      return true
    }
    return false
  }, [errorTip, inputBridgeValue])

  const btnTxt = useMemo(() => {
    // console.log(isWrapInputError)
    // if (errorTip) {
    //   return errorTip?.tip
    // } else if (wrapTerraType === WrapType.WRAP) {
    //   return t('swap')
    // }
    return t('swap')
  }, [errorTip, t, wrapTerraType])

  const { initCurrency } = useInitSelectCurrency(allTokensList, chainId, initBridgeToken)

  useEffect(() => {
    setSelectCurrency(initCurrency)
  }, [initCurrency])

  useEffect(() => {
    if (swapType == 'swap' && evmAccount && !isNaN(selectChain)) {
      setRecipient(evmAccount)
    } else if (isNaN(selectChain) && destConfig?.type === 'swapout') {
      setRecipient('')
    }
  }, [evmAccount, swapType, selectChain, destConfig])

  const { initChainId, initChainList } = useDestChainid(selectCurrency, selectChain, chainId)

  useEffect(() => {
    // console.log(selectCurrency)
    setSelectChain(initChainId)
  }, [initChainId])

  useEffect(() => {
    setSelectChainList(initChainList)
  }, [initChainList])

  const { initDestCurrency, initDestCurrencyList } = useDestCurrency(selectCurrency, selectChain)

  useEffect(() => {
    setSelectDestCurrency(initDestCurrency)
  }, [initDestCurrency])

  useEffect(() => {
    setSelectDestCurrencyList(initDestCurrencyList)
  }, [initDestCurrencyList])

  const handleMaxInput = useCallback(
    value => {
      if (value) {
        setInputBridgeValue(value)
      } else {
        setInputBridgeValue('')
      }
    },
    [setInputBridgeValue]
  )

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
          {isUnderlying && isDestUnderlying ? (
            <>
              <ConfirmText>
                {t('swapTip', {
                  symbol: config.getBaseCoin(selectCurrency?.underlying?.symbol, chainId),
                  symbol1: config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId),
                  chainName: config.getCurChainInfo(selectChain).name
                })}
              </ConfirmText>
            </>
          ) : (
            <></>
          )}
          {/* <TxnsInfoText>{inputBridgeValue + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, chainId)}</TxnsInfoText>
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
          } */}
          <BottomGrouping>
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
            ) : (
              <ButtonPrimary
                disabled={isCrossBridge || delayAction}
                onClick={() => {
                  // <ButtonPrimary disabled={delayAction} onClick={() => {
                  onDelay()
                  if (onTerraWrap)
                    onTerraWrap().then(() => {
                      onClear()
                    })
                }}
              >
                {t('Confirm')}
              </ButtonPrimary>
            )}
          </BottomGrouping>
        </ConfirmContent>
      </ModalContent>

      <AutoColumn gap={'sm'}>
        <SelectCurrencyInputPanel
          label={t('From')}
          value={inputBridgeValue}
          onUserInput={value => {
            // console.log(value)
            setInputBridgeValue(value)
          }}
          onCurrencySelect={inputCurrency => {
            // console.log(inputCurrency)
            setSelectCurrency(inputCurrency)
          }}
          onMax={value => {
            handleMaxInput(value)
          }}
          currency={selectCurrency}
          disableCurrencySelect={false}
          showMaxButton={true}
          isViewNetwork={true}
          onOpenModalView={value => {
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
          <ArrowWrapper
            clickable={false}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              // toggleNetworkModal()
              changeNetwork(selectChain)
            }}
          >
            <ArrowDown size="16" color={theme.text2} />
          </ArrowWrapper>
          {destConfig?.type !== 'swapin' && !isNaN(selectChain) ? (
            <ArrowWrapper
              clickable={false}
              style={{ cursor: 'pointer', position: 'absolute', right: 0 }}
              onClick={() => {
                if (swapType === 'swap') {
                  setSwapType('send')
                } else {
                  setSwapType('swap')
                  if (evmAccount) {
                    setRecipient(evmAccount)
                  }
                }
              }}
            >
              {swapType === 'swap' ? (
                <FlexEC>
                  <Plus size="16" color={theme.text2} />{' '}
                  <span style={{ fontSize: '12px', lineHeight: '12px' }}>{t('sendto')}</span>
                </FlexEC>
              ) : (
                <FlexEC>
                  <Minus size="16" color={theme.text2} />{' '}
                  <span style={{ fontSize: '12px', lineHeight: '12px' }}>{t('sendto')}</span>
                </FlexEC>
              )}
            </ArrowWrapper>
          ) : (
            ''
          )}
        </AutoRow>

        <SelectChainIdInputPanel
          label={t('to')}
          value={outputBridgeValue.toString()}
          onUserInput={value => {
            setInputBridgeValue(value)
          }}
          onChainSelect={chainID => {
            setSelectChain(chainID)
          }}
          selectChainId={selectChain}
          id="selectChainID"
          onCurrencySelect={inputCurrency => {
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
        {swapType == 'send' || (isNaN(selectChain) && destConfig?.type === 'swapout') || isNaN(chainId) ? (
          <AddressInputPanel
            id="recipient"
            value={recipient}
            label={t('Recipient')}
            labelTip={'( ' + t('receiveTip') + ' )'}
            onChange={setRecipient}
            selectChainId={selectChain}
          />
        ) : (
          ''
        )}
      </AutoColumn>

      <Reminder destConfig={destConfig} bridgeType="bridgeAssets" currency={selectCurrency} selectChain={selectChain} />
      <ErrorTip errorTip={errorTip} />
      {config.isStopSystem ? (
        <BottomGrouping>
          <ButtonLight disabled>{t('stopSystem')}</ButtonLight>
        </BottomGrouping>
      ) : (
        <BottomGrouping>
          {!account ? (
            <>
              <ButtonLight
                onClick={() => {
                  if (connect) {
                    try {
                      connect(ConnectType.CHROME_EXTENSION)
                      // setModalView(true)
                    } catch (error) {
                      alert('Please install Terra Station!')
                    }
                  } else {
                    alert('Please install Terra Station!')
                  }
                }}
              >
                {t('ConnectWallet')}
              </ButtonLight>
              {/* <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight> */}
            </>
          ) : (
            <ButtonPrimary
              disabled={isCrossBridge || delayAction}
              onClick={() => {
                setModalTipOpen(true)
              }}
            >
              {btnTxt}
            </ButtonPrimary>
          )}
        </BottomGrouping>
      )}
    </>
  )
}
