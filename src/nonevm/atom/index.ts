import { useCallback, useMemo } from "react"
import {
  useDispatch,
  // useSelector
} from 'react-redux'
import {
  // AppState,
  AppDispatch
} from '../../state'
import {nonevmAddress} from '../hooks/actions'
import { useActiveReact } from '../../hooks/useActiveReact'
import { ChainId } from "../../config/chainConfig/chainId"

const ChainIdList:any = {
  [ChainId.ATOM]: '',
  [ChainId.ATOM_TEST]: 'atlantic-1',
}

export function isAtomAddress (address:string):boolean | string {
  return address //true: address; false: false
}

/**
 * Connect wallet and get account address
 */
export function useLoginAtom () {
  const dispatch = useDispatch<AppDispatch>()
  const loginAtom = useCallback((chainId) => {
    window.keplr.enable(chainId)
    if (window?.keplr) {
      window.keplr.enable(ChainIdList[chainId]).then(() => {
        // console.log(res)
        const offlineSigner = window.getOfflineSigner(ChainIdList[chainId])
        offlineSigner.getAccounts().then((res:any) => {
          console.log(res)
          if (res?.[0]?.address) {
            dispatch(nonevmAddress({chainId, account: res?.[0]?.address}))
          } else {
            dispatch(nonevmAddress({chainId, account: ''}))
          }
        })
      }).catch((error:any) => {
        console.log(error)
        dispatch(nonevmAddress({chainId, account: ''}))
      })
    } else {
      if (confirm('Please install Petra Wallet.') === true) {
        window.open('https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap')
      }
    }
  }, [])
  return {
    loginAtom
  }
}

/**
 * Get native balance and token balance
 *
 * @param account wallet address
 * @param token token address
 */
export function useAtomBalance () {
  const getAtomBalance = useCallback(({account}: {account:string|null|undefined}) => {
    return new Promise((resolve) => {
      if (account) {
        fetch(`https://sei-testnet-rpc.allthatnode.com:1317/cosmos/bank/v1beta1/balances/${account}`).then((res:any) => {
          resolve(res)
        })
      }
    })
  }, []) 

  const getAtomTokenBalance = useCallback(({account, token}: {account:string|null|undefined, token:string|null|undefined}) => {
    return new Promise((resolve) => {
      if (account && token) {
        resolve('')
      }
    })
  }, [])

  return {
    getAtomBalance,
    getAtomTokenBalance
  }
}

/**
 * Authorization and obtaining authorization information
 *
 * @param account wallet address
 * @param token token address
 * @param spender spender address
 */
export function useAtomAllowance(
  token: string | null | undefined,
  spender: string | null | undefined,
  chainId: string | null | undefined,
  account: string | null | undefined,
) {
  const setAtomAllowance = useCallback((): Promise<any> => {
    return new Promise(async(resolve, reject) => {
      if (token && spender && account && chainId) {
        resolve('')
      } else {
        reject('')
      }
    })
  }, [token, spender, account, chainId])

  const getAtomAllowance = useCallback(() => {
    return new Promise(async(resolve): Promise<any> => {
      resolve('')
    })
  }, [account, chainId, token, spender])

  return {
    setAtomAllowance,
    getAtomAllowance,
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
export function getAtomTxnsStatus (txid:string) {
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
export function useAtomCrossChain (
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
        console.log(1)
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
export function useAtomSwapPoolCallback(
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
        console.log(1)
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
export function useAtomPoolDatas () {
  const getAtomPoolDatas = useCallback(async(calls: Array<[PoolCalls]>, chainId: string | null | undefined): Promise<PoolResult> => {
    console.log(calls, chainId)
    return {
      'anytoken': {
        balanceOf: '',
        totalSupply: '',
        balance: '',
      }
    }
  }, [])
  return {
    getAtomPoolDatas
  }
}