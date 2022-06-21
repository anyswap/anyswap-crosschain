// import { useConnectedWallet } from '@terra-money/wallet-provider'
// import { CurrencyAmount, JSBI, Fraction } from 'anyswap-sdk'
// import { JSBI, Fraction } from 'anyswap-sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useETHBalances } from '../state/wallet/hooks'
import { useUserSelectChainId } from '../state/user/hooks'
import useInterval from './useInterval'
import {useTerraBaseBalance} from './useTerraBalance'
import { useCurrentNasBalance } from './nas'
import { useNearBalance } from './near'
// import {fromWei} from '../utils/tools/tools'
import { ChainId } from '../config/chainConfig/chainId'
import { BigAmount } from '../utils/formatBignumber'

export function useBaseBalances (
  uncheckedAddresses?: string | null | undefined,
  chainId?: any
) {
  const {selectNetworkInfo} = useUserSelectChainId()
  const userEthBalance = useETHBalances((uncheckedAddresses && !selectNetworkInfo?.label) ? [uncheckedAddresses] : [])?.[uncheckedAddresses ?? '']
  // const userEthBalance = useETHBalances((uncheckedAddresses) ? [uncheckedAddresses] : [])?.[uncheckedAddresses ?? '']
  const {getTerraBaseBalances} = useTerraBaseBalance()

  const { getNasBalance } = useCurrentNasBalance()
  const { getNearBalance } = useNearBalance()
  // console.log(selectNetworkInfo)
  const [balance, setBalance] = useState<any>()
  const fetchBalancesCallback = useCallback(() => {
    if (selectNetworkInfo?.label === ChainId.TERRA) {
      getTerraBaseBalances().then(res => {
        setBalance(res)
      })
    } else if (selectNetworkInfo?.label === ChainId.NAS) {
      getNasBalance().then(res => {
        // console.log(res)
        setBalance(res)
      })
    } else if (
      selectNetworkInfo?.label === ChainId.NEAR
      || selectNetworkInfo?.label === ChainId.NEAR_TEST
    ) {
      getNearBalance().then(res => {
        // console.log(res)
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
    } else if (selectNetworkInfo?.label === ChainId.TERRA) {
      // return balance?.uluna ? new Fraction(JSBI.BigInt(balance?.uluna), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(6))) : undefined
      return balance?.uluna ? BigAmount.format(6, balance?.uluna) : undefined
    } else if (selectNetworkInfo?.label === ChainId.NAS) {
      console.log('useBaseBalances nas balance', balance)
      return balance ? BigAmount.format(18, balance) : undefined
      // try {
      //   return balance
      //     ? new Fraction(JSBI.BigInt(balance), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
      //     : undefined
      // } catch (err) {
      //   console.error(err)
      // }
    } else if (
      selectNetworkInfo?.label === ChainId.NEAR
      || selectNetworkInfo?.label === ChainId.NEAR_TEST
    ) {
      return balance?.total ? BigAmount.format(24, balance?.total) : undefined
    }
    return undefined
  }, [balance, userEthBalance, selectNetworkInfo])
}