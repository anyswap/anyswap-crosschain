import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'

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
import {useBtcCrossChain} from '../../nonevm/btc'
import {useAtomCrossChain} from '../../nonevm/atom'
import {useReefCrossChain} from '../../nonevm/reef'

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
import {usePool} from '../../hooks/usePools'
// import { useWalletModalToggle } from '../../state/application/hooks'
// import { tryParseAmount } from '../../state/swap/hooks'
// import { useMergeBridgeTokenList } from '../../state/lists/hooks'
import { useAllMergeBridgeTokenList } from '../../state/lists/hooks'
import {
  // useDarkModeManager,
  // useExpertModeManager,
  useInterfaceModeManager,
  useInterfaceBalanceValidManager
  // useUserTransactionTTL,
  // useUserSlippageTolerance
} from '../../state/user/hooks'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'
import { ChainId } from '../../config/chainConfig/chainId'
import { isAddress } from '../../utils/isAddress'
// import ConfirmView from './confirmModal'
import ErrorTip from './errorTip'
import CrossChainTip from  './CrossChainTip'
import CrossChainButton from  './CrossChainButton'
import LiquidityPool from '../LiquidityPool'
import { BigAmount } from '../../utils/formatBignumber'

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
// import useInterval from '../../hooks/useInterval'

