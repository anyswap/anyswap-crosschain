import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'
import useInterval from '../../hooks/useInterval'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import {btcBalanceList} from './actions'

import {
  useLoginBtc,
  // useAptAllowance,
  useBtcBalance
} from './index'

export default function Updater(): null {
  const { chainId,account } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  // const {setAptAllowance} = useAptAllowance()
  const {loginBtc} = useLoginBtc()
  const {getBtcBalance} = useBtcBalance()

  const getBalance = useCallback(() => {
    getBtcBalance(chainId, account).then((res:any) => {
      dispatch(btcBalanceList({list: {NATIVE: res?.chain_stats?.funded_txo_sum}}))
    })
  }, [account, chainId, dispatch])

  useEffect(() => {
    getBalance()
  }, [account, chainId, dispatch])

  useInterval(getBalance, 1000 * 5)

  const getAptosAddress = useCallback(() => {
    // console.log(chainId)
    loginBtc(chainId)
  }, [chainId])

  useEffect(() => {
    getAptosAddress()
  }, [chainId])

  return null
}