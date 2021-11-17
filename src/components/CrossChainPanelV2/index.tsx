import React from 'react'
import CrossChainBTC from './crossChainBTC'
import CrossChainEVM from './crossChainEVM'

import { useUserSelectChainId } from '../../state/user/hooks'

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {
  const [selectNetworkInfo] = useUserSelectChainId()
  // console.log(selectNetworkInfo)
  if (selectNetworkInfo?.label === 'BTC') {
    return (
      <>
        <CrossChainBTC bridgeKey={bridgeKey} />
      </>
    )
  }
  return (
    <>
      <CrossChainEVM bridgeKey={bridgeKey} />
    </>
  )
}