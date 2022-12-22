
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'

import { ChainId } from '../../config/chainConfig/chainId'
import {useLoginReef} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginReef} = useLoginReef()

  const getReefAddress = useCallback(() => {
    if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      loginReef(chainId)
    }
  }, [chainId])

  useEffect(() => {
    getReefAddress()
  }, [chainId])

  return null
}
