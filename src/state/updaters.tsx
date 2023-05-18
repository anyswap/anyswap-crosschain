import React, { useEffect } from 'react'
import ApplicationUpdater from './application/updater'
import ListsUpdater from './lists/updater'
import MulticallUpdater from './multicall/updater'
import TransactionUpdater from './transactions/updater'
import UserUpdater from './user/updater'
// import PoolsUpdater from './pools/updater'
import WalletUpdater from './wallet/updater'

import NonevmUpdater from '../nonevm/updater'

import {getParams} from '../config/tools/getUrlParams'

import {
  setCookie
} from '../utils/cookie'
// import RpcUpdater from './rpc/updater'

export function Updaters() {
  useEffect(() => {
    const parterLabel = getParams('utm_source')
    // console.log(parterLabel)
    if (parterLabel) {
      setCookie('parter', parterLabel)
    }
  }, [])
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      {/* <PoolsUpdater /> */}
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <WalletUpdater />
      <NonevmUpdater />
      {/* <RpcUpdater /> */}
      {/* <MulticallUpdater type={1}/> */}
    </>
  )
}