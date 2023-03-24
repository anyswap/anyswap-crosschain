// import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import { createBrowserHistory } from 'history'
import { ArrowDown } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'

import SelectCurrencyInputPanel from '../../components/CurrencySelect/selectCurrency'
import AddressInputPanel from '../../components/AddressInputPanel'
import { useActiveReact } from '../../hooks/useActiveReact'
import {
  useSwapUnderlyingCallback,
  useBridgeCallback,
  useSwapNativeCallback,
  usePermissonlessCallback
} from '../../hooks/useBridgeCallback'
import { WrapType } from '../../hooks/useWrapCallback'
import { useLocalToken } from '../../hooks/Tokens'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import {usePools, usePool} from '../../hooks/usePools'

import { AutoColumn } from '../../components/Column'
// import SwapIcon from '../../components/SwapIcon'
import { BottomGrouping, ArrowWrapper } from '../../components/swap/styleds'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import Title from '../../components/Title'



import { tryParseAmount } from '../../state/swap/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
// import { useBridgeTokenList } from '../../state/lists/hooks'
import { usePoolListState } from '../../state/pools/hooks'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'

import AppBody from '../AppBody'

// import PoolTip from './poolTip'
import MorePool from './morePool'

import SelectChainIdInputPanel from '../../components/CrossChainPanelV2/selectChainID'
import Reminder from '../../components/CrossChainPanelV2/reminder'
// import Reminder from '../CrossChain/reminder'
import {useDestChainid, useDestCurrency, useInitSelectCurrency, outputValue} from '../../components/CrossChainPanelV2/hooks'
import { BigAmount } from '../../utils/formatBignumber'
import useInterval from '../../hooks/useInterval'

import {useSwapPoolCallback} from '../../nonevm/pools'
import {useNonevmAllowances} from '../../nonevm/allowances'

import { isAddress } from '../../utils/isAddress'
import { ChainId } from '../../config/chainConfig/chainId'

import {
  useSolCreateAccount,
  // useLoginSol
} from '../../nonevm/solana'

const BackBox = styled.div`
  cursor:pointer;
  display:inline-block;
  margin-bottom: 10px;
`

