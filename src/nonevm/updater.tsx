import React from 'react'

import CardanoUpdater from './cardano/updater'
import TrxUpdater from './trx/updater'
import FlowUpdater from './flow/updater'
import SolUpdater from './solana/updater'
import AptUpdater from './apt/updater'
import BtcUpdater from './btc/updater'

import {useActiveReact} from '../hooks/useActiveReact'
import { ChainId } from '../config/chainConfig/chainId'

export default function Updaters() {
  const { chainId } = useActiveReact()
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
  } else if ([ChainId.BTC, ChainId.BTC_TEST].includes(chainId)) {
    return <BtcUpdater />
  }
  return <></>
}