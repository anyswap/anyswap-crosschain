
import { useCallback, useMemo } from 'react'
import {  useDispatch, useSelector } from 'react-redux'

import { AppState, AppDispatch } from '../../state'
import { useActiveReact } from '../../hooks/useActiveReact'
import { tryParseAmount3 } from '../../state/swap/hooks'
import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { BigAmount } from "../../utils/formatBignumber"
import { ChainId } from "../../config/chainConfig/chainId"

import {adaAddress} from './actions'

import * as typhonjs from '@stricahq/typhonjs'
// export const CardanoWasm = () => { // 路由懒加载
//   return () => Promise.resolve(require(`@emurgo/cardano-serialization-lib-nodejs`).default)
// }
// const CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs')
// import * as CardanoWasm from '@dcspark/cardano-multiplatform-lib-browser'
// import CardanoWasm from "@emurgo/cardano-serialization-lib-asmjs"
// import CardanoWasm from '@dcspark/cardano-multiplatform-lib-browser'
// import * as CardanoWasm from '@dcspark/cardano-multiplatform-lib-browser'
// const CardanoWasm = require('@dcspark/cardano-multiplatform-lib-browser')
console.log(typhonjs)
// console.log(CardanoWasm)

export function useAdaAddress () {
  const account:any = useSelector<AppState, AppState['ada']>(state => state.ada.adaAddress)
  return {
    adaAddress: account
  }
}

export function useAdaLogin() {
  const {chainId} = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => {
    const adaWallet = window?.cardano?.typhon
    // console.log(adaWallet)
    if (adaWallet?.enable) {
      adaWallet.enable().then((res:any) => {
        // console.log(res)
        if (res) {
          adaWallet.getNetworkId().then((res:any) => {
            // console.log(res)
            if (
              (res.data === 0 && ChainId.ADA_TEST === chainId)
              || (res.data === 1 && ChainId.ADA === chainId)
            ) {
              adaWallet.getAddress().then((res:any) => {
                // console.log(res)
                if (res) {
                  dispatch(adaAddress({address: res.data}))
                }
              })
            } else {
              alert('Network Error.')
            }
          })
        }
      })
    } else {
      if (confirm('Please connect Typhon or install Typhon.') === true) {
        // window.open('https://namiwallet.io/')
        window.open('https://typhonjs.io/#/download')
      }
    }
  }, [])
}

export function useAdaBalance () {
  const adaBalanceList:any = useSelector<AppState, AppState['ada']>(state => state.ada.adaBalanceList)
  const getAdaBalance = useCallback(() => {
    return new Promise(resolve => {
      const adaWallet = window?.cardano?.typhon
      if (adaWallet) {
        adaWallet.getBalance().then((res:any) => {
          // console.log(res)
          resolve(res)
        })
      } else {
        resolve('')
      }
    })
  }, [])

  return {
    getAdaBalance,
    adaBalanceList
    // getAdaTokenBalance
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
    let url = 'https://graphql-api.mainnet.dandelion.link/'
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

  const {adaBalanceList} = useAdaBalance()

  const adaWallet = window?.cardano?.typhon
  const addTransaction = useTransactionAdder()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  const useBalance = useMemo(() => {
    if (selectCurrency?.tokenType && adaBalanceList) {
      const dec = selectCurrency?.decimals
      if (selectCurrency?.tokenType === 'NATIVE' && adaBalanceList['NATIVE']) {
        return BigAmount.format(dec, adaBalanceList['NATIVE'])
      } else if (selectCurrency?.tokenType === 'TOKEN' && adaBalanceList[selectCurrency?.address]) {
        return BigAmount.format(dec, adaBalanceList[selectCurrency?.address])
      }
    }
    return ''
  }, [adaBalanceList, selectCurrency])

  return useMemo(() => {
    if (!account || ![ChainId.ADA, ChainId.ADA_TEST].includes(chainId) || !routerToken || !adaWallet) return {}
    return {
      balance: useBalance,
      execute: async () => {
        // let txResult:any = ''
        console.log(adaWallet)
        const MetaDatum:any =  {
          "bind": receiveAddress,
          "toChainId": selectChain
        }
        const auxDataCbor = typhonjs.utils
        .createAuxiliaryDataCbor({
          metadata: [
            {
              label: 123,
              data: MetaDatum,
            },
          ],
        })
        .toString("hex");
        const outputs = []
        if (selectCurrency?.tokenType === 'NATIVE') {
          outputs.push({
            address: routerToken,
            amount: inputAmount,
          })
        } else {
          const tokenArr = selectCurrency?.address.split('.')
          const tokenArrLen = tokenArr.length
          outputs.push({
            address: routerToken,
            amount: '2000000',
            tokens: [
              {
                assetName: tokenArrLen === 2 ? tokenArr[1] : '',
                policyId: tokenArr[0],
                amount: inputAmount,
              },
            ],
          })
        }
        const txResult = await adaWallet.paymentTransaction({
          auxiliaryDataCbor: auxDataCbor,
          outputs: [...outputs],
        });
        try {
          const txReceipt:any = {hash: txResult?.data?.transactionId}
          console.log(txReceipt)
          if (txReceipt?.hash) {
            const data:any = {
              hash: txReceipt.hash,
              chainId: chainId,
              selectChain: selectChain,
              account: account,
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
              version: destConfig.type,
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
    }
  }, [receiveAddress, account, selectCurrency, inputAmount, chainId, routerToken, selectChain, destConfig, inputToken, useBalance, adaWallet])
}
