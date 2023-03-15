
import { useCallback, useMemo, useState, useEffect, useRef } from "react"
import { useTranslation } from 'react-i18next'
// import useInterval from '../../hooks/useInterval'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import { MaxUint256 } from '@ethersproject/constants'
import {
  AppState,
  AppDispatch
} from '../../state'
// import {reefAddress} from './actions'
import { useActiveReact } from '../../hooks/useActiveReact'
import {nonevmAddress} from '../hooks/actions'
import {
  reefEvmAddress,
  // reefClient,
  // reefProvider
} from './actions'
import axios from "axios"
import config from "../../config"
import { ChainId } from "../../config/chainConfig/chainId"
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useAllTokenBalance } from '../../state/wallet/hooks'
import { tryParseAmount3 } from '../../state/swap/hooks'
import {BigAmount} from '../../utils/formatBignumber'
import {recordsTxns} from '../../utils/bridge/register'

// import { Contract } from '@ethersproject/contracts'
import { Contract } from "ethers"
import ERC20_ABI from '../../constants/abis/erc20.json'
import {VALID_BALANCE} from '../../config/constant'

import REEF_ABI from './abi.json'
// import {web3Enable} from "@reef-defi/extension-dapp";
// import {REEF_EXTENSION_IDENT} from "@reef-defi/extension-inject"
// import {resolveAddress, resolveEvmAddress} from "@reef-defi/evm-provider/utils";
// import { ApiPromise, WsProvider } from '@polkadot/api'
import {
  // TestAccountSigningKey,
  Provider,
  Signer,
} from "@reef-defi/evm-provider"
const { WsProvider } =  require('@polkadot/api')
// import { options } from '@reef-defi/api'
// const { options } = require('@reef-defi/api')
// const {
//   resolveAddress,
//   // resolveEvmAddress
// } = require("@reef-defi/evm-provider/utils")
// const {REEF_EXTENSION_IDENT} = require("@reef-defi/extension-inject")
const REEF_EXTENSION_IDENT = 'reef'
const {web3Enable} = require('@reef-defi/extension-dapp')
// console.log(web3Enable)
// console.log(REEF_EXTENSION_IDENT)

// let reefExtension:any

const reefAddress = /(^[0-9a-zA-Z]{48})$|(^0x[0-9a-zA-Z]{40})$/
export function isReefAddress (address:string):boolean | string {
  return reefAddress.test(address) //true: address; false: false
}

async function init () {
  const appName = 'Multichain App'
  const extensionsArr:any = await web3Enable(appName);
  if (extensionsArr) {
    return extensionsArr.find((e:any)=>e.name===REEF_EXTENSION_IDENT)
  }
  return undefined
}

let reefProvider:any
let reefClient:any

// function getContract (account:any, chainId:any, tokenAddress:any, ABI:any) {
//   return new Promise(async(resolve) => {
//     const client = await init()
//     const provider = new Provider({
//       provider: new WsProvider(config.chainInfo[chainId].nodeRpcWs)
//     })
//     await provider.api.isReadyOrError
//     if (client && account && tokenAddress && ABI) {
//       // console.log(client , account , tokenAddress , ABI)
//       const wallet:any = new Signer(provider, account, client.signer)
//       // console.log(wallet)
//       const contract = new Contract(tokenAddress, ABI, wallet)
//       resolve(contract)
//     } else {
//       resolve('')
//     }
//   })
// }

export function useReefClient () {
  // const dispatch = useDispatch<AppDispatch>()
  const clientCount = useRef(0)
  return useCallback(async() => {
    init().then(client => {
      // console.log('clientCount',clientCount, client)
      if (client) {
        // dispatch(reefClient({client}))
        reefClient = client
      } else {
        clientCount.current +=1
      }
    })
  }, [clientCount.current])
}

export function useReefProvider () {
  // const dispatch = useDispatch<AppDispatch>()
  const clientCount = useRef(0)
  return useCallback(async(chainId) => {
    const provider = new Provider({
      provider: new WsProvider(config.chainInfo[chainId].nodeRpcWs)
    })
    provider.api.isReadyOrError.then((res:any) => {
      console.log(res)
      // dispatch(reefProvider({provider}))
      reefProvider = provider
    }).catch((error:any) => {
      console.log(error)
      clientCount.current +=1
    })
  }, [clientCount.current])
}

