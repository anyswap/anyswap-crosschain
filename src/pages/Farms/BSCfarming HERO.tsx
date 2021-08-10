import React, { useEffect, useState } from 'react'
import Farming from '../../components/Farming'
// import { getQueryParam } from '../../utils'
import config from '../../config'
import {VERSION} from '../../config/constant'
import Title from '../../components/Title'
import AppBody from '../AppBody'

import {getPrice} from '../../utils/tools/getPrice'

import farmlist from '../../config/farmlist'

const BSC_HERO = 'BSC_HERO'
export default function FarmingComponent() {
  const [price, setPrice] = useState()
  const [LPprice, setLPPrice] = useState()
  useEffect(() => {
    getPrice('HERO').then((res:any) => {
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
        <Title title='Stake ANY tokens to earn HERO'></Title>
        <Farming
          CHAINID = {farmlist[BSC_HERO].chainId}
          FARMTOKEN = {farmlist[BSC_HERO].farmToken}
          FARMURL = {config.farmUrl + 'farm/bsc/hero'}
          // initPairs = {['ANY', 'anyBTC', 'anyETH', 'anyUSDT', 'anyBNB', 'anyFSN']}
          poolCoin = 'HERO'
          poolCoinLogoUrl={'https://assets.coingecko.com/coins/images/16245/small/HERO-200.png'}
          blockNumber = {farmlist[BSC_HERO].blockNumber}
          price={price}
          version={VERSION.V2_2}
          initLpList={farmlist[BSC_HERO].lpTokenIno}
          LPprice={LPprice}
        />
      </AppBody>
    </>
  )
}
