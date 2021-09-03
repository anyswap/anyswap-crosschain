import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
// import {GetTokenListByChainID, createAddress, isAddress, getProvider} from 'multichain-bridge'
import {GetTokenListByChainID, createAddress, isAddress} from 'multichain-bridge'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'
import { ArrowDown, Plus, Minus } from 'react-feather'
// import { createBrowserHistory } from 'history'

import SelectChainIdInputPanel from '../CrossChain/selectChainID'
import Reminder from '../CrossChain/reminder'

import { useActiveWeb3React } from '../../hooks'
import {useCrossBridgeCallback, useTerraCrossBridgeCallback} from '../../hooks/useBridgeCallback'
import { WrapType } from '../../hooks/useWrapCallback'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { useLocalToken } from '../../hooks/Tokens'

import SelectCurrencyInputPanel from '../../components/CurrencySelect/selectCurrency'
import { AutoColumn } from '../../components/Column'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ArrowWrapper, BottomGrouping } from '../../components/swap/styleds'
import Title from '../../components/Title'
import ModalContent from '../../components/Modal/ModalContent'
import QRcode from '../../components/QRcode'

// import { useWalletModalToggle, useToggleNetworkModal } from '../../state/application/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { tryParseAmount } from '../../state/swap/hooks'
import { useBridgeAllTokenBalances } from '../../state/wallet/hooks'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'

import {getNodeTotalsupply} from '../../utils/bridge/getBalance'
import {getP2PInfo} from '../../utils/bridge/register'
import {CROSSCHAINBRIDGE} from '../../utils/bridge/type'
import {formatDecimal, setLocalConfig, thousandBit} from '../../utils/tools/tools'

import AppBody from '../AppBody'
import TokenLogo from '../../components/TokenLogo'

import ConnectTerraModal from './ConnectTerraModal'

// const provider = getProvider()
// provider.send('eth_requestAccounts', []).then((res:any) => {
//   console.log(provider)
//   console.log(provider.network)
//   console.log(res)
// })

const LiquidityView = styled.div`
  ${({theme}) => theme.flexSC};
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  border-radius: 0.5625rem;
  padding: 8px 16px;
  color: ${({ theme }) => theme.tipColor};
  font-size: 12px;
  white-space:nowrap;
  .item {
    ${({theme}) => theme.flexBC};
    margin-right: 10px;
    margin-left: 10px;
    .cont {
      margin-left: 10px;
      color: ${({ theme }) => theme.tipColor};
      font-size: 12px;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 8px 12px;
  `};
`

const LogoBox = styled.div`
  ${({ theme }) => theme.flexC};
  width: 46px;
  height: 46px;
  object-fit: contain;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 0.5px rgba(0, 0, 0, 0.1);
  border-radius:100%;
  margin: auto;

  img{
    height: 24px;
    width: 24px;
    display:block;
  }
`
const ConfirmContent = styled.div`
  width: 100%;
`
const TxnsInfoText = styled.div`
  font-family: 'Manrope';
  font-size: 22px;
  text-align: center;
  color: ${({ theme }) => theme.textColorBold};
  margin-top: 1rem;
`
const ConfirmText = styled.div`
  width: 100%;
  font-family: 'Manrope';
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
  color: #734be2;
  padding: 1.25rem 0;
  border-top: 0.0625rem solid rgba(0, 0, 0, 0.08);
  margin-top:1.25rem
`

const ListBox = styled.div`
  width:100%;
  margin-bottom: 30px;
  .item{
    width: 100%;
    margin-bottom: 10px;
    .label{
      color: ${({ theme }) => theme.text1};
      margin: 0;
    }
    .value {
      color: ${({ theme }) => theme.textColorBold};
      margin: 0;
    }
  }
`

const FlexEC = styled.div`
  ${({ theme }) => theme.flexEC};
