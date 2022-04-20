import { ChainId } from "../../config/chainConfig/chainId"

export const BASE_INFO = {
  name: 'Multichain',
  symbol: 'MULTI',
  decimals: 18
}

export const VENFT_BASE_INFO = {
  name: 'veNFT',
  symbol: 'veNFT',
  decimals: 18
}

export const veMULTI:any = {
  [ChainId.RINKEBY]: {
    ...VENFT_BASE_INFO,
    address: '0x21dbD7562981cC4bafeA14dBec82eD24Cdba8E3F'
  },
  // [ChainId.BNB_TEST]: {
  //   ...VENFT_BASE_INFO,
  //   address: '0x27C03bDc9ec0945a4ab06DDC11CC0e8946eC4Aab'
  // }
}

export const MULTI_TOKEN:any = {
  [ChainId.RINKEBY]: {
    ...BASE_INFO,
    address: '0xf58C8B9E2645Ff2dF78ED3C0A15ef04E0CCA2567'
  },
  // [ChainId.BNB_TEST]: {
  //   ...BASE_INFO,
  //   address: '0x74e8e6eb31ef6970d2623a1c700cbe6f56f20f43'
  // }
}

export const REWARD_TOKEN:any = {
  [ChainId.RINKEBY]: {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 18,
    address: '0x1241aeCFb79B1e2c0cac7A83B47b11303968d695'
  },
  // [ChainId.BNB_TEST]: {
  //   address: '0x74e8e6eb31ef6970d2623a1c700cbe6f56f20f43'
  // }
}

export const REWARD:any = {
  [ChainId.RINKEBY]: {
    address: '0x06De03C78A81A05b05141bbA9cF5271fBdbbAa88'
  },
  // [ChainId.BNB_TEST]: {
  //   address: '0x25c5Cc9082d7d87B3321868bA2C64e0C969072a4'
  // }
}