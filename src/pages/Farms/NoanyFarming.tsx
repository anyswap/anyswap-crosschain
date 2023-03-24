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
  const [price, setPrice] = useState()
  useEffect(() => {
    getPrice(farmlist[farmkey].key).then((res:any) => {
      // console.log(res)
      setPrice(res)
    })
  }, [])
  return (
    <>
      <AppBody>
        <Title title={'Stake LP tokens to earn ' + farmlist[farmkey].key}></Title>
        <Farming
          CHAINID = {farmlist[farmkey].chainId}
          FARMTOKEN = {farmlist[farmkey].farmToken}
          FARMURL = {config.farmUrl + farmlist[farmkey].url}
          poolCoin = {farmlist[farmkey].key}
          poolCoinLogoUrl={farmlist[farmkey].logoUrl}
          blockNumber = {farmlist[farmkey].blockNumber}
          price={price}
          initLpList={farmlist[farmkey].lpTokenIno}
          stakeType={'LP'}
          isEnd={farmlist[farmkey].isEnd}
        />
      </AppBody>
    </>
  )
}
