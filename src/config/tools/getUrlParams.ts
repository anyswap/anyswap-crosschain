import { createBrowserHistory } from 'history'

import { chainInfo,spportChainArr } from '../chainConfig'
import { isAddress } from '../../utils'

// import {ARBITRUM_MAIN_CHAINID} from './chainConfig/arbitrum'
// import {AVAX_MAIN_CHAINID} from './chainConfig/avax'
import {BNB_MAIN_CHAINID} from '../chainConfig/bsc'
import {ETH_MAIN_CHAINID} from '../chainConfig/eth'
import {FSN_MAIN_CHAINID} from '../chainConfig/fsn'
import {FTM_MAIN_CHAINID} from '../chainConfig/ftm'
import {HT_MAIN_CHAINID} from '../chainConfig/ht'

import {selectNetwork} from './methods'


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

let onlyOne = 0
function getParamNode(type: any, INIT_NODE: any) {
  type = type?.toString()?.toLowerCase()
  const history = createBrowserHistory()
  // console.log(history)
  // console.log(history.location.hash)
  // history.replace('')
  let labelStr = INIT_NODE
  for (const key in chainInfo) {
    // console.log(key)
    if (
      type === key
      || type === chainInfo[key].symbol.toLowerCase()
      || type === chainInfo[key].name.toLowerCase()
    ) {
      labelStr = chainInfo[key].label
      break
    }
  }
  if (!onlyOne) {
    onlyOne = 1
    const lpath = history.location.hash.split('?')
    const pathKey = lpath[0]
    const paramKey = lpath[1]
    const paramArr = paramKey.split('&')
    const paramList = []
    for (const k of paramArr) {
      if (k.indexOf('network=') === 0) continue
      paramList.push(k)
    }
    history.replace(pathKey + '?' + paramList.join('&'))
    if (!isNaN(labelStr)) {
      selectNetwork(labelStr, 1).then((res:any) => {
        console.log(res)
        if (res.msg === 'Error') {
          alert(`Please switch metamask network to：${chainInfo[labelStr].networkName}`)
        }
      })
    }
  }
  return labelStr
}

function getNode(type: any, INIT_NODE: any) {
  let labelStr = INIT_NODE
  if (type.indexOf('fsn') !== -1) {
    labelStr = chainInfo[FSN_MAIN_CHAINID].label
  } else if (type.indexOf('bsc') !== -1) {
    labelStr = chainInfo[BNB_MAIN_CHAINID].label
  } else if (type.indexOf('ftm') !== -1) {
    labelStr = chainInfo[FTM_MAIN_CHAINID].label
  } else if (type.indexOf('eth') !== -1) {
    labelStr = chainInfo[ETH_MAIN_CHAINID].label
  } else if (type.indexOf('huobi') !== -1) {
    labelStr = chainInfo[HT_MAIN_CHAINID].label
  }
  if (!onlyOne) {
    selectNetwork(labelStr)
  }
  return labelStr
}
export function getNetwork(ENV_NODE_CONFIG: any, INIT_NODE: any) {
  let nc = ''
  const urlParams = getParams('network')
  const srcchainid = getParams('srcchainid')
  const localHost = window.location.host
  let localStr = window.localStorage.getItem(ENV_NODE_CONFIG)
  if (localStr && !spportChainArr.includes(localStr.toString())) {
    localStr = INIT_NODE
  }
  if (urlParams) {
    nc = getParamNode(urlParams, INIT_NODE)
    // window.localStorage.setItem(ENV_NODE_CONFIG, nc)
  } else if (srcchainid) {
    nc = getParamNode(srcchainid, INIT_NODE)
    // window.localStorage.setItem(ENV_NODE_CONFIG, nc)
  } else {
    if (localStr) {
      nc = localStr
    } else {
      nc = getNode(localHost, INIT_NODE)
    }
  }
  window.localStorage.setItem(ENV_NODE_CONFIG, nc)
  return nc
}

const ID_CODE = 'ID_CODE'
export function getIdCode() {
  const urlParams = getParams('agent')
  if (urlParams) {
    window.localStorage.setItem(ID_CODE, urlParams)
  }
}
