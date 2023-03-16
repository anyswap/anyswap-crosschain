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
  }
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