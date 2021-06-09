import React from 'react'
import Farming from '../../components/Farming'
// import { getQueryParam } from '../../utils'
import config from '../../config'
import Title from '../../components/Title'
import AppBody from '../AppBody'

export default function MATICfaring({initialTrade}: {initialTrade?:string}) {
  // let initLpToken = getQueryParam(window.location, 'lpToken')
  const CHAINID = '137'
  const FARMTOKEN = '0xB0A3dA261BAD3Df3f3cc3a4A337e7e81f6407c49'
  console.log(initialTrade)
  return (
    <>
      <AppBody>
        <Title title='Stake LP tokens to earn ANY'></Title>
        <Farming
          // initLpToken = {initLpToken}
          initialTrade = {initialTrade}
          CHAINID = {CHAINID}
          FARMTOKEN = {FARMTOKEN}
          FARMURL = {config.farmUrl + 'farm/matic'}
          // initPairs = {['ANY', 'anyBTC', 'anyETH', 'anyUSDT', 'anyBNB', 'anyFSN']}
          poolCoin = 'ANY'
          blockNumber = {6600}
        />
      </AppBody>
    </>
  )
}
