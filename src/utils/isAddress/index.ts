
import { AccAddress } from '@terra-money/terra.js'
import { getAddress } from '@ethersproject/address'
import nebulas from 'nebulas'
import { ChainId } from "../../config/chainConfig/chainId"
import {isBTCAddress, BTCARR} from './BTC'

import {isTRXAddress} from '../../hooks/trx'

export function isEvmAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function isAddress(address: any, chainId?: any) {
  if (!address) return undefined
  if (chainId) {
    if ([ChainId.TRX].includes(chainId)) {
      return isTRXAddress(address)
    } else if ([ChainId.NAS].includes(chainId)) {
      return nebulas.Account.isValidAddress(address) ? address : false
    } else if ([ChainId.TERRA].includes(chainId)) {
      return AccAddress.validate(address) ? address : false
    } else if ([ChainId.XRP].includes(chainId)) {
      return address && address.indexOf('r') === 0 && address.length === 34 ? true : false
    } else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {
      return address ? address : false
    } else if (BTCARR.includes(chainId)) {
      return isBTCAddress(address, chainId)
    } else {
      return isEvmAddress(address)
    }
  } else {
    return isEvmAddress(address)
  }
}
