import { ChainId } from "../../config/chainConfig/chainId"

export const BASE_INFO = {
  name: 'Multichain',
  symbol: 'MULTI',
  decimals: 18,
  label: 'multichain'
}

export const VENFT_BASE_INFO = {
  name: 'veNFT',
  symbol: 'veNFT',
  decimals: 18
}

export const REWARD_BASE_INFO = {
  name: 'USDCoin',
  symbol: 'USDC',
  decimals: 18
}

export const veMULTI:any = {
  [ChainId.RINKEBY]: {
    ...VENFT_BASE_INFO,
    address: '0x1E1A9090c8F2adF292042a89639d7a54Ab523Ad7'
  },
  // [ChainId.BNB_TEST]: {
  //   ...VENFT_BASE_INFO,
  //   address: '0x27C03bDc9ec0945a4ab06DDC11CC0e8946eC4Aab'
  // }
}

export const MULTI_TOKEN:any = {
  [ChainId.RINKEBY]: {
    ...BASE_INFO,
    address: '0x5aD702B98194046b0998c552F04Fd74A582560A1'
  },
  // [ChainId.BNB_TEST]: {
  //   ...BASE_INFO,
  //   address: '0x74e8e6eb31ef6970d2623a1c700cbe6f56f20f43'
  // }
}

export const REWARD_TOKEN:any = {
  [ChainId.RINKEBY]: {
    ...REWARD_BASE_INFO,
    address: '0xD723a26Da0CB4C0044f99da34dd2a5Ba0F884Eb4'
  },
  // [ChainId.BNB_TEST]: {
  //   address: '0x74e8e6eb31ef6970d2623a1c700cbe6f56f20f43'
  // }
}

export const REWARD:any = {
  [ChainId.RINKEBY]: {
    address: '0x9fe7497ef6243649212b0BA3e185d75e14f1F1e7'
  },
  // [ChainId.BNB_TEST]: {
  //   address: '0x25c5Cc9082d7d87B3321868bA2C64e0C969072a4'
  // }
}