const BRIDGETYPE = 'routerTokenList'
// let onlyFirst = 0
// let intervalFN:any
export default function SwapNative() {
  // const { account, chainId } = useActiveWeb3React()
  const { account, chainId, evmAccount } = useActiveReact()
  const history = createBrowserHistory()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  const {validAccount} = useSolCreateAccount()
  
  const toggleWalletModal = useWalletModalToggle()
  const allTokensList:any = usePoolListState(chainId)
// console.log(allTokensList)
  const urlSwapType = getParams('bridgetype') ? getParams('bridgetype') : 'deposit'

  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>(chainId)
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  
  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()
  const [selectDestCurrencyList, setSelectDestCurrencyList] = useState<any>()


  const [selectAnyToken, setSelectAnyToken] = useState<any>()
  const [anyTokenList, setAnyTokenList] = useState<any>()

  const [openAdvance, setOpenAdvance] = useState<any>(urlSwapType === 'deposit' ? false : true)
  const [swapType, setSwapType] = useState<any>(urlSwapType)
  // const [count, setCount] = useState<number>(0)
  // const [poolInfo, setPoolInfo] = useState<any>()

  const [modalOpen, setModalOpen] = useState(false)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)
  const [recipient, setRecipient] = useState<any>(evmAccount ?? '')

  const [solTokenAddress, setSolTokenAddress] = useState<any>(false)

  useEffect(() => {
    // console.log(evmAccount)
    if (evmAccount && !isNaN(selectChain)) {
      setRecipient(evmAccount)
    } else {
      setRecipient('')
    }
  }, [evmAccount, selectChain])


  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''
  let initAnyToken:any = getParams('anytoken') ? getParams('anytoken') : ''
  initAnyToken = initAnyToken ? initAnyToken.toLowerCase() : ''

  const destConfig = useMemo(() => {
    // console.log(selectDestCurrency)
    if (selectDestCurrency) {
      return selectDestCurrency
    }
    return false
  }, [selectDestCurrency])

  const useReceiveAddress = useMemo(() => {
    if ([ChainId.SOL, ChainId.SOL_TEST].includes(selectChain)) {
      if (destConfig.tokenType === 'NATIVE' && solTokenAddress) {
        return recipient
      } else if (destConfig.tokenType !== 'NATIVE' && solTokenAddress) {
        return solTokenAddress?.toString()
      }
      return undefined
    } else {
      return recipient
    }
  }, [selectChain, recipient, solTokenAddress, destConfig])

  const getNonevmInfo = useCallback(() => {
    if (
      [ChainId.SOL, ChainId.SOL_TEST].includes(selectChain)
      && destConfig?.address
      && isAddress(recipient, selectChain)
    ) {
      validAccount({chainId: selectChain, account: recipient, token: destConfig?.address}).then((res:any) => {
        console.log(res)
        setSolTokenAddress(res)
      })
    }
  }, [selectChain, recipient, destConfig])

  useEffect(() => {
    getNonevmInfo()
  }, [selectChain, recipient, destConfig])

  useInterval(getNonevmInfo, 1000 * 10)

  const isApprove = useMemo(() => {
    // return destConfig.isApprove
    // return true
    if (swapType === 'deposit') {
      return true
    }
    return false
  }, [swapType])

  useEffect(() => {
    // console.log(selectDestCurrency)
    if (selectDestCurrency) {
      setSelectAnyToken({...selectDestCurrency?.fromanytoken, router: selectDestCurrency.router, sortId: selectDestCurrency.sortId})
    }
  }, [selectDestCurrency, swapType])


  const useRouterToken = useMemo(() => {
    // console.log(destConfig)
    if (chainId?.toString() === selectChain?.toString()) {
      // return selectCurrency?.router
      return selectAnyToken?.router
    }
    return destConfig?.router
  }, [chainId, selectChain, selectAnyToken, destConfig])
  // console.log(useRouterToken)
  const isNativeToken = useMemo(() => {
    if (
      selectCurrency
      && selectCurrency?.tokenType === 'NATIVE'
    ) {
      return true
    }
    return false
  }, [selectCurrency, chainId])

  const useSelectCurrency = useMemo(() => {
    // console.log(selectAnyToken)
    console.log(selectCurrency)
    if (swapType === 'deposit') {
      return selectCurrency
    }
    return {...selectCurrency, ...selectAnyToken}
  }, [selectCurrency, swapType, selectAnyToken])
  // console.log(useSelectCurrency)
  const underlyingCurrency = useLocalToken(useSelectCurrency ?? undefined)


  const formatInputBridgeValue = tryParseAmount(inputBridgeValue, underlyingCurrency && !isNativeToken && swapType === 'deposit' ? underlyingCurrency : undefined)
  const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, selectAnyToken?.address, underlyingCurrency && !isNativeToken && swapType === 'deposit' ? underlyingCurrency : undefined)
  const {allowance, loading, setNonevmAllowance} = useNonevmAllowances(isApprove, selectCurrency, selectAnyToken?.address, chainId, account, inputBridgeValue, selectAnyToken)

  const approveState = useMemo(() => {
    // console.log(trxAllowance)
    if (inputBridgeValue && isApprove) {
      if (isNaN(chainId)) {
        // if ((allowance || allowance === 0) && Number(inputBridgeValue) < Number(allowance)) {
        if ((allowance || allowance === 0) && Number(inputBridgeValue) > Number(allowance)) {
          if (loading) {
            return ApprovalState.PENDING
          } else {
            return ApprovalState.NOT_APPROVED
          }
        }
        return ApprovalState.UNKNOWN
      } else {
        return approval
      }
    }
    return ApprovalState.UNKNOWN
    // return ApprovalState.NOT_APPROVED
  }, [chainId, allowance, inputBridgeValue, approval, isApprove, loading])

  const useToChainId = useMemo(() => {
    if (isNaN(selectChain)) {
      return destConfig?.chainId
    }
    return selectChain
  }, [destConfig, selectChain])

  const useSwapMethods = useMemo(() => {
    return destConfig.routerABI
  }, [destConfig])

  // useEffect(() => {
  //   console.log('ApprovalState', ApprovalState)
  //   console.log('approveState', approveState)
  //   console.log('selectAnyToken', selectAnyToken)
  // }, [approveState, selectAnyToken])

  const { wrapType: wrapTypePermissonless, execute: onWrapPermissonless, inputError: wrapInputErrorPermissonless, fee: nativeFee } = usePermissonlessCallback(
    useRouterToken,
    underlyingCurrency ?? undefined,
    selectAnyToken?.address,
    account ?? undefined,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency,
    destConfig?.isLiquidity,
    destConfig,
    swapType
  )

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useBridgeCallback(
    useRouterToken,
    underlyingCurrency ?? undefined,
    selectAnyToken?.address,
    useReceiveAddress ?? undefined,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency,
    destConfig?.isLiquidity,
    destConfig,
    swapType
  )

  const {execute: onWrapNonevm, inputError: wrapInputErrorNonevm} = useSwapPoolCallback(
    useRouterToken,
    useSelectCurrency,
    selectAnyToken?.address,
    inputBridgeValue,
    swapType,
    selectChain,
    useReceiveAddress,
    destConfig,
    selectCurrency,
    useToChainId
  )
  
  const { wrapType: wrapTypeUnderlying, execute: onWrapUnderlying, inputError: wrapInputErrorUnderlying } = useSwapUnderlyingCallback(
    underlyingCurrency ? underlyingCurrency : undefined,
    selectAnyToken?.address,
    inputBridgeValue,
    swapType,
    selectCurrency
  )
  // console.log(destConfig)
  const { wrapType: wrapTypeNative, execute: onWrapNative, inputError: wrapInputErrorNative } = useSwapNativeCallback(
    useRouterToken,
    underlyingCurrency ? underlyingCurrency : undefined,
    selectAnyToken?.address,
    inputBridgeValue,
    swapType
  )
  // console.log('wrapInputErrorNative',wrapInputErrorNative)
  const poolTokenList = useMemo(() => {
    // console.log(anyTokenList)
    const arr:any = []
    if (anyTokenList) {
      for (const item of anyTokenList) {
        if (selectCurrency?.address) {
          arr.push({
            anytoken: item.address,
            underlying: selectCurrency.address
          })
        }
      }
    }
    // console.log(arr)
    return arr
  }, [selectCurrency, anyTokenList])
  const {poolData} = usePools({chainId, account, tokenList: poolTokenList})
  const {poolData: destPoolData} = usePool(selectChain, account, chainId?.toString() === selectChain?.toString() || !destConfig?.isLiquidity ? undefined : destConfig?.anytoken?.address, destConfig?.underlying?.address)

  // useEffect(() => {
  //   console.log(destPoolData)
  //   console.log(poolTokenList)
  //   console.log(poolData)
  // }, [destPoolData, poolData, poolTokenList])

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
        // console.log(wrapInputErrorUnderlying)
        if (isNaN(chainId)) {
          if (wrapInputErrorNonevm) {
            return wrapInputErrorNonevm
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
    }  else {
      if (openAdvance) {
        if (wrapInputError && useSwapMethods?.indexOf('swapout(swapout,token,amount,receiver,toChainId,flags)') === -1) {
          return wrapInputError
        } else if (wrapInputErrorPermissonless && useSwapMethods?.indexOf('swapout(swapout,token,amount,receiver,toChainId,flags)') !== -1) {
          return wrapInputErrorPermissonless
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
          if (isNaN(chainId)) {
            if (wrapInputErrorNonevm) {
              return wrapInputErrorNonevm
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
    }
  }, [isNativeToken, openAdvance, wrapInputError, wrapInputErrorUnderlying, wrapInputErrorNative, swapType, chainId, wrapInputErrorNonevm, useSwapMethods, wrapInputErrorPermissonless])

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
      } else if (swapType !== 'deposit') {
        // console.log(selectAnyToken)
        // console.log(poolData)
        const curLiquidity = selectAnyToken?.address &&  poolData?.[selectAnyToken?.address]?.balanceOf ? BigAmount.format(selectAnyToken.decimals, poolData?.[selectAnyToken?.address].balanceOf).toExact() : ''
        const destLiquidity = destConfig?.anytoken?.address &&  destPoolData?.[destConfig?.anytoken?.address]?.balanceOf ? BigAmount.format(destConfig?.anytoken.decimals, destPoolData?.[destConfig?.anytoken?.address].balanceOf).toExact() : ''
        // console.log('curLiquidity', curLiquidity)
        // console.log('destLiquidity', destLiquidity)
        if (chainId?.toString() !== selectChain?.toString()) {
          // console.log(destChain)
          if (Number(inputBridgeValue) < Number(destConfig.MinimumSwap) && Number(destConfig.MinimumSwap) !== 0) {
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
          } else if (
            (destConfig.isLiquidity && destLiquidity && Number(inputBridgeValue) > Number(destLiquidity))
            || (destConfig.isLiquidity && !destLiquidity)
          ) {
            // console.log('dest')
            return {
              state: 'Error',
              tip: t('insufficientLiquidity')
            }
          }
        } else if (
          curLiquidity
          && chainId?.toString() === selectChain?.toString()
          && Number(curLiquidity) < Number(inputBridgeValue)
        ) {
          // console.log(poolInfo)
          return {
            state: 'Warning',
            tip: t('insufficientLiquidity')
          }
        }
      }
    }
    return undefined
  }, [chainId, swapType, selectCurrency, selectChain, isWrapInputError, inputBridgeValue, destConfig, destPoolData, selectAnyToken, poolData])

  const errorTip = useMemo(() => {
    const bt = swapType !== 'deposit' ? t('RemoveLiquidity') : t('AddLiquidity')
    const isAddr = isAddress( useReceiveAddress, selectChain)
    if (isInputError) {
      return isInputError
    } else if (!inputBridgeValue) {
      return {
        state: 'Error',
        tip: bt
      }
    } else if (
      swapType !== 'deposit'
      && !Boolean(isAddr)
      && chainId.toString() !== selectChain.toString()
    ) {
      return {
        state: 'Error',
        tip: t('invalidRecipient')
      }
    }
    return undefined
  }, [isInputError, inputBridgeValue, swapType, useReceiveAddress, selectChain, chainId])

  const isCrossBridge = useMemo(() => {
    if (errorTip) {
      if (
        (
          selectCurrency
          && selectCurrency.chainId === '1' && selectCurrency.symbol === "BitANT"
        )
        && errorTip
        && errorTip.state === 'Warning'
      ) {
      // if (selectCurrency && selectCurrency.chainId === '56' && selectCurrency.symbol === "USDC") {
        return false
      }
      return true
    }
    return false
  }, [errorTip, selectCurrency])

  const btnTxt = useMemo(() => {
    const bt = swapType !== 'deposit' ? t('RemoveLiquidity') : t('AddLiquidity')
    if (errorTip) {
      return errorTip?.tip
    } else if (
      wrapTypeUnderlying === WrapType.WRAP
      || wrapType === WrapType.WRAP
      || wrapTypeNative === WrapType.WRAP
      || wrapTypePermissonless === WrapType.WRAP
    ) {
      return bt
    }
    return bt
  }, [errorTip, t, wrapType, wrapTypeUnderlying, swapType, wrapTypeNative, wrapTypePermissonless])

  const {outputBridgeValue} = outputValue(inputBridgeValue, destConfig, selectCurrency)

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


  const {initCurrency, underlyingList} = useInitSelectCurrency(allTokensList, chainId, initBridgeToken, true)
  // console.log(underlyingList)
  useEffect(() => {
    setSelectCurrency(initCurrency)
    // if (!initCurrency) {
    //   history.replace(window.location.pathname + '#/pool/add')
    // }
  }, [initCurrency])

  const {initDestCurrency, initDestCurrencyList}:any = useDestCurrency(selectCurrency, selectCurrency?.destChains?.[selectChain])

  useEffect(() => {
    setSelectDestCurrency(initDestCurrency)
  }, [initDestCurrency])
  useEffect(() => {
    console.log(initDestCurrencyList)
    setSelectDestCurrencyList(initDestCurrencyList)
  }, [initDestCurrencyList])

  useEffect(() => {
    if (selectCurrency) {
      const destChainList = selectCurrency?.destChains
      const arr:any = []
      const anyTokenList = []
      let useAnyToken:any = ''
      for (const destChainId in destChainList) {
        const destTokenList = destChainList[destChainId]
        for (const destTokenKey in destTokenList) {
          const destTokenItem = destTokenList[destTokenKey]
          if (destTokenItem.isFromLiquidity && !arr.includes(destTokenItem.fromanytoken.address)) {
            arr.push(destTokenItem.fromanytoken.address)
            const data = {
              ...destTokenItem.fromanytoken,
              router: destTokenItem.router,
              sortId: destTokenItem.sortId
            }
            // console.log(initAnyToken)
            // console.log(destTokenItem)
            if (initAnyToken?.toLowerCase() === destTokenItem?.fromanytoken?.address?.toLowerCase()) {
              useAnyToken = data
            }
            anyTokenList.push(data)
          }
        }
      }
      if (anyTokenList.length > 0) {
        if (useAnyToken) {
          setSelectAnyToken(useAnyToken)
        } else {
          setSelectAnyToken(anyTokenList[0])
        }
      }
      // console.log(anyTokenList)
      setAnyTokenList(anyTokenList)
    } else {
      setAnyTokenList([])
    }
  }, [selectCurrency, initAnyToken])

  const {initChainId, initChainList} = useDestChainid(selectCurrency, selectChain, chainId)

  useEffect(() => {
    // console.log(selectCurrency)
    setSelectChain(chainId ? chainId : initChainId)
  }, [initChainId])

  useEffect(() => {
    const arr  = [chainId]
    for (const c of initChainList) {
      // if ([ChainId.SOL, ChainId.SOL_TEST].includes(c)) continue
      arr.push(c)
    }
    // setSelectChainList([chainId, ...initChainList])
    setSelectChainList(arr)
  }, [initChainList, chainId])
  
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
            currency={useSelectCurrency}
            disableCurrencySelect={false}
            showMaxButton={true}
            id="selectCurrency"
            inputType={{swapType, type: 'INPUT'}}
            // onlyUnderlying={true}
            isViewModal={modalOpen}
            isError={Boolean(isInputError)}
            // isViewMode={swapType === 'deposit' ? false : true}
            isViewMode={false}
            onOpenModalView={(value) => {
              // console.log(value)
              setModalOpen(value)
            }}
            isNativeToken={isNativeToken}
            allTokens={underlyingList}
            bridgeKey={BRIDGETYPE}
            // allBalances={allBalances}
          />
          {
            swapType === 'deposit' || chainId?.toString() === selectChain?.toString() ? (
              <MorePool
                anyTokenList={anyTokenList}
                poolData={poolData}
                type={'S'}
                selectCurrency={selectCurrency}
                selectAnyToken={selectAnyToken}
                tipTitleKey={swapType === 'deposit' ? "addLiquidityTip" : "removeLiquidityTip"}
                onSelectAnyToken={(value:any) => {
                  setSelectAnyToken(value)
                }}
              />
            ) : (
              <MorePool
                anyTokenList={selectDestCurrencyList ? Object.keys(selectDestCurrencyList).map((tokenKey) => {
                  return selectDestCurrencyList[tokenKey]
                }) : []}
                poolData={poolData}
                type={'M'}
                selectCurrency={selectCurrency}
                selectAnyToken={selectDestCurrency}
                tipTitleKey="removeLiquidityTip"
                onSelectAnyToken={(value:any) => {
                  setSelectDestCurrency(value)
                }}
              />
            )
          }
          
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
                  value={chainId?.toString() === selectChain?.toString() ? inputBridgeValue : outputBridgeValue.toString() }
                  onUserInput={(value) => {
                    setInputBridgeValue(value)
                  }}
                  onChainSelect={(chainID) => {
                    setSelectChain(chainID)
                  }}
                  selectChainId={selectChain}
                  id="selectChainID"
                  // onOpenModalView={(value) => {
                  //   // console.log(value)
                  //   setModalOpen(value)
                  // }}
                  onCurrencySelect={(inputCurrency) => {
                    setSelectDestCurrency(inputCurrency)
                  }}
                  bridgeConfig={selectCurrency}
                  // intervalCount={intervalCount}
                  isViewAllChain={true}
                  selectChainList={selectChainList}
                  selectDestCurrency={selectDestCurrency}
                  selectDestCurrencyList={selectDestCurrencyList}
                />
              </>
            ) : ''
          }
          {
            swapType !== 'deposit' && (isNaN(chainId) || isNaN(selectChain)) && chainId?.toString() !== selectChain?.toString() ? (
              <AddressInputPanel id="recipient" value={recipient} label={t('Recipient')} labelTip={'( ' + t('receiveTip') + ' )'} onChange={setRecipient} isValid={false} selectChainId={selectChain} isError={!Boolean(isAddress( useReceiveAddress, selectChain))} />
            ) : ''
          }
        </AutoColumn>
        {/* <PoolTip 
          anyCurrency={anyCurrency}
          bridgeConfig={poolInfo}
          destChain={destChain}
          swapType={swapType}
        /> */}
        {
          swapType !== 'deposit' && chainId?.toString() !== selectChain?.toString() && destConfig?.isLiquidity ? (
            <MorePool
              anyTokenList={destConfig?.anytoken ? [destConfig?.anytoken] : []}
              poolData={destPoolData}
              type={'S'}
              selectCurrency={destConfig}
            />
          ) : ''
        }
        
        {
          openAdvance && chainId?.toString() !== selectChain?.toString() ? (
            <>
            {/* <Reminder bridgeConfig={selectCurrency} bridgeType='bridgeAssets' currency={selectCurrency} selectChain={selectChain}/> */}
            {/* <Reminder destConfig={destConfig} bridgeType='bridgeAssets' currency={selectCurrency} selectChain={selectChain}/> */}
            <Reminder destConfig={destConfig} bridgeType='bridgeAssets' currency={selectCurrency} version={destConfig?.type} fee={nativeFee}/>
            </>
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
                  inputBridgeValue && (approveState === ApprovalState.NOT_APPROVED || approveState === ApprovalState.PENDING)? (
                    <ButtonConfirmed
                      onClick={() => {
                        onDelay()
                        if (isNaN(chainId)) {
                          console.log('setNonevmAllowance')
                          setNonevmAllowance().then(() => {
                            onClear(1)
                          })
                        } else {
                          console.log('approveCallback')
                          approveCallback().then(() => {
                            onClear(1)
                          })
                        }
                      }}
                      disabled={approveState !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
                      width="48%"
                      altDisabledStyle={approveState === ApprovalState.PENDING} // show solid button while waiting
                      // confirmed={approval === ApprovalState.APPROVED}
                    >
                      {approveState === ApprovalState.PENDING ? (
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
                    <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
                      onDelay()
                      if (openAdvance && chainId?.toString() !== selectChain?.toString()) {
                        if (isNaN(chainId)) {
                          console.log('onWrapNonevm')
                          if (onWrapNonevm) onWrapNonevm().then(() => {
                            onClear()
                          })
                        } else {
                          console.log('onWrap')
                          if (useSwapMethods?.indexOf('swapout(swapout,token,amount,receiver,toChainId,flags)') !== -1) {
                            if (onWrapPermissonless) onWrapPermissonless().then(() => {
                              onClear()
                            })
                          } else {
                            if (onWrap) onWrap().then(() => {
                              onClear()
                            })
                          }
                        }
                      } else {
                        if (isNaN(chainId)) {
                          console.log('onWrapNonevm')
                          if (onWrapNonevm) onWrapNonevm().then(() => {
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
                            if (onWrapUnderlying) onWrapUnderlying().then(() => {
                              onClear()
                            })
                          }
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