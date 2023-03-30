import React from 'react'
import SwapToken from './index'
import {SWAP_TYPE} from './data'
export default function SwapBTC () {
  return <SwapToken swapType={SWAP_TYPE.BTC} />
}