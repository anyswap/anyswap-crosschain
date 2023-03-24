import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'

import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown, Plus, Minus } from 'react-feather'
import { useConnectedWallet } from '@terra-money/wallet-provider'
// import nebulas from 'nebulas'
import SelectChainIdInputPanel from '../CrossChainPanelV2/selectChainID'
import { useActiveReact } from '../../hooks/useActiveReact'

import {
  useBridgeCallback,
  useBridgeUnderlyingCallback,
  useBridgeNativeCallback,
  useCrossBridgeCallback
} from '../../hooks/useBridgeCallback'
// import { WrapType } from '../../hooks/useWrapCallback'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { useLocalToken } from '../../hooks/Tokens'

import SelectCurrencyInputPanel from '../CurrencySelect/selectCurrency'
import { AutoColumn } from '../Column'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../Button'
import { AutoRow } from '../Row'
import { useActiveWeb3React } from '../../hooks'
import Loader from '../Loader'
import AddressInputPanel from '../AddressInputPanel'
import { ArrowWrapper, BottomGrouping } from '../swap/styleds'

import { useWalletModalToggle } from '../../state/application/hooks'
import { tryParseAmount } from '../../state/swap/hooks'
// import { useMergeBridgeTokenList } from '../../state/lists/hooks'
import { useInitUserSelectCurrency } from '../../state/lists/hooks'

import config from '../../config'
import { VALID_BALANCE } from '../../config/constant'
import { getParams } from '../../config/tools/getUrlParams'
import { selectNetwork } from '../../config/tools/methods'
import { ChainId } from '../../config/chainConfig/chainId'
import { getWeb3 } from '../../utils/tools/web3UtilsV2'

// import {getNodeTotalsupply} from '../../utils/bridge/getBalanceV2'
import { thousandBit } from '../../utils/tools/tools'

import LiquidityPool from '../LiquidityPool'

import ErrorTip from '../CrossChainPanelV2/errorTip'

import RouterList from '../CrossChainPanelV2/routerList'

import { usePool } from '../../hooks/usePools'
import { useNearBalance } from '../../nonevm/near'

import { useSolCreateAccount } from '../../nonevm/solana'

import { useAptosBalance } from '../../nonevm/apt'

import { FlexEC } from '../../pages/styled'

import {
  outputValue,
  useInitSelectCurrency,
  useDestChainid,
  useDestCurrency,
  getFTMSelectPool
} from '../CrossChainPanelV2/hooks'
import { BigAmount } from '../../utils/formatBignumber'

import { isAddress } from '../../utils/isAddress'
import useInterval from '../../hooks/useInterval'
import chains, { tokenList, abi, noEvmChainMenu } from './chainlist'
import { SubCurrencySelectBox } from './styleds'
import BulbIcon from '../../assets/images/icon/bulb.svg'
import { useTransactionAdder } from '../../state/transactions/hooks'
// import { chainInfo } from './../../config/chainConfig/index'