export function useReefContract() {
  // const reefProvider:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefProvider)
  // const reefClient:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefClient)
  return useCallback((tokenAddress:any, ABI:any,account?:any) => {
    // console.log('reefSigner',reefSigner, chainId + '-chainId', account + '-account', tokenAddress + '-tokenAddress')
    account = account ? account : '5E1eMGGH6ug3GmLRDdgkfV22LjnX8ss2kP1cJr4iQsTRkzyW'
    if (
      account
      && tokenAddress
      && ABI
      && reefProvider
      && reefClient
    ) {
      const wallet:any = new Signer(reefProvider, account, reefClient.signer)
      const contract = new Contract(tokenAddress, ABI, wallet)
      return contract
    }
    return undefined
  }, [reefProvider, reefClient])
}

/**
 * Connect wallet and get account address
 */
export function useLoginReef () {
  const dispatch = useDispatch<AppDispatch>()
  const loginReef = useCallback(async(chainId, type?:any) => {
    // const appName = 'Multichain Bridge App'
    const client = await init()
    // const extensionsArr:any = await web3Enable(appName);
    // console.log(client)
    if (client) {
      client.reefSigner.subscribeSelectedAccount(
        (account:any) => {
          if (account) {
            // console.log(account)
            dispatch(nonevmAddress({account: account?.address, chainId}));
          }
        }
      )
    } else if (!type) {
      if (confirm('Please install Reef Wallet.') === true) {
        window.open('https://app.reef.io/')
      }
    }
    // dispatch(nonevmAddress({account: '', chainId}));
  }, [])
  return {
    loginReef
  }
}

/**
 * Get native balance and token balance
 *
 * @param account wallet address
 * @param token token address
 */
export function useReefBalance () {
  const dispatch = useDispatch<AppDispatch>()
  const evmAccount:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefEvmAddress)
  // console.log(evmAccount)
  const getContract  = useReefContract()
  const getReefBalance = useCallback(({account, chainId}: {account:string|null|undefined, chainId:any}) => {
    return new Promise(async(resolve) => {
      if (!account || ![ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
        resolve('')
      } else {
        axios.post(config.chainInfo[chainId].nodeRpc,{
          extensions: {},
          operationName: "account",
          query: `query account($address: String!) {
            account(
              where: {_or: [{address: {_ilike: $address}}, {evm_address: {_ilike: $address}}]}
            ) {
              address
              evm_address
              available_balance
              free_balance
              locked_balance
              block_id
              timestamp
              nonce
              identity
              evm_nonce
              free_balance
              available_balance
              locked_balance
              reserved_balance
              vested_balance
              voting_balance
              __typename
            }
          }`,
          variables: {address: account}
        },
        // {headers: {
        //   Authorization: process.env.REACT_APP_REEF_NETWORK_KEY
        // }}
        ).then((result:any) => {
          // console.log(result)
          const {data: res} = result
          if (res?.data?.account?.[0]) {
            // console.log(res?.data?.account?.[0].evm_address)
            dispatch(reefEvmAddress({address: res?.data?.account?.[0].evm_address}));
            resolve(res?.data?.account?.[0].available_balance)
          } else {
            resolve('')
          }
        }).catch((error:any) => {
          console.log(error)
          resolve('')
        })
      }
    })
  }, [dispatch]) 

  const getReefTokenBalance = useCallback(({chainId, account, token}: {chainId:any, account:any, token:any}) => {
    return new Promise(async(resolve) => {
      // console.log('evmAccount',evmAccount, token, account)
      if (account && token && chainId ) {
        const contract:any = getContract (token, ERC20_ABI, account)
        // console.log('evmAccount',evmAccount)
        // console.log(contract)
        if (contract){
          contract.balanceOf(evmAccount).then((res:any) => {
            console.log(res.toString())
            resolve(res.toString())
          }).catch((error:any) => {
            console.log(error.toString())
            resolve('')
          })
        } else {
          resolve('')
        }
      }
    })
  }, [evmAccount, getContract])
  return {
    getReefBalance,
    getReefTokenBalance
  }
}

