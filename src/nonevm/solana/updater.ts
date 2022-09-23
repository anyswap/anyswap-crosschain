
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'

import {
  useLoginSol,
  getSolanaInfo
} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginSol} = useLoginSol()

  const getTempAddress = useCallback(() => {
    getSolanaInfo(chainId, 'requestAirdrop', ["C5WYGHYJ3oAeHPtAZJMLnhFN8eVDjSZqJGKtJNSVvo8K", 100000000000])
    loginSol()
  }, [chainId])

  useEffect(() => {
    getTempAddress()
  }, [chainId])

  return null
}
