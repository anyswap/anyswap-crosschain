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
  const [LPprice, setLPPrice] = useState()
  useEffect(() => {
    getPrice('DEP').then((res:any) => {
      console.log(res)
      setPrice(res)
    })
    getPrice('ANY').then((res:any) => {
      console.log(res)
      setLPPrice(res)
    })
  }, [])
  return (
    <>
      <AppBody>
        <Title title='Stake ANY tokens to earn DEP'></Title>
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
          LPprice={LPprice}
        />
      </AppBody>
    </>
  )
}
