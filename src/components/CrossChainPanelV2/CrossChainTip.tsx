import React, { useEffect, useState, useMemo, useCallback } from "react"
import { useTranslation } from 'react-i18next'

import { 
  ApprovalState
} from '../../hooks/useApproveCallback'

import {
  LogoBox,
  // ConfirmContent,
  TxnsInfoText,
  ConfirmText,
  // FlexEC,
} from '../../pages/styled'

import TokenLogo from '../TokenLogo'
import ConfirmView from './confirmModal'

import config from '../../config'
import { ChainId } from '../../config/chainConfig/chainId'

import {getUrlData} from '../../utils/tools/axios'
import {isAddress} from '../../utils/isAddress'
import useInterval from '../../hooks/useInterval'

import {
  useNearBalance,
  // useSendNear
} from '../../nonevm/near'

import {
  useXlmBalance,
  // useTrustlines
} from '../../nonevm/stellar'
import {
  useSolCreateAccount,
  // useLoginSol
} from '../../nonevm/solana'
import {
  useAptosBalance,
  // useAptAllowance,
  // useLoginAptos
} from '../../nonevm/apt'


export default function CrossChainTip ({
  isApprove,
  inputBridgeValue,
  approval,
  selectCurrency,
  useChain,
  selectChain,
  recipient,
  destConfig,
  outputBridgeValue,
  fee,
  nativeFee,
  isDestUnderlying,
  anyToken,
  onSetNearStorageBalanceBounds,
  onSetNearStorageBalance,
  onSetSolTokenAddress,
  onSetAptRegisterList,
  onSetXlmlimit,
  OnSetXrplimit,
}: {
  isApprove:any
  inputBridgeValue:any
  approval:any
  selectCurrency:any
  useChain:any
  selectChain:any
  recipient:any,
  destConfig:any,
  outputBridgeValue:any,
  fee:any,
  nativeFee:any,
  isDestUnderlying:any,
  anyToken:any
  onSetNearStorageBalanceBounds: (value: any) => void,
  onSetNearStorageBalance: (value: any) => void,
  onSetSolTokenAddress: (value: any) => void,
  onSetAptRegisterList: (value: any) => void,
  onSetXlmlimit: (value: any) => void,
  OnSetXrplimit: (value: any) => void,
}) {
  const { t } = useTranslation()

  
  const {getAllBalance} = useXlmBalance()
  // const {setTrustlines} = useTrustlines()
  const {getNearStorageBalance, getNearStorageBalanceBounds} = useNearBalance()
  const {validAccount} = useSolCreateAccount()
  const {getAptosResource} = useAptosBalance()

  const [xlmlimit, setXlmlimit] = useState<any>('NONE')

  const [xrplimit, setXrplimit] = useState<any>('INIT')
  const [nearStorageBalance, setNearStorageBalance] = useState<any>()
  // const [nearStorageBalanceBounds, setNearStorageBalanceBounds] = useState<any>()
  const [solTokenAddress, setSolTokenAddress] = useState<any>(false)
  const [aptRegisterList, setAptRegisterList] = useState<any>({})

  useEffect(() => {
    if (
      [ChainId.XLM, ChainId.XLM_TEST].includes(selectChain)
      && isAddress(recipient, selectChain)
    ) {
      getAllBalance(selectChain, recipient).then((res:any) => {
        // console.log(destConfig)
        // console.log(res)
        if (destConfig?.address === 'native') {
          setXlmlimit('Unlimited')
          onSetXlmlimit('Unlimited')
        } else if (res?.[destConfig?.address]) {
          if (res?.[destConfig?.address]?.limit) {
            setXlmlimit(res?.[destConfig?.address]?.limit)
            onSetXlmlimit(res?.[destConfig?.address]?.limit)
          } else {
            setXlmlimit(0)
            onSetXlmlimit(0)
          }
        } else {
          setXlmlimit(0)
          onSetXlmlimit(0)
        }
      })
    } else {
      setXlmlimit('NONE')
      onSetXlmlimit('NONE')
    }
  }, [selectChain, recipient, destConfig])

  useEffect(() => {
    if (
      selectChain === ChainId.XRP
      && recipient
      && recipient.indexOf('0x') !== 0
      && destConfig?.address !== 'XRP'
    ) {
      // const symbol = destConfig.symbol
      getUrlData(`${config.multiAridgeApi}/xrp/trustset/${recipient}`).then((res:any) => {
        console.log(res)
        if (res.msg === 'Success') {
          const data = res.data?.result?.lines ?? []
          let type = ''
          for (const item of data) {
            // if (item.currency === symbol) {
            if (destConfig.address.indexOf(item.account) !== -1) {
              if (Number(item.limit) > Number(inputBridgeValue)) {
                type = 'PASS'
              } else {
                type = 'NOPASS'
              }
              break
            }
          }
          if (type) {
            setXrplimit(type)
            OnSetXrplimit(type)
          } else {
            setXrplimit('ERROR')
            OnSetXrplimit('ERROR')
          }
        } else {
          setXrplimit('ERROR')
          OnSetXrplimit('ERROR')
        }
      })
    } else {
      setXrplimit('NONE')
      OnSetXrplimit('NONE')
    }
  }, [getUrlData, selectChain, recipient, destConfig, inputBridgeValue])

  const maxInputValue = Math.ceil(inputBridgeValue)
  const xrpurl = useMemo(() => {
    let url = ''
    if (
      selectChain === ChainId.XRP
      && destConfig?.address !== 'XRP'
    ) {
      const result = destConfig?.address?.split('/')
      // console.log(result)
      if (result && result.length === 2) {
        url = `https://xrpl.services/?issuer=${result[1]}&currency=${result[0]}&limit=${maxInputValue}`
      }
    }
    return url
  }, [destConfig, selectChain, maxInputValue])



  const getNonevmInfo = useCallback(() => {
    if (
      [ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChain)
      && destConfig?.address
      && isAddress(recipient, selectChain)
      && ['TOKEN'].includes(destConfig?.tokenType)
    ) {
      getNearStorageBalanceBounds({token: destConfig.address, chainId: selectChain}).then((res:any) => {
        console.log(res)
        if (res?.min) {
          // setNearStorageBalanceBounds(res?.min)
          onSetNearStorageBalanceBounds(res?.min)
        } else {
          // setNearStorageBalanceBounds('')
          onSetNearStorageBalanceBounds('')
        }
      })
      getNearStorageBalance({token: destConfig.address,account: recipient, chainId: selectChain}).then((res:any) => {
        console.log(res)
        if (res?.total) {
          setNearStorageBalance(res.total)
          onSetNearStorageBalance(res.total)
        } else {
          setNearStorageBalance('')
          onSetNearStorageBalance('')
        }
        
      })
    } else if (
      [ChainId.SOL, ChainId.SOL_TEST].includes(selectChain)
      && destConfig?.address
      && isAddress(recipient, selectChain)
    ) {
      validAccount({chainId: selectChain, account: recipient, token: destConfig?.address}).then((res:any) => {
        console.log(res)
        setSolTokenAddress(res)
        onSetSolTokenAddress(res)
      })
    } else if (
      [ChainId.APT, ChainId.APT_TEST].includes(selectChain)
      && destConfig?.address
      && isAddress(recipient, selectChain)
    ) {
      getAptosResource(selectChain, recipient).then((res:any) => {
        console.log(res)
        const list:any = {}
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
        setAptRegisterList(list)
        onSetAptRegisterList(list)
      })
    }
  }, [selectChain, recipient, destConfig])

  useEffect(() => {
    getNonevmInfo()
  }, [selectChain, recipient, destConfig])

  useInterval(getNonevmInfo, 1000 * 10)

  if (isApprove && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)) {
    return <>
      <LogoBox>
        <TokenLogo symbol={selectCurrency?.symbol ?? selectCurrency?.symbol} logoUrl={selectCurrency?.logoUrl} size={'1rem'}></TokenLogo>
      </LogoBox>
      <TxnsInfoText>{config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, useChain)}</TxnsInfoText>
      <ConfirmText>
        {
          t('approveTip', {
            symbol: config.getBaseCoin(selectCurrency?.symbol, useChain),
          })
        }
      </ConfirmText>
    </>
  } else if (
    xlmlimit === 'INIT'
    || (
      [ChainId.XLM, ChainId.XLM_TEST].includes(selectChain)
      && !isNaN(xlmlimit)
      && !isNaN(inputBridgeValue)
      && Number(xlmlimit) < Number(inputBridgeValue)
    )
  ) {
    if (xlmlimit === 'INIT') {
      return <ConfirmText>
        Loading...
      </ConfirmText>
    }
    return <ConfirmText>
      Get trust set error, the transaction may fail.Please set Trustlines.
    </ConfirmText>
  } else if (
    selectChain === ChainId.XRP
    && xrplimit === 'NOPASS'
  ) {
    return <ConfirmText>
      Get trust set error, the transaction may fail.Please use <a href={xrpurl} target='__blank'>{xrpurl}</a>
    </ConfirmText>
  } else if (
    !nearStorageBalance
    && [ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChain)
    && ['TOKEN'].includes(destConfig?.tokenType)
  ) {
    if (window?.near?.account()) {
      return <ConfirmText>
        Get storage balance of receive account error, the transaction may fail.Please deposit near to the token&apos;s storage.
      </ConfirmText>
    } else {
      return <ConfirmText>
        Please connect wallet or install Sender Wallet.
      </ConfirmText>
    }
  } else if (
    !solTokenAddress
    && [ChainId.SOL, ChainId.SOL_TEST].includes(selectChain)
  ) {
    if (window?.solana) {
      return <ConfirmText>
        Please create address.
      </ConfirmText>
    } else {
      return <ConfirmText>
        Please open or install Solana wallet.
      </ConfirmText>
    }
  } else if (
    [ChainId.APT, ChainId.APT_TEST].includes(selectChain)
    && (!aptRegisterList?.[destConfig?.address] || !aptRegisterList?.[destConfig?.anytoken?.address || aptRegisterList.error])
  ) {
    if (window?.aptos) {
      return <ConfirmText>
        {aptRegisterList.error ? `Please deposit APT, the gas token of Aptos, to activate your account (${recipient}). Multichain gas swap tool will come soon.` : 'Please register token first. Token registration is Aptos security policy, which required in your first interaction with an asset.'}
        
      </ConfirmText>
    } else {
      return <ConfirmText>
        Please open or install Petra wallet.
      </ConfirmText>
    }
  } else {
    let otherTip:any
    if (selectChain === ChainId.XRP && xrplimit === 'ERROR') {
      otherTip = <ConfirmText>
        Get trust set error, the transaction may fail.Please use <a href={xrpurl} target='__blank'>{xrpurl}</a>
      </ConfirmText>
    } else if (destConfig?.symbol?.indexOf('FRAX') !== -1 && !isDestUnderlying) {
      otherTip = <ConfirmText>
        Please use <a href='https://app.frax.finance/crosschain' target='__blank'>https://app.frax.finance/crosschain</a> to swap into native FRAX on destination chain.
      </ConfirmText>
    }
    return <>
      <ConfirmView
        fromChainId={useChain}
        value={inputBridgeValue}
        toChainId={selectChain}
        swapvalue={outputBridgeValue}
        recipient={recipient}
        destConfig={destConfig}
        selectCurrency={selectCurrency}
        fee={fee}
        nativeFee={nativeFee}
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
      {otherTip}
    </>
  }
}