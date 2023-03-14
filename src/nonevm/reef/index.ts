
import { useCallback, useMemo, useState, useEffect, useRef } from "react"
import { useTranslation } from 'react-i18next'
import useInterval from '../../hooks/useInterval'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import {
  AppState,
  AppDispatch
} from '../../state'
// import {reefAddress} from './actions'
import { useActiveReact } from '../../hooks/useActiveReact'
import {nonevmAddress} from '../hooks/actions'
import {
  reefEvmAddress,
  reefClient,
  reefSigner
} from './actions'
import axios from "axios"
import config from "../../config"
import { ChainId } from "../../config/chainConfig/chainId"
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { tryParseAmount3 } from '../../state/swap/hooks'
import {BigAmount} from '../../utils/formatBignumber'
import {recordsTxns} from '../../utils/bridge/register'

import { Contract } from '@ethersproject/contracts'
// import ERC20_ABI from '../../constants/abis/erc20.json'

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

const ERC20_ABI = [{
  "constant": true,
  "inputs": [{ "name": "_owner", "type": "address" }],
  "name": "balanceOf",
  "outputs": [{ "name": "balance", "type": "uint256" }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}]

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


function getContract (account:any, chainId:any, tokenAddress:any, ABI:any) {
  return new Promise(async(resolve) => {
    const client = await init()
    const provider = new Provider({
      provider: new WsProvider(config.chainInfo[chainId].nodeRpcWs)
    })
    // const wallet = new Signer(provider, accountId, accountSigner)
    if (client && account && tokenAddress && ABI) {
      client?.reefSigner.subscribeSelectedSigner(async(signer:any) => {
        // console.log(signer)
        const wallet:any = new Signer(provider, account, signer)
        // console.log(wallet)
        const contract = new Contract(tokenAddress, ABI, wallet)
        resolve(contract)
      })
    } else {
      resolve('')
    }
  })
}

export function useReefClient () {
  const dispatch = useDispatch<AppDispatch>()
  const clientCount = useRef(0)
  return useCallback(async() => {
    init().then(client => {
      // console.log('clientCount',clientCount, client)
      if (client) {
        dispatch(reefClient({client}))
      } else {
        clientCount.current +=1
      }
    })
  }, [clientCount.current])
}

export function useReefSigner () {
  const dispatch = useDispatch<AppDispatch>()
  // const reefClient:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefClient)
  // const evmAccount:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefEvmAddress)
  return useCallback((client:any) => {
    // console.log(client)
    if (client) {
      client?.reefSigner.subscribeSelectedSigner(async(signer:any) => {
        // console.log(signer)
        dispatch(reefSigner({signer}))
      })
    }
  }, [])
}

export function useReefContract() {
  const reefSigner:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefSigner)
  return useCallback((chainId:any, account:any, tokenAddress:any, ABI:any) => {
    // console.log('reefSigner',reefSigner, chainId + '-chainId', account + '-account', tokenAddress + '-tokenAddress')
    if (
      chainId
      && account
      && tokenAddress
      && ABI
      && reefSigner
    ) {
      const provider = new Provider({
        provider: new WsProvider(config.chainInfo[chainId].nodeRpcWs)
      })
      const wallet:any = new Signer(provider, account, reefSigner)
            // console.log(wallet)
      const contract = new Contract(tokenAddress, ABI, wallet)
      return contract
    }
    return undefined
  }, [reefSigner])
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
  // const getContract  = useReefContract()
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

  // const getReefTokenBalance = useCallback(({chainId, account, token}: {chainId:any, account:any, token:any}) => {
  //   return new Promise(async(resolve) => {
  //     // console.log('evmAccount',evmAccount, token, account)
  //     if (account && token && chainId ) {
  //       const contract:any = getContract (chainId, account, token, ERC20_ABI)
  //       console.log('evmAccount',evmAccount)
  //       console.log(contract)
  //       if (contract){
  //         contract.balanceOf('0xeB33ef5Cd460F79C335bbcdcFC5f1a2EaDd6C6c5').then((res:any) => {
  //           console.log(res.toString())
  //           resolve(res.toString())
  //         }).catch((error:any) => {
  //           console.log(error.toString())
  //           resolve('')
  //         })
  //       } else {
  //         resolve('')
  //       }
  //     }
  //   })
  // }, [evmAccount, getContract])
  const getReefTokenBalance = useCallback(({chainId, account, token}: {chainId:any, account:any, token:any}) => {
    return new Promise(async(resolve) => {
      // console.log('evmAccount',evmAccount, token, account)
      
      // axios.post(config.chainInfo[chainId].nodeRpc,{
      //   id: 15,
      //   jsonrpc: "2.0",
      //   method: "evm_call",
      //   params: [{
      //     data: "0x70a08231000000000000000000000000eb33ef5cd460f79c335bbcdcfc5f1a2eadd6c6c5",
      //     from: "0xeb33ef5cd460f79c335bbcdcfc5f1a2eadd6c6c5",
      //     gasLimit: null,
      //     storageLimit: 0,
      //     to: "0x9a0f7fbc52324bad4c2c6dedf6f6f1a7a1f1b9fd",
      //     value: null
      //   }
      //   ]
      // }).then((res:any) => {
      // // axios.post(config.chainInfo[chainId].nodeRpc,{
      // //   data: "0x70a08231000000000000000000000000eb33ef5cd460f79c335bbcdcfc5f1a2eadd6c6c5",
      // //   from: "0xeb33ef5cd460f79c335bbcdcfc5f1a2eadd6c6c5",
      // //   gasLimit: null,
      // //   storageLimit: 0,
      // //   to: "0x9a0f7fbc52324bad4c2c6dedf6f6f1a7a1f1b9fd",
      // //   value: null
      // // }).then((res:any) => {
      //   console.log(res)
      // })
      if (account && token && chainId && evmAccount) {
        const contract:any = await getContract (account, chainId, token, ERC20_ABI)
        // console.log('evmAccount',evmAccount)
        // console.log(contract)
        if (contract){
          // console.log(contract.balanceOf(evmAccount))
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
  const setReefAllowance = useCallback((): Promise<any> => {
    return new Promise(async(resolve, reject) => {
      if (token && spender && account && chainId) {
        resolve('')
      } else {
        reject('')
      }
    })
  }, [token, spender, account, chainId])

  const getReefAllowance = useCallback(() => {
    return new Promise(async(resolve): Promise<any> => {
      resolve('')
    })
  }, [account, chainId, token, spender])

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
      })
      resolve(data)
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
  const {getReefTokenBalance, getReefBalance} = useReefBalance()
  const [balance, setBalance] = useState<any>()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  const getBalance = useCallback(() => {
    if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      if (selectCurrency?.tokenType === 'NATIVE' || selectCurrency?.address === 'near') {
        getReefBalance({account, chainId}).then((res:any) => {
          const dec = 18
          if (res && res.toString() !== '0') {
            // const blvalue = tryParseAmount3(res, dec)
            const bl = res ? BigAmount.format(dec, res.toString()) : undefined
            // console.log(bl?.toExact())
            setBalance(bl)
          } else {
            const bl = BigAmount.format(dec, '0')
            setBalance(bl)
          }
        })
      } else {
        getReefTokenBalance({chainId,account,token: selectCurrency?.address}).then((res:any) => {
          // console.log(contractId)
          // console.log(res)
          if (res) {
            // setBalance(BigAmount.format(selectCurrency?.decimals,res?.available))
            setBalance(BigAmount.format(selectCurrency?.decimals,res))
          } else {
            setBalance('')
          }
        })
      }
    }
  }, [selectCurrency, chainId, account])

  useEffect(() => {
    getBalance()
  }, [selectCurrency, chainId, account])

  useInterval(getBalance, 1000 * 10)

  let sufficientBalance:any = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }
  
// const api = await ApiPromise.create({ provider: wsProvider })
return useMemo(() => {
  if (!routerToken) return {}
    // console.log(provider)
    // const contract = new Contract(routerToken, REEF_ABI, provider as any)
    // console.log(contract)
    return {
      balance: '',
      execute: async () => {
        try {
          let txResult:any
          const contract:any = await getContract(account,chainId,routerToken,REEF_ABI)
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
              txResult = await contract.anySwapOut(...parameArr)
            }
          }
          // const client = await init()
          console.log(txResult)
          
          const txReceipt:any = {}
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
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, useToChainId])
}

enum SwapType {
  withdraw = 'withdraw',
  deposit = 'deposit',
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
  routerToken: string | null | undefined,
  selectCurrency: string | null | undefined,
  inputToken: string | null | undefined,
  typedValue: string | null | undefined,
  swapType: SwapType,
  selectChain: string | null | undefined,
  receiveAddress: string | null | undefined,
  destConfig: any,
): { execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, chainId } = useActiveReact()
  return useMemo(() => {
    return {
      balance: '',
      execute: async () => {
        console.log()
      },
      inputError: ''
    }
  }, [routerToken, inputToken, swapType, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, chainId])
}

interface PoolCalls {
  token: string | null | undefined,
  account: string | null | undefined,
  anytoken: string | null | undefined,
  dec: number
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
  const getReefPoolDatas = useCallback(async(calls: Array<[PoolCalls]>, chainId: string | null | undefined): Promise<PoolResult> => {
    console.log(calls)
    console.log(chainId)
    return {
      'anytoken': {
        balanceOf: '',
        totalSupply: '',
        balance: '',
      }
    }
  }, [])
  return {
    getReefPoolDatas
  }
}