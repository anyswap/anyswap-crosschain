import React, { useEffect } from "react"

import {useActiveReact} from '../../hooks/useActiveReact'

export default function History () {
  const {account, chainId} = useActiveReact()
  useEffect(() => {

  }, [account, chainId])
  return (
    <>
    </>
  )
}