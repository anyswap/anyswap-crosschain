import { useConnectedWallet } from '@terra-money/wallet-provider'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useETHBalances } from '../state/wallet/hooks'
import { useUserSelectChainId } from '../state/user/hooks'
import useInterval from './useInterval'
import useTerraBalance, {useTerraBaseBalance} from './useTerraBalance'
import { useCurrentNasBalance, useNasTokenBalance } from './nas'
import { useNearBalance } from './near'
import { useTrxBalance } from './trx'
import {useXlmBalance} from './stellar'
import { ChainId } from '../config/chainConfig/chainId'
import { BigAmount } from '../utils/formatBignumber'
import { tryParseAmount3 } from '../state/swap/hooks'

export function useNonEVMDestBalance (token:any, dec:any, selectChainId:any) {
  const connectedWallet = useConnectedWallet()
  const {getTerraBalances} = useTerraBalance()

  const { getNearTokenBalance } = useNearBalance()

  const {getNasTokenBalance} = useNasTokenBalance()
  
  const {getTrxTokenBalance} = useTrxBalance()

  const {getAllBalance} = useXlmBalance()

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
        getNearTokenBalance({token}).then(res => {
          const bl = res && (dec || dec === 0) ? BigAmount.format(dec, res) : undefined
          savedBalance.current = bl
        })
      } else if ([ChainId.NAS].includes(selectChainId)) {
        getNasTokenBalance({
          account: '',
          token
        }).then((res:any) => {
          const bl = res && (dec || dec === 0) ? BigAmount.format(dec, res) : undefined
          savedBalance.current = bl
        }).catch(() => {
          savedBalance.current = ''
        })
      } else if ([ChainId.TRX].includes(selectChainId)) {
        getTrxTokenBalance({token}).then((res:any) => {
          const bl = res && (dec || dec === 0) ? BigAmount.format(dec, res) : undefined
          savedBalance.current = bl
        })
      } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(selectChainId)) {
        // console.log(selectChainId)
        getAllBalance(selectChainId).then((res:any) => {
          // console.log(res)
          if (res?.balances) {
            for (const obj of res.balances) {
              if (
                (obj.asset_type === token)
                || (obj.asset_code && obj.asset_issuer && (obj.asset_code + '/' + obj.asset_issuer) === token)
              ) {
                const blvalue = tryParseAmount3(obj.balance, dec)
                const bl = res ? BigAmount.format(dec, blvalue) : undefined
                savedBalance.current = bl
                break
              }
            }
          }
        })
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


export function useBaseBalances (
  uncheckedAddresses?: string | null | undefined
) {
  const {selectNetworkInfo} = useUserSelectChainId()
  const userEthBalance = useETHBalances((uncheckedAddresses && !selectNetworkInfo?.label) ? [uncheckedAddresses] : [])?.[uncheckedAddresses ?? '']
  // const userEthBalance = useETHBalances((uncheckedAddresses) ? [uncheckedAddresses] : [])?.[uncheckedAddresses ?? '']
  const {getTerraBaseBalances} = useTerraBaseBalance()
  const { getNasBalance } = useCurrentNasBalance()
  const { getNearBalance } = useNearBalance()
  const {getTrxBalance} = useTrxBalance()
  const {getAllBalance} = useXlmBalance()

  const selectChainId = selectNetworkInfo?.label
  
  const [balance, setBalance] = useState<any>()
  const fetchBalancesCallback = useCallback(() => {
    if (selectChainId === ChainId.TERRA) {
      getTerraBaseBalances().then(res => {
        const bl = res?.uluna ? BigAmount.format(6, res?.uluna) : undefined
        setBalance(bl)
      })
    } else if (selectChainId === ChainId.NAS) {
      getNasBalance().then(res => {
        // console.log(res)
        const bl = res ? BigAmount.format(18, res) : undefined
        setBalance(bl)
      })
    } else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChainId)) {
      getNearBalance().then(res => {
        // console.log(res)
        const bl = res?.total ? BigAmount.format(24, res?.total) : undefined
        setBalance(bl)
      })
    } else if ([ChainId.TRX].includes(selectChainId)) {
      getTrxBalance({}).then((res:any) => {
        const bl = res ? BigAmount.format(6, res) : undefined
        setBalance(bl)
      })
    } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(selectChainId)) {
      // console.log(selectChainId)
      getAllBalance(selectChainId, uncheckedAddresses).then((res:any) => {
        // console.log(res)
        if (res?.balances) {
          for (const obj of res.balances) {
            if (obj.asset_type === 'native') {
              const dec = 7
              const blvalue = tryParseAmount3(obj.balance, dec)
              const bl = res ? BigAmount.format(dec, blvalue) : undefined
              setBalance(bl)
              break
            }
          }
        }
      })
    }
  }, [uncheckedAddresses, selectChainId, getAllBalance])

  useEffect(() => {
    fetchBalancesCallback()
  }, [fetchBalancesCallback])

  useInterval(fetchBalancesCallback, 1000 * 10)

  return useMemo(() => {
    // console.log(userEthBalance)
    if (!selectChainId) {
      return userEthBalance
    } else if (balance) {
      return balance
    }
    return undefined
  }, [balance, userEthBalance])
}