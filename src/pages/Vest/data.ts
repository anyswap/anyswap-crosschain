import { ChainId } from "../../config/chainConfig/chainId"
import {spportChainArr} from '../../config/chainConfig'
function useChain (data:any) {
  const list:any = {}
  // console.log(spportChainArr)
  for (const c in  data) {
    if (!spportChainArr.includes(c)) continue
    list[c] = {
      ...data[c]
    }
  }
  return list
}
const BASE_INFO = {
  name: 'Multichain',
  symbol: 'MULTI',
  decimals: 18,
  label: 'multichain'
}

const VENFT_BASE_INFO = {
  name: 'veMULTI NFT',
  symbol: 'veMULTI',
  decimals: 18
}


const veMULTI:any = useChain({
  [ChainId.ETH]: {
    ...VENFT_BASE_INFO,
    address: '0xbba4115ecb1f811061ecb5a8dc8fcdee2748ceba'
  },
  [ChainId.RINKEBY]: {
    ...VENFT_BASE_INFO,
    address: '0xF0dA9470fe5C1df563F89a56a5238150295468D5'
  },
})

const MULTI_TOKEN:any = useChain({
  [ChainId.ETH]: {
    ...BASE_INFO,
    address: '0x65ef703f5594d2573eb71aaf55bc0cb548492df4'
  },
  [ChainId.RINKEBY]: {
    ...BASE_INFO,
    address: '0x5aD702B98194046b0998c552F04Fd74A582560A1'
  },
})

const REWARD_TOKEN:any = useChain({
  [ChainId.ETH]: {
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  },
  [ChainId.RINKEBY]: {
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 18,
    address: '0xD723a26Da0CB4C0044f99da34dd2a5Ba0F884Eb4'
  },
})

const REWARD:any = useChain({
  [ChainId.ETH]: {
    address: '0x44529a37a43bab8af2336698e31f2e4585ad7db6'
  },
  [ChainId.RINKEBY]: {
    address: '0x45f529b815716B8bd40606b9E43c1251CF43987D'
  },
})



export {
  BASE_INFO,
  VENFT_BASE_INFO,
  veMULTI,
  MULTI_TOKEN,
  REWARD_TOKEN,
  REWARD,
}