// import React, { useEffect, useState } from 'react'
import React from 'react'
import Farming from '../../components/Farming'
// import { getQueryParam } from '../../utils'
import config from '../../config'
// import {VERSION} from '../../config/constant'
import Title from '../../components/Title'
import AppBody from '../AppBody'

// import {getPrice} from '../../utils/tools/getPrice'

import farmlist from '../../config/farmlist'

const FARM_KEY = 'ETH_TEST'
export default function FarmingComponent() {
  // const [price, setPrice] = useState()
  // const [LPprice, setLPPrice] = useState()
  // useEffect(() => {
  //   // getPrice('HERO').then((res:any) => {
  //   //   console.log(res)
  //   //   setPrice(res)
  //   // })
  //   getPrice('ANY').then((res:any) => {
  //     console.log(res)
  //     setLPPrice(res)
  //   })
  // }, [])
  return (
    <>
      <AppBody>
        <Title title='Stake ANY tokens to earn TRO'></Title>
        <Farming
          CHAINID = {farmlist[FARM_KEY].chainId}
          FARMTOKEN = {farmlist[FARM_KEY].farmToken}
          FARMURL = {config.farmUrl + 'farm/eth/test'}
          // initPairs = {['ANY', 'anyBTC', 'anyETH', 'anyUSDT', 'anyBNB', 'anyFSN']}
          poolCoin = 'TRO'
          poolCoinLogoUrl={require('../../assets/images/coin/source/TRO.png')}
          blockNumber = {farmlist[FARM_KEY].blockNumber}
          price={0.015}
          initLpList={farmlist[FARM_KEY].lpTokenIno}
          LPprice={1}
        />
      </AppBody>
    </>
  )
}
