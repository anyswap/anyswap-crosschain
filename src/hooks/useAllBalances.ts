// import { JSBI, Fraction } from 'anyswap-sdk'
import { useConnectedWallet } from '@terra-money/wallet-provider'

import useTerraBalance from './useTerraBalance'
import useInterval from './useInterval'

import { useCallback, useMemo, useRef, useEffect } from 'react'

import { ChainId } from '../config/chainConfig/chainId'

import { BigAmount } from '../utils/formatBignumber'

export function useNonEVMDestBalance (token:any, dec:any, selectChainId:any) {
  const connectedWallet = useConnectedWallet()
  const {getTerraBalances} = useTerraBalance()

  // const [balance, setBalance] = useState<any>()
  const savedBalance = useRef<any>()

  const fetchBalance = useCallback(() => {
    // console.log(token)
    if (token) {
      if ([ChainId.TERRA].includes(selectChainId) && connectedWallet?.walletAddress) {
        getTerraBalances({
          terraWhiteList: [{
            token: token
          }],
          account: connectedWallet?.walletAddress
        }).then(res => {
          const bl = res[token] && (dec || dec === 0) ? BigAmount.format(dec, res[token]) : undefined
          savedBalance.current = bl
        })
      } else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChainId)) {

      } else if ([ChainId.NAS].includes(selectChainId)) {

      }
    } else {
      savedBalance.current = ''
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