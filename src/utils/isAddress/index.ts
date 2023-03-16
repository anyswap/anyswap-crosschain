
import { AccAddress } from '@terra-money/terra.js'
import { getAddress } from '@ethersproject/address'
import nebulas from 'nebulas'
import { ChainId } from "../../config/chainConfig/chainId"
import {isBTCAddress, BTCARR} from './BTC'

import {isTRXAddress} from '../../nonevm/trx'
import {isSolAddress} from '../../nonevm/solana'
import {isAptosAddress} from '../../nonevm/apt'
import {isAtomAddress} from '../../nonevm/atom'
import {isReefAddress} from '../../nonevm/reef'

export function isEvmAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

const IotaBech32Helper = {
  BECH32_DEFAULT_HRP_MAIN: /^iota/,
  BECH32_DEFAULT_HRP_DEV: /^atoi/
}

const stellarAddress = /^[1-9A-Z]{56}$/

export function isAddress(address: any, chainId?: any) {
  // console.log(chainId, address)
  if (!address) return undefined
  if (chainId) {
    if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
      return isTRXAddress(address)
    } else if ([ChainId.NAS].includes(chainId)) {
      return nebulas.Account.isValidAddress(address) ? address : false
    } else if ([ChainId.TERRA].includes(chainId)) {
      return AccAddress.validate(address) ? address : false
    } else if ([ChainId.XRP].includes(chainId)) {
      return address && address.indexOf('r') === 0 && address.length === 34 ? true : false
    } else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {
      return address && address.indexOf('0x') !== 0 ? address : false
    } else if (BTCARR.includes(chainId)) {
      return isBTCAddress(address, chainId)
    } else if ([ChainId.IOTA, ChainId.IOTA_TEST].includes(chainId)) {
      if (chainId === ChainId.IOTA) {
        if (IotaBech32Helper.BECH32_DEFAULT_HRP_MAIN.test(address)) {
          return address
        }
        return false
      } else {
        if (IotaBech32Helper.BECH32_DEFAULT_HRP_DEV.test(address)) {
          return address
        }
        return false
      }
    } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(chainId)) {
      if (stellarAddress.test(address)) {
        return address
      }
      return false
    } else if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId)) {
      if (chainId === ChainId.ADA) {
        const pattern = /^addr[0-9a-zA-Z]{54,99}/
        if (pattern.test(address)) {
          return address
        }
      } else {
        const pattern = /^addr_test[0-9a-zA-Z]{54,99}/
        if (pattern.test(address)) {
          return address
        }
      }
      return false
    } else if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(chainId)) {
      const pattern = /^0x[0-9a-zA-Z]{16}/
      if (pattern.test(address)) {
        return address
      }
      return false
    } else if ([ChainId.SOL, ChainId.SOL_TEST].includes(chainId)) {
      return isSolAddress(address)
    } else if ([ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
      return isAptosAddress(address)
    } else if ([ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST, ChainId.ATOM_DCORE, ChainId.ATOM_DCORE_TEST].includes(chainId)) {
      return isAtomAddress(address, chainId)
    } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      return isReefAddress(address)
    } else {
      return isEvmAddress(address)
    }
  } else {
    return isEvmAddress(address)
  }
}
