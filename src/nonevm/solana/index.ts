import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { AppState, AppDispatch } from '../../state'
import {solAddress} from './actions'
import { useActiveReact } from '../../hooks/useActiveReact'

const solAddressReg = /^[1-9A-Z]{44}$/

export function isSolAddress (address:string):boolean | string {
  if (solAddressReg.test(address)) {
    return address
  }
  return false
}

export function useSolAddress () {
  const account:any = useSelector<AppState, AppState['sol']>(state => state.sol.solAddress)
  return {
    solAddress: account
  }
}

export function useLoginSol () {
  const dispatch = useDispatch<AppDispatch>()
  const loginSol = useCallback(() => {
    if (window?.solana?.connect) {
      window?.solana?.connect().then((res:any) => {
        if (res?.publicKey) {
          dispatch(solAddress({address: res.publicKey.toString()}))
        }
      }).catch((err:any) => {
        console.log(err)
      })
    } else {
      if (confirm('Please open or install Solana wallet.') === true) {
        window.open('https://solana.com/ecosystem/explore?categories=wallet')
      }
    }
  }, [])
  return {
    loginSol
  }
}


export function useSolBalance () {
  const getSolBalance = useCallback(({account}: {account:string|null|undefined}) => {
    return new Promise((resolve) => {
      if (account) {
        resolve('')
      }
    })
  }, []) 

  const getSolTokenBalance = useCallback(({account, token}: {account:string|null|undefined, token:string|null|undefined}) => {
    return new Promise((resolve) => {
      if (account && token) {
        resolve('')
      }
    })
  }, [])

  return {
    getSolBalance,
    getSolTokenBalance
  }
}

export function useSolAllowance(
  token: string | null | undefined,
  spender: string | null | undefined,
  chainId: string | null | undefined,
  account: string | null | undefined,
) {
  const setSolAllowance = useCallback((): Promise<any> => {
    return new Promise(async(resolve, reject) => {
      if (token && spender && account && chainId) {
        resolve('')
      } else {
        reject('')
      }
    })
  }, [token, spender, account, chainId])

  const getSolAllowance = useCallback(() => {
    return new Promise(async(resolve): Promise<any> => {
      resolve('')
    })
  }, [account, chainId, token, spender])

  return {
    setSolAllowance,
    getSolAllowance,
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
export function getSolTxnsStatus (txid:string) {
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

export function useSolCrossChain (
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

export function useSolSwapPoolCallback(
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

export function useSolPoolDatas () {
  const getSolPoolDatas = useCallback(async(calls: Array<[PoolCalls]>, chainId: string | null | undefined): Promise<PoolResult> => {
    return {
      'anytoken': {
        balanceOf: '',
        totalSupply: '',
        balance: '',
      }
    }
  }, [])
  return {
    getSolPoolDatas
  }
}