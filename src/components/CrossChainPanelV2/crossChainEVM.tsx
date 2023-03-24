import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'

import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown, Plus, Minus } from 'react-feather'
import { useConnectedWallet } from '@terra-money/wallet-provider'
// import nebulas from 'nebulas'
import SelectChainIdInputPanel from './selectChainID'
import Reminder from './reminder'

import {useActiveReact} from '../../hooks/useActiveReact'

import {
  useBridgeCallback,
  useBridgeUnderlyingCallback,
  useBridgeNativeCallback,
  useCrossBridgeCallback,
  usePermissonlessCallback
} from '../../hooks/useBridgeCallback'
// import { WrapType } from '../../hooks/useWrapCallback'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { useLocalToken } from '../../hooks/Tokens'
// import {useLogin} from '../../nonevm/near'

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
import { useAllMergeBridgeTokenList, useInitUserSelectCurrency } from '../../state/lists/hooks'
import {
  // useDarkModeManager,
  // useExpertModeManager,
  useInterfaceModeManager,
  useInterfaceBalanceValidManager
  // useUserTransactionTTL,
  // useUserSlippageTolerance
} from '../../state/user/hooks'

import config from '../../config'
// import {VALID_BALANCE} from '../../config/constant'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'
import { ChainId } from '../../config/chainConfig/chainId'

// import {getNodeTotalsupply} from '../../utils/bridge/getBalanceV2'
// import {formatDecimal, thousandBit} from '../../utils/tools/tools'

// import TokenLogo from '../TokenLogo'
import LiquidityPool from '../LiquidityPool'

// import ConfirmView from './confirmModal'
import ErrorTip from './errorTip'
import CrossChainTip from  './CrossChainTip'
import CrossChainButton from  './CrossChainButton'

import RouterList from './routerList'

import {usePool} from '../../hooks/usePools'
import {
  // LogoBox,
  ConfirmContent,
  // TxnsInfoText,
  // ConfirmText,
  FlexEC,
} from '../../pages/styled'

import {
  outputValue,
  useInitSelectCurrency,
  useDestChainid,
  useDestCurrency,
  getFTMSelectPool
} from './hooks'
import { BigAmount } from '../../utils/formatBignumber'

