
import { useCallback, useEffect } from 'react'
import { ChainId } from '../../config/chainConfig/chainId'
import { useActiveReact } from '../../hooks/useActiveReact'

import {useLoginAtom} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginAtom} = useLoginAtom()

  const getAtomAddress = useCallback(() => {
    console.log(chainId)
    if ([ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST].includes(chainId)) {
      loginAtom(chainId)
    }
  }, [chainId])

  useEffect(() => {
    getAtomAddress()
  }, [chainId])

  return null
}
