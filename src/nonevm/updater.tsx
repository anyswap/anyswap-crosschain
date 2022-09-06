import React from 'react'

import CardanoUpdater from './cardano/updater'
import TrxUpdater from './trx/updater'

import {useActiveReact} from '../hooks/useActiveReact'
import { ChainId } from '../config/chainConfig/chainId'

export default function Updaters() {
  const { chainId } = useActiveReact()
  if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId)) {
    return <CardanoUpdater />
  } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
    return <TrxUpdater />
  }
  return <></>
}