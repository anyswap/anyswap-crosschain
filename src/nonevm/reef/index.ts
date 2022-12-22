
import { useCallback, useMemo } from "react"
import {
  useDispatch,
  // useSelector
} from 'react-redux'
import {
  // AppState,
  AppDispatch
} from '../../state'
// import {reefAddress} from './actions'
import { useActiveReact } from '../../hooks/useActiveReact'
import {nonevmAddress} from '../hooks/actions'
import {web3Enable} from "@reef-defi/extension-dapp";
// const {web3Enable} = require('@reef-defi/extension-dapp')
console.log(web3Enable)

export function isReefAddress (address:string):boolean | string {
  return address //true: address; false: false
}

/**
 * Connect wallet and get account address
 */
export function useLoginReef () {
  const dispatch = useDispatch<AppDispatch>()
  const loginReef = useCallback(async(chainId) => {
    // const appName = 'Multichain Bridge App'
    // const extensionsArr:any = await web3Enable(appName);
    // console.log(extensionsArr)
    // if (extensionsArr) {
    //   extensionsArr.find((e:any)=>e.name==='REEF_EXTENSION_IDENT').reefSigner.subscribeSelectedAccount(
    //       (account:any) => {
    //         if (account) {
    //           dispatch(nonevmAddress({account: account?.address, chainId}));
    //         }
    //       }
    //   )
    // } else {
    //   if (confirm('Please install Reef Wallet.') === true) {
    //     window.open('https://app.reef.io/')
    //   }
    // }
    dispatch(nonevmAddress({account: '', chainId}));
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
  const getReefBalance = useCallback(({account}: {account:string|null|undefined}) => {
    return new Promise((resolve) => {
      if (account) {
        resolve('')
      }
    })
  }, []) 

  const getReefTokenBalance = useCallback(({account, token}: {account:string|null|undefined, token:string|null|undefined}) => {
    return new Promise((resolve) => {
      if (account && token) {
        resolve('')
      }
    })
  }, [])

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

enum State {
  Success = 'Success',
  Failure = 'Failure',
  Null = 'Null',
}

interface TxDataResult {
  msg: State,
  info: any,
  error: any
}
/**
 * Get transaction info
 *
 * @param txid transaction hash
 */
export function getReefTxnsStatus (txid:string) {
  return new Promise(resolve => {
    const data:TxDataResult = {
      msg: State.Null,
      info: '',
      error: ''
    }
    if (txid) {
      resolve(data)
    }
  })
}

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
  typedValue: string | null | undefined,
  destConfig: any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { account, chainId } = useActiveReact()
  return useMemo(() => {
    return {
      balance: '',
      execute: async () => {
        console.log()
      },
      inputError: ''
    }
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account])
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