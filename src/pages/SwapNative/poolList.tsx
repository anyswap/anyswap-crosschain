import React, { useEffect } from 'react'

import { useActiveWeb3React } from '../../hooks'

import {getAllToken} from '../../utils/bridge/getBaseInfo'

export default function PoolLists ({

}) {
  const { account, chainId } = useActiveWeb3React()

  useEffect(() => {
    getAllToken(chainId).then((res:any) => {
      console.log(account)
      if (res) {
        // const list:any = []
        for (const token in res) {
          console.log(token)
        }
      }
    })
  }, [chainId])

  return (
    <>
    </>
  )
}