import React, {useEffect, useState, useMemo, useContext, useCallback} from 'react'

import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'
import { ArrowDown } from 'react-feather'
import axios from 'axios'

import {useActiveReact} from '../../hooks/useActiveReact'
// import { useMergeBridgeTokenList } from '../../state/lists/hooks'
import { useAllMergeBridgeTokenList } from '../../state/lists/hooks'

import {getP2PInfo} from '../../utils/bridge/register'
import {CROSSCHAINBRIDGE} from '../../utils/bridge/type'
// import {formatDecimal, setLocalConfig, thousandBit} from '../../utils/tools/tools'
import {setLocalConfig} from '../../utils/tools/tools'
import {
  shortenAddress,
  // shortenAddress1
} from '../../utils'
import { isAddress } from '../../utils/isAddress'
import { createAddress } from '../../utils/isAddress/BTC'


import {
  // useDarkModeManager,
  // useExpertModeManager,
  useInterfaceModeManager,
  // useUserTransactionTTL,
  // useUserSlippageTolerance
} from '../../state/user/hooks'

import {
  useAddNoWalletTx
} from '../../state/transactions/hooks'
import {
  useTxnsErrorTipOpen,
  // useNoWalletModalToggle
  useTxnsDtilOpen
} from '../../state/application/hooks'

import SelectCurrencyInputPanel from '../CurrencySelect/selectCurrency'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
// import Loader from '../Loader'
import AddressInputPanel from '../AddressInputPanel'
import { ButtonPrimary, ButtonLight } from '../Button'
import { ArrowWrapper, BottomGrouping } from '../swap/styleds'
import ModalContent from '../Modal/ModalContent'
import QRcode from '../QRcode'
import CopyHelper from '../AccountDetails/Copy'

import SelectChainIdInputPanel from './selectChainID'
import Reminder from './reminder'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
// import {selectNetwork} from '../../config/tools/methods'
import ErrorTip from './errorTip'
import {
  ListBox
} from '../../pages/styled'

import {
  outputValue,
  useInitSelectCurrency,
  useDestChainid,
  useDestCurrency
} from './hooks'
import { ChainId } from '../../config/chainConfig/chainId'

const CrossChainTip = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.textColorBold};
  word-break: break-all;
  .red {
    color: ${({ theme }) => theme.red1};
    word-break: break-all;
  }
