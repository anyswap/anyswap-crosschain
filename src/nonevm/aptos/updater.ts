
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'

import {useLoginAptos} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginAptos} = useLoginAptos()

  const getAptosAddress = useCallback(() => {
    loginAptos()
  }, [chainId])

  useEffect(() => {
    getAptosAddress()
  }, [chainId])

  return null
}
