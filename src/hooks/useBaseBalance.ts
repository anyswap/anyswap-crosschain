// import { useConnectedWallet } from '@terra-money/wallet-provider'
// import { CurrencyAmount, JSBI, Fraction } from 'anyswap-sdk'
import { JSBI, Fraction } from 'anyswap-sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useETHBalances } from '../state/wallet/hooks'
import { useUserSelectChainId } from '../state/user/hooks'
import useInterval from './useInterval'
import {useTerraBaseBalance} from './useTerraBalance'
// import {fromWei} from '../utils/tools/tools'


export function useBaseBalances (
  uncheckedAddresses?: string | null | undefined,
  chainId?: any
) {
  const {selectNetworkInfo} = useUserSelectChainId()
  const userEthBalance = useETHBalances((uncheckedAddresses && !selectNetworkInfo?.label) ? [uncheckedAddresses] : [])?.[uncheckedAddresses ?? '']
  // const userEthBalance = useETHBalances((uncheckedAddresses) ? [uncheckedAddresses] : [])?.[uncheckedAddresses ?? '']
  const {getTerraBaseBalances} = useTerraBaseBalance()

  const [balance, setBalance] = useState<any>()
  const fetchBalancesCallback = useCallback(() => {
    if (selectNetworkInfo?.label === 'TERRA') {
      getTerraBaseBalances().then(res => {
        setBalance(res)
      })
    }
  }, [uncheckedAddresses, selectNetworkInfo, chainId])

  useEffect(() => {
    fetchBalancesCallback()
  }, [fetchBalancesCallback])

  useInterval(fetchBalancesCallback, 1000 * 10)

  return useMemo(() => {
    // console.log(uncheckedAddresses)
    // console.log(userEthBalance)
    if (!selectNetworkInfo?.label) {
      return userEthBalance
    } else if (selectNetworkInfo?.label === 'TERRA') {
      return balance?.uluna ? new Fraction(JSBI.BigInt(balance?.uluna), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(6))) : undefined
    }
    return undefined
  }, [balance, userEthBalance, selectNetworkInfo])
}