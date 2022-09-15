import {updateTerraHash} from '../terra'
import {updateNasHash} from '../nas'
import {updateNearHash} from '../near'
import {updateXlmHash} from '../stellar'
import {getTRXTxnsStatus} from '../trx'
import {getADATxnsStatus} from '../cardano'
import {getFLOWTxnsStatus} from '../flow'
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
    }
  })
}