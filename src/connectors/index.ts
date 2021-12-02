import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletConnectConnector } from 'web3-react/walletconnect-connector'

import { NetworkConnector } from './NetworkConnector'

// import {spportChainArr} from '../config/chainConfig'
import config from '../config'

const NETWORK_URL = config.nodeRpc

export const NETWORK_CHAIN_ID: number = config.chainID ?? 1

const spportChain:any = {}
const spportChainArr:any = []
for (const chainID in config.chainInfo) {
// for (const chainID of spportChainArr) {
  if (isNaN(Number(chainID))) continue
  if (chainID && config.chainInfo[chainID]?.nodeRpc) {
    spportChainArr.push(Number(chainID))
    spportChain[chainID] = config.chainInfo[chainID].nodeRpc
  }
}
// spportChainArr.push(Number(NETWORK_CHAIN_ID))
// spportChain[NETWORK_CHAIN_ID] = config.chainInfo[NETWORK_CHAIN_ID].nodeRpc

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}
// console.log(spportChainArr)
// mainnet only
export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [...spportChainArr],
  rpc: {
    ...spportChain
  },
  chainId: NETWORK_CHAIN_ID
})

export const network = new NetworkConnector({
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
