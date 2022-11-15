import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import {BscConnector} from '@binance-chain/bsc-connector'
import {CloverConnector} from '@clover-network/clover-connector'
import { NetworkConnector } from './NetworkConnector'
import {XdefiConnector} from './xdefi'
import {BitKeepConnector} from './bitkeep'
import {SafeAppConnector} from './gnosis-safe'
import {TallyConnector} from './tally'

import {spportChainArr as sc} from '../config/chainConfig'
import config from '../config'

const NETWORK_URL = config.nodeRpc

export const NETWORK_CHAIN_ID: number = config.chainID ?? 1

const spportChain:any = {}
const spportChainArr:any = []
for (const chainID in config.chainInfo) {
// for (const chainID of spportChainArr) {
  if (isNaN(Number(chainID))) continue
  if (chainID && config.chainInfo[chainID]?.nodeRpc) {
    // spportChainArr.push(Number(chainID))
    spportChain[chainID] = config.chainInfo[chainID].nodeRpc
  }
}
// const sc1:any = sc
for (const c of sc) {
  if (isNaN(Number(c))) continue
  spportChainArr.push(Number(c))
}
// spportChainArr.push(Number(NETWORK_CHAIN_ID))
// spportChain[NETWORK_CHAIN_ID] = config.chainInfo[NETWORK_CHAIN_ID].nodeRpc
// console.log(spportChainArr)
if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}
// console.log(spportChainArr)
// mainnet only
// export const walletconnect = new WalletConnectConnector({
//   supportedChainIds: [...spportChainArr],
//   rpc: {
//     ...spportChain
//   },
//   chainId: NETWORK_CHAIN_ID
// })
export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [...spportChainArr],
  rpc: {
    ...spportChain
  },
  qrcode: true,
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


export const walletlink = new WalletLinkConnector({
  url: spportChain[NETWORK_CHAIN_ID],
  appName: 'Anyswap',
  appLogoUrl: 'https://assets.coingecko.com/coins/images/12242/small/anyswap.jpg',
  supportedChainIds: [...spportChainArr]
})


export const bsc = new BscConnector({
  supportedChainIds: [...spportChainArr],
})
export const xdefi = new XdefiConnector({
  supportedChainIds: [...spportChainArr],
})
export const bitkeep = new BitKeepConnector({
  supportedChainIds: [...spportChainArr],
})

export const clover =  new CloverConnector({
  supportedChainIds: [...spportChainArr],
})
export const tally =  new TallyConnector({
  supportedChainIds: [...spportChainArr],
})
export const gnosissafe =  new SafeAppConnector()