
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { AppState, AppDispatch } from '../../state'
import { useActiveReact } from '../../hooks/useActiveReact'
import { tryParseAmount3 } from '../../state/swap/hooks'
import { recordsTxns } from '../../utils/bridge/register'
import { useTxnsDtilOpen, useTxnsErrorTipOpen } from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { BigAmount } from "../../utils/formatBignumber"
import { ChainId } from "../../config/chainConfig/chainId"

import { adaAddress } from './actions'

// import * as typhonjs from '@stricahq/typhonjs'
// export const CardanoWasm = () => { // 路由懒加载
//   return () => Promise.resolve(require(`@emurgo/cardano-serialization-lib-nodejs`).default)
// }
// const CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs')
// import * as CardanoWasm from '@dcspark/cardano-multiplatform-lib-browser'
// import CardanoWasm from "@emurgo/cardano-serialization-lib-asmjs"
// import CardanoWasm from '@dcspark/cardano-multiplatform-lib-browser'
// import * as CardanoWasm from '@dcspark/cardano-multiplatform-lib-browser'
// const CardanoWasm = require('@dcspark/cardano-multiplatform-lib-browser')
// console.log(typhonjs)
// console.log(CardanoWasm)

export function useAdaAddress() {
  const account: any = useSelector<AppState, AppState['ada']>(state => state.ada.adaAddress)
  return {
    adaAddress: account
  }
}

export async function eternlLogin() {
  try {
    const api = await window.cardano.eternl.enable();
    window.lucid.selectWallet(api);
    localStorage.setItem("lucid", "true");
  } catch (error) {
    console.log(error)
  }
  
}

export function useAdaLogin() {
  // const api = await window.cardano.eternl.enable();
  // window.lucid.selectWallet(api);
  const { chainId } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => {
    const adaWallet =  window?.cardano && window?.cardano?.eternl

    if(window?.lucid && window?.lucid?.wallet === undefined) {
      eternlLogin();
      return;
    }

    if (adaWallet && adaWallet?.enable && window?.lucid && window?.lucid?.wallet) {
      
      if (
        (ChainId.ADA_TEST === chainId) || (ChainId.ADA === chainId)
      ) {
        window.lucid.wallet.getUtxos().then((e: any) => {
          if (e && e.length > 0) {
            dispatch(adaAddress({ address: e[0].address }))
          }
        })
      } else {
        alert('Network Error.')
      }

    } else {
      if (confirm('Please connect Eternl or install Eternl.') === true) {
        // window.open('https://namiwallet.io/')
        window.open('https://eternl.io/')
      }
    }
  }, [])
}

export function useAdaBalance() {
  const adaBalanceList: any = useSelector<AppState, AppState['ada']>(state => state.ada.adaBalanceList)

  return {
    adaBalanceList
    // getAdaTokenBalance
  }
}

export function getADATxnsStatus(txid: string, chainId: any) {
  const data: any = {
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

const baseValue = 2

export function useAdaCrossChain(
  routerToken: any,
  inputToken: any,
  chainId: any,
  selectCurrency: any,
  selectChain: any,
  receiveAddress: any,
  typedValue: any,
  destConfig: any,
  useToChainId: any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { account } = useActiveReact()
  const { t } = useTranslation()
  const { onChangeViewDtil } = useTxnsDtilOpen()
  const { onChangeViewErrorTip } = useTxnsErrorTipOpen()

  const { adaBalanceList } = useAdaBalance()

  const adaWallet = window?.cardano && window?.cardano?.eternl
  const addTransaction = useTransactionAdder()

  const inputValue = selectCurrency?.tokenType === 'NATIVE' ? Number(typedValue) + baseValue : typedValue

  const inputAmount = useMemo(() => tryParseAmount3(inputValue + '', selectCurrency?.decimals), [inputValue, selectCurrency])

  const useBalance = useMemo(() => {
    if (selectCurrency?.tokenType && adaBalanceList) {
      const dec = selectCurrency?.decimals
      if (selectCurrency?.tokenType === 'NATIVE' && adaBalanceList['NATIVE']) {
        return BigAmount.format(dec, adaBalanceList['NATIVE'])
      } else if (selectCurrency?.tokenType === 'TOKEN' && adaBalanceList[selectCurrency?.address]) {
        console.log(adaBalanceList)
        return BigAmount.format(dec, adaBalanceList[selectCurrency?.address])
      }
    }
    return ''
  }, [adaBalanceList, selectCurrency])
  let sufficientBalance: any = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && useBalance && (Number(useBalance?.toExact()) >= Number(inputValue))
  } catch (error) {
    console.log(error)
  }
  return useMemo(() => {
    if (!account || ![ChainId.ADA, ChainId.ADA_TEST].includes(chainId) || !routerToken || !adaWallet || !useToChainId) return {}
    return {
      balance: useBalance,
      execute: async () => {
        // let txResult:any = ''
        console.log(adaWallet)

        try {
          // const MetaDatum: any = {
          //   "bind": receiveAddress,
          //   "toChainId": useToChainId + ''
          // }
          // const auxDataCbor = typhonjs.utils
          // .createAuxiliaryDataCbor({
          //   metadata: [
          //     {
          //       label: 123,
          //       data: MetaDatum,
          //     },
          //   ],
          // })
          // .toString("hex");
          let tx = undefined;
          if (selectCurrency?.tokenType === 'NATIVE') {
            tx = await window.lucid.newTx().payToContract(
              routerToken,
              {
                inline: window.lucid.data.to(BigInt(0)),
              },
              { lovelace: BigInt(inputAmount) })
              .attachMetadata(123, {
                "bind": receiveAddress,
                "toChainId": useToChainId + ''
              })
              .complete();
          } else {
            const tokenArr = selectCurrency?.address.split('.');
            const tokenObj: any = {};
            // const decimals = selectCurrency.decimals;
            tokenObj[tokenArr[0] + tokenArr[1]] = BigInt(inputAmount);
            tx = await window.lucid.newTx().payToContract(
              routerToken,
              {
                inline: window.lucid.data.to(BigInt(0)),
              },
              tokenObj)
              .attachMetadata(123, {
                "bind": receiveAddress,
                "toChainId": useToChainId + ''
              })
              .complete();
          }

          const signedTx = await tx.sign().complete();
          const txHash = await signedTx.submit();
          const txResult = {
            data: {
              transactionId: txHash
            },
            status: true,
          }
          // const txResult = await adaWallet.paymentTransaction({
          //   auxiliaryDataCbor: auxDataCbor,
          //   outputs: [...outputs], 
          // });
          console.log(txResult)
          if (txResult?.status) {
            const txReceipt: any = { hash: txResult?.data?.transactionId }
            console.log(txReceipt)
            if (txReceipt?.hash) {
              const data: any = {
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
          } else {
            // onChangeViewErrorTip('Txns failure.', true)
            onChangeViewErrorTip(JSON.stringify(txResult), true)
          }
        } catch (error) {
          console.log(error);
          onChangeViewErrorTip('Txns failure.', true)
        }
      },
      inputError: sufficientBalance ? undefined : t('Insufficient', { symbol: selectCurrency?.symbol })
    }
  }, [receiveAddress, account, selectCurrency, inputAmount, chainId, routerToken, selectChain, destConfig, inputToken, useBalance, adaWallet, useToChainId])
}
