
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'

import { ChainId } from '../../config/chainConfig/chainId'
import {useNasLogin} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginNas} = useNasLogin()

  const getNasAddress = useCallback(() => {
    if ([ChainId.NAS].includes(chainId)) {
      // console.log(111)
      loginNas(chainId, 1)
    }
  }, [chainId])

  useEffect(() => {
    getNasAddress()
  }, [chainId])

  return null
}