// let intervalFN:any = ''

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {
  
  const { account, chainId, evmAccount } = useActiveReact()
  const { t } = useTranslation()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
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
  // const { connect } = useWallet()
  const connectWallet = useConnectWallet()
  
  const allTokensList:any = useAllMergeBridgeTokenList(bridgeKey, chainId)
  const theme = useContext(ThemeContext)
  // const toggleWalletModal = useWalletModalToggle()
  const [userInterfaceMode] = useInterfaceModeManager()
  

  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()
  const [selectDestCurrencyList, setSelectDestCurrencyList] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [recipient, setRecipient] = useState<any>(evmAccount ?? '')
  const [swapType, setSwapType] = useState('swap')
  // const [p2pAddress, setP2pAddress] = useState<any>('')
  
  // const [intervalCount, setIntervalCount] = useState<number>(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipOpen, setModalTipOpen] = useState(false)

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

  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  const destConfig = useMemo(() => {
    console.log(selectCurrency)
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

  const isBridgeFTM = useMemo(() => {
    if (
      destConfig?.address === 'FTM'
      || destConfig?.fromanytoken?.address === 'FTM'
    ) {
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

  const {curChain: curFTMChain, destChain: destFTMChain} = getFTMSelectPool(selectCurrency, useChain, selectChain, destConfig)
  const {poolData} = usePool(useChain, account, destConfig?.isFromLiquidity && !isBridgeFTM && destConfig?.isLiquidity ? anyToken?.address : undefined, selectCurrency?.address)
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
  const {poolData: destPoolData} = usePool(selectChain, account, destConfig?.isLiquidity && !isBridgeFTM ? destConfig?.anytoken?.address : undefined, destConfig?.underlying?.address)
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

  const {allowance, loading, setNonevmAllowance} = useNonevmAllowances(isApprove, selectCurrency, destConfig?.spender, chainId, account, inputBridgeValue, anyToken)

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
  
  const useToChainId = useMemo(() => {
    if (isNaN(selectChain)) {
      return destConfig?.chainId
    }
    return selectChain
  }, [destConfig, selectChain])

  const { inputError: wrapInputErrorNeb, wrapType: wrapNebType, execute: onNebWrap } = useNebBridgeCallback({
    inputCurrency: selectCurrency,
    DepositAddress: destConfig.DepositAddress,
    typedValue: inputBridgeValue,
    chainId,
    selectChain,
    recipient: useReceiveAddress,
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
    useReceiveAddress,
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
    useReceiveAddress,
    chainId,
    selectChain,
    destConfig,
    useToChainId
  )

  const {balance: xlmBalance,execute: onXlmWrap, inputError: wrapInputErrorXlm} = useXlmCrossChain(
    chainId,
    selectCurrency,
    selectChain,
    useReceiveAddress,
    destConfig?.router,
    inputBridgeValue,
    destConfig,
    useToChainId
  )
  const {balance: trxBalance,execute: onTrxWrap, inputError: wrapInputErrorTrx} = useTrxCrossChain(
    destConfig?.router,
    anyToken?.address,
    chainId,
    selectCurrency,
    selectChain,
    useReceiveAddress,
    inputBridgeValue,
    destConfig,
    useToChainId
  )
  const {balance: adaBalance,execute: onAdaWrap, inputError: wrapInputErrorAda} = useAdaCrossChain(
    destConfig?.router,
    anyToken?.address,
    chainId,
    selectCurrency,
    selectChain,
    useReceiveAddress,
    inputBridgeValue,
    destConfig,
    useToChainId
  )
  const {execute: onSolWrap, inputError: wrapInputErrorSol} = useSolCrossChain(
    destConfig?.router,
    anyToken?.address,
    selectCurrency,
    selectChain,
    useReceiveAddress,
    inputBridgeValue,
    destConfig,
    useToChainId
  )

  const {execute: onAptWrap, inputError: wrapInputErrorApt} = useAptCrossChain(
    destConfig?.router,
    anyToken?.address,
    selectCurrency,
    selectChain,
    useReceiveAddress,
    inputBridgeValue,
    destConfig,
    useToChainId
  )

  const {execute: onBtcWrap, inputError: wrapInputErrorBtc} = useBtcCrossChain(
    destConfig?.router,
    anyToken?.address,
    selectCurrency,
    selectChain,
    useReceiveAddress,
    inputBridgeValue,
    destConfig,
    useToChainId
  )

  const {execute: onAtomWrap, inputError: wrapInputErrorAtom} = useAtomCrossChain(
    destConfig?.router,
    anyToken?.address,
    selectCurrency,
    selectChain,
    useReceiveAddress,
    inputBridgeValue,
    destConfig,
    useToChainId
  )
  const {execute: onReefWrap, inputError: wrapInputErrorReef} = useReefCrossChain(
    destConfig?.router,
    anyToken?.address,
    selectCurrency,
    selectChain,
    useReceiveAddress,
    inputBridgeValue,
    destConfig,
    useToChainId
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
    } else if (wrapInputErrorApt && [ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
      return wrapInputErrorApt
    } else if (wrapInputErrorBtc && [ChainId.BTC, ChainId.BTC_TEST].includes(chainId) && config?.chainInfo?.[chainId]?.chainType !== 'NOWALLET') {
      return wrapInputErrorBtc
    } else if (wrapInputErrorAtom && [ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST, ChainId.ATOM_DCORE, ChainId.ATOM_DCORE_TEST].includes(chainId)) {
      return wrapInputErrorAtom
    } else if (wrapInputErrorReef && [ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      return wrapInputErrorReef
    } else {
      return false
    }
  }, [wrapInputErrorTerra, chainId, wrapInputErrorNeb, wrapInputErrorNear, wrapInputErrorXlm, wrapInputErrorTrx, wrapInputErrorAda, wrapInputErrorSol, wrapInputErrorApt, wrapInputErrorBtc, wrapInputErrorAtom, wrapInputErrorReef])
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
      }
    }
    return undefined
  }, [selectCurrency, selectChain, isWrapInputError, inputBridgeValue, destConfig, userInterfaceBalanceValid])

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
    if (evmAccount && !isNaN(selectChain)) {
      setRecipient(evmAccount)
    } else {
      setRecipient('')
    }
  }, [evmAccount, selectChain])

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
          {/* <ConfirmView
            fromChainId={chainId}
            value={inputBridgeValue}
            toChainId={selectChain}
            swapvalue={outputBridgeValue}
            recipient={recipient}
            destConfig={destConfig}
            selectCurrency={selectCurrency}
            fee={fee}
          /> */}
          <CrossChainTip
            isApprove={isApprove}
            inputBridgeValue={inputBridgeValue}
            approval={''}
            selectCurrency={selectCurrency}
            useChain={chainId}
            selectChain={selectChain}
            recipient={recipient}
            destConfig={destConfig}
            outputBridgeValue={outputBridgeValue}
            fee={fee}
            nativeFee={''}
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
            <CrossChainButton
              isApprove={isApprove}
              inputBridgeValue={inputBridgeValue}
              approval={''}
              selectCurrency={selectCurrency}
              useChain={chainId}
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
                } else if (onBtcWrap && [ChainId.BTC, ChainId.BTC_TEST].includes(chainId) && config?.chainInfo?.[chainId]?.chainType !== 'NOWALLET') {
                  console.log('onBtcWrap')
                  onBtcWrap().then(() => {
                    onClear()
                  })
                } else if (onAtomWrap && [ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST, ChainId.ATOM_DCORE, ChainId.ATOM_DCORE_TEST].includes(chainId)) {
                  console.log('onAtomWrap')
                  onAtomWrap().then(() => {
                    onClear()
                  })
                } else if (onReefWrap && [ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
                  console.log('onReefWrap')
                  onReefWrap().then(() => {
                    onClear()
                  })
                }
                
              }}
              // approvalSubmitted={approvalSubmitted}
              // onApprovel={() => {
              //   onDelay()
              //   approveCallback().then(() => {
              //     onClear(1)
              //   })
              // }}
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
          evmAccount && useChain && destChain?.ts && !userInterfaceMode ? (
            <LiquidityPool
              destChain={destChain}
              // isDestUnderlying={isDestUnderlying}
              selectCurrency={destConfig}
            />
          ) : ''
        }
        {
          swapType == 'send' || (isNaN(selectChain) && destConfig?.type === 'swapout') || isNaN(chainId) ? (
            <AddressInputPanel id="recipient" value={recipient} label={t('Recipient')} labelTip={'( ' + t('receiveTip') + ' )'} onChange={setRecipient} isValid={false} selectChainId={selectChain} isError={!Boolean(isAddress( recipient, selectChain))} />
          ) : ''
        }
      </AutoColumn>
      {
        !userInterfaceMode ? (
          <Reminder destConfig={destConfig} bridgeType='bridgeAssets' currency={selectCurrency} selectChain={selectChain}/>
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