
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'
import useInterval from '../../hooks/useInterval'

import {
  useLoginSol,
  useSolBalance
  // getSolanaInfo
  // getSolTxnsStatus
} from './index'

export default function Updater(): null {
  const { chainId, account } = useActiveReact()
  
  const {loginSol} = useLoginSol()

  const {getSolBalance, getSolTokenBalance} = useSolBalance()

  const getBalance = useCallback(() => {
    Promise.all([
      getSolBalance({chainId, account}), getSolTokenBalance({chainId, account})
    ]).then((res) => {
      console.log(res)
    })
  }, [getSolBalance, getSolTokenBalance, chainId, account])

  useEffect(() => {
    getBalance()
  }, [getSolBalance, getSolTokenBalance, chainId, account])

  useInterval(getBalance, 1000 * 10)

  useEffect(() => {
    loginSol()
  }, [chainId])

  return null
}
