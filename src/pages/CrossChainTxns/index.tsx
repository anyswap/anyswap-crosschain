import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
// import { TokenAmount } from 'anyswap-sdk'
// import { createBrowserHistory } from 'history'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'
import { ArrowDown } from 'react-feather'

import SelectChainIdInputPanel from './selectChainID'
// import Reminder from '../CrossChain/reminder'
import Reminder from '../../components/CrossChainPanelV2/reminder'

import { useActiveWeb3React } from '../../hooks'
import {useBridgeSwapUnderlyingCallback, useBridgeSwapNativeCallback} from '../../hooks/useBridgeCallback'
import { WrapType } from '../../hooks/useWrapCallback'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { useLocalToken } from '../../hooks/Tokens'

import SelectCurrencyInputPanel from '../../components/CurrencySelect/selectCurrency'
import { AutoColumn } from '../../components/Column'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
// import AddressInputPanel from '../../components/AddressInputPanel'
import { ArrowWrapper, BottomGrouping } from '../../components/swap/styleds'
import Title from '../../components/Title'
import ModalContent from '../../components/Modal/ModalContent'
import Settings from '../../components/Settings'

// import { useWalletModalToggle, useToggleNetworkModal } from '../../state/application/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
// import { useAddDestChainId } from '../../state/multicall/hooks'
import { useBridgeTokenList } from '../../state/lists/hooks'
// import { useBridgeAllTokenBalances } from '../../state/wallet/hooks'
import {
  tryParseAmount,
  useDerivedSwapInfo,
  useSwapActionHandlers
} from '../../state/swap/hooks'
// import {
//   useDefaultsFromURLSearch,
//   useDerivedSwapInfo,
//   useSwapActionHandlers,
//   useSwapState
// } from '../../state/swap/hooks'
import { Field } from '../../state/swap/actions'
import { useUserTransactionTTL } from '../../state/user/hooks'


import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'
import {BASECURRENCY} from '../../config/constant'

import {getNodeTotalsupply} from '../../utils/bridge/getBalanceV2'
// import {formatDecimal} from '../../utils/tools/tools'
// import { isAddress } from '../../utils'

import AppBody from '../AppBody'
import TokenLogo from '../../components/TokenLogo'
import LiquidityPool from '../../components/LiquidityPool'

import {
  LogoBox,
  ConfirmContent,
  TxnsInfoText,
  ConfirmText,
} from '../styled'

import {
  // outputValue,
  useInitSelectCurrency,
  useDestChainid,
  // useDestCurrency
} from '../../components/CrossChainPanelV2/hooks'

const SettingsBox = styled.div`
  ${({ theme }) => theme.flexEC};
  position:absolute;
  top:0;
  right:0;
  .set{
    width: 45px;
    height: 35px;
    float:right;
  }
`

