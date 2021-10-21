import React from 'react'

import CrossChainEVM from '../../components/CrossChainPanel/crossChainEVM'

export default function CrossChain() {
  return (
    <>
      <CrossChainEVM bridgeKey={'routerTokenList'} />
    </>
  )
}