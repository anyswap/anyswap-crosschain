import {updateTerraHash} from '../terra'
import {updateNasHash} from '../nas'
import {updateNearHash} from '../near'
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
    }
  })
}