/**
 * Authorization and obtaining authorization information
 *
 * @param account wallet address
 * @param token token address
 * @param spender spender address
 */
export function useReefAllowance(
  token: string | null | undefined,
  spender: string | null | undefined,
  chainId: string | null | undefined,
  account: string | null | undefined,
) {
  const evmAccount:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefEvmAddress)
  const getContract  = useReefContract()
  const setReefAllowance = useCallback((): Promise<any> => {
    return new Promise(async(resolve, reject) => {
      // console.log('evmAccount',evmAccount, token, account)
      if (account && token && chainId ) {
        const contract:any = getContract (token, ERC20_ABI, account)
        if (contract){
          contract.approve(token, MaxUint256.toString()).then((res:any) => {
            console.log(res)
            resolve(res)
          }).catch((error:any) => {
            console.log(error.toString())
            reject(error)
          })
        } else {
          reject('')
        }
      }
    })
  }, [token, spender, account, chainId, evmAccount, getContract])

  const getReefAllowance = useCallback(() => {
    return new Promise(async(resolve) => {
      // console.log('evmAccount',evmAccount, token, account)
      if (account && token && chainId ) {
        const contract:any = getContract (token, ERC20_ABI, account)
        if (contract){
          contract.allowance(account, token).then((res:any) => {
            console.log(res)
            resolve(res)
          }).catch((error:any) => {
            console.log(error.toString())
            resolve('')
          })
        } else {
          resolve('')
        }
      }
    })
  }, [account, chainId, token, spender, evmAccount, getContract])

  return {
    setReefAllowance,
    getReefAllowance,
  }
}

/**
 * Get transaction info
 *
 * @param txid transaction hash
 */
export function getReefTxnsStatus (txid:string, chainId:any) {
  return new Promise(resolve => {
    const data:any = {}
    if (txid) {
      axios.post(config.chainInfo[chainId].nodeRpc,{
      // axios.post('https://squid.subsquid.io/reef-bridge/v/v1/graphql',{
        extensions: {},
        operationName: "extrinsic",
        query: `query extrinsic($hash: String!)
          {
            extrinsic(where: {hash: {_eq: $hash}}) {
              id
              block_id
              index
              signer
              section
              method
              args
              hash
              docs
              type
              timestamp
              error_message
              signed_data
              __typename
            }
          }
        `,
        variables: {hash: txid},
      },
      // {headers: {
      //   Authorization: process.env.REACT_APP_REEF_NETWORK_KEY
      // }}
      ).then((result:any) => {
        const {data: res} = result
        console.log(res)
        if (res?.data?.extrinsic) {
          if (res?.data?.extrinsic.length > 0) {
            data.msg = 'Success'
            data.info = res?.data
          } else {
            data.msg = 'Null'
            data.error = 'Query is empty!'
          }
        } else {
          data.msg = 'Null'
          data.error = 'Query is empty!'
        }
        resolve(data)
      })
    }
  })
}

// getReefTxnsStatus('0x6cbb6fa45504921b8f44822fe5e56ea9408ddf9b35845f3495a6aea0410bd9b6', 'REEF')

/**
 * Cross chain 
 *
 * @param routerToken router token address
 * @param inputToken any or underlying address
 * @param selectCurrency select current token info
 * @param selectChain to chainId
 * @param receiveAddress receive address
 * @param typedValue typed Value
 * @param destConfig to chain info
 */
export function useReefCrossChain (
  routerToken: string | null | undefined,
  inputToken: string | null | undefined,
  selectCurrency: any,
  selectChain: string | null | undefined,
  receiveAddress: string | null | undefined,
  typedValue: any,
  destConfig: any,
  useToChainId: any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { account, chainId } = useActiveReact()

  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()
  // const {getReefTokenBalance, getReefBalance} = useReefBalance()
  const [balance, setBalance] = useState<any>()
  const getContract  = useReefContract()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])
  const {getTokenBalance} = useAllTokenBalance()
  const getBalance = useCallback(() => {
    if (selectCurrency && [ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      const result = getTokenBalance(chainId,selectCurrency?.address,account)
      const dec = selectCurrency?.decimals ?? 0
      // console.log(result)
      let bl = BigAmount.format(dec, '0')
      if (result) {
        bl = BigAmount.format(result.decimals, result.balance)
      }
      setBalance(bl)
    }
  }, [selectCurrency, chainId, account, getTokenBalance])

  useEffect(() => {
    getBalance()
  }, [selectCurrency, chainId, account, getTokenBalance])

  // useInterval(getBalance, 1000 * 10)

  let sufficientBalance:any = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }
  
