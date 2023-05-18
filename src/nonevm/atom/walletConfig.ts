import { ChainId } from "../../config/chainConfig/chainId"

export const atomChainConfig:any = {
  [ChainId.ATOM_DCORE_TEST]: {
    "chainId": "coreum-testnet-1",
    "chainName": "Coreum Testnet 1",
    "rpc": "https://full-node-pluto.testnet-1.coreum.dev",
    "rest": "https://full-node-pluto.testnet-1.coreum.dev:1317",
    "bip44": {
      "coinType": 990
    },
    "bech32Config": {
      "bech32PrefixAccAddr": "testcore",
      "bech32PrefixAccPub": "testcorepub",
      "bech32PrefixValAddr": "testcorevaloper",
      "bech32PrefixValPub": "testcorevaloperpub",
      "bech32PrefixConsAddr": "testcorevalcons",
      "bech32PrefixConsPub": "testcorevalconspub"
    },
    "currencies": [
      {
        "coinDenom": "TESTCORE",
        "coinMinimalDenom": "utestcore",
        "coinDecimals": 6,
        "coinGeckoId": "coreum"
      }
    ],
    "feeCurrencies": [
      {
        "coinDenom": "TESTCORE",
        "coinMinimalDenom": "utestcore",
        "coinDecimals": 6,
        "coinGeckoId": "coreum",
        "gasPriceStep": {
          "low": 0.0625,
          "average": 0.1,
          "high": 62.5
        }
      }
    ],
    "stakeCurrency": {
      "coinDenom": "TESTCORE",
      "coinMinimalDenom": "utestcore",
      "coinDecimals": 6,
      "coinGeckoId": "coreum"
    },
    "beta": true
  },
  [ChainId.ATOM_SEI_TEST]: {
    "chainId": "atlantic-2",
    "chainName": "Sei atlantic-2",
    "rpc": "https://rpc.atlantic-2.seinetwork.io/",
    "rest": "https://rest.atlantic-2.seinetwork.io/",
    "bip44": {
      "coinType": 118
    },
    "bech32Config": {
      "bech32PrefixAccAddr": "sei",
      "bech32PrefixAccPub": "seipub",
      "bech32PrefixValAddr": "seivaloper",
      "bech32PrefixValPub": "seivaloperpub",
      "bech32PrefixConsAddr": "seivalcons",
      "bech32PrefixConsPub": "seivalconspub"
    },
    "currencies": [
      {
        "coinDenom": "SEI",
        "coinMinimalDenom": "usei",
        "coinDecimals": 6
      },
      {
        "coinDenom": "USDC",
        "coinMinimalDenom": "uusdc",
        "coinDecimals": 6,
        "coinGeckoId": "usd-coin"
      },
      {
        "coinDenom": "ATOM",
        "coinMinimalDenom": "uatom",
        "coinDecimals": 6,
        "coinGeckoId": "cosmos"
      },
      {
        "coinDenom": "WETH",
        "coinMinimalDenom": "ibc/C2A89D98873BB55B62CE86700DFACA646EC80352E8D03CC6CF34DD44E46DC75D",
        "coinDecimals": 18,
        "coinGeckoId": "weth"
      },
      {
        "coinDenom": "WBTC",
        "coinMinimalDenom": "ibc/42BCC21A2B784E813F8878739FD32B4AA2D0A68CAD94F4C88B9EA98609AB0CCD",
        "coinDecimals": 8,
        "coinGeckoId": "bitcoin"
      },
      {
        "coinDenom": "aUSDC",
        "coinMinimalDenom": "ibc/6D45A5CD1AADE4B527E459025AC1A5AEF41AE99091EF3069F3FEAACAFCECCD21",
        "coinDecimals": 6,
        "coinGeckoId": "usd-coin"
      },
      {
        "coinDenom": "UST2",
        "coinMinimalDenom": "factory/sei1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqpeheyc/uust2",
        "coinDecimals": 6
      },
      {
        "coinDenom": "uCeler",
        "coinMinimalDenom": "factory/sei174t9p63nzlmsycmd9x9zxx3ejq9lp2y9f69rp9/uceler",
        "coinDecimals": 6
      }
    ],
    "feeCurrencies": [
      {
        "coinDenom": "SEI",
        "coinMinimalDenom": "usei",
        "coinDecimals": 6
      }
    ],
    "stakeCurrency": {
      "coinDenom": "SEI",
      "coinMinimalDenom": "usei",
      "coinDecimals": 6
    },
    "coinType": 118,
    "features": [
      "stargate",
      "ibc-transfer",
      "cosmwasm"
    ],
    "beta": true
  },
  // []: {
  //   "chainId": "sei-devnet-3",
  //   "chainName": "Sei sei-devnet-3",
  //   "rpc": "https://rpc.sei-devnet-3.seinetwork.io/",
  //   "rest": "https://rest.sei-devnet-3.seinetwork.io/",
  //   "bip44": {
  //     "coinType": 118
  //   },
  //   "bech32Config": {
  //     "bech32PrefixAccAddr": "sei",
  //     "bech32PrefixAccPub": "seipub",
  //     "bech32PrefixValAddr": "seivaloper",
  //     "bech32PrefixValPub": "seivaloperpub",
  //     "bech32PrefixConsAddr": "seivalcons",
  //     "bech32PrefixConsPub": "seivalconspub"
  //   },
  //   "currencies": [
  //     {
  //       "coinDenom": "SEI",
  //       "coinMinimalDenom": "usei",
  //       "coinDecimals": 6
  //     },
  //     {
  //       "coinDenom": "USDC",
  //       "coinMinimalDenom": "uusdc",
  //       "coinDecimals": 6,
  //       "coinGeckoId": "usd-coin"
  //     },
  //     {
  //       "coinDenom": "ATOM",
  //       "coinMinimalDenom": "uatom",
  //       "coinDecimals": 6,
  //       "coinGeckoId": "cosmos"
  //     },
  //     {
  //       "coinDenom": "WETH",
  //       "coinMinimalDenom": "ibc/C2A89D98873BB55B62CE86700DFACA646EC80352E8D03CC6CF34DD44E46DC75D",
  //       "coinDecimals": 18,
  //       "coinGeckoId": "weth"
  //     },
  //     {
  //       "coinDenom": "WBTC",
  //       "coinMinimalDenom": "ibc/42BCC21A2B784E813F8878739FD32B4AA2D0A68CAD94F4C88B9EA98609AB0CCD",
  //       "coinDecimals": 8,
  //       "coinGeckoId": "bitcoin"
  //     },
  //     {
  //       "coinDenom": "aUSDC",
  //       "coinMinimalDenom": "ibc/6D45A5CD1AADE4B527E459025AC1A5AEF41AE99091EF3069F3FEAACAFCECCD21",
  //       "coinDecimals": 6,
  //       "coinGeckoId": "usd-coin"
  //     },
  //     {
  //       "coinDenom": "UST2",
  //       "coinMinimalDenom": "factory/sei1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqpeheyc/uust2",
  //       "coinDecimals": 6
  //     },
  //     {
  //       "coinDenom": "uCeler",
  //       "coinMinimalDenom": "factory/sei174t9p63nzlmsycmd9x9zxx3ejq9lp2y9f69rp9/uceler",
  //       "coinDecimals": 6
  //     }
  //   ],
  //   "feeCurrencies": [
  //     {
  //       "coinDenom": "SEI",
  //       "coinMinimalDenom": "usei",
  //       "coinDecimals": 6
  //     }
  //   ],
  //   "stakeCurrency": {
  //     "coinDenom": "SEI",
  //     "coinMinimalDenom": "usei",
  //     "coinDecimals": 6
  //   },
  //   "coinType": 118,
  //   "features": [
  //     "stargate",
  //     "ibc-transfer",
  //     "cosmwasm"
  //   ],
  //   "beta": true
  // }  
  // [ChainId.ATOM_DCORE_TEST]: {  // dev
  //   "chainId": "coreum-devnet-1",
  //   "chainName": "Coreum Devnet 1",
  //   "rpc": "https://s-0.devnet-1.coreum.dev",
  //   "rest": "https://s-0.devnet-1.coreum.dev/rest",
  //   "bip44": {
  //     "coinType": 990
  //   },
  //   "bech32Config": {
  //     "bech32PrefixAccAddr": "devcore",
  //     "bech32PrefixAccPub": "devcorepub",
  //     "bech32PrefixValAddr": "devcorevaloper",
  //     "bech32PrefixValPub": "devcorevaloperpub",
  //     "bech32PrefixConsAddr": "devcorevalcons",
  //     "bech32PrefixConsPub": "devcorevalconspub"
  //   },
  //   "currencies": [
  //     {
  //       "coinDenom": "DCORE",
  //       "coinMinimalDenom": "ducore",
  //       "coinDecimals": 6,
  //       "coinGeckoId": "coreum"
  //     }
  //   ],
  //   "feeCurrencies": [
  //     {
  //       "coinDenom": "DCORE",
  //       "coinMinimalDenom": "ducore",
  //       "coinDecimals": 6,
  //       "coinGeckoId": "coreum",
  //       "gasPriceStep": {
  //         "low": 0.0625,
  //         "average": 0.1,
  //         "high": 62.5
  //       }
  //     }
  //   ],
  //   "stakeCurrency": {
  //     "coinDenom": "DCORE",
  //     "coinMinimalDenom": "ducore",
  //     "coinDecimals": 6,
  //     "coinGeckoId": "coreum"
  //   },
  //   "beta": true
  // }
}