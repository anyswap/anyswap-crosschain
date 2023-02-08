import React from 'react'

import CardanoUpdater from './cardano/updater'
import TrxUpdater from './trx/updater'
import FlowUpdater from './flow/updater'
import SolUpdater from './solana/updater'
import AptUpdater from './apt/updater'
import BtcUpdater from './btc/updater'
import AtomUpdater from './atom/updater'
import ReefUpdater from './reef/updater'
import NasUpdater from './nas/updater'

import {useActiveReact} from '../hooks/useActiveReact'
import { ChainId } from '../config/chainConfig/chainId'
import config from '../config'

export default function Updaters() {
  const { chainId } = useActiveReact()
  // console.log(config)
  if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId)) {
    return <CardanoUpdater />
  } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
    return <TrxUpdater />
  } else if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(chainId)) {
    return <FlowUpdater />
  } else if ([ChainId.SOL, ChainId.SOL_TEST].includes(chainId)) {
    return <SolUpdater />
  } else if ([ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
    return <AptUpdater />
  } else if ([ChainId.BTC, ChainId.BTC_TEST].includes(chainId) && config?.chainInfo?.[chainId]?.chainType !== 'NOWALLET') {
  // } else if ([ChainId.BTC_TEST].includes(chainId)) {
    return <BtcUpdater />
  } else if ([ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST, ChainId.ATOM_DCORE, ChainId.ATOM_DCORE_TEST].includes(chainId)) {
    return <AtomUpdater />
  } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
    return <ReefUpdater />
  } else if ([ChainId.NAS].includes(chainId)) {
    return <NasUpdater />
  }
  return <></>
}