// const api = await ApiPromise.create({ provider: wsProvider })
return useMemo(() => {
  // console.log(routerToken)
  if (!routerToken || !account || !inputToken) return {}
    // const contract = new Contract(routerToken, REEF_ABI, provider as any)
    // console.log(contract)
    return {
      balance: '',
      execute: async () => {
        try {
          let txResult:any

          const contract:any = await getContract(routerToken,REEF_ABI, account)
          // console.log(contract)
          if (contract) {
            if (destConfig.routerABI.indexOf('anySwapOutNative') !== -1) { // anySwapOutNative
              txResult = await contract.anySwapOutNative(...[inputToken, receiveAddress, useToChainId], {value: inputAmount})
            } else if (destConfig.routerABI.indexOf('anySwapOutUnderlying') !== -1) { // anySwapOutUnderlying
              const parameArr = [inputToken, receiveAddress, inputAmount, useToChainId]
              console.log(parameArr)
              txResult = await contract.anySwapOutUnderlying(...parameArr)
            } else if (destConfig.routerABI.indexOf('anySwapOut') !== -1) { // anySwapOut
              const parameArr = [inputToken, receiveAddress, inputAmount, useToChainId]
              console.log(parameArr)
              // txResult = await contract.anySwapOut(inputToken, receiveAddress, inputAmount, useToChainId)
              txResult = await contract.anySwapOut(...parameArr)
            }
          }
          // const client = await init()
          console.log(txResult)
          
          const txReceipt:any = {hash: txResult.hash}
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
              toAddress: receiveAddress?.indexOf('0x') === 0 ? receiveAddress?.toLowerCase() : receiveAddress,
              symbol: selectCurrency?.symbol,
              version: destConfig?.type,
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
          // reject(error)
          console.log(error)
          onChangeViewErrorTip('Txns failure.', true)
        }
      },
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, useToChainId, getContract])
}

/**
 * Cross chain 
 *
 * @param routerToken router token address
 * @param selectCurrency select current token info
 * @param inputToken any or underlying address
 * @param typedValue typed Value
 * @param swapType deposit or withdraw
 * @param selectChain to chainId
 * @param receiveAddress receive address
 * @param destConfig to chain info
 */
