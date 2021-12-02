import { JSBI, Fraction } from 'anyswap-sdk'
import { useConnectedWallet } from '@terra-money/wallet-provider'

import useTerraBalance from './useTerraBalance'
import useInterval from './useInterval'

// import { useUserSelectChainId } from '../state/user/hooks'
import { useCallback, useMemo, useRef, useEffect } from 'react'

export function useNonEVMDestBalance (token:any, dec:any, selectChainId:any) {
  // const [selectNetworkInfo] = useUserSelectChainId()
  const connectedWallet = useConnectedWallet()
  const {getTerraBalances} = useTerraBalance()

  // const [balance, setBalance] = useState<any>()
  const savedBalance = useRef<any>()

  const fetchBalance = useCallback(() => {
    if (token) {
      if (selectChainId === 'TERRA' && connectedWallet?.walletAddress) {
        // console.log(token)
        // console.log(connectedWallet?.walletAddress)
        getTerraBalances({
          terraWhiteList: [{
            token: token
          }],
          account: connectedWallet?.walletAddress
        }).then(res => {
          // console.log(res)
          const bl = res[token] && (dec || dec === 0) ? new Fraction(JSBI.BigInt(res[token]), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(dec))) : undefined
          // console.log(bl)
          savedBalance.current = bl
        })
      }
    } else {
      // setBalance('')
    }
  }, [token, connectedWallet, selectChainId])

  useInterval(fetchBalance, 1000 * 10, false)

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance, token])

  return useMemo(() => {
    // console.log(savedBalance)
    return savedBalance.current
  }, [savedBalance.current, selectChainId, token])
}