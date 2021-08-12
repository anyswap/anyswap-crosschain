import React, { useEffect, useState } from 'react'
import Farming from '../../components/Farming'
// import { getQueryParam } from '../../utils'
import config from '../../config'
import {VERSION} from '../../config/constant'
import Title from '../../components/Title'
import AppBody from '../AppBody'

import {getPrice} from '../../utils/tools/getPrice'

import farmlist from '../../config/farmlist'

const BSC_TRO = 'BSC_TRO'
export default function FarmingComponent() {
  // const [price, setPrice] = useState()
  const [LPprice, setLPPrice] = useState()
  useEffect(() => {
    // getPrice('HERO').then((res:any) => {
    //   console.log(res)
    //   setPrice(res)
    // })
    getPrice('ANY').then((res:any) => {
      console.log(res)
      setLPPrice(res)
    })
  }, [])
  return (
    <>
      <AppBody>
        <Title title='Stake ANY tokens to earn TRO'></Title>
        <Farming
          CHAINID = {farmlist[BSC_TRO].chainId}
          FARMTOKEN = {farmlist[BSC_TRO].farmToken}
          FARMURL = {config.farmUrl + 'farm/bsc/tro'}
          // initPairs = {['ANY', 'anyBTC', 'anyETH', 'anyUSDT', 'anyBNB', 'anyFSN']}
          poolCoin = 'TRO'
          poolCoinLogoUrl={require('../../assets/images/coin/source/TRO.png')}
          blockNumber = {farmlist[BSC_TRO].blockNumber}
          price={0.015}
          version={VERSION.V2_2}
          initLpList={farmlist[BSC_TRO].lpTokenIno}
          LPprice={LPprice}
        />
      </AppBody>
    </>
  )
}