export default function CrossChain() {
  const { account } = useActiveWeb3React()
  // console.info('library', library)
  // const { account, chainId } = useActiveWeb3React()
  const { chainId, evmAccount } = useActiveReact()
  const { t } = useTranslation()
  const connectedWallet = useConnectedWallet()
  const useChain = useMemo(() => {
    // console.log(chainId)
    // console.log(config.getCurChainInfo(chainId).chainID)
    if (chainId) {
      return chainId
    } else if (config.getCurChainInfo(chainId).chainID) {
      return config.getCurChainInfo(chainId).chainID
    }
    return undefined
  }, [chainId])

  // const allTokensList: any = useAllMergeBridgeTokenList(bridgeKey, useChain)
  const allTokensList: any = tokenList?.[useChain] ? tokenList?.[useChain] : {}

  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()

  const { getNearStorageBalance, getNearStorageBalanceBounds } = useNearBalance()

  const { setUserFromSelect, setUserToSelect } = useInitUserSelectCurrency(useChain)

  const { validAccount } = useSolCreateAccount()
  const { getAptosResource } = useAptosBalance()

  let initBridgeToken: any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  const initSelectCurrencyKey = initBridgeToken ? 'evm' + initBridgeToken : ''

  let initToChainId: any = getParams('toChainId') ? getParams('toChainId') : ''
  initToChainId = initToChainId ? initToChainId.toLowerCase() : ''

  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>(
    allTokensList?.[initSelectCurrencyKey] ? allTokensList?.[initSelectCurrencyKey] : ''
  )
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

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction] = useState<boolean>(false)

  const [setNearStorageBalance] = useState<any>()
  const [setNearStorageBalanceBounds] = useState<any>()
  const [solTokenAddress, setSolTokenAddress] = useState<any>(false)

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

  const [price, setPrice] = useState<any>({})
  const pollingCurrencyInfo = (arr: Array<string>) => {
    const web3 = getWeb3('https://endpoints.omniatech.io/v1/fantom/testnet/public')
    web3.setProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public')
    const contract = new web3.eth.Contract(abi)
    contract.options.address = '0xcfD1ee7EA7300F106506e7454fD73E87664B8992'
    const batch = new web3.BatchRequest()
    const newPrice: any = {}
    arr.forEach(async (r: any) => {
      const item = isNaN(r) ? noEvmChainMenu[r] : r
      batch.add(contract.methods.getCurrencyInfo(web3.utils.toHex(item)))
      await contract.methods
        .getCurrencyInfo(web3.utils.toHex(item))
        .call()
        .then((res: any) => {
          newPrice[r] = res.price / Math.pow(10, 6)
          if (Object.keys(newPrice).length === arr.length) {
            setPrice(newPrice)
          }
        })
    })
  }
  useEffect(() => {
    const arr = [selectCurrency?.chainId, selectChain]

    if (arr.some(r => !Boolean(r))) {
      return
    }
    pollingCurrencyInfo(arr)
    const interval = setInterval(() => {
      pollingCurrencyInfo(arr)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [selectCurrency?.chainId, selectChain])

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
    if (selectCurrency && selectCurrency?.tokenType === 'NATIVE') {
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
    if (destConfig?.address === 'FTM' || destConfig?.fromanytoken?.address === 'FTM') {
      return true
    }
    return false
  }, [destConfig])

  const formatCurrency = useLocalToken(selectCurrency ?? undefined)
  // console.log(formatCurrency)
  const formatInputBridgeValue = tryParseAmount(
    inputBridgeValue,
    formatCurrency && isApprove ? formatCurrency : undefined
  )
  // console.log((formatCurrency && isApprove) ? formatCurrency : undefined)

  const [approval] = useApproveCallback(
    formatInputBridgeValue && isApprove ? formatInputBridgeValue : undefined,
    approveSpender,
    formatCurrency
  )
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  function changeNetwork(chainID: any) {
    selectNetwork(chainID).then((res: any) => {
      console.log(res)
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', { label: config.getCurChainInfo(chainID).networkName }))
      }
    })
  }

  useEffect(() => {
    setDestChain('')
  }, [selectChain, selectCurrency])
  const { curChain: curFTMChain, destChain: destFTMChain } = getFTMSelectPool(
    selectCurrency,
    useChain,
    selectChain,
    destConfig
  )

  const { poolData } = usePool(
    useChain,
    evmAccount,
    destConfig?.isFromLiquidity && !isBridgeFTM && destConfig?.isLiquidity ? anyToken?.address : undefined,
    selectCurrency?.address
  )
  useEffect(() => {
    // console.log(poolData)
    // console.log(curFTMChain)
    if (poolData && anyToken?.address && !isBridgeFTM && poolData?.[anyToken?.address]?.balanceOf) {
      setCurChain({
        chain: useChain,
        ts: BigAmount.format(anyToken?.decimals, poolData[anyToken?.address]?.balanceOf).toExact(),
        bl: poolData[anyToken?.address]?.balance
          ? BigAmount.format(anyToken?.decimals, poolData[anyToken?.address]?.balance).toExact()
          : ''
      })
    } else if (isBridgeFTM && curFTMChain) {
      setCurChain({
        ...curFTMChain
      })
    } else {
      setCurChain({})
    }
  }, [poolData, anyToken, curFTMChain, isBridgeFTM])
  const { poolData: destPoolData } = usePool(
    selectChain,
    evmAccount,
    destConfig?.isLiquidity && !isBridgeFTM ? destConfig?.anytoken?.address : undefined,
    destConfig?.underlying?.address
  )
  useEffect(() => {
    // console.log(destPoolData)
    // console.log(destFTMChain)
    if (
      destPoolData &&
      destConfig?.anytoken?.address &&
      !isBridgeFTM &&
      destPoolData?.[destConfig?.anytoken?.address]?.balanceOf
    ) {
      setDestChain({
        chain: selectChain,
        ts: BigAmount.format(
          destConfig?.anytoken?.decimals,
          destPoolData[destConfig?.anytoken?.address]?.balanceOf
        ).toExact(),
        bl: destPoolData[destConfig?.anytoken?.address]?.balance
          ? BigAmount.format(
              destConfig?.anytoken?.decimals,
              destPoolData[destConfig?.anytoken?.address]?.balance
            ).toExact()
          : ''
      })
    } else if (isBridgeFTM && destFTMChain) {
      setDestChain({
        ...destFTMChain
      })
    } else {
      setDestChain({})
    }
  }, [destPoolData, destConfig, destFTMChain, isBridgeFTM])

  const { wrapType, inputError: wrapInputError } = useBridgeCallback(
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

  const { wrapType: wrapTypeNative, inputError: wrapInputErrorNative } = useBridgeNativeCallback(
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

  const { wrapType: wrapTypeUnderlying, inputError: wrapInputErrorUnderlying } = useBridgeUnderlyingCallback(
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

  const {
    wrapType: wrapTypeCrossBridge,

    inputError: wrapInputErrorCrossBridge
  } = useCrossBridgeCallback(
    formatCurrency ? formatCurrency : undefined,
    destConfig?.type === 'swapin' ? destConfig?.DepositAddress : useReceiveAddress,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    anyToken?.address,
    destConfig?.pairid,
    isLiquidity,
    useReceiveAddress,
    selectCurrency,
    destConfig
  )

  const { outputBridgeValue } = outputValue(inputBridgeValue, destConfig, selectCurrency)

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
  }, [
    useSwapMethods,
    wrapInputError,
    wrapInputErrorUnderlying,
    wrapInputErrorNative,
    isRouter,
    wrapInputErrorCrossBridge
  ])
  const isInputError = useMemo(() => {
    // if (!price[(selectCurrency || {}).chainId]) return undefined
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
        if (VALID_BALANCE) {
          return {
            state: 'Error',
            tip: isWrapInputError
          }
        } else {
          return undefined
        }
      } else if ((inputBridgeValue || 0) * (price[selectCurrency.chainId] || 0) < 0.5) {
        return {
          state: 'Error',
          tip: t('ExceedMinLimit', {
            amount: '0.5 USD',
            symbol: ' '
          })
        }
      } else if ((inputBridgeValue || 0) * (price[selectCurrency.chainId] || 0) > 10) {
        return {
          state: 'Error',
          tip: t('ExceedMaxLimit', {
            amount: '10 USD',
            symbol: ' '
          })
        }
      } else if (
        isLiquidity &&
        ((isDestUnderlying && destChain && destChain.ts !== '' && Number(inputBridgeValue) > Number(destChain.ts)) ||
          (isDestUnderlying && !destChain))
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
  }, [
    selectCurrency,
    selectChain,
    isWrapInputError,
    inputBridgeValue,
    destConfig,
    isDestUnderlying,
    destChain,
    isLiquidity
    // price
  ])

  const errorTip = useMemo(() => {
    const isAddr = isAddress(recipient, selectChain)
    // console.log(isAddr)
    if (!evmAccount || !useChain) {
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
  }, [isInputError, selectChain, recipient, evmAccount, useChain])

  const isCrossBridge = useMemo(() => {
    if (errorTip || !inputBridgeValue) {
      if (
        selectCurrency &&
        selectCurrency.chainId === '1' &&
        selectCurrency.symbol === 'BitANT' &&
        errorTip &&
        errorTip.state === 'Warning'
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
  }, [errorTip, wrapType, wrapTypeNative, wrapTypeUnderlying, wrapTypeCrossBridge])

  const { initCurrency } = useInitSelectCurrency(allTokensList, useChain, initBridgeToken)

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

  const { initChainId, initChainList } = useDestChainid(selectCurrency, selectChain, useChain)

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
    setUserToSelect({ useChainId: selectChain, toChainId: useChain, token: token, tokenKey: tokenKey.toLowerCase() })
  }, [selectDestCurrency, selectChain, useChain])

  useEffect(() => {
    // console.log('chainId',chainId)
    // console.log('selectChain',selectChain)
    if (useChain && selectChain) {
      // setInitUserSelect({useChainId: useChain, toChainId: selectChain, token: selectCurrency?.address})
      setUserFromSelect({ useChainId: useChain, toChainId: selectChain, token: '' })
    }
  }, [selectChain, useChain])

  useEffect(() => {
    // console.log(initDestCurrencyList)
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

  const getNonevmInfo = useCallback(() => {
    if (
      [ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChain) &&
      destConfig?.address &&
      isAddress(recipient, selectChain) &&
      ['TOKEN'].includes(destConfig?.tokenType)
    ) {
      getNearStorageBalanceBounds({ token: destConfig.address, chainId: selectChain }).then((res: any) => {
        console.log(res)
        if (res?.min) {
          setNearStorageBalanceBounds(res?.min)
        } else {
          setNearStorageBalanceBounds('')
        }
      })
      getNearStorageBalance({ token: destConfig.address, account: recipient, chainId: selectChain }).then(
        (res: any) => {
          console.log(res)
          if (res?.total) {
            setNearStorageBalance(res.total)
          } else {
            setNearStorageBalance('')
          }
        }
      )
    } else if (
      [ChainId.SOL, ChainId.SOL_TEST].includes(selectChain) &&
      destConfig?.address &&
      isAddress(recipient, selectChain)
    ) {
      validAccount({ chainId: selectChain, account: recipient, token: destConfig?.address }).then((res: any) => {
        console.log(res)
        setSolTokenAddress(res)
      })
    } else if (
      [ChainId.APT, ChainId.APT_TEST].includes(selectChain) &&
      destConfig?.address &&
      isAddress(recipient, selectChain)
    ) {
      getAptosResource(selectChain, recipient).then((res: any) => {
        console.log(res)
        const list: any = {}
        if (res && !res.error_code) {
          for (const obj of res) {
            const type = obj.type
            const token = type.replace('0x1::coin::CoinStore<', '').replace('>', '')
            if (obj?.data?.coin?.value) {
              list[token] = {
                balance: obj?.data?.coin?.value
              }
            }
          }
        } else if (res?.error_code && res?.error_code === 'account_not_found') {
          list.error = res.message
        }
        console.log(list)
      })
    }
  }, [selectChain, recipient, destConfig])

  useEffect(() => {
    getNonevmInfo()
  }, [selectChain, recipient, destConfig])

  useInterval(getNonevmInfo, 1000 * 10)
  const addTransaction = useTransactionAdder()
  const send = async () => {
    if ([selectCurrency.chainId, selectChain].some((item: any) => isNaN(item))) {
      alert('Non-evm chains are not supported yet !')
      return
    }
    // const web3 = getWeb3('https://rpc.testnet.fantom.network/')
    const web3 = getWeb3()
    const recipientAccount = (Number(outputBridgeValue) * (price[selectCurrency.chainId] || 0)) / price[selectChain]

    const transactionData: any = {
      from: account,
      to: chains[selectChain]['RouterContract'],
      value: web3.utils.numberToHex(String(inputBridgeValue * Math.pow(10, chains[selectCurrency.chainId].decimal))),
      data: Buffer.from(`${recipient}:${selectChain}:${recipientAccount / 1.2}`, 'utf8').toString('hex')
      // nonce: '',
      // gas: '',
      // gasPrice: ''
    }
    const nonce = await (window as any)?.ethereum?.request({
      method: 'eth_getTransactionCount',
      params: [account]
    })
    const gas = await (window as any)?.ethereum?.request({
      method: 'eth_estimateGas',
      params: [{ to: transactionData.to }]
    })
    const gasPrice = await (window as any)?.ethereum?.request({
      method: 'eth_gasPrice',
      params: []
    })
    transactionData.nonce = nonce
    transactionData.gas = String(Number(gas) * 2)
    transactionData.gasPrice = String(Number(gasPrice))

    const txHash = await (window as any)?.ethereum?.request({
      method: 'eth_sendTransaction',
      params: [transactionData]
    })
    if (txHash) addTransaction(txHash, { summary: `Stake ${recipientAccount} ${chains[selectChain].symbol}` })
  }

  const amount: number | string = (inputBridgeValue || 0) * (price?.[selectCurrency?.chainId] || 0)
  return (
    <>
      <AutoColumn gap={'sm'}>
        <SelectCurrencyInputPanel
          label={t('From')}
          value={inputBridgeValue}
          onUserInput={value => {
            // console.log(value)

            setInputBridgeValue(value)
          }}
          onCurrencySelect={inputCurrency => {
            console.log(inputCurrency)
            setSelectCurrency(inputCurrency)
            setIsUserSelect(false)
            setUserFromSelect({
              useChainId: useChain,
              toChainId: '',
              token: inputCurrency?.address,
              tokenKey: inputCurrency?.key
            })
          }}
          onMax={value => {
            handleMaxInput(value)
          }}
          currency={selectCurrency}
          disableCurrencySelect={false}
          showMaxButton={true}
          isViewNetwork={true}
          customChainId={useChain}
          onOpenModalView={value => {
            // console.log(value)
            setModalOpen(value)
          }}
          isViewModal={modalOpen}
          id="selectCurrency"
          isError={Boolean(isInputError)}
          isNativeToken={isNativeToken}
          // bridgeKey={bridgeKey}
          allTokens={allTokensList}
          isRouter={isRouter}
        />
        {evmAccount && useChain && curChain?.ts ? (
          <>
            <LiquidityPool
              curChain={curChain}
              // destChain={destChain}
              // isUnderlying={isUnderlying}
              selectCurrency={selectCurrency}
              // isDestUnderlying={isDestUnderlying}
            />
          </>
        ) : (
          ''
        )}

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
          {// destConfig?.type !== 'swapin' && !isNaN(selectChain) ? (
          destConfig?.type !== 'swapin' && !isNaN(selectChain) && !isNaN(useChain) ? (
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
          value={
            (
              (Number(outputBridgeValue) * (price?.[selectCurrency?.chainId] || 0)) / price?.[selectChain] || '0.0'
            ).toString()
            // outputBridgeValue.toString()
          }
          onUserInput={value => {
            setInputBridgeValue(value)
          }}
          onChainSelect={chainID => {
            setSelectChain(chainID)
            setIsUserSelect(false)
          }}
          selectChainId={selectChain}
          id="selectChainID"
          onCurrencySelect={inputCurrency => {
            setSelectDestCurrency(inputCurrency)
            setIsUserSelect(true)
          }}
          bridgeConfig={selectCurrency}
          isNativeToken={isNativeToken}
          selectChainList={selectChainList}
          selectDestCurrency={selectDestCurrency}
          selectDestCurrencyList={selectDestCurrencyList}
          // bridgeKey={bridgeKey}
        />
        {evmAccount && useChain && destChain?.ts ? (
          <LiquidityPool
            destChain={destChain}
            // isDestUnderlying={isDestUnderlying}
            selectCurrency={destConfig}
          />
        ) : (
          ''
        )}
        {(swapType === 'send' && !isNaN(useChain) && destConfig?.type != 'swapin') ||
        isNaN(selectChain) ||
        isNaN(useChain) ? (
          <AddressInputPanel
            id="recipient"
            value={recipient}
            label={t('Recipient')}
            labelTip={'( ' + t('receiveTip') + ' )'}
            onChange={setRecipient}
            isValid={false}
            selectChainId={selectChain}
            isError={!Boolean(isAddress(recipient, selectChain))}
          />
        ) : (
          ''
        )}

        <RouterList
          selectCurrency={selectCurrency}
          // tipTitleKey=""
          selectChain={selectChain}
          selectDestKey={destConfig.key}
          routerlist={selectDestCurrencyList}
          inputBridgeValue={inputBridgeValue}
          sortType={'LIQUIDITYUP'}
          isUserSelect={isUserSelect}
          onUserCurrencySelect={inputCurrency => {
            setSelectDestCurrency(inputCurrency)
            setIsUserSelect(true)
          }}
          onCurrencySelect={inputCurrency => {
            setSelectDestCurrency(inputCurrency)
          }}
        />
      </AutoColumn>

      {/* <Reminder destConfig={destConfig} bridgeType="bridgeAssets" currency={selectCurrency} selectChain={selectChain} /> */}

      <SubCurrencySelectBox>
        <dl className="list">
          <dt>
            <img src={BulbIcon} alt="" />
            {t('Reminder')}:
          </dt>
          <dd>
            <i></i>
            {t('redeemTip6', { max: '10 USD', min: '0.5 USD' })}
          </dd>
          <dd>
            <i></i>
            {selectCurrency?.chainId && t('redeemTip7', { amount: thousandBit(amount, '3') })} USD
          </dd>
          <dd>
            <i></i>
            {t('redeemTip8', {
              priceContent: `${selectCurrency?.symbol}: ${price?.[selectCurrency?.chainId] || '-'} USD,     ${
                config.chainInfo[selectChain].symbol
              }: ${price[selectChain] || '-'} USD`
            })}
          </dd>
        </dl>
      </SubCurrencySelectBox>

      <ErrorTip errorTip={errorTip} />
      {config.isStopSystem ? (
        <BottomGrouping>
          <ButtonLight disabled>{t('stopSystem')}</ButtonLight>
        </BottomGrouping>
      ) : (
        <BottomGrouping style={{ width: '100%' }}>
          {!evmAccount ? (
            <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
          ) : isApprove &&
            inputBridgeValue &&
            (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) ? (
            <>
              <ButtonConfirmed
                onClick={() => {
                  // setModalTipOpen(true)
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
              <ButtonConfirmed disabled={true} width="45%" style={{ marginLeft: '10px' }}>
                {t('swap')}
              </ButtonConfirmed>
            </>
          ) : (
            <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={send}>
              {btnTxt}
            </ButtonPrimary>
          )}
        </BottomGrouping>
      )}
    </>
  )
}
