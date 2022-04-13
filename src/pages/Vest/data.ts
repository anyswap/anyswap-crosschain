import { ChainId } from "../../config/chainConfig/chainId"

export const BASE_INFO = {
  name: 'Multichain',
  symbol: 'MULTI',
  decimals: 18
}

export const veMULTI:any = {
  [ChainId.BNB_TEST]: '0xa88e49CfFd199f77cDbF0B5149E2660A34b8c3D1'
}

export const MULTI_TOKEN:any = {
  [ChainId.BNB_TEST]: {
    ...BASE_INFO,
    address: '0x74e8e6eb31ef6970d2623a1c700cbe6f56f20f43'
  }
}

export const REWARD_TOKEN:any = {
  [ChainId.BNB_TEST]: '0xB608035D8555ba924EceBb6239b148f99224A36C'
}

export const REWARD:any = {
  [ChainId.BNB_TEST]: {
    // ...BASE_INFO,
    address: '0xF43F9f7c87D4c2BD8868251661470a07E229E477'
  }
}