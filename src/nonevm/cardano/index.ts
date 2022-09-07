
import { useCallback, useState, useMemo, useEffect } from 'react'
import {  useDispatch, useSelector } from 'react-redux'

import { AppState, AppDispatch } from '../../state'
import { useActiveReact } from '../../hooks/useActiveReact'
import { tryParseAmount3 } from '../../state/swap/hooks'
import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
// import { BigAmount } from "../../utils/formatBignumber"
import { ChainId } from "../../config/chainConfig/chainId"

import {adaAddress} from './actions'

export function useAdaAddress () {
  const account:any = useSelector<AppState, AppState['ada']>(state => state.ada.adaAddress)
  return {
    adaAddress: account
  }
}

export function useAdaLogin() {
  const { cardano } = window
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => {
    if (cardano?.nami?.enable) {
      cardano.nami.enable().then((res:any) => {
        res.getChangeAddress().then((res:any) => {
          if (res) {
            dispatch(adaAddress({address: res}))
          }
        })
      })
    } else {
      if (confirm('Please connect Nami or install Nami.') === true) {
        window.open('https://namiwallet.io/')
      }
    }
  }, [cardano])
}

export function useAdaBalance () {
  const { cardano } = window
  const getAdaBalance = useCallback(() => {
    cardano.getBalance().then((res:any) => {
      console.log(res)
    })
  }, [])

  const getAdaTokenBalance = useCallback(() => {
    cardano.getBalance().then((res:any) => {
      console.log(res)
    })
  }, [])

  return {
    getAdaBalance,
    getAdaTokenBalance
  }
}

export function getADATxnsStatus (txid:string, chainId:any) {
  const data:any = {
    msg: 'Error',
    info: ''
  }
  return new Promise(resolve => {
    const query = `{
      transactions(where: { hash: { _eq: "${txid}"}}) {
        block {number epochNo slotNo}
        hash metadata{key value}
        inputs{
          tokens{
            asset{
              assetId
              assetName
            }
            quantity
          }
          value
        }
        outputs(order_by:{index:asc}){
          address
          index
          tokens{
            asset{
              assetId
              assetName
            }
            quantity
          }
          value
        }
        validContract
      }
    }`
    let url = 'https://graphql-api.dandelion.link/'
    if (chainId === 'ADA_TEST') {
      url = 'https://graphql-api.testnet.dandelion.link/'
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }).then(res => res.json()).then(json => {
      // console.log(json)
      // console.log(json.data)
      // console.log(json.data.transactions)
      // console.log(JSON.stringify(json.data.transactions))
      // console.log(json)
      if (json && json.data && json.data.transactions && json.data.transactions.length > 0) {
        if (!json.data.transactions[0].outputs) {
          data.msg = 'Failure'
          data.error = 'Txns is failure!'
        } else {
          data.msg = 'Success'
          data.info = json.data.transactions[0]
        }
      } else {
        data.msg = 'Null'
        data.error = 'Query is empty!'
      }
      resolve(data)
    }).catch(err => {
      data.error = 'Query is empty!'
      console.log(err)
      resolve(data)
    })
  })
}

export function useAdaCrossChain (
  routerToken: any,
  inputToken: any,
  chainId:any,
  selectCurrency:any,
  selectChain:any,
  receiveAddress:any,
  typedValue:any,
  destConfig:any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const {account} = useActiveReact()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()

  const [balance, setBalance] = useState<any>()

  // const {getTrxBalance, getTrxTokenBalance} = useTrxBalance()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  useEffect(() => {
    if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId) && selectCurrency?.address) {
      setBalance('')
      // const dec = selectCurrency?.decimals
      // if (selectCurrency?.tokenType === 'NATIVE') {
      //   getTrxBalance({account}).then((res:any) => {
      //     console.log(res)
      //     setBalance('')
      //   })
      // } else {
      //   const token = fromHexAddress(selectCurrency.address)
      //   // console.log(token)
      //   getTrxTokenBalance({token: token,account}).then((res:any) => {
      //     // console.log(res)
      //     if (res?.constant_result) {
      //       const bl = '0x' + res?.constant_result[0]
      //       // console.log(BigAmount.format(dec, bl))
      //       setBalance(BigAmount.format(dec, bl))
      //     } else {
      //       setBalance('')
      //     }
      //   })
      // }
    }
  }, [selectCurrency, chainId, account])

  return useMemo(() => {
    if (!account || ![ChainId.TRX, ChainId.TRX_TEST].includes(chainId) || !routerToken) return {}
    return {
      balance: balance,
      execute: async () => {
        // let contract = await window?.tronWeb?.contract()
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          const TRXAccount = window?.tronWeb?.defaultAddress.base58
          const formatRouterToken = routerToken
          const formatInputToken = inputToken
          // const formatReceiveAddress = formatTRXAddress(receiveAddress)
          const formatReceiveAddress = receiveAddress
          if (TRXAccount.toLowerCase() === account.toLowerCase()) {
            let txResult:any = ''
            // const instance:any = await window?.tronWeb?.contract(isNaN(selectChain) ? ABI_TO_ADDRESS : ABI_TO_STRING, formatRouterToken)
            const instance:any = await window?.tronWeb?.contract('ABI_TO_STRING', formatRouterToken)
            try {
              if (destConfig.routerABI.indexOf('anySwapOutNative') !== -1) { // anySwapOutNative
                txResult = await instance.anySwapOutNative(...[formatInputToken, formatReceiveAddress, selectChain], {value: inputAmount}).send()
              } else if (destConfig.routerABI.indexOf('anySwapOutUnderlying') !== -1) { // anySwapOutUnderlying
                const parameArr = [formatInputToken, formatReceiveAddress, inputAmount, selectChain]
                console.log(parameArr)
                txResult = await instance.anySwapOutUnderlying(...parameArr).send()
              } else if (destConfig.routerABI.indexOf('anySwapOut') !== -1) { // anySwapOut
                const parameArr = [formatInputToken, formatReceiveAddress, inputAmount, selectChain]
                console.log(parameArr)
                txResult = await instance.anySwapOut(...parameArr).send()
              }
              const txReceipt:any = {hash: txResult}
              console.log(txReceipt)
              if (txReceipt?.hash) {
                const data:any = {
                  hash: txReceipt.hash,
                  chainId: chainId,
                  selectChain: selectChain,
                  account: TRXAccount,
                  value: inputAmount,
                  formatvalue: typedValue,
                  to: receiveAddress,
                  symbol: selectCurrency?.symbol,
                  version: destConfig.type,
                  pairid: selectCurrency?.symbol,
                  routerToken: routerToken
                }
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${typedValue} ${selectCurrency?.symbol}`,
                  value: typedValue,
                  toChainId: selectChain,
                  toAddress: receiveAddress.indexOf('0x') === 0 ? receiveAddress?.toLowerCase() : receiveAddress,
                  symbol: selectCurrency?.symbol,
                  version: 'swapin',
                  routerToken: routerToken,
                  token: selectCurrency?.address,
                  logoUrl: selectCurrency?.logoUrl,
                  isLiquidity: destConfig?.isLiquidity,
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
                recordsTxns(data)
                onChangeViewDtil(txReceipt?.hash, true)
              }
            } catch (error) {
              console.log(error);
              onChangeViewErrorTip('Txns failure.', true)
            }
          }
        } else {
          onChangeViewErrorTip('Please install TronLink.', true)
        }
      }
    }
  }, [receiveAddress, account, selectCurrency, inputAmount, chainId, routerToken, selectChain, destConfig, inputToken, balance])
}