`

let intervalFN:any = ''

export enum BridgeType {
  deposit = 'deposit',
  bridge = 'bridge',
}

export enum SelectListType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

const SelectBridgeCurrencyLabel = 'SelectBridgeCurrencyLabel'
const SelectBridgeChainIdLabel = 'SelectBridgeChainIdLabel'

function getInitToken () {
  const urlParams = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  const localParams = sessionStorage.getItem(SelectBridgeCurrencyLabel) ? sessionStorage.getItem(SelectBridgeCurrencyLabel) : ''
  let initBridgeToken:any = urlParams ? urlParams : localParams
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''
  if (initBridgeToken) {
    return initBridgeToken
  } else {
    return false
  }
}

const BRIDGETYPE = 'bridgeTokenList'

export default function CrossChain() {
  // const { account, chainId, library } = useActiveWeb3React()
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  // const toggleNetworkModal = useToggleNetworkModal()
  // const history = createBrowserHistory()
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  const allBalances = useBridgeAllTokenBalances(BRIDGETYPE, chainId)
  // console.log(balances)
  const localSelectChain:any = sessionStorage.getItem(SelectBridgeChainIdLabel) ? sessionStorage.getItem(SelectBridgeChainIdLabel) : ''
  const initBridgeToken = getInitToken()

  let initSwapType:any = getParams('bridgetype') ? getParams('bridgetype') : ''
  initSwapType = initSwapType ? initSwapType.toLowerCase() : ''

  const [inputBridgeValue, setInputBridgeValue] = useState('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>(localSelectChain?.toString() === chainId?.toString() ? '' : localSelectChain)
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [recipient, setRecipient] = useState<any>(account ?? '')
  const [viewRrecipient, setViewRecipient] = useState<any>(false)
  const [swapType, setSwapType] = useState(initSwapType ? initSwapType : BridgeType.bridge)
  const [count, setCount] = useState<number>(0)
  const [intervalCount, setIntervalCount] = useState<number>(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipOpen, setModalTipOpen] = useState(false)
  const [modalSpecOpen, setModalSpecOpen] = useState(false)

  // const [bridgeConfig, setBridgeConfig] = useState<any>()

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)

  const [allTokens, setAllTokens] = useState<any>({})
  const [p2pAddress, setP2pAddress] = useState<any>('')
  const [selectCurrencyType, setSelectCurrencyType] = useState<any>(SelectListType.INPUT)

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

  // console.log(selectChain)

  const formatCurrency = useLocalToken(
    selectCurrency?.underlying ? {
      ...selectCurrency,
      address: selectCurrency.underlying.address,
      name: selectCurrency.underlying.name,
      symbol: selectCurrency.underlying?.symbol,
      decimals: selectCurrency.underlying.decimals
    } : selectCurrency)
  // const formatInputBridgeValue = inputBridgeValue && Number(inputBridgeValue) ? tryParseAmount(inputBridgeValue, formatCurrency ?? undefined) : ''
  const formatInputBridgeValue = tryParseAmount(inputBridgeValue, formatCurrency ?? undefined)
  const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, selectCurrency?.address)

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  // console.log(selectCurrency)

  function onDelay () {
    setDelayAction(true)
  }
  function onClear () {
    setDelayAction(false)
    setModalTipOpen(false)
    setModalSpecOpen(false)
    setInputBridgeValue('')
  }

  function changeNetwork (chainID:any) {
    selectNetwork(chainID).then((res: any) => {
      console.log(res)
      
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(chainID).networkName}))
      } else {
        if (selectCurrency?.chainId) {
          sessionStorage.setItem(SelectBridgeChainIdLabel, selectCurrency.chainId)
          history.go(0)
          // setSelectChain(selectCurrency.chainId)
        }
      }
    })
  }

  const getSelectPool = useCallback(async() => {
    // console.log(selectCurrency)
    if (selectCurrency && chainId) {
      const CC:any = await getNodeTotalsupply(
        selectCurrency?.address,
        chainId,
        selectCurrency?.decimals,
        account,
        selectCurrency?.underlying?.address ? selectCurrency?.address : selectCurrency?.underlying?.address
      )
      // console.log(CC)
      // console.log(selectCurrency)
      if (CC) {
        setCurChain({
          chain: chainId,
          ts: selectCurrency?.underlying ? CC[selectCurrency?.address]?.ts : CC[selectCurrency?.address]?.anyts,
          bl: CC[selectCurrency?.address]?.balance
        })
      }
      if (!isNaN(selectChain)) {
        const DC:any = await getNodeTotalsupply(
          selectCurrency?.destChains[selectChain]?.address,
          selectChain,
          selectCurrency?.destChains[selectChain]?.decimals,
          account,
          selectCurrency?.destChains[selectChain]?.underlying?.address
        )
        if (DC) {
          setDestChain({
            chain: selectChain,
            ts: selectCurrency?.underlying ? DC[selectCurrency?.destChains[selectChain].address]?.ts : DC[selectCurrency?.destChains[selectChain].token]?.anyts,
            bl: DC[selectCurrency?.destChains[selectChain].address]?.balance
          })
        }
      }
      // console.log(CC)
      // console.log(DC)
      if (intervalFN) clearTimeout(intervalFN)
      intervalFN = setTimeout(() => {
        setIntervalCount(intervalCount + 1)
      }, 1000 * 10)
    }
  }, [selectCurrency, chainId, account, selectChain, intervalCount])

  // const oldSymbol = useRef()

  useEffect(() => {
    getSelectPool()
  }, [getSelectPool])

  useEffect(() => {
    if (selectCurrency?.symbol && swapType === BridgeType.bridge) {
      sessionStorage.setItem(SelectBridgeCurrencyLabel, selectCurrency?.symbol)
    } else if (selectCurrency?.symbol && swapType !== BridgeType.bridge) {
      sessionStorage.setItem(SelectBridgeCurrencyLabel, '')
    }
  }, [selectCurrency])
  // useEffect(() => {
  //   if (selectChain) {
  //     sessionStorage.setItem(SelectBridgeChainIdLabel, selectChain)
  //   }
  // }, [selectChain])
  // console.log(oldSymbol)
  const useTolenList = useMemo(() => {
    if (allTokens && swapType && chainId) {
      const urlParams = selectCurrency && selectCurrency.chainId?.toString() === chainId?.toString() ? selectCurrency.address : (initBridgeToken ? initBridgeToken : config.getCurChainInfo(chainId).crossBridgeInitToken?.toLowerCase())
      // console.log(urlParams)
      // console.log(allTokens)
      const list:any = {}
      let isUseToken = 0
      // let initToken = ''
      let useToken
      for (const token in allTokens[swapType]) {
        // console.log(token)
        const obj = allTokens[swapType]
        if (!isAddress(token, chainId) && token !== config.getCurChainInfo(chainId).symbol) continue
        const tokenObj = {
          ...obj[token],
          // address: obj[token].underlying ? obj[token].underlying.address : obj[token].address,
          // underlying: obj[token].underlying ? {
          //   ...obj[token].underlying,
          //   address: obj[token].address
          // } : false,
          "specChainId": swapType === BridgeType.deposit ? obj[token].chainId : ''
        }
        if ( selectCurrencyType === SelectListType.OUTPUT && swapType !== BridgeType.deposit) {
          if (obj[token].destChains[selectChain]) {
            list[token] = tokenObj
          } else {
            continue
          }
        } else {
          list[token] = tokenObj
        }
        if (
          !selectCurrency 
          || selectCurrency?.chainId?.toString() !== chainId?.toString()
        ) {
          if (
            urlParams 
            && (
              urlParams === token.toLowerCase()
              || list[token].name.toLowerCase() === urlParams
              || list[token].symbol.toLowerCase() === urlParams
            )
          ) {
            useToken = token
          } else if (!urlParams && !isUseToken) {
            isUseToken = 1
            useToken = token
          }
        }
      }
      if (!useToken) {
        useToken = config.getCurChainInfo(chainId).crossBridgeInitToken
      }
      if (!selectCurrency) {
        setSelectCurrency(list[useToken])
      }
      return list
    }
    return {}
  }, [allTokens, swapType, chainId, selectCurrencyType, selectChain])

  const bridgeConfig = useMemo(() => {
    // console.log(useTolenList)
    // console.log(selectCurrency)
    // console.log(selectChain)
    if (selectCurrency?.address && useTolenList[selectCurrency?.address]) return useTolenList[selectCurrency?.address]
    return ''
  }, [selectCurrency, useTolenList])

  const destConfig = useMemo(() => {
    // console.log(bridgeConfig)
    // console.log(selectChain)
    if (bridgeConfig && bridgeConfig?.destChains[selectChain]) {
      return bridgeConfig?.destChains[selectChain]
    }
    return false
  }, [bridgeConfig, selectChain])

  
  useEffect(() => {
    if ((selectCurrency && chainId?.toString() !== selectCurrency?.chainId?.toString()) || (!bridgeConfig && selectCurrency)) {
      // history.go(0)
    }
  }, [chainId, bridgeConfig])
  
  const isUnderlying = useMemo(() => {
    if (selectCurrency && selectCurrency?.underlying) {
      return true
    }
    return false
  }, [selectCurrency, selectChain])

  const isDestUnderlying = useMemo(() => {
    if (destConfig?.underlying) {
      return true
    }
    return false
  }, [destConfig])
  
  const isNativeToken = useMemo(() => {
    if (
      selectCurrency
      && chainId
      && config.getCurChainInfo(chainId)
      && config.getCurChainInfo(chainId).symbol.toLowerCase() === selectCurrency.symbol.toLowerCase()
    ) {
      return true
    }
    return false
  }, [selectCurrency, chainId])

  const TitleList = useMemo(() => {
    const arr = [
      {
        // name: t('bridge'),
        name: 'EVM',
        onTabClick: () => {
          if (swapType !== BridgeType.bridge) {
            sessionStorage.setItem(SelectBridgeCurrencyLabel, '')
            setSelectCurrency('')
            setSwapType(BridgeType.bridge)
          }
        },
        iconTxt: 'E'
      }
    ]
    if (allTokens?.deposit && Object.keys(allTokens?.deposit).length > 0) {
      arr.push({
        // name: t('Deposited'),
        name: 'BTC',
        onTabClick: () => {
          if (swapType !== BridgeType.deposit) {
            sessionStorage.setItem(SelectBridgeCurrencyLabel, '')
            setSelectCurrency('')
            setSwapType(BridgeType.deposit)
          }
        },
        iconTxt: 'B'
      })
    }
    return arr
  }, [allTokens, swapType])
  // console.log(selectCurrency)
  // console.log(swapType)
  
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useCrossBridgeCallback(
    formatCurrency ? formatCurrency : undefined,
    destConfig?.type === 'swapin' ? destConfig.DepositAddress : recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    selectCurrency?.address,
    // destConfig?.pairid
  )
  const { wrapType: wrapTerraType, execute: onTerraWrap } = useTerraCrossBridgeCallback(
    formatCurrency ? formatCurrency : undefined,
    destConfig.DepositAddress,
    inputBridgeValue,
    selectChain,
    selectCurrency?.address,
    destConfig?.pairid
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
      if (value && Number(value) && Number(value) > 0) {
        return thousandBit(formatDecimal(value, Math.min(6, selectCurrency.decimals)), 'no')
      }
      return ''
    } else {
      return ''
    }
  }, [inputBridgeValue, destConfig])

  const isWrapInputError = useMemo(() => {
    if (wrapInputError && swapType !== BridgeType.deposit) {
      return wrapInputError
    } else {
      return false
    }
  }, [wrapInputError, selectCurrency, swapType])

  const isCrossBridge = useMemo(() => {
    const isAddr = swapType === BridgeType.deposit ? isAddress( p2pAddress, selectCurrency?.specChainId) : isAddress( recipient, selectChain)
    if (
      account
      && destConfig
      && selectCurrency
      && inputBridgeValue
      && !isWrapInputError
      && Boolean(isAddr)
      && destChain
    ) {
      if (
        Number(inputBridgeValue) < Number(destConfig.MinimumSwap)
        || Number(inputBridgeValue) > Number(destConfig.MaximumSwap)
        || (swapType !== BridgeType.deposit && isDestUnderlying && Number(inputBridgeValue) > Number(destChain.ts))
      ) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }, [selectCurrency, account, destConfig, inputBridgeValue, recipient, swapType, destChain, isWrapInputError, selectChain, p2pAddress])

  const isInputError = useMemo(() => {
    // console.log(isCrossBridge)
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
        || isCrossBridge
      ) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }, [account, destConfig, selectCurrency, inputBridgeValue, isCrossBridge])


  const btnTxt = useMemo(() => {
    // console.log(isWrapInputError)
    if (isWrapInputError && inputBridgeValue && swapType !== BridgeType.deposit) {
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
    } else if (wrapType === WrapType.WRAP) {
      return t('swap')
    }
    return t('swap')
  }, [t, isWrapInputError, inputBridgeValue, swapType])

  // useEffect(() => {
  //   if (!chainId) {
  //     history.go(0)
  //   }
  // }, [chainId])

  useEffect(() => {
    setP2pAddress('')
    if (account && selectCurrency && destConfig && swapType === BridgeType.deposit && chainId) {
      getP2PInfo(account, chainId, selectCurrency?.symbol, selectCurrency?.address).then((res:any) => {
        // console.log(res)
        // console.log(selectCurrency)
        if (res?.p2pAddress) {
          const localAddress = createAddress(account, selectCurrency?.symbol, destConfig?.DepositAddress)
          if (res?.p2pAddress === localAddress) {
            // console.log(localAddress)
            setP2pAddress(localAddress)
            setLocalConfig(account, selectCurrency?.address, chainId, CROSSCHAINBRIDGE, {p2pAddress: localAddress})
          }
        }
      })
    }
  }, [account, selectCurrency, destConfig, chainId, swapType])
  
  useEffect(() => {
    if (account && swapType !== BridgeType.deposit) {
      if (destConfig?.type === 'swapin' || !isNaN(selectChain)) {
        setRecipient(account)
      } else {
        setRecipient('')
      }
    } else {
      setRecipient('')
    }
  }, [account, destConfig, swapType, selectChain])

  useEffect(() => {
    
    if (chainId) {
      setAllTokens({})
      GetTokenListByChainID({srcChainID: chainId, chainList: config.getCurConfigInfo().showChain}).then((res:any) => {
        console.log(res)
        if (res) {
          setAllTokens(res)
        } else {
          setTimeout(() => {
            setCount(count + 1)
          }, 1000)
          // setBridgeConfig('')
        }
      })
    } else {
      setAllTokens({})
    }
  // }, [chainId, swapType, count, selectCurrency])
  }, [chainId, count])

  // console.log(selectChain)
  useEffect(() => {
    if (selectCurrency) {
      const arr:any = []
      
      for (const c in selectCurrency?.destChains) {
        if (c?.toString() === chainId?.toString() && swapType !== BridgeType.deposit) continue
        if (config.getCurConfigInfo().showChain.length > 0 && !config.getCurConfigInfo().showChain.includes(c)) continue
        arr.push(c)
      }
      // console.log(arr)
      // console.log(selectCurrency)
      // console.log(selectChain)
      if (arr.length > 0 && !arr.includes(selectChain)) {
        for (const c of arr) {
          if (config.getCurConfigInfo()?.hiddenChain?.includes(c)) continue
          // console.log(c)
          setSelectChain(c)
          break
        }
      } else if (!selectChain) {
        setSelectChain(config.getCurChainInfo(chainId).bridgeInitChain)
      }
      setSelectChainList(arr)
    }
  }, [selectCurrency, swapType, chainId, selectChain])
  // console.log(selectCurrency)
  const handleMaxInput = useCallback((value) => {
    if (value) {
      setInputBridgeValue(value)
    } else {
      setInputBridgeValue('')
    }
  }, [setInputBridgeValue])

  function ButtonView (type:any) {
    let buttonNode:any = ''
    const onClickFn = (label:any) => {
      if (label === 'INIT') {
        if (swapType !== BridgeType.deposit) {
          setModalTipOpen(true)
        } else {
          setModalSpecOpen(true)
        }
      } else if (label === 'APPROVE') {
        onDelay()
        approveCallback().then(() => {
          onClear()
        })
      } else if (label === 'SWAP') {
        onDelay()
        if (onWrap && swapType !== BridgeType.deposit) onWrap().then(() => {
          onClear()
        })
        if (onTerraWrap && swapType === BridgeType.deposit && wrapTerraType === WrapType.WRAP) onTerraWrap().then(() => {
          onClear()
        })
      }
    }
    if (!account) {
      buttonNode = <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
    } else if (
      !isNativeToken
      && selectCurrency
      && selectCurrency.underlying
      && selectCurrency.underlying.isApprove
      && inputBridgeValue
      && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)
    ) {
      buttonNode = <ButtonConfirmed
        onClick={() => {
          onClickFn(type === 'INIT' ? 'INIT' : 'APPROVE')
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
    } else if (
      swapType === BridgeType.deposit
      && selectCurrency?.specChainId === 'TERRA'
      && wrapTerraType === WrapType.NOCONNECT
    ) {
      buttonNode = <ConnectTerraModal />
    } else {
      buttonNode = <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
        onClickFn(type === 'INIT' ? 'INIT' : 'SWAP')
      }}>
        {btnTxt}
      </ButtonPrimary>
    }
    return (
      <BottomGrouping>
        {buttonNode}
      </BottomGrouping>
    )
  }
  // console.log(destConfig)
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
          <div className="item">
            <p className="label">Value:</p>
            <p className="value">{inputBridgeValue}</p>
          </div>
          <div className="item">
            <p className="label">Address:</p>
            <p className="value">{p2pAddress}</p>
          </div>
          <div className="item">
            <QRcode uri={p2pAddress} size={160}></QRcode>
          </div>
        </ListBox>
        <BottomGrouping>
          <ButtonLight onClick={() => {
            setModalSpecOpen(false)
          }}>{t('Confirm')}</ButtonLight>
        </BottomGrouping>
      </ModalContent>
      <ModalContent
        isOpen={modalTipOpen}
        title={'Cross-chain Router'}
        onDismiss={() => {
          setModalTipOpen(false)
        }}
      >
        <LogoBox>
          <TokenLogo symbol={selectCurrency?.symbol} logoUrl={selectCurrency?.logoUrl} size={'1rem'}></TokenLogo>
        </LogoBox>
        <ConfirmContent>
          <TxnsInfoText>{inputBridgeValue + ' ' + config.getBaseCoin(selectCurrency?.underlying?.symbol ?? selectCurrency?.symbol, chainId)}</TxnsInfoText>
          {
            isUnderlying && isDestUnderlying ? (
              <ConfirmText>
                {
                  t('swapTip', {
                    symbol: config.getBaseCoin(selectCurrency?.symbol, chainId),
                    symbol1: config.getBaseCoin(selectCurrency?.underlying?.symbol ?? selectCurrency?.symbol, chainId),
                    chainName: config.getCurChainInfo(selectChain).name
                  })
                }
              </ConfirmText>
            ) : ''
          }
          {ButtonView('SWAP')}
        </ConfirmContent>
      </ModalContent>
      <AppBody>
        <Title
          title={t('bridge')} 
          tabList={TitleList}
          currentTab={(() => {
            // if (swapType === BridgeType.swapin) return 0
            if (swapType === BridgeType.bridge) return 0
            if (swapType === BridgeType.deposit) return 1
            return 0
          })()}
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
              console.log(inputCurrency)
              setSelectCurrency(inputCurrency)
            }}
            onMax={(value) => {
              handleMaxInput(value)
            }}
            // currency={formatCurrency ? formatCurrency : selectCurrency}
            currency={selectCurrency}
            disableCurrencySelect={false}
            disableChainSelect={swapType === BridgeType.deposit}
            showMaxButton={true}
            isViewNetwork={true}
            onOpenModalView={(value) => {
              console.log(value)
              setSelectCurrencyType(SelectListType.INPUT)
              setModalOpen(value)
            }}
            isViewModal={modalOpen}
            id="selectCurrency"
            isError={isInputError}
            isNativeToken={isNativeToken}
            allTokens={useTolenList}
            hideBalance={swapType === BridgeType.deposit}
            customChainId={swapType === BridgeType.deposit ? selectCurrency?.symbol : ''}
            bridgeKey={'bridgeTokenList'}
            allBalances={allBalances}
          />
          {
            account && chainId && isUnderlying && isDestUnderlying ? (
              <LiquidityView>
                {t('pool') + ': '}
                {
                  curChain && isUnderlying ? (
                    <div className='item'>
                      <TokenLogo symbol={config.getCurChainInfo(curChain.chain).networkLogo ?? config.getCurChainInfo(curChain.chain)?.symbol} size={'1rem'}></TokenLogo>
                      <span className='cont'>{config.getCurChainInfo(curChain.chain).name}:{curChain.ts ? formatDecimal(curChain.ts, 2) : '0.00'}</span>
                    </div>
                  ) : ''
                }
                {
                  destChain && isDestUnderlying ? (
                    <div className='item'>
                      <TokenLogo symbol={config.getCurChainInfo(destChain.chain).networkLogo ?? config.getCurChainInfo(destChain.chain)?.symbol} size={'1rem'}></TokenLogo>
                      <span className='cont'>{config.getCurChainInfo(destChain.chain).name}:{destChain.ts ? formatDecimal(destChain.ts, 2) : '0.00'}</span>
                    </div>
                  ) : ''
                }
              </LiquidityView>
            ) : ''
          }

          {/* <AutoRow justify="center" style={{ padding: '0 1rem' }}>
            <ArrowWrapper clickable={false} style={{cursor:'pointer'}} onClick={() => {
              // toggleNetworkModal()
              
              changeNetwork(selectChain)
            }}>
              <ArrowDown size="16" color={theme.text2} />
            </ArrowWrapper>
          </AutoRow> */}
          <AutoRow justify="center" style={{ padding: '0 1rem' }}>
            <ArrowWrapper clickable={false} style={{cursor:'pointer'}} onClick={() => {
              // toggleNetworkModal()
              changeNetwork(selectChain)
            }}>
              <ArrowDown size="16" color={theme.text2} />
            </ArrowWrapper>
            {
              account && swapType !== BridgeType.deposit && destConfig?.type === 'swapout' && !isNaN(selectChain) ? (
                <ArrowWrapper clickable={false} style={{cursor:'pointer', position: 'absolute', right: 0}} onClick={() => {
                  if (isNaN(selectChain)) {
                    setRecipient('')
                    if (viewRrecipient) {
                      setViewRecipient(false)
                    } else {
                      setViewRecipient(true)
                    }
                  } else {
                    setRecipient(account)
                    if (viewRrecipient) {
                      setViewRecipient(false)
                    } else {
                      setViewRecipient(true)
                    }
                  }
                }}>
                  {
                    viewRrecipient ? (
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
            onOpenModalView={(value) => {
              console.log(value)
              setSelectCurrencyType(SelectListType.OUTPUT)
              setModalOpen(value)
            }}
            bridgeConfig={bridgeConfig}
            intervalCount={intervalCount}
            isNativeToken={false}
            selectChainList={selectChainList}
            // isViewAllChain={swapType === BridgeType.deposit}
          />
          {swapType === BridgeType.bridge && destConfig?.type === 'swapout' && (viewRrecipient || isNaN(selectChain)) ? (
            <>
              <AddressInputPanel id="recipient" value={recipient} onChange={setRecipient} isValid={false} />
            </>
          ): ''}
          {
            p2pAddress ? <AddressInputPanel id="p2pAddress" value={p2pAddress} disabledInput={true} /> : ''
          }
        </AutoColumn>

        {/* <Reminder bridgeConfig={bridgeConfig} bridgeType='bridgeAssets' currency={selectCurrency} /> */}
        <Reminder bridgeConfig={bridgeConfig} bridgeType={destConfig?.type} currency={selectCurrency} selectChain={selectChain}/>
        {ButtonView('INIT')}
      </AppBody>
    </>
  )
}