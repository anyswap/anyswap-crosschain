import {updateTerraHash} from '../terra'
import {updateNasHash} from '../nas'
import {updateNearHash} from '../near'
import {updateXlmHash} from '../stellar'
import {getTRXTxnsStatus} from '../trx'
import {getADATxnsStatus} from '../cardano'
import {getFLOWTxnsStatus} from '../flow'
import {getSolTxnsStatus} from '../solana'
import {getAptTxnsStatus} from '../apt'
import {getBtcHash} from '../btc'
import {getAtomTxnsStatus} from '../atom'
import {getReefTxnsStatus} from '../reef'

import { ChainId } from '../../config/chainConfig/chainId'

export function getHashInfo(hash: any, chainId: any) {
  return new Promise(resolve => {
    if ([ChainId.TERRA].includes(chainId)) {
      updateTerraHash(hash).then(res => {
        resolve(res)
      })
    } else if ([ChainId.NAS].includes(chainId)) {
      updateNasHash(hash).then(res => {
        resolve(res)
      })
    } else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {
      updateNearHash(hash, chainId).then(res => {
        resolve(res)
      })
    } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(chainId)) {
      updateXlmHash(hash, chainId).then(res => {
        resolve(res)
      })
    } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
      getTRXTxnsStatus(hash).then(res => {
        resolve(res)
      })
    } else if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId)) {
      getADATxnsStatus(hash, chainId).then(res => {
        resolve(res)
      })
    } else if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(chainId)) {
      getFLOWTxnsStatus(hash, chainId).then(res => {
        resolve(res)
      })
    } else if ([ChainId.SOL, ChainId.SOL_TEST].includes(chainId)) {
      getSolTxnsStatus(hash, chainId).then(res => {
        resolve(res)
      })
    } else if ([ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
      getAptTxnsStatus(hash, chainId).then(res => {
        resolve(res)
      })
    } else if ([ChainId.BTC, ChainId.BTC_TEST].includes(chainId)) {
      getBtcHash(hash, chainId).then(res => {
        resolve(res)
      })
    } else if ([ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST, ChainId.ATOM_DCORE, ChainId.ATOM_DCORE_TEST].includes(chainId)) {
      getAtomTxnsStatus(hash, chainId).then(res => {
        resolve(res)
      })
    } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      getReefTxnsStatus(hash, chainId).then(res => {
        resolve(res)
      })
    }
  })
}