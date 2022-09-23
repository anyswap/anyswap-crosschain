
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'

import {
  useLoginSol,
  // getSolanaInfo
  getSolTxnsStatus
} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginSol} = useLoginSol()

  const getTempAddress = useCallback(() => {
    // getSolanaInfo(chainId, 'requestAirdrop', ["C5WYGHYJ3oAeHPtAZJMLnhFN8eVDjSZqJGKtJNSVvo8K", 100000000000])
    getSolTxnsStatus('37wB4pxA9F5bmhxnnCX7zENDS1ugFoSQe77i3chgESCUo9zpv8bqL4GnFaKqZ4tyZaGUwW8dLiEz8RBqaQcKxgf1', chainId)
    getSolTxnsStatus('37wB4pxA9F5bmhxnnCX7zENDS1ugFoSQe77i3chgESCUo9zpv8bqL4GnFaKqZ4tyZaGUwW8dLiEz8RBqaQcKxgfN', chainId)
    loginSol()
  }, [chainId])

  useEffect(() => {
    getTempAddress()
  }, [chainId])

  return null
}
