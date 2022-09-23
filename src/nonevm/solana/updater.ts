
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
    // const params = {chainId, account}
    const params = {chainId, account: '4fZikRtyoW2qZ2f5EVRKYw3qCkPwhrxCmCgixQ4HXVU6'}
    // const params = {chainId: 'SOL', account: '4fZikRtyoW2qZ2f5EVRKYw3qCkPwhrxCmCgixQ4HXVU6'}
    Promise.all([
      getSolBalance(params), getSolTokenBalance(params)
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
