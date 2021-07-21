import { chainInfo } from './chainConfig'
import { isAddress } from '../utils'

import {ARBITRUM_MAIN_CHAINID} from './chainConfig/arbitrum'
import {AVAX_MAIN_CHAINID} from './chainConfig/avax'
import {BNB_MAIN_CHAINID, BNB_TEST_CHAINID} from './chainConfig/bsc'
import {ETH_MAIN_CHAINID, ETH_TEST_CHAINID} from './chainConfig/eth'
import {FSN_MAIN_CHAINID, FSN_TEST_CHAINID} from './chainConfig/fsn'
import {FTM_MAIN_CHAINID} from './chainConfig/ftm'
import {HT_MAIN_CHAINID, HT_TEST_CHAINID} from './chainConfig/ht'
import {MATIC_MAIN_CHAINID} from './chainConfig/matic'
import {XDAI_MAIN_CHAINID} from './chainConfig/xdai'
import {KCC_MAIN_CHAINID} from './chainConfig/kcc'

export function getParams(param: any) {
  const str = window.location.href.indexOf('?') ? window.location.href.split('?')[1] : ''
  if (str) {
    const arr = str.split('&')
    let value = ''
    for (const str2 of arr) {
      const arr2 = str2.split('=')
      if (arr2[0] === param) {
        value = arr2[1]
        break
      }
    }
    return value
  } else {
    return ''
  }
}

export function getInitBridgeChain(destChainID: any, bridgeToken: any) {
  const nc = {
    initChain: destChainID,
    bridgeInitToken: bridgeToken
  }
  const dc = getParams('destchainid')
  const bt = getParams('bridgetoken')
  if (dc) {
    nc.initChain = dc
  }
  if (bt && isAddress(bt)) {
    nc.bridgeInitToken = bt
  }

  return nc
}


function getParamNode(type: any, INIT_NODE: any) {
  type = type?.toString()?.toLowerCase()
  if (type === 'fusion' || type === 'fsn' || type.toString() === FSN_MAIN_CHAINID) {
    return chainInfo[FSN_MAIN_CHAINID].label
  } else if (type === 'fusiontestnet' || type === 'fsntestnet' || type.toString() === FSN_TEST_CHAINID) {
    return chainInfo[FSN_TEST_CHAINID].label
  } else if (type === 'bsc' || type.toString() === BNB_MAIN_CHAINID) {
    return chainInfo[BNB_MAIN_CHAINID].label
  } else if (type === 'bsctestnet' || type.toString() === BNB_TEST_CHAINID) {
    return chainInfo[BNB_TEST_CHAINID].label
  } else if (type === 'fantom' || type === 'ftm' || type.toString() === FTM_MAIN_CHAINID) {
    return chainInfo[FTM_MAIN_CHAINID].label
  } else if (type === 'eth' || type.toString() === ETH_MAIN_CHAINID) {
    return chainInfo[ETH_MAIN_CHAINID].label
  } else if (type === 'ethtestnet' || type.toString() === ETH_TEST_CHAINID) {
    return chainInfo[ETH_TEST_CHAINID].label
  } else if (type === 'huobi' || type === 'ht' || type.toString() === HT_MAIN_CHAINID) {
    return chainInfo[HT_MAIN_CHAINID].label
  } else if (type === 'huobitestnet' || type === 'httestnet' || type.toString() === HT_TEST_CHAINID) {
    return chainInfo[HT_TEST_CHAINID].label
  } else if (type === 'polygon' || type === 'matic' || type.toString() === MATIC_MAIN_CHAINID) {
    return chainInfo[MATIC_MAIN_CHAINID].label
  } else if (type === 'xdai' || type.toString() === XDAI_MAIN_CHAINID) {
    return chainInfo[XDAI_MAIN_CHAINID].label
  } else if (type === 'avalanche' || type === 'avax' || type.toString() === AVAX_MAIN_CHAINID) {
    return chainInfo[AVAX_MAIN_CHAINID].label
  } else if (type === 'arbitrum' || type.toString() === ARBITRUM_MAIN_CHAINID) {
    return chainInfo[ARBITRUM_MAIN_CHAINID].label
  } else if (type === 'kcc' || type.toString() === KCC_MAIN_CHAINID) {
    return chainInfo[KCC_MAIN_CHAINID].label
  } else {
    return INIT_NODE
  }
}

function getNode(type: any, INIT_NODE: any) {
  if (type.indexOf('fsn') !== -1) {
    return chainInfo[FSN_MAIN_CHAINID].label
  } else if (type.indexOf('bsc') !== -1) {
    return chainInfo[BNB_MAIN_CHAINID].label
  } else if (type.indexOf('ftm') !== -1) {
    return chainInfo[FTM_MAIN_CHAINID].label
  } else if (type.indexOf('eth') !== -1) {
    return chainInfo[ETH_MAIN_CHAINID].label
  } else if (type.indexOf('huobi') !== -1) {
    return chainInfo[HT_MAIN_CHAINID].label
  } else {
    return INIT_NODE
  }
}
export function getNetwork(ENV_NODE_CONFIG: any, INIT_NODE: any) {
  let nc = ''
  const urlParams = getParams('network')
  const srcchainid = getParams('srcchainid')
  const localHost = window.location.host
  const localStr = localStorage.getItem(ENV_NODE_CONFIG)
  if (urlParams) {
    nc = getParamNode(urlParams, INIT_NODE)
    localStorage.setItem(ENV_NODE_CONFIG, nc)
  } else if (srcchainid) {
    nc = getParamNode(srcchainid, INIT_NODE)
    localStorage.setItem(ENV_NODE_CONFIG, nc)
  } else {
    if (localStr) {
      nc = localStr
    } else {
      nc = getNode(localHost, INIT_NODE)
      localStorage.setItem(ENV_NODE_CONFIG, nc)
    }
  }
  return nc
}

const ID_CODE = 'ID_CODE'
export function getIdCode() {
  const urlParams = getParams('agent')
  if (urlParams) {
    localStorage.setItem(ID_CODE, urlParams)
  }
}
