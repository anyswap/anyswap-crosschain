import {
  USE_VERSION
} from '../constant'

export function formatSwapTokenList (name, tokenlist) {
  const arr = []
  for (const obj of tokenlist) {
    arr.push({
      ...obj,
      address: obj.address.toLowerCase()
    })
  }
  return {
    "keywords": ["roll", "default", "social money", "personal tokens"],
    "logoURI": "",
    "name": name,
    "timestamp": "",
    "tokens": arr,
    "version": {"major": 0, "minor": 0, "patch": 1}
  }
}

const LOCAL_RPC = 'LOCAL_RPC'
export function getLocalRPC (chainId, initRpc) {
  const lStr = window.localStorage.getItem(USE_VERSION + '_' + LOCAL_RPC)
  if (lStr) {
    const lObj = JSON.parse(lStr)
    if (lObj[chainId]) {
      return lObj[chainId]
    } else {
      return initRpc
    }
  } else {
    return initRpc
  }
}

export function setLocalRPC (chainId, initRpc) {
  const lStr = window.localStorage.getItem(USE_VERSION + '_' + LOCAL_RPC)
  let lObj ={}
  if (lStr) {
    lObj = JSON.parse(lStr)
    lObj[chainId] = initRpc
  } else {
    lObj[chainId] = initRpc
  }
  window.localStorage.setItem(USE_VERSION + '_' + LOCAL_RPC, JSON.stringify(lObj))
}