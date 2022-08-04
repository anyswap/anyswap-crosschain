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
  [ChainId.BNB_TEST]: {
    ...VENFT_BASE_INFO,
    address: '0x2aF78D056F2D32C130D791091333575DF592Bb06'
  },
})

const MULTI_TOKEN:any = useChain({
  [ChainId.BNB_TEST]: {
    ...BASE_INFO,
    address: '0x89Ea10f213008e4e26483A2d2A6b6852E4997A49'
  },
})

const REWARD_TOKEN:any = useChain({
  [ChainId.BNB_TEST]: {
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 18,
    address: '0x86e2c741Bf2BC6772Fed68a75eaa5bfab4a76d16'
  },
})

const REWARD:any = useChain({
  [ChainId.BNB_TEST]: {
    address: '0xbAD169597E88404021435b743E809fC640b526f5'
  },
})

const VESHARE:any = useChain({
  [ChainId.BNB_TEST]: {
    address: '0xA0bA02090D0e893558B81fA4e24Fda8D3dE56D13'
  },
})



export {
  BASE_INFO,
  VENFT_BASE_INFO,
  veMULTI,
  MULTI_TOKEN,
  REWARD_TOKEN,
  REWARD,
  VESHARE
}