// import {getUrlData} from '../../utils/tools/axios'
import {isAddress} from '../../utils/isAddress'
// import useInterval from '../../hooks/useInterval'

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
  // const {login: loginNear} = useLogin()
  const useChain = useMemo(() => {
    // console.log(chainId)
    // console.log(config.getCurChainInfo(chainId).chainID)
    if (chainId) {
      return chainId
    }
    else if (config.getCurChainInfo(chainId).chainID) {
      return config.getCurChainInfo(chainId).chainID
    }
    return undefined
  }, [chainId])

  const allTokensList:any = useAllMergeBridgeTokenList(bridgeKey, useChain)
  // console.log(bridgeKey)
  // console.log(allTokensList)
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  const [userInterfaceMode] = useInterfaceModeManager()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()

  // const {getNearStorageBalance, getNearStorageBalanceBounds} = useNearBalance()

  const {setUserFromSelect, setUserToSelect} = useInitUserSelectCurrency(useChain)
  // const {depositStorageNear} = useSendNear()
  // const {getAllBalance} = useXlmBalance()
  // const {setTrustlines} = useTrustlines()
  // const {
  //   // validAccount,
  //   createAccount
  // } = useSolCreateAccount()
  // const {loginSol} = useLoginSol()
  // const {getAptosResource} = useAptosBalance()
  // const {setAptAllowance} = useAptAllowance()
  // const {loginAptos} = useLoginAptos()

  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  const initSelectCurrencyKey = initBridgeToken ? 'evm' + initBridgeToken : ''

  let initToChainId:any = getParams('toChainId') ? getParams('toChainId') : ''
  initToChainId = initToChainId ? initToChainId.toLowerCase() : ''
  

  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>(allTokensList?.[initSelectCurrencyKey] ? allTokensList?.[initSelectCurrencyKey] : '')
  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()
  const [selectDestCurrencyList, setSelectDestCurrencyList] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>(initToChainId)
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [recipient, setRecipient] = useState<any>(evmAccount ?? '')
  const [swapType, setSwapType] = useState('swap')

  const [isUserSelect, setIsUserSelect] = useState(false)
  
  // useEffect(() => {
  //   console.log(selectCurrency)
  // }, [selectCurrency])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipOpen, setModalTipOpen] = useState(false)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)

  const [xlmlimit, setXlmlimit] = useState<any>('NONE')
  const [xrplimit, setXrplimit] = useState<any>('INIT')
  const [nearStorageBalance, setNearStorageBalance] = useState<any>()
  const [nearStorageBalanceBounds, setNearStorageBalanceBounds] = useState<any>()
  const [solTokenAddress, setSolTokenAddress] = useState<any>(false)
  const [aptRegisterList, setAptRegisterList] = useState<any>({})

  const [curChain, setCurChain] = useState<any>({
    chain: useChain,
    ts: '',
    bl: ''
  })
  const [destChain, setDestChain] = useState<any>({
    chain: config.getCurChainInfo(useChain).bridgeInitChain,
    ts: '',
    bl: ''
  })


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
    } else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChain)) {
      console.log(destConfig )
      return recipient
    } else {
      return recipient
    }
  }, [selectChain, recipient, solTokenAddress, destConfig])

  // console.log(useReceiveAddress)
  const isRouter = useMemo(() => {
    // console.log(destConfig)
    if (['swapin', 'swapout'].includes(destConfig?.type)) {
      return false
    }
    return true
  }, [destConfig])

  const isApprove = useMemo(() => {
    return destConfig.isApprove
  }, [destConfig])

  const isLiquidity = useMemo(() => {
    return destConfig.isLiquidity
  }, [destConfig])

  const useSwapMethods = useMemo(() => {
    return destConfig.routerABI
  }, [destConfig])

  const isNativeToken = useMemo(() => {
    console.log(selectCurrency)
    if (
      selectCurrency
      && selectCurrency?.tokenType === 'NATIVE'
    ) {
      return true
    }
    return false
  }, [selectCurrency])
  // console.log(isNativeToken)

  const anyToken = useMemo(() => {
    if (destConfig?.fromanytoken) {
      return destConfig.fromanytoken
    }
    return undefined
  }, [destConfig.fromanytoken])

  const isDestUnderlying = useMemo(() => {
    if (destConfig?.underlying) {
      return true
    }
    return false
  }, [destConfig])

  const routerToken = useMemo(() => {
    if (destConfig?.router && isAddress(destConfig?.router)) {
      return destConfig?.router
    }
    return undefined
  }, [destConfig])

  const approveSpender = useMemo(() => {
    if (destConfig.isApprove) {
      if (isRouter) {
        // setBridgeAnyToken('')
        return destConfig.spender
      } else {
        return destConfig?.fromanytoken?.address
      }
    }
    return undefined
  }, [destConfig, isRouter, routerToken])

  
  const isBridgeFTM = useMemo(() => {
    if (
      destConfig?.address === 'FTM'
      || destConfig?.fromanytoken?.address === 'FTM'
    ) {
      return true
    }
    return false
  }, [destConfig])

  const formatCurrency = useLocalToken(selectCurrency ?? undefined)
  // console.log(formatCurrency)
  const formatInputBridgeValue = tryParseAmount(inputBridgeValue, (formatCurrency && isApprove) ? formatCurrency : undefined)
  // console.log((formatCurrency && isApprove) ? formatCurrency : undefined)

  const [approval, approveCallback] = useApproveCallback((formatInputBridgeValue && isApprove) ? formatInputBridgeValue : undefined, approveSpender, formatCurrency)
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
  
  const {curChain: curFTMChain, destChain: destFTMChain} = getFTMSelectPool(selectCurrency, useChain, selectChain, destConfig)
  const {poolData} = usePool(useChain, evmAccount, destConfig?.isFromLiquidity && !isBridgeFTM && destConfig?.isLiquidity ? anyToken?.address : undefined, selectCurrency?.address)
  useEffect(() => {
    // console.log('poolData', poolData)
    // console.log(curFTMChain)
    if (poolData && anyToken?.address && !isBridgeFTM && poolData?.[anyToken?.address]?.balanceOf) {
      setCurChain({
        chain: useChain,
        ts: BigAmount.format(anyToken?.decimals, poolData[anyToken?.address]?.balanceOf).toExact(),
        bl: poolData[anyToken?.address]?.balance ? BigAmount.format(anyToken?.decimals, poolData[anyToken?.address]?.balance).toExact() :'',
      })
    } else if (isBridgeFTM && curFTMChain) {
      setCurChain({
        ...curFTMChain
      })
    } else {
      setCurChain({})
    }
  }, [poolData, anyToken, curFTMChain, isBridgeFTM])
  const {poolData: destPoolData} = usePool(selectChain, evmAccount, destConfig?.isLiquidity && !isBridgeFTM ? destConfig?.anytoken?.address : undefined, destConfig?.underlying?.address)
  useEffect(() => {
    // console.log('destPoolData',destPoolData)
    // console.log(destFTMChain)
    if (destPoolData && destConfig?.anytoken?.address && !isBridgeFTM && destPoolData?.[destConfig?.anytoken?.address]?.balanceOf) {
      setDestChain({
        chain: selectChain,
        ts: BigAmount.format(destConfig?.anytoken?.decimals, destPoolData[destConfig?.anytoken?.address]?.balanceOf).toExact(),
        bl: destPoolData[destConfig?.anytoken?.address]?.balance ? BigAmount.format(destConfig?.anytoken?.decimals, destPoolData[destConfig?.anytoken?.address]?.balance).toExact() : '',
      })
    } else if (isBridgeFTM && destFTMChain) {
      setDestChain({
        ...destFTMChain
      })
    } else {
      setDestChain({})
    }
  }, [destPoolData, destConfig, destFTMChain, isBridgeFTM])
  
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useBridgeCallback(
    routerToken,
    formatCurrency ? formatCurrency : undefined,
    anyToken?.address,
    useReceiveAddress,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency,
    isLiquidity,
    destConfig
  )

  const { wrapType: wrapTypePermissonless, execute: onWrapPermissonless, inputError: wrapInputErrorPermissonless, fee: nativeFee } = usePermissonlessCallback(
    routerToken,
    formatCurrency ? formatCurrency : undefined,
    anyToken?.address,
    useReceiveAddress,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency,
    isLiquidity,
    destConfig
  )

  const { wrapType: wrapTypeNative, execute: onWrapNative, inputError: wrapInputErrorNative } = useBridgeNativeCallback(
    routerToken,
    formatCurrency ? formatCurrency : undefined,
    anyToken?.address,
    useReceiveAddress,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    isLiquidity,
    destConfig
  )

  const { wrapType: wrapTypeUnderlying, execute: onWrapUnderlying, inputError: wrapInputErrorUnderlying } = useBridgeUnderlyingCallback(
    routerToken,
    formatCurrency ? formatCurrency : undefined,
    anyToken?.address,
    useReceiveAddress,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency,
    isLiquidity,
    destConfig
  )

  const { wrapType: wrapTypeCrossBridge, execute: onWrapCrossBridge, inputError: wrapInputErrorCrossBridge } = useCrossBridgeCallback(
    formatCurrency ? formatCurrency : undefined,
    destConfig?.type === 'swapin' ? destConfig?.DepositAddress : useReceiveAddress,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    anyToken?.address ,
    destConfig?.pairid,
    isLiquidity,
    useReceiveAddress,
    selectCurrency,
    destConfig
  )
  

  const {outputBridgeValue, fee} = outputValue(inputBridgeValue, destConfig, selectCurrency)

  const isWrapInputError = useMemo(() => {
    if (isRouter) {
      if (useSwapMethods) {
        if (useSwapMethods.indexOf('anySwapOutNative') !== -1) {
          if (wrapInputErrorNative) {
            return wrapInputErrorNative
          } else {
            return false
          }
        } else if (useSwapMethods.indexOf('anySwapOutUnderlying') !== -1) {
          if (wrapInputErrorUnderlying) {
            return wrapInputErrorUnderlying
          } else {
            return false
          }
        } else if (useSwapMethods.indexOf('anySwapOut') !== -1) {
          if (wrapInputError) {
            return wrapInputError
          } else {
            return false
          }
        } else if (useSwapMethods.indexOf('swapout(swapout,token,amount,receiver,toChainId,flags)') !== -1) {
          if (wrapInputErrorPermissonless) {
            return wrapInputErrorPermissonless
          } else {
            return false
          }
        }
      }
      return false
    } else {
      if (wrapInputErrorCrossBridge) {
        return wrapInputErrorCrossBridge
      } else {
        return false
      }
    }
  }, [useSwapMethods, wrapInputError, wrapInputErrorUnderlying, wrapInputErrorNative, isRouter, wrapInputErrorCrossBridge, wrapInputErrorPermissonless])
  // console.log(selectCurrency)
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
        if (userInterfaceBalanceValid) {
          return {
            state: 'Error',
            tip: isWrapInputError
          }
        } else {
          return undefined
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
      } else if (
        isLiquidity
        && (
          (isDestUnderlying && destChain && destChain.ts !== '' && Number(inputBridgeValue) > Number(destChain.ts))
          || (isDestUnderlying && !destChain)
        )
      ) {
        // if (selectCurrency.chainId === '1' && selectCurrency.symbol === "BitANT") {
        //   return undefined
        // }
        // console.log(destChain)
        return {
          state: 'Warning',
          tip: t('insufficientLiquidity')
        }
      }
    }
    return undefined
  }, [selectCurrency, selectChain, isWrapInputError, inputBridgeValue, destConfig, isDestUnderlying, destChain, isLiquidity, userInterfaceBalanceValid])

  const errorTip = useMemo(() => {
    const isAddr = isAddress( recipient, selectChain)
    // console.log(isAddr)
    if (!evmAccount || !useChain) {
      return undefined
    } else if (isInputError) {
      return isInputError
    } else if (
      !Boolean(isAddr) 
    ) {
      return {
        state: 'Error',
        tip: t('invalidRecipient')
      }
    }
    return undefined
  }, [isInputError, selectChain, recipient, evmAccount, useChain])

  const isCrossBridge = useMemo(() => {
    if (errorTip || !inputBridgeValue) {
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
  }, [errorTip, inputBridgeValue, selectCurrency])

  const btnTxt = useMemo(() => {
    return t('swap')
  }, [errorTip, wrapType, wrapTypeNative, wrapTypeUnderlying, wrapTypeCrossBridge, wrapTypePermissonless])

  const {initCurrency} = useInitSelectCurrency(allTokensList, useChain, initBridgeToken)

  useEffect(() => {
    // console.log(initCurrency)
    setSelectCurrency(initCurrency)
  }, [initCurrency])

  useEffect(() => {
    // if (swapType == 'swap' && evmAccount && !isNaN(selectChain)) {
    if (evmAccount && !isNaN(selectChain)) {
      setRecipient(evmAccount)
    } else if (isNaN(selectChain)) {
      if (selectChain === ChainId.TERRA && connectedWallet?.walletAddress) {
        setRecipient(connectedWallet?.walletAddress)
      } else {
        setRecipient('')
      }
    }
  }, [evmAccount, swapType, selectChain])

  const {initChainId, initChainList} = useDestChainid(selectCurrency, selectChain, useChain)

  useEffect(() => {
    // console.log(initChainId)
    setSelectChain(initChainId)
  }, [initChainId, selectCurrency])
// console.log(initChainId)
// console.log(selectChain)


  useEffect(() => {
    setSelectChainList(initChainList)
  }, [initChainList])
  
  // const {initDestCurrency, initDestCurrencyList} = useDestCurrency(selectCurrency, selectCurrency?.destChains?.[selectChain])
  const {
    // initDestCurrency,
    initDestCurrencyList
  } = useDestCurrency(selectCurrency, selectCurrency?.destChains?.[selectChain])
  // console.log(selectChain)
  // console.log(selectCurrency?.destChains?.[selectChain])
  // useEffect(() => {
  //   setSelectDestCurrency(initDestCurrency)
  // }, [initDestCurrency])

  useEffect(() => {
    let tokenKey = ''
    const token = selectDestCurrency?.address?.toLowerCase()
    if (token && selectChain) {

      if (selectDestCurrency?.tokenType === 'NATIVE') {
        if (isNaN(selectChain)) {
          tokenKey = selectChain + token
        } else {
          if (config.getCurChainInfo(selectChain).symbol.toLowerCase() === token) {
            tokenKey = token
          } else {
            tokenKey = 'evm' + config.getCurChainInfo(selectChain).symbol + token
          }
        }
      } else {
        if (isNaN(selectChain)) {
          tokenKey = selectChain + token
        } else {
          tokenKey = 'evm' + token
        }
      }
    }
    setUserToSelect({useChainId: selectChain, toChainId: useChain, token: token,tokenKey: tokenKey.toLowerCase()})
  }, [selectDestCurrency, selectChain, useChain])

  useEffect(() => {
    // console.log('chainId',chainId)
    // console.log('selectChain',selectChain)
    if (useChain && selectChain) {
      // setInitUserSelect({useChainId: useChain, toChainId: selectChain, token: selectCurrency?.address})
      setUserFromSelect({useChainId: useChain, toChainId: selectChain, token: ''})
    }
  }, [selectChain, useChain])

  useEffect(() => {
    // console.log(initDestCurrencyList)
    setSelectDestCurrencyList(initDestCurrencyList)
  }, [initDestCurrencyList])

  const handleMaxInput = useCallback((value) => {
    if (value) {
      setInputBridgeValue(value)
    } else {
      setInputBridgeValue('')
    }
  }, [setInputBridgeValue])

  const handleSwap = useCallback(() => {
    onDelay()
    if (useSwapMethods) {
      if (
        useSwapMethods.indexOf('transfer') !== -1
        || useSwapMethods.indexOf('sendTransaction') !== -1
        || useSwapMethods.indexOf('Swapout') !== -1
      ) {
        if (onWrapCrossBridge) onWrapCrossBridge().then(() => {
          onClear()
        })
      } else if (useSwapMethods.indexOf('anySwapOutNative') !== -1) {
        if (onWrapNative) onWrapNative().then(() => {
          onClear()
        })
      } else if (useSwapMethods.indexOf('anySwapOutUnderlying') !== -1) {
        if (onWrapUnderlying) onWrapUnderlying().then((hash) => {
          console.log(hash)
          onClear()
        })
      } else if (useSwapMethods.indexOf('anySwapOut') !== -1) {
        if (onWrap) onWrap().then(() => {
          onClear()
        })
      } else if (useSwapMethods.indexOf('swapout(swapout,token,amount,receiver,toChainId,flags)') !== -1) {
        if (onWrapPermissonless) onWrapPermissonless().then(() => {
          onClear()
        })
      }
    }
  }, [useSwapMethods, onWrapCrossBridge, onWrapNative, onWrapUnderlying, onWrap, onWrapPermissonless])


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
          <CrossChainTip
            isApprove={isApprove}
            inputBridgeValue={inputBridgeValue}
            approval={approval}
            selectCurrency={selectCurrency}
            useChain={useChain}
            selectChain={selectChain}
            recipient={recipient}
            destConfig={destConfig}
            outputBridgeValue={outputBridgeValue}
            fee={fee}
            nativeFee={nativeFee}
            isDestUnderlying={isDestUnderlying}
            anyToken={anyToken}
            onSetNearStorageBalanceBounds={(val:any) => {
              setNearStorageBalanceBounds(val)
            }}
            onSetNearStorageBalance={(val:any) => {
              setNearStorageBalance(val)
            }}
            onSetSolTokenAddress={(val:any) => {
              setSolTokenAddress(val)
            }}
            onSetAptRegisterList={(val:any) => {
              setAptRegisterList(val)
            }}
            onSetXlmlimit={(val:any) => {
              setXlmlimit(val)
            }}
            OnSetXrplimit={(val:any) => {
              setXrplimit(val)
            }}
          />
          <BottomGrouping>
            {/* <ViemConfirmBtn /> */}
            <CrossChainButton
              isApprove={isApprove}
              inputBridgeValue={inputBridgeValue}
              approval={approval}
              selectCurrency={selectCurrency}
              useChain={useChain}
              selectChain={selectChain}
              recipient={recipient}
              destConfig={destConfig}
              delayAction={delayAction}
              isCrossBridge={isCrossBridge}
              xlmlimit={xlmlimit}
              xrplimit={xrplimit}
              nearStorageBalance={nearStorageBalance}
              nearStorageBalanceBounds={nearStorageBalanceBounds}
              solTokenAddress={solTokenAddress}
              aptRegisterList={aptRegisterList}
              onHandleSwap={() => {
                handleSwap()
              }}
              approvalSubmitted={approvalSubmitted}
              onApprovel={() => {
                onDelay()
                approveCallback().then(() => {
                  onClear(1)
                })
              }}
            />
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
            console.log(inputCurrency)
            setSelectCurrency(inputCurrency)
            setIsUserSelect(false)
            setUserFromSelect({useChainId: useChain, toChainId: '', token: inputCurrency?.address, tokenKey: inputCurrency?.key})
          }}
          onMax={(value) => {
            handleMaxInput(value)
          }}
          currency={selectCurrency}
          disableCurrencySelect={false}
          showMaxButton={true}
          isViewNetwork={true}
          customChainId={useChain}
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
          evmAccount && useChain && curChain?.ts && !userInterfaceMode ? (
            <>
              <LiquidityPool
                curChain={curChain}
                // destChain={destChain}
                // isUnderlying={isUnderlying}
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
            // destConfig?.type !== 'swapin' && !isNaN(selectChain) ? (
            destConfig?.type !== 'swapin' && !isNaN(selectChain) && !isNaN(useChain) ? (
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
            console.log(chainID)
            setSelectChain(chainID)
            setIsUserSelect(false)
          }}
          selectChainId={selectChain}
          id="selectChainID"
          onCurrencySelect={(inputCurrency) => {
            setSelectDestCurrency(inputCurrency)
            setIsUserSelect(true)
          }}
          bridgeConfig={selectCurrency}
          isNativeToken={isNativeToken}
          selectChainList={selectChainList}
          selectDestCurrency={selectDestCurrency}
          selectDestCurrencyList={selectDestCurrencyList}
          bridgeKey={bridgeKey}
        />
        {
          evmAccount && useChain && destChain?.ts && !userInterfaceMode ? (
            <LiquidityPool
              destChain={destChain}
              // isDestUnderlying={isDestUnderlying}
              selectCurrency={destConfig}
            />
          ) : ''
        }
        {
          (swapType === 'send' && !isNaN(useChain) && destConfig?.type != 'swapin')
          || (isNaN(selectChain))
          || isNaN(useChain) ? (
            <AddressInputPanel id="recipient" value={recipient} label={t('Recipient')} labelTip={'( ' + t('receiveTip') + ' )'} onChange={setRecipient} isValid={false} selectChainId={selectChain} isError={!Boolean(isAddress( recipient, selectChain))} />
          ) : ''
        }

        <RouterList
          selectCurrency={selectCurrency}
          // tipTitleKey=""
          selectChain={selectChain}
          selectDestKey={destConfig.key}
          routerlist={selectDestCurrencyList}
          inputBridgeValue={inputBridgeValue}
          sortType={'LIQUIDITYUP'}
          isUserSelect={isUserSelect}
          onUserCurrencySelect={(inputCurrency) => {
            setSelectDestCurrency(inputCurrency)
            setIsUserSelect(true)
          }}
          onCurrencySelect={(inputCurrency) => {
            setSelectDestCurrency(inputCurrency)
          }}
        />
      </AutoColumn>
      {
         !userInterfaceMode ? (
           <Reminder destConfig={destConfig} bridgeType='bridgeAssets' currency={selectCurrency} version={destConfig?.type} fee={nativeFee}/>
         ) : ''
      }

      <ErrorTip errorTip={errorTip} />
      {
        selectChain === ChainId.ARBITRUM ? (
          <ErrorTip errorTip={{
            state: 'Error',
            tip: 'Bridge to Arbitrum will take more than 60 minutes due to network congestion.'
          }} />
        ) : ''
      }
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
                isApprove && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)? (
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
                        t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, useChain)
                      )}
                    </ButtonConfirmed>
                    <ButtonConfirmed disabled={true} width="45%" style={{marginLeft:'10px'}}>
                      {t('swap')}
                    </ButtonConfirmed>
                  </>
                ) : (
                  <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
                  // <ButtonPrimary  onClick={() => {
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