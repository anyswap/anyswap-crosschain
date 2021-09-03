import { MATIC_MAIN_CHAINID } from './chainConfig/matic'
import { FTM_MAIN_CHAINID } from './chainConfig/ftm'
import { BNB_MAIN_CHAINID } from './chainConfig/bsc'

interface FarmConfig {
  [key: string]: any
}

const BSC_ANY_TOKEN = '0xf68c9df95a18b2a5a5fa1124d79eeeffbad0b6fa'
const BSC_ANY = {
  [BSC_ANY_TOKEN]: {
    list: {
      symbol: "ANY",
      name: "Anyswap",
      decimals: 18
    }
  }
}

const config: FarmConfig = {
  'MATIC': {
    chainId: MATIC_MAIN_CHAINID,
    farmToken: '0xB0A3dA261BAD3Df3f3cc3a4A337e7e81f6407c49',
    lpToken: '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6',
    blockNumber: 41143,
    lpTokenIno: {
      '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6': {
        list: {
          symbol: "USDC",
          name: "USDCoin",
          decimals: 6
        }
      }
    }
  },
  'FTM': {
    chainId: FTM_MAIN_CHAINID,
    farmToken: '0xdccd7b567da13a11cde232522be708b2d1a14498',
    lpToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
    blockNumber: 86393,
    lpTokenIno: {
      '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605': {
        list: {
          symbol: "USDC",
          name: "USDCoin",
          decimals: 6
        }
      }
    }
  },
  'BSC': {
    chainId: BNB_MAIN_CHAINID,
    farmToken: '0x411f3e09c66b30e7facfec45cd823b2e19dfad2d',
    lpToken: BSC_ANY_TOKEN,
    blockNumber: 28800,
    lpTokenIno: BSC_ANY
  },
  'BSC_HERO': {
    chainId: BNB_MAIN_CHAINID,
    farmToken: '0x5e430f88d1be82eb3ef92b6ff06125168fd5dcf2',
    lpToken: BSC_ANY_TOKEN,
    blockNumber: 28800,
    lpTokenIno: BSC_ANY
  },
  'BSC_TRO': {
    chainId: BNB_MAIN_CHAINID,
    farmToken: '0xf47a640ff9745b5591edd446cb02ed6d096c99bd',
    lpToken: BSC_ANY_TOKEN,
    blockNumber: 28800,
    lpTokenIno: BSC_ANY
  },
  'BSC_PLAY': {
    chainId: BNB_MAIN_CHAINID,
    farmToken: '0xdb12c7e30dc2a2c421724d07c7a09147bd9f61bb',
    lpToken: BSC_ANY_TOKEN,
    blockNumber: 28800,
    lpTokenIno: BSC_ANY
  },
  'BSC_BACON': {
    chainId: BNB_MAIN_CHAINID,
    farmToken: '0xfd14d755a3a3358aec08d0979ecf369b4a387039',
    lpToken: BSC_ANY_TOKEN,
    blockNumber: 28800,
    lpTokenIno: BSC_ANY
  },
  'ETH_TEST': {
    chainId: '4',
    farmToken: '0x0bd19f6447cd676255C7C7B00428462B3dA67e3a',
    lpToken: '0x7f30b414a814a6326d38535ca8eb7b9a62bceae2',
    blockNumber: 28800,
    lpTokenIno: {
      '0x7f30b414a814a6326d38535ca8eb7b9a62bceae2': {
        list: {
          symbol: "ANY",
          name: "Anyswap",
          decimals: 18
        }
      }
    }
  },
}
export default config