let intervalFN:any = ''
const BRIDGETYPE = 'routerTokenList'
export default function CrossChain() {
  // const { account, chainId, library } = useActiveWeb3React()
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const allTokensList:any = useBridgeTokenList(BRIDGETYPE, chainId)
  // const toggleNetworkModal = useToggleNetworkModal()
  // const history = createBrowserHistory()
  // const allBalances = useBridgeAllTokenBalances(BRIDGETYPE, chainId)
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()

  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  // const [recipient, setRecipient] = useState<any>(account ?? '')
  // const [swapType, setSwapType] = useState('swap')
  // const [count, setCount] = useState<number>(0)
  const [intervalCount, setIntervalCount] = useState<number>(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipOpen, setModalTipOpen] = useState(false)

  // const [bridgeConfig, setBridgeConfig] = useState<any>()

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)

  // const [allTokens, setAllTokens] = useState<any>({})

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
  // console.log(initBridgeToken)

  const isNativeToken = useMemo(() => {
    if (
      selectCurrency
      && chainId
      && config.getCurChainInfo(chainId)
      && config.getCurChainInfo(chainId).nativeToken
      && config.getCurChainInfo(chainId).nativeToken.toLowerCase() === selectCurrency.address.toLowerCase()
    ) {
      return true
    }
    return false
  }, [selectCurrency, chainId])

  const isUnderlying = useMemo(() => {
    if (selectCurrency && selectCurrency?.underlying) {
      return true
    }
    return false
  }, [selectCurrency, selectChain])
  
  // const bridgeConfig = useMemo(() => {
  //   if (selectCurrency?.address && allTokens[selectCurrency?.address]) return allTokens[selectCurrency?.address]
  //   return ''
  // }, [selectCurrency, allTokens])

  const destConfig = useMemo(() => {
    if (selectCurrency && selectCurrency?.destChains[selectChain]) {
      return selectCurrency?.destChains[selectChain]
    }
    return false
  }, [selectCurrency, selectChain])

  const formatCurrency = useLocalToken(selectCurrency)
  // const formatInputBridgeValue = inputBridgeValue && Number(inputBridgeValue) ? tryParseAmount(inputBridgeValue, formatCurrency ?? undefined) : ''
  const formatInputBridgeValue = tryParseAmount(inputBridgeValue, formatCurrency ?? undefined)
  const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, destConfig?.routerToken)

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

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
  }, [selectChain])

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
  }, [selectCurrency, chainId, account, selectChain, intervalCount])


  useEffect(() => {
    getSelectPool()
  }, [getSelectPool])

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const [ttl] = useUserTransactionTTL()
  
  const {
    // v1Trade,
    v2Trade,
    // currencyBalances,
    // parsedAmount,
    // currencies,
    // inputError: swapInputError
    outputAmount
  } = useDerivedSwapInfo(selectChain)
  // console.log(ttl)
  
  const routerPath = useMemo(() => {
    const arr:any = [selectCurrency?.underlying?.address ?? selectCurrency?.address]
    // const arr:any = []
    if (v2Trade?.route?.pairs) {
      for (const obj of v2Trade?.route?.path) {
        if (obj?.address) {
          arr.push(obj?.address)
        }
      }
    }
    // console.log(arr)
    return arr
  }, [v2Trade])

  

  const { wrapType: wrapTypeNative, execute: onWrapNative, inputError: wrapInputErrorNative } = useBridgeSwapNativeCallback(
    destConfig?.routerToken,
    formatCurrency?formatCurrency:undefined,
    account,
    inputBridgeValue,
    selectChain,
    ttl,
    outputAmount?.raw?.toString(),
    routerPath,
    isUnderlying,
    destConfig?.type
  )

  const { wrapType: wrapTypeUnderlying, execute: onWrapUnderlying, inputError: wrapInputErrorUnderlying } = useBridgeSwapUnderlyingCallback(
    destConfig?.routerToken,
    formatCurrency?formatCurrency:undefined,
    account,
    inputBridgeValue,
    selectChain,
    ttl,
    outputAmount?.raw?.toString(),
    routerPath,
    isUnderlying,
    destConfig?.type
  )


  // const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  // const {onSelectChainId} = useAddDestChainId()
  useEffect(() => {
    // console.log(v2Trade)
    // console.log(v2Trade)
    // console.log(outputAmount ? outputAmount?.toSignificant(6) : '')
    if (v2Trade) {
      // console.log(v2Trade?.inputAmount?.toSignificant(6))
      // console.log(outputAmount?.raw.toString())
      // console.log(routerPath)
      // console.log(swapInputError)
    }
  }, [v2Trade])


  // console.log(allTokens)
  // console.log(bridgeConfig)
  
  useEffect(() => {
    onCurrencySelection(
      Field.INPUT,
      isUnderlying ? destConfig?.underlying?.address : destConfig?.address,
      selectChain,
      isUnderlying ? destConfig?.underlying?.decimals : destConfig?.decimals,
      isUnderlying ? destConfig?.underlying?.symbol : destConfig?.symbol,
      isUnderlying ? destConfig?.underlying?.name : destConfig?.name,
    )
  }, [destConfig, selectChain, isUnderlying])

  useEffect(() => {
    // console.log(selectDestCurrency)
    // onCurrencySelection(
    //   Field.OUTPUT,
    //   isUnderlying ? selectDestCurrency?.underlying?.address : selectDestCurrency?.address,
    //   selectChain,
    //   isUnderlying ? selectDestCurrency?.underlying?.decimals : selectDestCurrency?.decimals,
    //   isUnderlying ? selectDestCurrency?.underlying?.symbol : selectDestCurrency?.symbol,
    //   isUnderlying ? selectDestCurrency?.underlying?.name : selectDestCurrency?.name,
    // )
    onCurrencySelection(
      Field.OUTPUT,
      selectDestCurrency?.address,
      selectChain,
      selectDestCurrency?.decimals,
      selectDestCurrency?.symbol,
      selectDestCurrency?.name,
    )
  }, [selectDestCurrency, selectChain, isUnderlying])
  
  

  
  const isDestUnderlying = useMemo(() => {
    if (selectCurrency && selectCurrency?.destChains[selectChain]?.underlying) {
      return true
    }
    return false
  }, [selectCurrency, selectChain])

  useEffect(() => {
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
        // console.log(value)
        onUserInput(Field.INPUT, value.toString())
        // return formatDecimal(value, Math.min(6, selectCurrency.decimals))
      } else {
        // console.log(1)
        onUserInput(Field.INPUT, '0')
        // return ''
      }
    } else {
      // console.log(2)
      onUserInput(Field.INPUT, '0')
      // return ''
    }
  }, [inputBridgeValue, destConfig, selectChain])

  const isWrapInputError = useMemo(() => {
    
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
    
  }, [isNativeToken, wrapInputErrorUnderlying, wrapInputErrorNative, selectCurrency])

  const isInputError = useMemo(() => {
    // console.log(selectCurrency)
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
          tip: t('ExceedLimit')
        }
      } else if (Number(inputBridgeValue) > Number(destConfig.MaximumSwap)) {
        return {
          state: 'Error',
          tip: t('ExceedLimit')
        }
      } else if (
        (isDestUnderlying && destChain && Number(inputBridgeValue) > Number(destChain.ts))
        || (isDestUnderlying && !destChain)
      ) {
        return {
          state: 'Error',
          tip: t('insufficientLiquidity')
        }
      } else if (routerPath.length <= 0) {
        return {
          state: 'Error',
          tip: 'Loading'
        }
      }
    }
    return undefined
  }, [selectCurrency, selectChain, isWrapInputError, inputBridgeValue, destConfig, isDestUnderlying, destChain])

  const errorTip = useMemo(() => {
    if (isInputError) {
      return isInputError
    }
    return undefined
  }, [isInputError, selectChain, inputBridgeValue])

  const isCrossBridge = useMemo(() => {
    if (errorTip || !inputBridgeValue) {
      return true
    }
    return false
  }, [errorTip])

  const btnTxt = useMemo(() => {
    if (errorTip) {
      return errorTip?.tip
    } else if (wrapTypeNative === WrapType.WRAP || wrapTypeUnderlying === WrapType.WRAP) {
      return t('swap')
    }
    return t('swap')
  }, [errorTip, wrapTypeNative, wrapTypeUnderlying])

  const {initCurrency} = useInitSelectCurrency(allTokensList, chainId, initBridgeToken)
  useEffect(() => {
    // console.log(allTokensList)
    setSelectCurrency(initCurrency)
  }, [initCurrency])

  const {initChainId, initChainList} = useDestChainid(selectCurrency, selectChain, chainId)
  useEffect(() => {
    // console.log(selectCurrency)
    setSelectChain(initChainId)
  }, [initChainId])
  useEffect(() => {
    setSelectChainList(initChainList)
  }, [initChainList])

  useEffect(() => {
    // onSelectChainId(selectChain)
    setSelectDestCurrency('')
    if (selectChain) {
      const arr = config.getCurChainInfo(selectChain)?.tokenList?.tokens
      const initToken = config.getCurChainInfo(selectChain).swapInitToken

      for (const obj of arr) {
        if (initToken && obj.address.toLowerCase() === initToken?.toLowerCase()) {
          // console.log(obj)
          setSelectDestCurrency(obj)
          break
        } else if (!initToken) {
          // console.log(obj)
          setSelectDestCurrency(obj)
          break
        }
      }
    }
  }, [selectChain])

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
          <TokenLogo symbol={selectCurrency?.symbol} size={'1rem'}></TokenLogo>
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
                    if (selectDestCurrency?.symbol === BASECURRENCY) {
                      if (onWrapNative) onWrapNative().then(() => {
                        onClear()
                      })
                    } else {
                      if (onWrapUnderlying) onWrapUnderlying().then(() => {
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
      <AppBody>
        <Title
          title={t('swap')} 
          
        >
          <SettingsBox>
            <div className="set">
              <Settings />
            </div>
          </SettingsBox>
        </Title>
        
        <AutoColumn gap={'sm'}>
          {/* <SettingsBox>
            <div className="set">
              <Settings />
            </div>
          </SettingsBox> */}

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
              // console.log(value)
              setModalOpen(value)
            }}
            isViewModal={modalOpen}
            id="selectCurrency"
            isError={Boolean(isInputError)}
            isNativeToken={isNativeToken}
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
          </AutoRow>

          <SelectChainIdInputPanel
            label={t('to')}
            // value={outputBridgeValue.toString()}
            value={outputAmount ? outputAmount?.toSignificant(6) : ''}
            // value={v2Trade?.outputAmount?.toSignificant(6) ?? ''}
            onUserInput={(value) => {
              setInputBridgeValue(value)
            }}
            onChainSelect={(chainID) => {
              setSelectChain(chainID)
            }}
            onDestCurrencySelect={(item) => {
              console.log(item)
              setSelectDestCurrency(item)
            }}
            selectChainId={selectChain}
            selectDestCurrency={selectDestCurrency}
            id="selectChainID"
            bridgeConfig={selectCurrency}
            // intervalCount={intervalCount}
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
          {/* {swapType == 'swap' ? '' : (
            <AddressInputPanel id="recipient" value={recipient} onChange={setRecipient} />
          )} */}
        </AutoColumn>

        {/* <Reminder bridgeConfig={selectCurrency} bridgeType='bridgeAssets' currency={selectCurrency} selectChain={selectChain} /> */}
        <Reminder destConfig={destConfig} bridgeType='bridgeAssets' currency={selectCurrency} selectChain={selectChain}/>

        <BottomGrouping>
          {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
            ) : (
              !isNativeToken && selectCurrency && isUnderlying && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)? (
                <ButtonConfirmed
                  onClick={() => {
                    // onDelay()
                    // approveCallback()
                    setModalTipOpen(true)
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
                  setModalTipOpen(true)
                }}>
                  {btnTxt}
                </ButtonPrimary>
              )
            )
          }
        </BottomGrouping>
      </AppBody>
    </>
  )
}