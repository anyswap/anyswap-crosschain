// import { useRecoilValue } from 'recoil'
import _ from 'lodash'

// import { UTIL } from 'consts'

// import AuthStore from 'store/AuthStore'

// import useMantle from './useMantle'
// import { BalanceListType } from 'types/asset'

import { useConnectedWallet } from '@terra-money/wallet-provider'
import { useCallback } from 'react'
import {terraExt} from '../nonevm/terra'

const jsonTryParse = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

type BalanceListType = Record<
  string, // tokenAddress
  string // balance
>

interface Query {
  token: string
  contract: string
  msg: object
}

const stringify = (msg: object): string =>
  JSON.stringify(msg).replace(/"/g, '\\"')

const bankBalanceQuery = `
  query($address: String) {
    BankBalancesAddress(Address: $address) {
      Result {
        Amount
        Denom
      }
    }
  }
`

const alias = ({ token, contract, msg }: Query): string =>
  `${token}: WasmContractsContractAddressStore(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`

const getTokenBalanceQuery = (queries: Query[]): string => `
query {
  ${queries.map(alias)}
}
`

// const TERRA_RPC = 'https://mantle.terra.dev/'
// const TERRA_RPC = 'https://tequila-mantle.terra.dev/'
// const TERRA_RPC = 'https://bombay-fcd.terra.dev/'
const TERRA_RPC = terraExt.mantle

const useMantle = (): {
  fetchQuery: ({
    query,
    variables,
  }: {
    query: string
    variables?: string
  }) => Promise<any> | undefined
} => {
  // const terraLocal = useRecoilValue(NetworkStore.terraLocal)
  // console.log(terraLocal)
  const fetchQuery = ({
    query,
    variables,
  }: {
    query: string
    variables?: string
  }): Promise<any> | undefined =>
    fetch(TERRA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
      .then((res) => res.json())
      .then((res) => res.data)
      .catch((error) => error)

  return {
    fetchQuery,
  }
}

export function useTerraBaseBalance () {
  const connectedWallet = useConnectedWallet()
  const { fetchQuery } = useMantle()
  const getTerraBaseBalances = useCallback(async (): Promise<BalanceListType> => {
    try {
      const fetchResult = await fetchQuery({
        query: bankBalanceQuery,
        variables: JSON.stringify({ address: connectedWallet?.walletAddress }),
      })
      const resultList: {
        Amount: string
        Denom: string
      }[] = fetchResult?.BankBalancesAddress?.Result || []
      if (_.some(resultList)) {
        const list: BalanceListType = {}
        _.forEach(resultList, (x) => {
          list[x.Denom] = x.Amount
        })
        return list
      } else {
        return {}
      }
    } catch (error) {
      return {}
    }

  }, [bankBalanceQuery, connectedWallet])
  return { getTerraBaseBalances }
}

export function useTerraTokenBalances () {
  const connectedWallet = useConnectedWallet()
  const { fetchQuery } = useMantle()
  const getTerraTokenBalances = useCallback(async ({
    terraWhiteList,
  }: {
    terraWhiteList: { token: string }[]
  }): Promise<BalanceListType> => {
    const aliasResult = getTokenBalanceQuery(
      Object.values(terraWhiteList).map(({ token }) => ({
        token,
        contract: token,
        msg: { balance: { address: connectedWallet?.walletAddress } },
      }))
    )
    try {
      
      const fetchResult: Record<
        string,
        { Height: string; Result: string }
      > = await fetchQuery({
        query: aliasResult,
      })
  
      if (_.some(fetchResult)) {
        const list: BalanceListType = {}
        _.forEach(fetchResult, (x, key) => {
          if (x) {
            const res = jsonTryParse<{ balance: string }>(x.Result)
            if (res) list[key] = res.balance
          }
        })
        return list
      } else {
        return {}
      }
    } catch (error) {
      return {}
    }
  }, [connectedWallet, getTokenBalanceQuery])

  return {getTerraTokenBalances}
}

const useTerraBalance = (): {
  getTerraBalances: ({
    terraWhiteList,
    account
  }: {
    terraWhiteList: {
      token: string
    }[],
    account?:any
  }) => Promise<BalanceListType>
} => {
  // const loginUser = useRecoilValue(AuthStore.loginUser)
  const connectedWallet = useConnectedWallet()
  const { fetchQuery } = useMantle()

  const getTerraTokenBalances = useCallback(async ({
    terraWhiteList,
    account
  }: {
    terraWhiteList: { token: string }[]
    account?:any
  }): Promise<BalanceListType> => {
    const useAccount = account ? account : connectedWallet?.walletAddress
    if (!useAccount) return {}
    const aliasResult = getTokenBalanceQuery(
      Object.values(terraWhiteList).map(({ token }) => ({
        token,
        contract: token,
        msg: { balance: { address: useAccount } },
      }))
    )
    try {
      
      const fetchResult: Record<
        string,
        { Height: string; Result: string }
      > = await fetchQuery({
        query: aliasResult,
      })
  
      if (_.some(fetchResult)) {
        const list: BalanceListType = {}
        _.forEach(fetchResult, (x, key) => {
          if (x) {
            const res = jsonTryParse<{ balance: string }>(x.Result)
            if (res) list[key] = res.balance
          }
        })
        return list
      } else {
        return {}
      }
    } catch (error) {
      return {}
    }
  }, [connectedWallet, getTokenBalanceQuery])
  // console.log(connectedWallet)
  // const getTerraBankBalances = async (): Promise<BalanceListType> => {
  const getTerraBankBalances = useCallback(async (account?:any): Promise<BalanceListType> => {
    const useAccount = account ? account : connectedWallet?.walletAddress
    if (!useAccount) return {}
    try {
      
      const fetchResult = await fetchQuery({
        query: bankBalanceQuery,
        variables: JSON.stringify({ address: useAccount }),
      })
      const resultList: {
        Amount: string
        Denom: string
      }[] = fetchResult?.BankBalancesAddress?.Result || []
  
      if (_.some(resultList)) {
        const list: BalanceListType = {}
        _.forEach(resultList, (x) => {
          list[x.Denom] = x.Amount
        })
        return list
      } else {
        return {}
      }
    } catch (error) {
      return {}
    }
  }, [bankBalanceQuery, connectedWallet])

  const getTerraBalances = useCallback(async ({
    terraWhiteList,
    account
  }: {
    terraWhiteList: { token: string }[],
    account?: any
  }): Promise<BalanceListType> => {
    const bank = await getTerraBankBalances(account)
    const token = await getTerraTokenBalances({ terraWhiteList, account })
    // console.log(account)
    // console.log(terraWhiteList)
    // console.log(bank)
    // console.log(token)
    return {
      ...bank,
      ...token,
    }
  }, [getTerraBankBalances, getTerraTokenBalances, connectedWallet])

  return { getTerraBalances }
}

export default useTerraBalance
