
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'

import {useLoginSol} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginSol} = useLoginSol()

  const getTempAddress = useCallback(() => {
    loginSol()
  }, [chainId])

  useEffect(() => {
    getTempAddress()
  }, [chainId])

  return null
}
