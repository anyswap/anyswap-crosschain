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
  [ChainId.BNB_TEST]: {
    ...VENFT_BASE_INFO,
    address: '0x27C03bDc9ec0945a4ab06DDC11CC0e8946eC4Aab'
  }
}

export const MULTI_TOKEN:any = {
  [ChainId.BNB_TEST]: {
    ...BASE_INFO,
    address: '0x74e8e6eb31ef6970d2623a1c700cbe6f56f20f43'
  }
}

export const REWARD_TOKEN:any = {
  [ChainId.BNB_TEST]: {
    address: '0xB608035D8555ba924EceBb6239b148f99224A36C'
  }
}

export const REWARD:any = {
  [ChainId.BNB_TEST]: {
    // ...BASE_INFO,
    address: '0x25c5Cc9082d7d87B3321868bA2C64e0C969072a4'
  }
}