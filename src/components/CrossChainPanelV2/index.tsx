import React from 'react'
// import CrossChainBTC from './crossChainBTC'
import CrossChainEVM from './crossChainEVM'
// import CrossChainNonEVM from './crossChainNonEVM'
import { BRIDGE_KEY } from '../../config/constant'
// import { useUserSelectChainId } from '../../state/user/hooks'

export default function CrossChain({ bridgeKey }: { bridgeKey: BRIDGE_KEY }) {
  // const [selectNetworkInfo] = useUserSelectChainId()

  return (
    <>
      <CrossChainEVM bridgeKey={bridgeKey} />
    </>
  )

  // if (selectNetworkInfo?.label === 'BTC') {
  //   return (
  //     <>
  //       <CrossChainBTC bridgeKey={bridgeKey} />
  //     </>
  //   )
  // } else if (selectNetworkInfo?.label && selectNetworkInfo?.label !== 'BTC') {
  //   return (
  //     <>
  //       <CrossChainNonEVM bridgeKey={bridgeKey} />
  //     </>
  //   )
  // } else {
  //   return (
  //     <>
  //       <CrossChainEVM bridgeKey={bridgeKey} />
  //     </>
  //   )
  // }
}