export function useReefSwapPoolCallback(
  routerToken: any,
  selectCurrency: any,
  inputToken: any,
  typedValue: any,
  swapType: any,
  selectChain: any,
  receiveAddress: any,
  destConfig: any,
  useToChainId: any,
): { execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, chainId } = useActiveReact()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const { t } = useTranslation()
  const [balance, setBalance] = useState<any>()
  // console.log(balance)
  // console.log(selectCurrency)
  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [selectCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  const getContract  = useReefContract()

  const {getTokenBalance} = useAllTokenBalance()
  const getBalance = useCallback(() => {
    if (selectCurrency && [ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      const result = getTokenBalance(chainId,selectCurrency?.address,account)
      const dec = selectCurrency?.decimals ?? 0
      // console.log(result)
      let bl = BigAmount.format(dec, '0')
      if (result) {
        bl = BigAmount.format(result.decimals, result.balance)
      }
      setBalance(bl)
    }
  }, [selectCurrency, chainId, account, getTokenBalance])

  useEffect(() => {
    getBalance()
  }, [selectCurrency, chainId, account, getTokenBalance])
  
  return useMemo(() => {
    // console.log(routerToken)
    // console.log(bridgeContract)
    // console.log(chainId)
    // console.log(selectCurrency)
    // console.log(swapType)
    // console.log(balance)
    // console.log(inputAmount)
    
    if (!chainId || !selectCurrency || !swapType) return {}
    // console.log(typedValue)

    const sufficientBalance = typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
    // console.log(sufficientBalance)
    return {
      wrapType: '',
      execute:
      (sufficientBalance || !VALID_BALANCE) && inputAmount
        ? async () => {
            try {
              const formatInputToken = inputToken
              let txResult:any
              const contract:any = getContract(routerToken,REEF_ABI, account)
              if (contract) {
                if (selectCurrency?.tokenType === 'NATIVE') {
                  if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {
                    const parameArr = [formatInputToken, receiveAddress, useToChainId]
                    txResult = await contract.anySwapOutNative(...parameArr, {value: inputAmount})
                  } else {
                    txResult = swapType === 'deposit' ? await contract.depositNative(...[inputToken, account], {value: inputAmount}) : await contract.withdrawNative(inputToken,inputAmount,account)
                  }
                } else {
                  if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {
                    const parameArr = [formatInputToken, receiveAddress, inputAmount, useToChainId]
                    txResult = await contract.anySwapOut(...parameArr)
                  } else {
                    txResult = swapType === 'deposit' ? await contract.deposit(inputAmount) : await contract.withdraw(inputAmount)
                  }
                }
              }
              const txReceipt:any = {hash: txResult?.hash}
              console.log(txReceipt)
              if (txReceipt?.hash) {

                if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {
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
                  recordsTxns(data)
                  onChangeViewDtil(txReceipt?.hash, true)
                } else {
                  addTransaction(txReceipt, { summary: `${swapType === 'deposit' ? 'Deposit' : 'Withdraw'} ${typedValue} ${config.getBaseCoin(selectCurrency?.symbol, chainId)}` })
                }
              }
            } catch (error) {
              console.log('Could not swapout', error)
              onChangeViewErrorTip(error, true)
            }
          }
        : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [chainId, selectCurrency, inputAmount, balance, addTransaction, t, inputToken, account, routerToken, selectChain, destConfig, useToChainId,  getContract])
}


interface PoolResult {
  [key:string]: {
    balanceOf: string,
    totalSupply: string,
    balance: string,
  }
}

/**
 * Get pool info
 *
 * @param chainId router token address
 * @param calls [{token: '', anytoken: '', account: ''}]
 * @return {'anytoken': {'balanceOf': '', 'totalSupply': '', 'balance': ''}}
 */
export function useReefPoolDatas () {
  const getContract  = useReefContract()
  const getReefPoolDatas = useCallback(async(calls: Array<[any]>, chainId: any): Promise<PoolResult> => {
    
    return new Promise(resolve => {
      const arr = []
      const labelArr:any = []
      // console.log(calls)
      if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId) ) {
        // console.log(calls)
        // const useAccount = window.tronWeb.defaultAddress.base58
        for (const obj of calls) {
          const item:any = obj
          const anytoken = item.anytoken
          const underlyingToken = item.token
          const account = item.account
          if (underlyingToken && anytoken) {
            const contract:any = getContract(underlyingToken,REEF_ABI, account)
            arr.push(contract.balanceOf(anytoken))
            labelArr.push({
              key: anytoken,
              label: 'balanceOf',
              dec: item.dec
            })
            arr.push(contract.totalSupply())
            labelArr.push({
              key: anytoken,
              label: 'totalSupply',
              dec: item.dec
            })
          }
          // console.log(item)
          // console.log(chainId)
          if (anytoken && isReefAddress(account)) {
            const contract:any = getContract(anytoken,REEF_ABI, account)
            arr.push(contract.balanceOf(account).call())
            labelArr.push({
              key: anytoken,
              label: 'balance',
              dec: item.dec
            })
          }
        }
      }
      // console.log(arr)
      Promise.all(arr).then(res => {
        // console.log(res)
        const list:any = {}
        for (let i = 0, len = arr.length; i < len; i++) {
          const k = labelArr[i].key
          const l = labelArr[i].label
          // const dec = labelArr[i].dec
          if (!list[k]) list[k] = {}
          // list[k][l] = res[i] ? BigAmount.format(dec, res[i].toString()).toExact() : ''
          list[k][l] = res[i].toString()
        }
        // console.log(list)
        resolve(list)
      })
    })
  }, [])
  return {
    getReefPoolDatas
  }
}