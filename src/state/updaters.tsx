import React from 'react'
import ApplicationUpdater from './application/updater'
import ListsUpdater from './lists/updater'
import MulticallUpdater from './multicall/updater'
import TransactionUpdater from './transactions/updater'
import UserUpdater from './user/updater'
// import PoolsUpdater from './pools/updater'
import WalletUpdater from './wallet/updater'

import NonevmUpdater from '../nonevm/updater'
// import RpcUpdater from './rpc/updater'

export function Updaters() {
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