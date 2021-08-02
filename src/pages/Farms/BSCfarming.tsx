import React, { useEffect, useState } from 'react'
import Farming from '../../components/Farming'
// import { getQueryParam } from '../../utils'
import config from '../../config'
import {VERSION} from '../../config/constant'
import Title from '../../components/Title'
import AppBody from '../AppBody'

import {getPrice} from '../../utils/tools/getPrice'

import farmlist from '../../config/farmlist'

const BSC = 'BSC'
export default function FarmingComponent() {
  const [price, setPrice] = useState()
  useEffect(() => {
    getPrice('DEP').then((res:any) => {
      console.log(res)
      setPrice(res)
    })
  }, [])
  return (
    <>
      <AppBody>
        <Title title='Stake LP tokens to earn ANY'></Title>
        <Farming
          CHAINID = {farmlist[BSC].chainId}
          FARMTOKEN = {farmlist[BSC].farmToken}
          FARMURL = {config.farmUrl + 'farm/bsc'}
          // initPairs = {['ANY', 'anyBTC', 'anyETH', 'anyUSDT', 'anyBNB', 'anyFSN']}
          poolCoin = 'DEP'
          poolCoinLogoUrl={'https://assets.coingecko.com/coins/images/10970/small/DEAPcoin_01.png'}
          blockNumber = {farmlist[BSC].blockNumber}
          price={price}
          version={VERSION.V2_2}
          initLpList={farmlist[BSC].lpTokenIno}
        />
      </AppBody>
    </>
  )
}
