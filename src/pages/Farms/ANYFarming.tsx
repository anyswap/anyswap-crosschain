import React, { useEffect, useState } from 'react'
import Farming from '../../components/Farming'
// import { getQueryParam } from '../../utils'
import config from '../../config'
// import {VERSION} from '../../config/constant'
import Title from '../../components/Title'
import AppBody from '../AppBody'

import {getPrice} from '../../utils/tools/getPrice'

import farmlist from '../../config/farmlist'

interface FarmProp {
  farmkey:any
}

export default function FarmingComponent({
  farmkey
}: FarmProp) {
  // console.log(farmkey)
  if (!farmkey) return <></>
  const [price, setPrice] = useState()
  const [LPprice, setLPPrice] = useState()
  useEffect(() => {
    
    if (farmlist[farmkey].price) {
      setPrice(farmlist[farmkey].price)
    } else {
      getPrice(farmlist[farmkey].key).then((res:any) => {
        console.log(res)
        setPrice(res)
      })
    }
    getPrice('ANY').then((res:any) => {
      console.log(res)
      setLPPrice(res)
    })
  }, [])
  return (
    <>
      <AppBody>
        <Title title={'Stake ANY tokens to earn ' + farmlist[farmkey].key}></Title>
        <Farming
          CHAINID = {farmlist[farmkey].chainId}
          FARMTOKEN = {farmlist[farmkey].farmToken}
          FARMURL = {config.farmUrl + farmlist[farmkey].url}
          poolCoin = {farmlist[farmkey].key}
          poolCoinLogoUrl={farmlist[farmkey].logoUrl}
          blockNumber = {farmlist[farmkey].blockNumber}
          price={price}
          initLpList={farmlist[farmkey].lpTokenIno}
          LPprice={LPprice}
        />
      </AppBody>
    </>
  )
}
