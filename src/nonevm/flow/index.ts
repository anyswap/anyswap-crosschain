import { useCallback, useState, useMemo, useEffect } from "react";
import * as fcl from "@onflow/fcl"
import { useTranslation } from 'react-i18next'
import {
  // useDispatch,
  useSelector
} from 'react-redux'
// import { useTranslation } from 'react-i18next'
import {
  AppState,
  // AppDispatch
} from '../../state'
// import { ChainId } from "../../config/chainConfig/chainId";
import config from "../../config";
import { useActiveReact } from '../../hooks/useActiveReact'
import { tryParseAmount3 } from '../../state/swap/hooks'
import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { BigAmount } from "../../utils/formatBignumber"
import { ChainId } from "../../config/chainConfig/chainId"
// import {
//   flowAddress
// } from './actions'

export function useLoginFlow () {
  const loginFlow = useCallback(() => {
    fcl.authenticate()
  }, [])

  const logoutFlow = useCallback(() => {
    fcl.unauthenticate()
  }, [])
  return {
    loginFlow,
    logoutFlow
  }
}

export function useFlowAddress () {
  const account:any = useSelector<AppState, AppState['flow']>(state => state.flow.flowAddress)
  return {
    flowAddress: account
  }
}

export function useFlowBalance () {
  const flowBalanceList:any = useSelector<AppState, AppState['flow']>(state => state.flow.flowBalanceList)
  // console.log(flowBalanceList)

  const getFlowTokenBalance = useCallback((account) => {
    return new Promise(resolve => {
      fcl.query({
        cadence: `
          import FungibleToken from 0xFungibleToken
          pub fun main(account:Address):UFix64 {
            // Get the accounts' public account objects
            let recipient = getAccount(account)
            let receiverRef = recipient.getCapability<&{FungibleToken.Balance}>(/public/exampleTokenBalance)
            let tokenBalance=receiverRef.borrow()??panic("get receiver for capability fails")
            return tokenBalance.balance
          }
        `,
        args: (arg:any, t:any) => [arg(account, t.Address)],
      }).then((res:any) => {
        console.log(res)
        resolve(res)
      }).catch((err:any) => {
        console.log(err)
        resolve('')
      })
    })
  }, [])

  return {
    flowBalanceList,
    getFlowTokenBalance
  }
}

export function getFLOWTxnsStatus (txid:string, chainId:any) {
  const data:any = {
    msg: 'Error',
    info: ''
  }
  return new Promise(resolve => {
    const url = `${config.chainInfo[chainId].nodeRpc}/transaction_results/${txid}`
    fetch(url).then(res => res.json()).then(json => {
      console.log(json)
      if (json) {
        if (json.execution === 'Failure') {
          data.msg = 'Failure'
          data.error = 'Txns is failure!'
        } else if (json.execution === 'Success') {
          data.msg = 'Success'
          data.info = json
        } else {
          data.msg = 'Null'
          data.error = 'Query is empty!'
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

export function useSendFlowTxns () {
  const transferFn = useCallback((receiveAddress:any, amount:any) => {
    // console.log(receiveAddress)
    // console.log(amount)
    return new Promise(resolve => {
      fcl.mutate({
        cadence: `
          import FungibleToken from 0xFungibleToken
          import FlowToken from 0xFlowToken
          transaction(receiveAddress:Address, amount:UFix64 ) {
            let sentVault: @FungibleToken.Vault
            prepare(signer: AuthAccount) {
                let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
              ?? panic("Could not borrow reference to the owner''s Vault!")
                self.sentVault <- vaultRef.withdraw(amount: amount)
            }
            execute {
                let receiverRef =  getAccount(receiveAddress)
                    .getCapability(/public/flowTokenReceiver)
                    .borrow<&{FungibleToken.Receiver}>()
              ?? panic("Could not borrow receiver reference to the recipient''s Vault")
                receiverRef.deposit(from: <-self.sentVault)
            }
          }
        `,
        args: (arg:any, t:any) => [arg(receiveAddress, t.Address), arg(amount.toFixed(8), t.UFix64)],
      }).then((res:any) => {
        console.log(res)
        resolve(res)
      }).catch((err:any) => {
        console.log(err)
      })
    })
  }, [])
  const swapoutFn = useCallback((routerToken:any, anyToken:any, receiveAddress:any, amount:any, toChainId:any) => {
    return new Promise(resolve => {
      fcl.mutate({
        cadence: `
          import FungibleToken from 0xFungibleToken
          import FlowToken from 0xFlowToken
          import Router from ${routerToken}
          transaction(routerToken:String, anyToken:String, receiveAddress:String, amount:UFix64, toChainId:UInt64) {
            let vaultRef: &{FungibleToken.Provider}
            let vaultStoragePath:StoragePath
            prepare(acct: AuthAccount) {
                self.vaultStoragePath= /storage/exampleTokenVault
                self.vaultRef = acct.borrow<&{FungibleToken.Provider}>(from:self.vaultStoragePath)
                                        ?? panic("Could not borrow a reference to the owner's vault")
            }
            execute {
                log("vaultStoragePath:".concat(self.vaultStoragePath.toString()))
                let temporaryVault <- self.vaultRef.withdraw(amount: amount)
                Router.swapOut(token:anyToken,to: receiveAddress,toChainId:toChainId,value:<-temporaryVault)
            }
          }
        `,
        args: (arg:any, t:any) => [arg(routerToken, t.String), arg(anyToken, t.String), arg(receiveAddress, t.String), arg(amount.toFixed(8), t.UFix64), arg(toChainId, t.UInt64)],
      }).then((res:any) => {
        console.log(res)
        resolve(res)
      }).catch((err:any) => {
        console.log(err)
      })
    })
  }, [])
  return {
    transferFn,
    swapoutFn
  }
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
  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()

  const addTransaction = useTransactionAdder()
  const {swapoutFn} = useSendFlowTxns()
  const {getFlowTokenBalance} = useFlowBalance()

  const inputValue = typedValue

  const [balance, setBalance] = useState<any>()

  useEffect(() => {
    if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(chainId)) {
      getFlowTokenBalance(account).then((res:any) => {
        // console.log(res)
        const dec = selectCurrency?.decimals
        // console.log(token)
        // console.log(res?.[token]?.balance)
        if (res) {
          const blvalue = tryParseAmount3(res, dec)
          const bl = res ? BigAmount.format(dec, blvalue) : undefined
          setBalance(bl)
        } else {
          setBalance(0)
        }
      })
    }
  }, [selectCurrency, account, chainId])

  const inputAmount = useMemo(() => tryParseAmount3(inputValue + '', selectCurrency?.decimals), [inputValue, selectCurrency])

  let sufficientBalance:any = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(inputValue))
  } catch (error) {
    console.log(error)
  }
  return useMemo(() => {
    if (!account || ![ChainId.FLOW, ChainId.FLOW_TEST].includes(chainId) || !routerToken ) return {}
    return {
      balance: balance,
      execute: async () => {
        try {
          
          const txResult:any = await swapoutFn(routerToken, inputToken, receiveAddress, typedValue, selectChain)
          console.log(txResult)
          if (txResult?.status) {
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
          } else {
            // onChangeViewErrorTip('Txns failure.', true)
            onChangeViewErrorTip(JSON.stringify(txResult), true)
          }
        } catch (error) {
          console.log(error);
          onChangeViewErrorTip('Txns failure.', true)
        }
      },
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [receiveAddress, account, selectCurrency, inputAmount, chainId, routerToken, selectChain, destConfig, inputToken, balance])
}
