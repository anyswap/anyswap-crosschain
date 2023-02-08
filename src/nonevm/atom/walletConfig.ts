import { ChainId } from "../../config/chainConfig/chainId"

export const atomChainConfig:any = {
  [ChainId.ATOM_DCORE_TEST]: {
    "chainId": "coreum-devnet-1",
    "chainName": "Coreum Devnet 1",
    "rpc": "https://s-0.devnet-1.coreum.dev",
    "rest": "https://s-0.devnet-1.coreum.dev/rest",
    "bip44": {
      "coinType": 990
    },
    "bech32Config": {
      "bech32PrefixAccAddr": "devcore",
      "bech32PrefixAccPub": "devcorepub",
      "bech32PrefixValAddr": "devcorevaloper",
      "bech32PrefixValPub": "devcorevaloperpub",
      "bech32PrefixConsAddr": "devcorevalcons",
      "bech32PrefixConsPub": "devcorevalconspub"
    },
    "currencies": [
      {
        "coinDenom": "DCORE",
        "coinMinimalDenom": "ducore",
        "coinDecimals": 6,
        "coinGeckoId": "coreum"
      }
    ],
    "feeCurrencies": [
      {
        "coinDenom": "DCORE",
        "coinMinimalDenom": "ducore",
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
      "coinDenom": "DCORE",
      "coinMinimalDenom": "ducore",
      "coinDecimals": 6,
      "coinGeckoId": "coreum"
    },
    "beta": true
  }
}