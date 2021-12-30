import React, { useEffect } from "react"
import axios from "axios"
import {useActiveReact} from '../../hooks/useActiveReact'

import config from '../../config'

export default function History () {
  const {account} = useActiveReact()
  useEffect(() => {
    if (account) {
      const url = `${config.bridgeApi}/v2/all/history/${account}/all/all/all?offset=0&limit=50&status=8,9,10`
      axios.get(url).then(res => {
        const {data, status} = res
        console.log(data)
        console.log(status)
      })
    }
  }, [account])
  return (
    <>
    </>
  )
}