import React from 'react'

import CardanoUpdater from './cardano/updater'
import TrxUpdater from './trx/updater'
import FlowUpdater from './flow/updater'

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
  }
  return <></>
}