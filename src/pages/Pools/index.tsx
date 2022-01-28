// import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import { createBrowserHistory } from 'history'
// import { TokenAmount } from 'anyswap-sdk'
import { ArrowDown } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'

import SelectCurrencyInputPanel from '../../components/CurrencySelect/selectCurrency'

import { useActiveWeb3React } from '../../hooks'
import {useSwapUnderlyingCallback, useBridgeCallback, useSwapNativeCallback} from '../../hooks/useBridgeCallback'
import { WrapType } from '../../hooks/useWrapCallback'
import { useLocalToken } from '../../hooks/Tokens'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'

import { AutoColumn } from '../../components/Column'
// import SwapIcon from '../../components/SwapIcon'
import { BottomGrouping, ArrowWrapper } from '../../components/swap/styleds'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import Title from '../../components/Title'



import { tryParseAmount } from '../../state/swap/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useBridgeTokenList } from '../../state/lists/hooks'
// import { useBridgeAllTokenBalances } from '../../state/wallet/hooks'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'

import AppBody from '../AppBody'

import PoolTip from './poolTip'

import {getNodeTotalsupply} from '../../utils/bridge/getBalanceV2'
import { isAddress } from '../../utils'
import {formatDecimal} from '../../utils/tools/tools'

import SelectChainIdInputPanel from '../../components/CrossChainPanel/selectChainID'
import Reminder from '../CrossChain/reminder'

const BackBox = styled.div`
  cursor:pointer;
  display:inline-block;
  margin-bottom: 10px;
`

