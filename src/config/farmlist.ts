import {ChainId} from '../config/chainConfig/chainId'
interface FarmConfig {
  [key: string]: any
}

// const BSC_ANY_TOKEN = '0xf68c9df95a18b2a5a5fa1124d79eeeffbad0b6fa'
// const BSC_ANY = {
//   [BSC_ANY_TOKEN]: {
//     list: {
//       symbol: "ANY",
//       name: "Anyswap",
//       decimals: 18
//     }
//   }
// }

const config: FarmConfig = {
  'ARB2': {
    chainId: ChainId.ARBITRUM,
    farmToken: '0x4ecf513a7d0E1548e14b621e21d2584bc7570918',
    lpToken: '0x1263fea931b86f3e8ce8afbf29f66631b7be9347',
    blockNumber: 2800000,
    lpTokenIno: {
      '0x1263fea931b86f3e8ce8afbf29f66631b7be9347': {
        list: {
          symbol: "ARB",
          name: "Arbitrum",
          decimals: 18,
          rewardDdecimals: 18,
        }
      }
    },
    url: 'farm/arb2',
    logoUrl: require('../assets/images/coin/source/ARB.png'),
    key: 'ARB',
    farmtype: 'noany',
    isEnd: 0
  },
  'ARB': {
    chainId: ChainId.ARBITRUM,
    farmToken: '0x1e1085eFaA63EDFE74aaD7C05a28EAE4ef917C3F',
    lpToken: '0x1263fea931b86f3e8ce8afbf29f66631b7be9347',
    blockNumber: 2800000,
    lpTokenIno: {
      '0x1263fea931b86f3e8ce8afbf29f66631b7be9347': {
        list: {
          symbol: "ARB",
          name: "Arbitrum",
          decimals: 18,
          rewardDdecimals: 18,
        }
      }
    },
    url: 'farm/arb',
    logoUrl: require('../assets/images/coin/source/ARB.png'),
    key: 'ARB',
    farmtype: 'noany',
    isEnd: 1
  },
  // 'ARB': {
  //   chainId: ChainId.GOERLI,
  //   farmToken: '0x3fB256CFefedb6A54De7465c0EE86dC574AE464D',
  //   lpToken: '0x7f8d31a49212c62a11b6718aa0b612e129256553',
  //   blockNumber: 8702220,
  //   lpTokenIno: {
  //     '0x7f8d31a49212c62a11b6718aa0b612e129256553': {
  //       list: {
  //         symbol: "ARB",
  //         name: "Multichain",
  //         decimals: 6,
  //         rewardDdecimals: 6,
  //       }
  //     }
  //   },
  //   url: 'farm/arb',
  //   logoUrl: require('../assets/images/coin/source/MULTI.png'),
  //   key: 'MULTI',
  //   farmtype: 'noany'
  // },
  // 'MATIC': {
  //   chainId: MATIC_MAIN_CHAINID,
  //   farmToken: '0xB0A3dA261BAD3Df3f3cc3a4A337e7e81f6407c49',
  //   lpToken: '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6',
  //   blockNumber: 41143,
  //   lpTokenIno: {
  //     '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6': {
  //       list: {
  //         symbol: "USDC",
  //         name: "USDCoin",
  //         decimals: 6
  //       }
  //     }
  //   },
  //   url: 'farm/matic',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  //   key: 'ANY',
  //   farmtype: 'noany'
  // },
  // 'FTM': {
  //   chainId: FTM_MAIN_CHAINID,
  //   farmToken: '0xdccd7b567da13a11cde232522be708b2d1a14498',
  //   lpToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
  //   blockNumber: 86393,
  //   lpTokenIno: {
  //     '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605': {
  //       list: {
  //         symbol: "USDC",
  //         name: "USDCoin",
  //         decimals: 6
  //       }
  //     }
  //   },
  //   url: 'farm/ftm',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  //   key: 'ANY',
  //   farmtype: 'noany'
  // },
  // 'BSC': {
  //   chainId: BNB_MAIN_CHAINID,
  //   farmToken: '0x411f3e09c66b30e7facfec45cd823b2e19dfad2d',
  //   lpToken: BSC_ANY_TOKEN,
  //   blockNumber: 28800,
  //   lpTokenIno: BSC_ANY,
  //   url: 'farm/bsc',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/10970/small/DEAPcoin_01.png',
  //   key: 'DEP',
  //   farmtype: 'any'
  // },
  // 'BSC_HERO': {
  //   chainId: BNB_MAIN_CHAINID,
  //   farmToken: '0x5e430f88d1be82eb3ef92b6ff06125168fd5dcf2',
  //   lpToken: BSC_ANY_TOKEN,
  //   blockNumber: 28800,
  //   lpTokenIno: BSC_ANY,
  //   url: 'farm/bsc/hero',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/16245/small/HERO-200.png',
  //   key: 'HERO',
  //   farmtype: 'any'
  // },
  // 'BSC_TRO': {
  //   chainId: BNB_MAIN_CHAINID,
  //   farmToken: '0xf47a640ff9745b5591edd446cb02ed6d096c99bd',
  //   lpToken: BSC_ANY_TOKEN,
  //   blockNumber: 28800,
  //   lpTokenIno: BSC_ANY,
  //   url: 'farm/bsc/hero',
  //   logoUrl: require('../assets/images/coin/source/TRO.png'),
  //   key: 'HERO',
  //   farmtype: 'any'
  // },
  // 'BSC_PLAY': {
  //   chainId: BNB_MAIN_CHAINID,
  //   farmToken: '0xdb12c7e30dc2a2c421724d07c7a09147bd9f61bb',
  //   lpToken: BSC_ANY_TOKEN,
  //   blockNumber: 28800,
  //   lpTokenIno: BSC_ANY,
  //   url: 'farm/bsc/polyplay',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/17314/small/09ee5fe7-7f9c-4e77-8872-d9053ac2a936.png',
  //   key: 'PLAY',
  //   farmtype: 'any'
  // },
  // 'BSC_BACON': {
  //   chainId: BNB_MAIN_CHAINID,
  //   farmToken: '0xfd14d755a3a3358aec08d0979ecf369b4a387039',
  //   lpToken: BSC_ANY_TOKEN,
  //   blockNumber: 28800,
  //   lpTokenIno: BSC_ANY,
  //   url: 'farm/bsc/bacon',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/18059/small/xDV_bhdA_400x400.jpg',
  //   key: 'BACON',
  //   farmtype: 'any'
  // },
  // 'BSC_KABY': {
  //   chainId: BNB_MAIN_CHAINID,
  //   farmToken: '0x5157629E486b36f5862d163C119c4E86506cA15e',
  //   lpToken: BSC_ANY_TOKEN,
  //   blockNumber: 28800,
  //   lpTokenIno: BSC_ANY,
  //   url: 'farm/bsc/kaby',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/18090/small/URPKhnop_400x400.jpg',
  //   key: 'KABY',
  //   farmtype: 'any'
  // },
  // 'BSC_PTLKX': {
  //   chainId: BNB_MAIN_CHAINID,
  //   farmToken: '0x8C77057C3343B7DCC97CA21dA274730396162a98',
  //   lpToken: BSC_ANY_TOKEN,
  //   blockNumber: 28800,
  //   lpTokenIno: BSC_ANY,
  //   url: 'farm/bsc/ptlkx',
  //   logoUrl: 'https://i.imgur.com/3TBo92F.png',
  //   key: 'PTLKX',
  //   farmtype: 'any',
  //   price: 0.00588118
  // },
  // 'ETH_TEST': {
  //   chainId: '4',
  //   farmToken: '0x0bd19f6447cd676255C7C7B00428462B3dA67e3a',
  //   lpToken: '0x7f30b414a814a6326d38535ca8eb7b9a62bceae2',
  //   blockNumber: 28800,
  //   lpTokenIno: {
  //     '0x7f30b414a814a6326d38535ca8eb7b9a62bceae2': {
  //       list: {
  //         symbol: "ANY",
  //         name: "Anyswap",
  //         decimals: 18
  //       }
  //     }
  //   },
  //   url: '/farm/eth/test',
  //   logoUrl: 'https://assets.coingecko.com/coins/images/18090/small/URPKhnop_400x400.jpg',
  //   key: 'ANY',
  //   farmtype: 'noany'
  // },
}
export default config