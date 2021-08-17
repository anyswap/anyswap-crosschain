import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'

import { NetworkConnector } from './NetworkConnector'
import { TerraConnector } from './TerraConnector'

import {spportChainArr} from '../config/chainConfig'
import config from '../config'

const NETWORK_URL = config.nodeRpc

const spportChain:any = {}
// for (const chainID in config.chainInfo) {
for (const chainID of spportChainArr) {
  if (isNaN(Number(chainID))) continue
  spportChain[chainID] = config.chainInfo[chainID].nodeRpc
}
console.log(spportChainArr)
console.log(spportChain)
export const NETWORK_CHAIN_ID: number = config.chainID ?? 1

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  // urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
  defaultChainId: NETWORK_CHAIN_ID,
  urls: { ...spportChain }
})

export const terra = new TerraConnector({
  // urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
  defaultChainId: NETWORK_CHAIN_ID,
  urls: { ...spportChain }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [...spportChainArr]
})

// export const Okinjected = new InjectedConnector({
//   supportedChainIds: [...spportChainArr]
// })
