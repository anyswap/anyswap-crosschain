import React, { useEffect, useState } from 'react'
import Farming from '../../components/Farming'
// import { getQueryParam } from '../../utils'
import config from '../../config'
// import {VERSION} from '../../config/constant'
import Title from '../../components/Title'
import AppBody from '../AppBody'

import {getAllLabelPrice} from '../../utils/tools/getPrice'

import farmlist from '../../config/farmlist'

interface FarmProp {
  farmkey:any
}

export default function FarmingComponent({
  farmkey
}: FarmProp) {
  const [price, setPrice] = useState(1)
  const [lpPrice, setLpPrice] = useState(1)
  useEffect(() => {
    const arr = []
    if (farmlist[farmkey]?.keyLable) {
      arr.push(farmlist[farmkey]?.keyLable)
    }
    if (farmlist[farmkey]?.lpKeyLabel) {
      arr.push(farmlist[farmkey]?.lpKeyLabel)
    }
    getAllLabelPrice(arr).then((res:any) => {
      if (res) {
        if (farmlist[farmkey]?.keyLable && res?.[farmlist[farmkey]?.keyLable].usd) {
          setPrice(res?.[farmlist[farmkey]?.keyLable].usd)
        }
        if (farmlist[farmkey]?.lpKeyLabel && res?.[farmlist[farmkey]?.lpKeyLabel].usd) {
          setLpPrice(res?.[farmlist[farmkey]?.lpKeyLabel].usd)
        }
      }
    })
    // if (farmlist[farmkey]?.lpKey && farmlist[farmkey]?.lpKey !== farmlist[farmkey].key) {
    //   getPrice(farmlist[farmkey].key).then((res:any) => {
    //     // console.log(res)
    //     setPrice(res)
    //   })
    //   getPrice(farmlist[farmkey].lpKey).then((res:any) => {
    //     // console.log(res)
    //     setLpPrice(res)
    //   })
    // } else {
    //   getPrice(farmlist[farmkey].key).then((res:any) => {
    //     // console.log(res)
    //     setPrice(res)
    //     setLpPrice(res)
    //   })
    // }
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
          lpPrice={lpPrice}
          initLpList={farmlist[farmkey].lpTokenIno}
          stakeType={'LP'}
          isEnd={farmlist[farmkey].isEnd}
        />
      </AppBody>
    </>
  )
}