`

const HashInput = styled.input<{ error?: boolean; align?: string }>`
  color: ${({ error, theme }) => (error ? 'rgb(255, 104, 113)' : theme.textColorBold)};
  width: 100%;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  font-size: 14px;
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px 5px;
  -webkit-appearance: textfield;
  height: 30px;
  background: none;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.inputBorder};
  // margin-right: 1.875rem;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    // color: ${({ theme }) => theme.text4};
    color:#DADADA;
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 100%;
    margin-right: 0;
    height: 30px;
    font-size: 14px;
  `};
  &.error {
    color: ${({ theme }) => theme.red1};
  }
`

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {

  const { chainId, evmAccount } = useActiveReact()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  
  const {setAddNoWalletTx} = useAddNoWalletTx()

  const [userInterfaceMode] = useInterfaceModeManager()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  // const toggleWalletModal = useNoWalletModalToggle()
  const {onChangeViewDtil} = useTxnsDtilOpen()


  const [p2pAddress, setP2pAddress] = useState<any>('')
  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()
  const [selectDestCurrencyList, setSelectDestCurrencyList] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [recipient, setRecipient] = useState<any>(evmAccount ?? '')
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [delayAction, setDelayAction] = useState<boolean>(false)
  const [modalSpecOpen, setModalSpecOpen] = useState(false)
  const [memo, setMemo] = useState('')

  const [hash, setHash] = useState('')


  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  // const allTokensList:any = useMergeBridgeTokenList(useChainId)
  const allTokensList:any = useAllMergeBridgeTokenList(bridgeKey, chainId)
  const {initCurrency} = useInitSelectCurrency(allTokensList, chainId, initBridgeToken)

  useEffect(() => {
    // console.log(initCurrency)
    setSelectCurrency(initCurrency)
  }, [initCurrency])

  const destConfig = useMemo(() => {
    if (selectDestCurrency) {
      return selectDestCurrency
    }
    return false
  }, [selectDestCurrency])

  const routerToken = useMemo(() => {
    if (destConfig?.router) {
      return destConfig?.router
    }
    return undefined
  }, [destConfig])

  const useToChainId = useMemo(() => {
    if (isNaN(selectChain)) {
      return destConfig?.chainId
    }
    return selectChain
  }, [destConfig, selectChain])

  const {outputBridgeValue} = outputValue(inputBridgeValue, destConfig, selectCurrency)

  const isInputError = useMemo(() => {
    console.log(selectCurrency)
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
      } else if (Number(inputBridgeValue) < Number(destConfig.MinimumSwap) && Number(destConfig.MinimumSwap) !== 0) {
        return {
          state: 'Error',
          tip: t('ExceedMinLimit', {
            amount: destConfig.MinimumSwap,
            symbol: selectCurrency.symbol
          })
        }
      } else if (Number(inputBridgeValue) > Number(destConfig.MaximumSwap) && Number(destConfig.MaximumSwap) !== 0) {
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
  }, [selectCurrency, selectChain, inputBridgeValue, destConfig])

  const errorTip = useMemo(() => {
    const isAddr = isAddress( recipient, selectChain)
    if (isInputError) {
      return isInputError
    } else if (!recipient || !Boolean(isAddr)) {
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

  const onCreateP2pAddress = useCallback(() => {
    setP2pAddress('')
    setMemo('')
    if (recipient && selectCurrency && destConfig && selectChain) {
      // if (chainId === 'XRP') {
      if ([ChainId.IOTA, ChainId.IOTA_TEST].includes(chainId)) {
        // console.log(destConfig)
        // setP2pAddress(recipient)
        setP2pAddress(destConfig?.router)
        setMemo(`swapOut ${recipient}:${useToChainId}`)
        // setMemo('')
        setModalSpecOpen(true)
        setDelayAction(false)
      } else if ([ChainId.XRP, ChainId.XRP_TEST].includes(chainId)) {
        // console.log(destConfig)
        setP2pAddress(destConfig?.router)
        // setMemo(`{data: ${recipient}}`)
        setMemo(recipient + ":" + useToChainId)
        setModalSpecOpen(true)
        setDelayAction(false)
      } else if ([ChainId.BTC, ChainId.BTC_TEST, ChainId.BLOCK, ChainId.COLX, ChainId.LTC].includes(chainId)) {
        if (['swapin', 'swapout'].includes(destConfig?.type)) {
          getP2PInfo(recipient, selectChain, selectCurrency?.symbol, selectCurrency?.address).then((res:any) => {
            // console.log(res)
            // console.log(selectCurrency)
            if (res?.p2pAddress) {
              const localAddress = createAddress(recipient, selectCurrency?.symbol, destConfig?.DepositAddress)
              if (res?.p2pAddress === localAddress && isAddress(localAddress, chainId)) {
                // console.log(localAddress)
                setP2pAddress(localAddress)
                setLocalConfig(recipient, selectCurrency?.address, selectChain, CROSSCHAINBRIDGE, {p2pAddress: localAddress})
              }
            }
            setModalSpecOpen(true)
            setDelayAction(false)
          })
        } else {
          setP2pAddress(destConfig?.router)
          setMemo(recipient + ":" + useToChainId)
          setModalSpecOpen(true)
          setDelayAction(false)
        }
      }
    } else {
      setDelayAction(false)
    }
  }, [recipient, selectCurrency, destConfig, selectChain, chainId, useToChainId])

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

  useEffect(() => {
    // console.log(evmAccount)
    if (evmAccount && !isNaN(selectChain)) {
      setRecipient(evmAccount)
    } else {
      setRecipient('')
    }
  }, [evmAccount, selectChain])

  function MemoView () {
    if (memo) {
      if ([ChainId.IOTA, ChainId.IOTA_TEST].includes(chainId)) {
        const arr = memo.split(' ')
        const indexStr = arr[0]
        const dataStr = arr[1]
        return <>
          <div className="item">
            <p className="label">Index:</p>
            <p className="value flex-sc">{indexStr}<CopyHelper toCopy={indexStr} /></p>
          </div>
          <div className="item">
            <p className="label">Data:</p>
            {/* <p className="value flex-bc">{shortenAddress(dataStr,8)}<CopyHelper toCopy={dataStr} /></p> */}
            <p className="value flex-sc">{dataStr}<CopyHelper toCopy={dataStr} /></p>
          </div>
        </>
      }
      return <div className="item">
        <p className="label">Memo:</p>
        {/* <p className="value flex-bc">{shortenAddress(memo,8)}<CopyHelper toCopy={memo} /></p> */}
        <p className="value flex-sc">{memo}<CopyHelper toCopy={memo} /></p>
      </div>
    }
    return <></>
  }

  const registerTxs = useCallback(() => {
    axios.get(`${config.bridgeApi}/v2/reswaptxns?hash=${hash}&srcChainID=${chainId}&destChainID=${selectChain}&recipient=${recipient}`).then((res:any) => {
      console.log(res)
      const {data, status} = res
      if (status === 200 && data.msg === 'Success') {
        setModalSpecOpen(false)
        // setAddNoWalletTx(chainId, hash, destConfig?.type)
        setAddNoWalletTx({hash}, {
          summary: `Cross bridge ${config.getBaseCoin(selectCurrency?.symbol, chainId)}`,
          value: '',
          toChainId: selectChain,
          toAddress: recipient,
          symbol: selectCurrency?.symbol,
          version: destConfig?.type,
          token: selectCurrency?.address,
          logoUrl: selectCurrency?.logoUrl,
          isLiquidity: '',
          fromInfo: {
            symbol: selectCurrency?.symbol,
            name: selectCurrency?.name,
            decimals: selectCurrency?.decimals,
            address: selectCurrency?.address,
          },
          toInfo: {
            symbol: destConfig?.symbol,
            name: destConfig?.name,
            decimals: destConfig?.decimals,
            address: destConfig?.address,
          },
        })
        // toggleWalletModal()
        onChangeViewDtil(hash, true)
      } else {
        if (data.error) {
          onChangeViewErrorTip(data.error, true)
        } else {
          onChangeViewErrorTip('Validation failed.', true)
        }
      }
    }).catch((error:any) => {
      console.log(error)
      onChangeViewErrorTip(error, true)
    })
  }, [hash, chainId, selectChain, destConfig, selectCurrency, recipient])

  function ViewBtn () {
    if ([ChainId.IOTA, ChainId.IOTA_TEST].includes(chainId)) {
      return <ButtonLight onClick={() => {
        window.open(`iota://wallet/swapOut/${routerToken}/?amount=${inputBridgeValue}&unit=Mi&chainId=${useToChainId}&receiverAddress=${recipient}`)
      }}>{t('Confirm')}</ButtonLight>
    }
    // return <ButtonLight disabled={!(hash && hash.length <= 100 && hash.length >= 40)} onClick={() => {
    //   registerTxs()
    // }}>{t('Confirm')}</ButtonLight>
    if ([ChainId.BTC, ChainId.BTC_TEST].includes(chainId)) {
      return <ButtonLight disabled={!(hash && hash.length <= 100 && hash.length >= 40)} onClick={() => {
        registerTxs()
      }}>{t('Confirm')}</ButtonLight>
    }
    return <ButtonLight onClick={() => {
      setModalSpecOpen(false)
    }}>{t('Confirm')}</ButtonLight>
  }

  return (
    <>
      <ModalContent
        isOpen={modalSpecOpen}
        title={'Cross-chain Router'}
        onDismiss={() => {
          setModalSpecOpen(false)
        }}
      >
        <ListBox>
          {
            [ChainId.IOTA, ChainId.IOTA_TEST].includes(chainId) ? (
              <>
                <CrossChainTip>
                  Please use IOTA wallet to transfer IOTA token to deposit address and input receive address on dest chain as input.
                  <p className='red'>If you don&apos;t input, you will not receive IOTA on dest chain.</p>
                </CrossChainTip>
              </>
            ) : ''
          }
          {
            [ChainId.XRP, ChainId.XRP_TEST].includes(chainId) ? (
              <>
                <CrossChainTip>
                  Please use XRP wallet to transfer {selectCurrency?.symbol} token to deposit address and input receive address on dest chain as memo.
                  <p className='red'>If you don&apos;t input memo, you will not receive {selectCurrency?.symbol} on dest chain.</p>
                </CrossChainTip>
              </>
            ) : ''
          }
          {
            [ChainId.BTC, ChainId.BTC_TEST].includes(chainId) ? (['swapin', 'swapout'].includes(destConfig?.type) ? (
              <>
                <CrossChainTip>
                  {/* <p className='red'>Please add below memo({shortenAddress(memo,8)}) information to your deposit transaction.</p> */}
                  Please use Bitcoin wallet to transfer BTC coin to deposit address.
                </CrossChainTip>
              </>
            ) : (
              <>
                <CrossChainTip>
                  {/* <p className='red'>Please add below memo({shortenAddress(memo,8)}) information to your deposit transaction.</p> */}
                  Please use Bitcoin wallet to transfer BTC to deposit address and input receive address on dest chain as memo(OP_RETURN).
                  <p className='red'>If you don&apos;t input memo({shortenAddress(memo,8)}), you will not receive multiBTC on dest chain.</p>
                </CrossChainTip>
              </>
            )) : ''
          }
          {/* {
            [ChainId.BTC, ChainId.BTC_TEST].includes(chainId) && !['swapin', 'swapout'].includes(destConfig?.type) ? (
              <>
                <CrossChainTip>
                  Please use Bitcoin wallet to transfer BTC to deposit address and input receive address on dest chain as memo(OP_RETURN).
                  <p className='red'>If you don&apos;t input memo({shortenAddress(memo,8)}), you will not receive multiBTC on dest chain.</p>
                </CrossChainTip>
              </>
            ) : ''
          } */}
          {
            [ChainId.XRP, ChainId.XRP_TEST].includes(chainId) ? '' : (
              <div className="item">
                <p className="label">Value:</p>
                <p className="value">{inputBridgeValue}</p>
              </div>
            )
          }
          <div className="item">
            <p className="label">Deposit Address:</p>
            <p className="value flex-bc">
              {p2pAddress}
              {/* {shortenAddress(p2pAddress,8)} */}
              {/* {shortenAddress1(p2pAddress, 12)} */}
              <CopyHelper toCopy={p2pAddress} />
            </p>
          </div>
          <MemoView />
          <div className="item">
            <QRcode uri={p2pAddress} size={160}></QRcode>
          </div>
          {/* <div className="item">
            <p className="label">Hash:</p>
            <p className="value">
              <HashInput
                placeholder='Hash'
                value={hash}
                onChange={event => {
                  setHash(event.target.value.replace(/\s/g, ''))
                }}
              />
            </p>
          </div>
          
          <CrossChainTip>
            <p className='red'>Please enter hash here after the transaction is successfully sent.</p>
          </CrossChainTip> */}
          {
            [ChainId.BTC, ChainId.BTC_TEST].includes(chainId) ? (
              <>
                <div className="item">
                  <p className="label">Hash:</p>
                  <p className="value">
                    <HashInput
                      placeholder='Hash'
                      value={hash}
                      onChange={event => {
                        setHash(event.target.value.replace(/\s/g, ''))
                      }}
                    />
                  </p>
                </div>
                
                <CrossChainTip>
                  Please input the {selectCurrency?.symbol} deposit transaction hash, and click confirm to check the bridge status.
                  {/* <p className='red'>Please enter hash here after the transaction is successfully sent.</p> */}
                </CrossChainTip>
              </>
            ) : ''
          }
        </ListBox>
        <BottomGrouping>
          {ViewBtn()}
        </BottomGrouping>
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
            console.log(inputCurrency)
            setSelectCurrency(inputCurrency)
          }}
          onOpenModalView={(value) => {
            // console.log(value)
            setModalOpen(value)
          }}
          // onMax={() => {}}
          currency={selectCurrency}
          disableCurrencySelect={false}
          showMaxButton={true}
          isViewNetwork={true}
          id="selectCurrency"
          isError={false}
          hideBalance={true}
          isViewModal={modalOpen}
          customChainId={chainId}
          // allBalances={allBalances}
          bridgeKey={bridgeKey}
          allTokens={allTokensList}
        />
        <AutoRow justify="center" style={{ padding: '0 1rem' }}>
          <ArrowWrapper clickable={false} style={{cursor:'pointer'}}>
            <ArrowDown size="16" color={theme.text2} />
          </ArrowWrapper>
        </AutoRow>

        <SelectChainIdInputPanel
          label={t('to')}
          value={outputBridgeValue.toString()}
          onUserInput={(value:any) => {
            setInputBridgeValue(value)
          }}
          onChainSelect={(chainID:any) => {
            setSelectChain(chainID)
          }}
          selectChainId={selectChain}
          id="selectChainID"
          onCurrencySelect={(inputCurrency) => {
            setSelectDestCurrency(inputCurrency)
          }}
          bridgeConfig={selectCurrency}
          isNativeToken={false}
          selectChainList={selectChainList}
          isViewAllChain={true}
          selectDestCurrency={selectDestCurrency}
          selectDestCurrencyList={selectDestCurrencyList}
          bridgeKey={bridgeKey}
        />
        <AddressInputPanel id="recipient" value={recipient} label={t('Recipient')} labelTip={'( ' + t('receiveTip') + ' )'} onChange={setRecipient} isValid={false} selectChainId={selectChain} isError={!Boolean(isAddress( recipient, selectChain))} />
      </AutoColumn>
      {
        !userInterfaceMode ? (
          <Reminder destConfig={destConfig} bridgeType={destConfig?.type} currency={selectCurrency}/>
        ) : ''
      }
      <ErrorTip errorTip={errorTip} />
      {/* {ButtonView('INIT')} */}
      <BottomGrouping>
        <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
          setDelayAction(true)
          onCreateP2pAddress()
        }}>
          {t('swap')}
        </ButtonPrimary>
      </BottomGrouping>
    </>
  )
}