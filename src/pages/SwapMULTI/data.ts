import { ChainId } from "../../config/chainConfig/chainId"
export enum SWAP_TYPE {
  MULTI = 'MULTI',
  BTC = 'BTC',
}

export const initConfig:any = {
  [SWAP_TYPE.MULTI]: {
    chainId: ChainId.ETH
  },
  [SWAP_TYPE.BTC]: {
    chainId: ChainId.BNB
  },
}

export const swapTokenList:any = {
  [SWAP_TYPE.MULTI]: {
    [ChainId.ETH]: {
      swapToken: '0xaed0472b498548B1354925d222B832b99Bb2EC60',
      anyToken: {
        address: "0xf99d58e463A2E07e5692127302C20A191861b4D6",
        symbol: 'ANY',
        name: 'Anyswap',
        decimals: 18
      },
      multiToken: {
        address: "0x65Ef703f5594D2573eb71Aaf55BC0CB548492df4",
        symbol: "MULTI",
        name: "Multichain",
        decimals: 18
      }
    },
    [ChainId.BNB]: {
      swapToken: '0x65Ef703f5594D2573eb71Aaf55BC0CB548492df4',
      anyToken: {
        address: "0xf68c9df95a18b2a5a5fa1124d79eeeffbad0b6fa",
        symbol: 'ANY',
        name: 'Anyswap',
        decimals: 18
      },
      multiToken: {
        address: "0x9fb9a33956351cf4fa040f65a13b835a3c8764e3",
        symbol: "MULTI",
        name: "Multichain",
        decimals: 18
      }
    },
    [ChainId.FTM]: {
      swapToken: '0x65Ef703f5594D2573eb71Aaf55BC0CB548492df4',
      anyToken: {
        address: "0xddcb3ffd12750b45d32e084887fdf1aabab34239",
        symbol: 'ANY',
        name: 'Anyswap',
        decimals: 18
      },
      multiToken: {
        address: "0x9fb9a33956351cf4fa040f65a13b835a3c8764e3",
        symbol: "MULTI",
        name: "Multichain",
        decimals: 18
      }
    }
  },
  [SWAP_TYPE.BTC]: {
    [ChainId.BNB]: {
      swapToken: '0x34c49b2a67e42683Bd58222Dc70ae459F49CF091',
      anyToken: {
        address: "0x54261774905f3e6e9718f2abb10ed6555cae308a",
        symbol: 'anyBTC',
        name: 'ANY Bitcoin',
        decimals: 8
      },
      multiToken: {
        address: "0xd9907fcda91ac644f70477b8fc1607ad15b2d7a8",
        symbol: "multiBTC",
        name: "Multichain BTC",
        decimals: 8
      }
    },
  },
}