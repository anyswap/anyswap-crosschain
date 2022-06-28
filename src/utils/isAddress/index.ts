
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

export function isAddress(address: string, chainId?: any) {
  if (chainId) {
    if (chainId === ChainId.TRX) {
      return isTRXAddress(address)
    } else if (chainId === ChainId.NAS) {
      return nebulas.Account.isValidAddress(address) ? address : false
    } else if (chainId === ChainId.TERRA) {
      return AccAddress.validate(address) ? address : false
    } else if (chainId === ChainId.XRP) {
      return address && address.indexOf('r') === 0 && address.length === 34 ? true : false
    } else if (
      chainId === ChainId.NEAR
      || chainId === ChainId.NEAR_TEST
    ) {
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
