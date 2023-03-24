
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
// import {getContract as getEvmContract} from '../../utils/tools/web3UtilsV2'

// import { Contract } from '@ethersproject/contracts'
import {
  Contract,
  // utils
} from "ethers"
import ERC20_INTERFACE from '../../constants/abis/erc20'
import ERC20_ABI from '../../constants/abis/erc20.json'
// import {VALID_BALANCE} from '../../config/constant'
import {
  // useDarkModeManager,
  // useExpertModeManager,
  // useInterfaceModeManager,
  useInterfaceBalanceValidManager
  // useUserTransactionTTL,
  // useUserSlippageTolerance
} from '../../state/user/hooks'

import REEF_ABI from './abi.json'
// import {web3Enable} from "@reef-defi/extension-dapp";
// import {REEF_EXTENSION_IDENT} from "@reef-defi/extension-inject"
// import {resolveAddress, resolveEvmAddress} from "@reef-defi/evm-provider/utils";
// import { ApiPromise, WsProvider } from '@polkadot/api'
import {
  // TestAccountSigningKey,
  Provider,
  Signer,
  // sendTransaction
} from "@reef-defi/evm-provider"
// import {
//   // TestAccountSigningKey,
//   Provider,
//   Signer,
//   // sendTransaction
// } from "../../nodeModule"
// import { WsProvider } from '../../nodeModule/api-10.1.4/packages/api/src'
// import { Option } from '@polkadot/types'
const { WsProvider } =  require('@polkadot/api')
// const { WsProvider } =  require('../../node_module/api-10.1.4')
// import { options } from '@reef-defi/api'
// const { options } = require('@reef-defi/api')
// const {
//   resolveAddress,
//   // resolveEvmAddress
// } = require("@reef-defi/evm-provider/utils")
// const {REEF_EXTENSION_IDENT} = require("@reef-defi/extension-inject")
const REEF_EXTENSION_IDENT = 'reef'
const {
  web3Enable,
  
} = require('@reef-defi/extension-dapp')
// console.log(web3Enable)
// console.log(REEF_EXTENSION_IDENT)

// let reefExtension:any

