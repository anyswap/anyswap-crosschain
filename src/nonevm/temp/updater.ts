
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'

import {useLoginTemp} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginTemp} = useLoginTemp()

  const getTempAddress = useCallback(() => {
    loginTemp()
  }, [chainId])

  useEffect(() => {
    getTempAddress()
  }, [chainId])

  return null
}
