import React, { useEffect, useState } from 'react'
import Farming from '../../components/Farming'
// import { getQueryParam } from '../../utils'
import config from '../../config'
// import {VERSION} from '../../config/constant'
import Title from '../../components/Title'
import AppBody from '../AppBody'

import {getPrice} from '../../utils/tools/getPrice'

import farmlist from '../../config/farmlist'

const FARM_KEY = 'MATIC'
export default function FarmingComponent() {
  const [price, setPrice] = useState()
  useEffect(() => {
    getPrice('ANY').then((res:any) => {
      // console.log(res)
      setPrice(res)
    })
  }, [])
  return (
    <>
      <AppBody>
        <Title title='Stake LP tokens to earn ANY'></Title>
        <Farming
          CHAINID = {farmlist[FARM_KEY].chainId}
          FARMTOKEN = {farmlist[FARM_KEY].farmToken}
          FARMURL = {config.farmUrl + 'farm/matic'}
          // initPairs = {['ANY', 'anyBTC', 'anyETH', 'anyUSDT', 'anyBNB', 'anyFSN']}
          poolCoin = 'ANY'
          poolCoinLogoUrl={'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'}
          blockNumber = {farmlist[FARM_KEY].blockNumber}
          price={price}
          initLpList={farmlist[FARM_KEY].lpTokenIno}
          stakeType={'LP'}
        />
      </AppBody>
    </>
  )
}