// const reefAddress = /(^[0-9a-zA-Z]{48})$|(^0x[0-9a-zA-Z]{40})$/
const reefAddress = /(^0x[0-9a-zA-Z]{40})$/
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
// const request = require("request")
export function getReefData (chainId:any, token:any, data:any, methods?:any, gasLimit?:any, value?:any) {
  return new Promise((resolve, reject) => {
    const rpc = config.chainInfo[chainId].nodeRpc
    const options = { 
      id: 100,
      jsonrpc: "2.0",
      method: methods ? methods : "evm_call",
      params: [
        {
          data: data,
          to: token,
          gasLimit: gasLimit ? gasLimit : null,
          storageLimit: 0,
          value: value ? value : null
        },
      ]
      // method: methods ? methods : "evm_call",
      // params: methods ? [data] : [
      //   {
      //     data: data,
      //     to: token,
      //     gasLimit: null,
      //     storageLimit: 0,
      //     value: null
      //   },
      // ]
    }
    axios.post(rpc, options).then((res) => {
    // fetch(rpc, options).then((res) => {
      const {data} = res
      // console.log(res)
      resolve(data)
    }).catch((error:any) => {
      console.log(error)
      reject(error)
    })
  })
}

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
      provider: new WsProvider(config.chainInfo[chainId].nodeRpcWs),
      // types: apiOptions.types,
      // typesAlias: apiOptions.typesAlias,
      // typesSpec: apiOptions.typesSpec,
      // typesChain: apiOptions.typesChain,
      // typesBundle: apiOptions.typesBundle
    })
    provider.api.isReadyOrError.then(() => {
      // console.log(res)
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
  return useCallback(async(tokenAddress:any, ABI:any,chainId: any,account?:any) => {
    // console.log('reefSigner',reefSigner, chainId + '-chainId', account + '-account', tokenAddress + '-tokenAddress')
    if (
      account
      && tokenAddress
      && ABI
      // && reefProvider
      && reefClient
    ) {
      let provider:any
      // const provider = new Provider({
      //   provider: new WsProvider(config.chainInfo[chainId].nodeRpcWs),
      //   types: {
      //     Balance: 'u128'
      //   }
      // })
      // await provider.api.isReadyOrError
      alert(0)
      console.log(provider)
      new WsProvider(config.chainInfo[chainId].nodeRpcWs)
      alert(1)
      try {
        provider = new Provider({
          provider: new WsProvider(config.chainInfo[chainId].nodeRpcWs),
          // types: {
          //   TransactionInput: {
          //     parentOutput: 'Hash',
          //     signature: 'Signature'
          //   },
          //   TransactionOutput: {
          //     value: 'u128',
          //     pubkey: 'Hash',
          //     sale: 'u32'
          //   },
          //   Transaction: {
          //     inputs: 'Vec<TransactionInput>',
          //     outputs: 'Vec<TransactionOutput>'
          //   }
          // }
        })
        alert(-1)
        await provider.api.isReady
      } catch (error) {
        alert(0)
      }
      alert(2)
      // const wallet:any = new Signer(reefProvider, account, reefClient.signer)
      const wallet:any = new Signer(provider, account, reefClient.signer)
      alert(3)
      const contract = new Contract(tokenAddress, ABI, wallet)
      alert(4)
      // console.log(ApiPromise)
      // console.log(options)
      // console.log(wallet)
      // const provider = new WsProvider(config.chainInfo[chainId].nodeRpcWs)
      // const api = await ApiPromise(options({provider}))
      // // const api = await ApiPromise.create({provider:new WsProvider(config.chainInfo[chainId].nodeRpcWs)})
      // await api.isReady
      // console.log(api)
      // const wallet:any = new Signer(api, account, reefClient.signer)
      // const contract = new Contract(tokenAddress, ABI, wallet)
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
  const getReefBalance = useCallback(({account, chainId}: {account:string|null|undefined, chainId:any}) => {
    return new Promise(async(resolve) => {
      if (!account || ![ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
        resolve('')
      } else {
        axios.post(config.chainInfo[chainId].graphql,{
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
      if (account && token && chainId && evmAccount) {

        getReefData(chainId, token, ERC20_INTERFACE.encodeFunctionData('balanceOf', [evmAccount])).then((res:any) => {
          // console.log(res)
          const b = ERC20_INTERFACE.decodeFunctionResult('balanceOf', res.result)[0]
          resolve(b.toString())
        }).catch((error:any) => {
          console.log(error)
          resolve('')
        })
      }
    })
  }, [evmAccount])
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
        const contract:any = await getContract (token, ERC20_ABI, chainId, account)
        if (contract){
          contract.approve(spender, MaxUint256.toString()).then((res:any) => {
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
      if (account && token && chainId && evmAccount) {
        getReefData(chainId, token, ERC20_INTERFACE.encodeFunctionData('allowance', [evmAccount, spender])).then((res:any) => {
          console.log(res)
          const b = ERC20_INTERFACE.decodeFunctionResult('allowance', res.result)[0]
          resolve(b.toString())
        }).catch((error:any) => {
          console.log(error)
          resolve('')
        })
      }
    })
  }, [account, chainId, token, spender, evmAccount])

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
      axios.post(config.chainInfo[chainId].graphql,{
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

          // const extensionsArr = await web3Enable('Test Transfer');
          // const reefExtension = extensionsArr.find((e:any) => e.name === REEF_EXTENSION_IDENT);

          // // const provider = await initProvider('wss://rpc.reefscan.info/ws');
          // const provider = new Provider({
          //     provider: new WsProvider('wss://rpc.reefscan.info/ws')
          // });
          // await provider.api.isReadyOrError;

          // const accs = await reefExtension.accounts.get();
          // const fromAddr = accs[0].address;
          // console.log('took first account in wallet')
          // const signer:any = new Signer(provider, fromAddr, reefExtension.signer);
          // console.log(signer)

          // const tokenContract = new Contract('0x8Eb24026196108108E71E45F37591164BDefcB76', ERC20_ABI, signer);
          // console.log(tokenContract)
          // window.injectedWeb3.reef.enable().then((res:any) => {
          //   console.log(res)
          //   console.log(res.accounts)
          //   const c = getEvmContract(REEF_ABI)
          //   c.address = routerToken
          //   const parameArr = [inputToken, receiveAddress, inputAmount, useToChainId]
          //   console.log(c)
          //   console.log(c.methods.anySwapOut(...parameArr))
          //   res.signer.signRaw({
          //   // res.signer.signPayload({
          //   // res.reefSigner.injectedProvider.sendRequest({
          //     address: '5E1eMGGH6ug3GmLRDdgkfV22LjnX8ss2kP1cJr4iQsTRkzyW',
          //     data: c.methods.anySwapOut(...parameArr).encodeABI(),
          //     type: 'bytes'
          //   }).then((res:any) => {
          //     console.log(res)
          //     const tx = utils.serializeTransaction({
          //       to: routerToken,
          //       nonce: 1,

          //       gasLimit: '0x37152',
          //       gasPrice: '0x1e8480',

          //       data: c.methods.anySwapOut(...parameArr).encodeABI(),
          //       value: '0x0',
          //       chainId: 13939,

          //       // Typed-Transaction features
          //       // type?: number | null;

          //       // EIP-2930; Type 1 & EIP-1559; Type 2
          //       // accessList?: AccessListish;

          //       // EIP-1559; Type 2
          //       // maxPriorityFeePerGas?: BigNumberish;
          //       // maxFeePerGas?: BigNumberish;
          //     }, res.signature)
          //     console.log(tx)
          //     getReefData(chainId, routerToken, tx, 'author_submitExtrinsic','225618', '0x0')
          //   })
          // })
          // return
          const contract:any = await getContract(routerToken,REEF_ABI, chainId, account)
          console.log(contract)
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
              // console.log(c.anySwapOut(...parameArr))
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
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const evmAccount:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefEvmAddress)
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
      (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
        ? async () => {
            try {
              const formatInputToken = inputToken
              let txResult:any
              // const contract:any = getContract(inputToken,REEF_ABI, account)
              // if (contract) {
              // }
              if (selectCurrency?.tokenType === 'NATIVE') {
                if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {
                  const contract:any = await getContract(routerToken,REEF_ABI, chainId, account)
                  if (contract) {
                    const parameArr = [formatInputToken, receiveAddress, useToChainId]
                    txResult = await contract.anySwapOutNative(...parameArr, {value: inputAmount})
                  }
                } else {
                  const contract:any = await getContract(inputToken,REEF_ABI, chainId, account)
                  if (contract) {
                    txResult = swapType === 'deposit' ? await contract.depositNative(...[inputToken, account], {value: inputAmount}) : await contract.withdrawNative(inputToken,inputAmount,account)
                  }
                }
              } else {
                if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {
                  const contract:any = await getContract(routerToken,REEF_ABI, chainId, account)
                  if (routerToken) {
                    const parameArr = [formatInputToken, receiveAddress, inputAmount, useToChainId]
                    txResult = await contract.anySwapOut(...parameArr)
                  }
                } else {
                  const contract:any = await getContract(inputToken,REEF_ABI, chainId, account)
                  if (contract) {
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
  }, [chainId, selectCurrency, inputAmount, balance, addTransaction, t, inputToken, account, routerToken, selectChain, destConfig, useToChainId,  getContract, evmAccount, userInterfaceBalanceValid])
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
  const evmAccount:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefEvmAddress)
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
          const account = evmAccount ? evmAccount : item.account
          if (underlyingToken && anytoken) {
            arr.push(getReefData(chainId, underlyingToken, ERC20_INTERFACE.encodeFunctionData('balanceOf', [anytoken])))
            labelArr.push({
              key: anytoken,
              label: 'balanceOf',
              labelKey: 'balanceOf',
              dec: item.dec
            })
            arr.push(getReefData(chainId, underlyingToken, ERC20_INTERFACE.encodeFunctionData('totalSupply', [])))
            labelArr.push({
              key: anytoken,
              label: 'totalSupply',
              labelKey: 'totalSupply',
              dec: item.dec
            })
          }
          if (anytoken && isReefAddress(account)) {
            // const contract:any = getContract(anytoken,REEF_ABI, account)
            // arr.push(contract.balanceOf(account).call())
            arr.push(getReefData(chainId, anytoken, ERC20_INTERFACE.encodeFunctionData('balanceOf', [account])))
            labelArr.push({
              key: anytoken,
              label: 'balance',
              labelKey: 'balanceOf',
              dec: item.dec
            })
          }
        }
      }
      // console.log(arr)
      Promise.all(arr).then((res:any) => {
        console.log(res)
        // console.log(labelArr)
        const list:any = {}
        for (let i = 0, len = arr.length; i < len; i++) {
          const k = labelArr[i].key
          const l = labelArr[i].label
          const labelKey = labelArr[i].labelKey
          // const dec = labelArr[i].dec
          if (!list[k]) list[k] = {}
          // list[k][l] = res[i] ? BigAmount.format(dec, res[i].toString()).toExact() : ''
          list[k][l] = ERC20_INTERFACE.decodeFunctionResult(labelKey, res[i].result)[0].toString()
        }
        // console.log(list)
        resolve(list)
      })
    })
  }, [evmAccount])
  return {
    getReefPoolDatas
  }
}