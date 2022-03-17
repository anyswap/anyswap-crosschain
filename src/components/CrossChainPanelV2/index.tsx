import React from 'react'
import CrossChainBTC from './crossChainBTC'
import CrossChainEVM from './crossChainEVM'
import CrossChainNonEVM from './crossChainNonEVM'

import { useUserSelectChainId } from '../../state/user/hooks'

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {
  const [selectNetworkInfo] = useUserSelectChainId()

  if (selectNetworkInfo?.label === 'BTC') {
    return (
      <>
        <CrossChainBTC bridgeKey={bridgeKey} />
      </>
    )
  } else if (selectNetworkInfo?.label && selectNetworkInfo?.label !== 'BTC') {
    return (
      <>
        <CrossChainNonEVM bridgeKey={bridgeKey} />
      </>
    )
  } else {
    return (
      <>
        <CrossChainEVM bridgeKey={bridgeKey} />
      </>
    )
  }
}