import { chainInfo } from './chainConfig'
import { isAddress } from '../utils'

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
  if (type === 'fusion' || type === '32659') {
    return chainInfo['32659'].label
  } else if (type === 'fusiontestnet' || type === '46688') {
    return chainInfo['46688'].label
  } else if (type === 'bsc' || type === '56') {
    return chainInfo['56'].label
  } else if (type === 'bsctestnet' || type === '97') {
    return chainInfo['97'].label
  } else if (type === 'fantom' || type === '250') {
    return chainInfo['250'].label
  } else if (type === 'eth' || type === '1') {
    return chainInfo['1'].label
  } else if (type === 'huobi' || type === '128') {
    return chainInfo['128'].label
  } else if (type === 'huobitestnet' || type === '256') {
    return chainInfo['256'].label
  } else {
    return INIT_NODE
  }
}

function getNode(type: any, INIT_NODE: any) {
  if (type.indexOf('fsn') !== -1) {
    return chainInfo['32659'].label
  } else if (type.indexOf('bsc') !== -1) {
    return chainInfo['56'].label
  } else if (type.indexOf('ftm') !== -1) {
    return chainInfo['250'].label
  } else if (type.indexOf('eth') !== -1) {
    return chainInfo['1'].label
  } else if (type.indexOf('huobi') !== -1) {
    return chainInfo['128'].label
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