const BRIDGETYPE = 'routerTokenList'
// let onlyFirst = 0
let intervalFN:any
export default function SwapNative() {
  const { account, chainId } = useActiveWeb3React()
  const history = createBrowserHistory()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  // const allBalances = useBridgeAllTokenBalances(BRIDGETYPE, chainId)
  const toggleWalletModal = useWalletModalToggle()
  const allTokensList:any = useBridgeTokenList(BRIDGETYPE, chainId)

  const urlSwapType = getParams('bridgetype') ? getParams('bridgetype') : 'deposit'

  const [inputBridgeValue, setInputBridgeValue] = useState('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [openAdvance, setOpenAdvance] = useState<any>(urlSwapType === 'deposit' ? false : true)
  const [swapType, setSwapType] = useState<any>(urlSwapType)
  // const [count, setCount] = useState<number>(0)
  const [poolInfo, setPoolInfo] = useState<any>()

  const [modalOpen, setModalOpen] = useState(false)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)

  const [intervalCount, setIntervalCount] = useState<number>(0)

  // const [allTokens, setAllTokens] = useState<any>({})

  const [destChain, setDestChain] = useState<any>({
    chain: '',
    ts: '',
    bl: ''
  })

  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  const isUnderlying = useMemo(() => {
    if (selectCurrency?.underlying) {
      return true
    }
    return false
  }, [selectCurrency])

  const destConfig = useMemo(() => {
    // console.log(selectCurrency)
    // console.log(selectChain)
    if (selectCurrency && selectCurrency?.destChains[selectChain]) {
      return selectCurrency?.destChains[selectChain]
    }
    return false
  }, [selectCurrency, selectChain])

  const useRouterToken = useMemo(() => {
    if (chainId?.toString() === selectChain?.toString()) {
      return selectCurrency?.routerToken
    }
    return destConfig?.routerToken
  }, [chainId, selectChain, selectCurrency])
  // console.log(useRouterToken)
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

  const underlyingToken =  useMemo(() => {
    if (isUnderlying) {
      return {
        address: selectCurrency.address,
        name: selectCurrency.name,
        symbol: selectCurrency.symbol,
        decimals: selectCurrency.decimals
      }
    }
    return
  }, [selectCurrency, isUnderlying])
  const anyToken =  useMemo(() => {
    if (isUnderlying) {
      return {
        address: selectCurrency.underlying.address,
        name: selectCurrency.underlying.name,
        symbol: selectCurrency.underlying.symbol,
        decimals: selectCurrency.underlying.decimals,
        underlying: {
          address: selectCurrency.address,
          name: selectCurrency.name,
          symbol: selectCurrency.symbol,
          decimals: selectCurrency.decimals
        }
      }
    }
    return selectCurrency
  }, [selectCurrency, isUnderlying])
  // console.log(selectCurrency)
  const anyCurrency = useLocalToken(anyToken ?? undefined)
  const underlyingCurrency = useLocalToken(underlyingToken ?? undefined)

  const formatInputBridgeValue = tryParseAmount(inputBridgeValue, underlyingCurrency && !isNativeToken && swapType === 'deposit' ? underlyingCurrency : undefined)
  const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, anyToken?.address)

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useBridgeCallback(
    useRouterToken,
    anyCurrency?anyCurrency:undefined,
    anyToken?.address,
    account ?? undefined,
    inputBridgeValue,
    selectChain,
    destConfig?.type
  )
    // console.log(wrapType)
    // console.log('wrapInputError', wrapInputError)
  const { wrapType: wrapTypeUnderlying, execute: onWrapUnderlying, inputError: wrapInputErrorUnderlying } = useSwapUnderlyingCallback(
    swapType !== 'deposit' ? (anyCurrency ?? undefined) : (underlyingCurrency ?? undefined),
    anyToken?.address,
    inputBridgeValue,
    swapType
  )
  // console.log(destConfig)
  const { wrapType: wrapTypeNative, execute: onWrapNative, inputError: wrapInputErrorNative } = useSwapNativeCallback(
    useRouterToken,
    swapType !== 'deposit' ? (anyCurrency ?? undefined) : (underlyingCurrency ?? undefined),
    anyToken?.address,
    inputBridgeValue,
    swapType
  )
  // console.log('wrapInputErrorNative',wrapInputErrorNative)

  function onDelay () {
    setDelayAction(true)
  }
  function onClear (type?:any) {
    setDelayAction(false)
    if (!type) {
      setInputBridgeValue('')
    }
  }

  const isWrapInputError = useMemo(() => {
    if (swapType === 'deposit') {
      if (isNativeToken) {
        if (wrapInputErrorNative) {
          return wrapInputErrorNative
        } else {
          return false
        }
      } else {
        if (wrapInputErrorUnderlying) {
          return wrapInputErrorUnderlying
        } else {
          return false
        }
      }
    }  else {
      if (openAdvance) {
        if (wrapInputError) {
          return wrapInputError
        } else {
          return false
        }
      } else {
        if (isNativeToken) {
          if (wrapInputErrorNative) {
            return wrapInputErrorNative
          } else {
            return false
          }
        } else {
          if (wrapInputErrorUnderlying) {
            return wrapInputErrorUnderlying
          } else {
            return false
          }
        }
      }
    }
  }, [isNativeToken, openAdvance, wrapInputError, wrapInputErrorUnderlying, wrapInputErrorNative, swapType])

  const isCrossBridge = useMemo(() => {
    // console.log(isWrapInputError)
    if (
      account
      && selectCurrency
      && inputBridgeValue
      && Number(inputBridgeValue) > 0
      && !isWrapInputError
    ) {
      // console.log(10)
      if (
        swapType === 'deposit'
        && Number(inputBridgeValue) > 0
      ) {
        // console.log(11)
        return false
      } else if (swapType !== 'deposit') {
        // console.log(12)
        // console.log(poolInfo)
        if (
          openAdvance
          && destChain
          && chainId?.toString() !== selectChain?.toString()
          && Number(destChain.ts) >= Number(inputBridgeValue)
          && Number(inputBridgeValue) >= Number(destConfig.MinimumSwap)
          && Number(inputBridgeValue) <= Number(destConfig.MaximumSwap)
        ) {
          // console.log(14)
          return false
        } else if (
          openAdvance
          && poolInfo
          && chainId?.toString() === selectChain?.toString()
          && Number(poolInfo.totalsupply) >= Number(inputBridgeValue)
        ) {
          // console.log(15)
          return false
        } else {
          // console.log(16)
          return true
        }
      } else {
        // console.log(13)
        return true
      }
    } else {
      return true
    }
  }, [selectCurrency, account, inputBridgeValue, poolInfo, swapType, destChain, isWrapInputError, openAdvance, chainId, selectChain, destConfig])

  const isInputError = useMemo(() => {
    // console.log(destConfig)
    // console.log(isCrossBridge)
    if (
      account
      && destConfig
      && selectCurrency
      && isCrossBridge
      && inputBridgeValue
    ) {
      // console.log(1)
      if (Number(inputBridgeValue) <= 0) {
        return true
      } else if (
        swapType !== 'deposit'
        && openAdvance
        && (
          Number(inputBridgeValue) < Number(destConfig.MinimumSwap)
          || Number(inputBridgeValue) > Number(destConfig.MaximumSwap)
        )
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
  }, [account, destConfig, selectCurrency, inputBridgeValue, isCrossBridge])

  // console.log(isInputError)

  const btnTxt = useMemo(() => {
    const bt = swapType !== 'deposit' ? t('RemoveLiquidity') : t('AddLiquidity')
    if (isWrapInputError && inputBridgeValue && Number(inputBridgeValue) > 0) {
      return isWrapInputError
    } else if (
      swapType !== 'deposit'
      && openAdvance
      && destConfig
      && inputBridgeValue
      && (
        Number(inputBridgeValue) < Number(destConfig.MinimumSwap)
        || Number(inputBridgeValue) > Number(destConfig.MaximumSwap)
      )
    ) {
      return t('ExceedLimit')
    } else if (
      swapType !== 'deposit'
      && openAdvance
      && destChain
      && Number(destChain.ts) < Number(inputBridgeValue)
    ) {
      return t('nodestlr')
    } else if (!inputBridgeValue) {
      return bt
    } else if (wrapTypeUnderlying === WrapType.WRAP || wrapType === WrapType.WRAP || wrapTypeNative === WrapType.WRAP) {
      return bt
    }
    return bt
  }, [t, swapType, wrapType, wrapTypeUnderlying, isWrapInputError, inputBridgeValue])

  const outputBridgeValue = useMemo(() => {
    if (inputBridgeValue && destConfig && chainId?.toString() !== selectChain?.toString()) {
      const fee = Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion) / 100
      let value = Number(inputBridgeValue) - fee
      if (fee < Number(destConfig.MinimumSwapFee)) {
        value = Number(inputBridgeValue) - Number(destConfig.MinimumSwapFee)
      } else if (fee > destConfig.MaximumSwapFee) {
        value = Number(inputBridgeValue) - Number(destConfig.MaximumSwapFee)
      }
      if (chainId?.toString() === selectChain?.toString() || !destConfig?.swapfeeon) {
        value = Number(inputBridgeValue)
      }
      
      if (value && Number(value) && Number(value) > 0) {
        return formatDecimal(value, Math.min(6, selectCurrency.decimals))
      }
      return ''
    } else if (inputBridgeValue && !destConfig && chainId?.toString() === selectChain?.toString()) {
      return formatDecimal(inputBridgeValue, Math.min(6, selectCurrency.decimals))
    } else {
      return ''
    }
  }, [inputBridgeValue, destConfig, selectChain])

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])
  useEffect(() => {
    if (chainId && !selectChain) {
      setSelectChain(chainId)
    }
  }, [chainId, selectChain])
  useEffect(() => {
    if (chainId) {
      setSelectChain(chainId)
    }
  }, [chainId])

  function formatPercent (n1:any, n2:any) {
    if (!n1 || !n2) return ''
    const n = (Number(n1) / Number(n2)) * 100
    if (n < 0.01) {
      return '(<0.01%)'
    } else {
      return '(' + n.toFixed(2) + '%)'
    }
  }
  useEffect(() => {
    setDestChain('')
  }, [selectChain])
  async function getAllOutBalance (account:any) {
    const token = selectCurrency.address
    // console.log(selectCurrency)
    const curAnyToken = isUnderlying ? selectCurrency?.underlying?.address : token
    const curUnlToekn = isUnderlying ? token : ''
    const obj:any = await getNodeTotalsupply(
      curAnyToken,
      chainId,
      selectCurrency.decimals,
      account,
      curUnlToekn
    )
    const dObj = chainId?.toString() === selectChain?.toString() ? selectCurrency : selectCurrency?.destChains[selectChain]
    const destAnyToken = dObj?.underlying?.address ? dObj?.underlying?.address : dObj?.address
    const destUnlToken = dObj?.underlying?.address ? dObj?.address : ''
    const DC:any = openAdvance ? await getNodeTotalsupply(
      destAnyToken,
      selectChain,
      dObj?.decimals,
      account,
      destUnlToken
    ) : ''
    // console.log(DC)
    const ts = obj[curAnyToken]?.ts
    const anyts = obj[curAnyToken]?.anyts
    const bl = obj[curAnyToken]?.balance
    if (DC) {
      setDestChain({
        chain: selectChain,
        ts: dObj?.underlying ? DC[destAnyToken]?.ts : DC[destAnyToken]?.anyts,
        bl: DC[destAnyToken]?.balance
      })
    }
    return {
      chainId: chainId,
      balance: bl,
      totalsupply: ts,
      anyTotalsupply: anyts,
      percent: formatPercent(bl, anyts)
    }
  }

  useEffect(() => {
    const t = selectCurrency && selectCurrency.chainId?.toString() === chainId?.toString() ? selectCurrency.address : (initBridgeToken ? initBridgeToken : config.getCurChainInfo(chainId).bridgeInitToken)
    // setAllTokens({})
    // setSelectCurrency('')
    const list:any = {}
    for (const token in allTokensList) {
      if (!isAddress(token)) continue
      list[token] = {
        ...allTokensList[token].tokenInfo,
      }
      // console.log(selectCurrency)
      if (
        !selectCurrency
        || selectCurrency.chainId?.toString() !== chainId?.toString()
      ) {
        if (
          t === token
          || list[token]?.symbol?.toLowerCase() === t
          || list[token]?.underlying?.symbol?.toLowerCase() === t
        ) {
          setSelectCurrency(list[token])
        }
      }
    }
    if (!selectCurrency) {
      history.replace(window.location.pathname + '#/pool/add')
    }
    
  }, [chainId, allTokensList])

  useEffect(() => {
    if (selectCurrency) {
      getAllOutBalance(account).then((res:any) => {
        setPoolInfo(res)
        if (intervalFN) clearTimeout(intervalFN)
        intervalFN = setTimeout(() => {
          setIntervalCount(intervalCount + 1)
        }, 1000 * 10)
      })
    } else {
      if (intervalFN) clearTimeout(intervalFN)
      intervalFN = setTimeout(() => {
        setIntervalCount(intervalCount + 1)
      }, 1000 * 10)
    }
  }, [selectCurrency, account, intervalCount, selectChain, openAdvance])

  useEffect(() => {
    // console.log(selectCurrency)
    if (selectCurrency) {
      const arr = []
      for (const c in selectCurrency?.destChains) {
        // if (Number(c) === Number(chainId)) continue
        if (
          !config.chainInfo[c]
        ) continue
        arr.push(c)
      }
      // console.log(arr)
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
      <AppBody>
        <Title
          title={t(swapType === 'deposit' ? 'Add' : 'Remove')}
          tabList={[
            {
              name: t('Add'),
              onTabClick: () => {
                setSwapType('deposit')
                setInputBridgeValue('')
                setOpenAdvance(false)
              },
              iconUrl: require('../../assets/images/icon/deposit.svg'),
              iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
            },
            {
              name: t('Remove'),
              onTabClick: () => {
                setSwapType('withdraw')
                setInputBridgeValue('')
                setOpenAdvance(true)
              },
              iconUrl: require('../../assets/images/icon/withdraw.svg'),
              iconActiveUrl: require('../../assets/images/icon/withdraw-purple.svg')
            }
          ]}
          currentTab={swapType === 'deposit' ? 0 : 1}
        ></Title>
        <BackBox onClick={() => {
          history.go(-1)
        }}>
          &lt;Back
        </BackBox>
        <AutoColumn gap={'md'}>

          <SelectCurrencyInputPanel
            label={t('From')}
            value={inputBridgeValue}
            onUserInput={(value) => {
              setInputBridgeValue(value)
            }}
            onCurrencySelect={(inputCurrency) => {
              console.log(inputCurrency)
              setSelectCurrency(inputCurrency)
            }}
            onMax={(value) => {
              handleMaxInput(value)
            }}
            isViewNetwork={openAdvance}
            currency={swapType !== 'deposit' ? (anyCurrency ?? undefined) : (underlyingCurrency ?? undefined)}
            disableCurrencySelect={false}
            showMaxButton={true}
            id="selectCurrency"
            inputType={{swapType, type: 'INPUT'}}
            // onlyUnderlying={true}
            isViewModal={modalOpen}
            isError={isInputError}
            // isViewMode={swapType === 'deposit' ? false : true}
            isViewMode={false}
            modeConent={{txt: openAdvance ? t('Simple') : t('Advance'), isFlag: openAdvance}}
            onChangeMode={(value) => {
              setOpenAdvance(value)
            }}
            isNativeToken={isNativeToken}
            allTokens={allTokensList}
            bridgeKey={BRIDGETYPE}
            // allBalances={allBalances}
          />
          {
            openAdvance ? (
              <>
                <AutoRow justify="center" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false} style={{cursor:'pointer'}}>
                    <ArrowDown size="16" color={theme.text2} />
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
                  isViewAllChain={true}
                  selectChainList={selectChainList}
                />
              </>
            ) : ''
          }

        </AutoColumn>
        <PoolTip 
          anyCurrency={anyCurrency}
          bridgeConfig={poolInfo}
          destChain={destChain}
          swapType={swapType}
        />
        
        {
          openAdvance && chainId?.toString() !== selectChain?.toString() ? (
            <Reminder bridgeConfig={selectCurrency} bridgeType='bridgeAssets' currency={selectCurrency} selectChain={selectChain}/>
          ) : ''
        }
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
                  inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)? (
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
                        t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.underlying?.symbol ?? selectCurrency?.symbol, chainId)
                      )}
                    </ButtonConfirmed>
                  ) : (
                    <ButtonPrimary disabled={isCrossBridge || isInputError || delayAction} onClick={() => {
                      onDelay()
                      if (openAdvance && chainId?.toString() !== selectChain?.toString()) {
                        console.log(1)
                        if (onWrap) onWrap().then(() => {
                          onClear()
                        })
                      } else {
                        console.log(2)
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