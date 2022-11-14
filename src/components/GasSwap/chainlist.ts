import { ChainId } from '../../config/chainConfig/chainId'

const chains: any = {
  [ChainId.FTM_TEST]: {
    BlockChain: 'Fantom',
    symbol: 'FTM',
    RouterContract: '0x1739648E7C1B23D6Da74177292B36aF7f286f643',
    decimal: '18',
    destChains: [ChainId.APT_TEST, ChainId.BNB_TEST]
  },
  [ChainId.APT_TEST]: {
    BlockChain: 'APTOS',
    symbol: 'APT',
    RouterContract: '0x1f27736e2a4e8316154a086c29605a3d9cce45a6927ab55bc8cd0980ed4135e9',
    decimal: '8',
    destChains: [ChainId.FTM_TEST, ChainId.BNB_TEST]
  },
  [ChainId.BNB_TEST]: {
    BlockChain: 'BSC',
    symbol: 'BNB',
    RouterContract: '0x1739648E7C1B23D6Da74177292B36aF7f286f643',
    decimal: '18',
    destChains: [ChainId.FTM_TEST, ChainId.APT_TEST]
  }
}
export const getTokenList = (chainsData: any) => {
  const obj: any = {}
  Object.keys(chainsData).forEach((chainId: string) => {
    const item = chainsData[chainId]
    const { BlockChain, decimal, symbol, destChains } = item
    const destChainsObj: any = {}
    destChains.forEach((c: string) => {
      destChainsObj[c] = {
        [chainsData[c].symbol]: {
          BaseFeePercent: '',
          BigValueThreshold: '',
          DepositAddress: '',
          MaximumSwap: '10',
          MaximumSwapFee: '',
          MinimumSwap: '0.5',
          MinimumSwapFee: '',
          SwapFeeRatePerMillion: 0.2,
          address: chainsData[c].symbol,
          anytoken: {
            address: chainsData[c].symbol,
            name: chainsData[c].BlockChain,
            symbol: chainsData[c].symbol,
            decimals: chainsData[c].decimal
          },
          chainId: chainsData[c].symbol,
          decimals: chainsData[c].decimal,
          fromanytoken: {
            address: symbol,
            name: BlockChain,
            symbol,
            decimals: decimal,
            chainId
          },
          isApprove: false,
          isFromLiquidity: false,
          isLiquidity: false,
          name: chainsData[c].BlockChain,
          pairid: '',
          router: chainsData[c].RouterContract,
          routerABI: ' ', // routerABI: 'anySwapOutUnderlying(anytoken,toAddress,amount,toChainID)',
          spender: '',
          symbol: chainsData[c].symbol,
          tokenType: 'NATIVE',
          tokenid: '',
          type: 'GAS',
          underlying: false
        }
      }
    })
    obj[chainId] = {
      [`evm${symbol.toLocaleLowerCase()}`]: {
        address: symbol,
        chainId,
        decimals: decimal,
        logoUrl: '',
        name: BlockChain,
        price: '',
        symbol,
        tokenType: 'NATIVE',
        destChains: destChainsObj
      }
    }
  })
  return obj
}

export const tokenList = getTokenList(chains)

// export const tokenList: any = {
//   4002: {
//     evmftm: {
//       address: 'ftm',
//       chainId: '4002',
//       decimals: 18,
//       destChains: {
//         // 1000004280406
//         APT_TEST: {
//           APT: {
//             BaseFeePercent: '',
//             BigValueThreshold: '',
//             DepositAddress: '',
//             MaximumSwap: '10',
//             MaximumSwapFee: '',
//             MinimumSwap: '0.5',
//             MinimumSwapFee: '',
//             SwapFeeRatePerMillion: 0.2,
//             address: 'APT',
//             anytoken: { address: 'APT', name: 'APTOS', symbol: 'APT', decimals: 6 },
//             chainId: 'APT',
//             decimals: 8,
//             fromanytoken: {
//               address: 'ftm',
//               name: 'Fantom',
//               symbol: 'FTM',
//               decimals: 8,
//               chainId: '4002'
//             },
//             isApprove: false,
//             isFromLiquidity: false,
//             isLiquidity: false,
//             name: 'APTOS',
//             pairid: '',
//             router: '0x1739648E7C1B23D6Da74177292B36aF7f286f643',
//             routerABI: ' ', // routerABI: 'anySwapOutUnderlying(anytoken,toAddress,amount,toChainID)',
//             spender: '',
//             symbol: 'APT',
//             tokenType: 'NATIVE',
//             tokenid: '',
//             type: 'GAS',
//             underlying: false
//           }
//         },
//         97: {
//           BNB: {
//             BaseFeePercent: '',
//             BigValueThreshold: '',
//             DepositAddress: '',
//             MaximumSwap: '10',
//             MaximumSwapFee: '',
//             MinimumSwap: '0.5',
//             MinimumSwapFee: '',
//             SwapFeeRatePerMillion: 0.2,
//             address: 'BNB',
//             anytoken: { address: 'BNB', name: 'BSC', symbol: 'BNB', decimals: 18 },
//             chainId: '80001',
//             decimals: 18,
//             fromanytoken: {
//               address: 'ftm',
//               name: 'Fantom',
//               symbol: 'FTM',
//               decimals: 18,
//               chainId: '4002'
//             },
//             isApprove: false,
//             isFromLiquidity: false,
//             isLiquidity: false,
//             name: 'BSC',
//             pairid: '',
//             router: '0x1739648E7C1B23D6Da74177292B36aF7f286f643',
//             routerABI: ' ', // routerABI: 'anySwapOutUnderlying(anytoken,toAddress,amount,toChainID)',
//             sortId: 2,
//             spender: '',
//             symbol: 'BNB',
//             tokenType: 'NATIVE',
//             tokenid: '',
//             type: 'GAS',
//             underlying: false
//           }
//         }
//       },
//       logoUrl: '',
//       name: 'Fantom',
//       price: '',
//       symbol: 'FTM',
//       tokenType: 'NATIVE'
//     }
//   },
//   APT_TEST: {
//     evmapt: {
//       address: 'apt',
//       chainId: 'APT_TEST',
//       decimals: 8,
//       destChains: {
//         // 1000004280406
//         4002: {
//           FTM: {
//             BaseFeePercent: '',
//             BigValueThreshold: '',
//             DepositAddress: '',
//             MaximumSwap: '10',
//             MaximumSwapFee: '',
//             MinimumSwap: '0.5',
//             MinimumSwapFee: '',
//             SwapFeeRatePerMillion: 0.2,
//             address: 'FTM',
//             anytoken: { address: 'FTM', name: 'Fantom', symbol: 'FTM', decimals: 18 },
//             chainId: 'FTM',
//             decimals: 18,
//             fromanytoken: {
//               address: 'apt',
//               name: 'Aptoms',
//               symbol: 'APT',
//               decimals: 8,
//               chainId: 'APT_TEST'
//             },
//             isApprove: false,
//             isFromLiquidity: false,
//             isLiquidity: false,
//             name: 'Fantom',
//             pairid: '',
//             router: '0x1739648E7C1B23D6Da74177292B36aF7f286f643',
//             routerABI: ' ', // routerABI: 'anySwapOutUnderlying(anytoken,toAddress,amount,toChainID)',
//             spender: '',
//             symbol: 'FTM',
//             tokenType: 'NATIVE',
//             tokenid: '',
//             type: 'GAS',
//             underlying: false
//           }
//         },
//         97: {
//           BNB: {
//             BaseFeePercent: '',
//             BigValueThreshold: '',
//             DepositAddress: '',
//             MaximumSwap: '10',
//             MaximumSwapFee: '',
//             MinimumSwap: '0.5',
//             MinimumSwapFee: '',
//             SwapFeeRatePerMillion: 0.2,
//             address: 'BNB',
//             anytoken: { address: 'BNB', name: 'BSC', symbol: 'BNB', decimals: 18 },
//             chainId: '80001',
//             decimals: 18,
//             fromanytoken: {
//               address: 'apt',
//               name: 'Aptoms',
//               symbol: 'APT',
//               decimals: 8,
//               chainId: 'APT_TEST'
//             },
//             isApprove: false,
//             isFromLiquidity: false,
//             isLiquidity: false,
//             name: 'BSC',
//             pairid: '',
//             router: '0x1739648E7C1B23D6Da74177292B36aF7f286f643',
//             routerABI: ' ', // routerABI: 'anySwapOutUnderlying(anytoken,toAddress,amount,toChainID)',
//             sortId: 2,
//             spender: '',
//             symbol: 'BNB',
//             tokenType: 'NATIVE',
//             tokenid: '',
//             type: 'GAS',
//             underlying: false
//           }
//         }
//       },
//       logoUrl: '',
//       name: 'Aptos',
//       price: 0.2,
//       symbol: 'APT',
//       tokenType: 'NATIVE'
//     }
//   },
//   97: {
//     evmbnb: {
//       address: 'BNB',
//       chainId: '97',
//       decimals: 18,
//       destChains: {
//         // 1000004280406
//         4002: {
//           FTM: {
//             BaseFeePercent: '',
//             BigValueThreshold: '',
//             DepositAddress: '',
//             MaximumSwap: '10',
//             MaximumSwapFee: '',
//             MinimumSwap: '0.5',
//             MinimumSwapFee: '',
//             SwapFeeRatePerMillion: 0.2,
//             address: 'FTM',
//             anytoken: { address: 'FTM', name: 'Fantom', symbol: 'FTM', decimals: 18 },
//             chainId: 'FTM',
//             decimals: 18,
//             fromanytoken: {
//               address: 'BNB',
//               name: 'BNB',
//               symbol: 'BNB',
//               decimals: 18,
//               chainId: '97'
//             },
//             isApprove: false,
//             isFromLiquidity: false,
//             isLiquidity: false,
//             name: 'Fantom',
//             pairid: '',
//             router: '0x1739648E7C1B23D6Da74177292B36aF7f286f643',
//             routerABI: ' ', // routerABI: 'anySwapOutUnderlying(anytoken,toAddress,amount,toChainID)',
//             spender: '',
//             symbol: 'FTM',
//             tokenType: 'NATIVE',
//             tokenid: '',
//             type: 'GAS',
//             underlying: false
//           }
//         },
//         APT_TEST: {
//           APT: {
//             BaseFeePercent: '',
//             BigValueThreshold: '',
//             DepositAddress: '',
//             MaximumSwap: '10',
//             MaximumSwapFee: '',
//             MinimumSwap: '0.5',
//             MinimumSwapFee: '',
//             SwapFeeRatePerMillion: 0.2,
//             address: 'APT',
//             anytoken: { address: 'APT', name: 'APTOS', symbol: 'APT', decimals: 6 },
//             chainId: 'APT',
//             decimals: 8,
//             fromanytoken: {
//               address: 'BNB',
//               name: 'BNB',
//               symbol: 'BNB',
//               decimals: 18,
//               chainId: '97'
//             },
//             isApprove: false,
//             isFromLiquidity: false,
//             isLiquidity: false,
//             name: 'APTOS',
//             pairid: '',
//             router: '0x1739648E7C1B23D6Da74177292B36aF7f286f643',
//             routerABI: ' ', // routerABI: 'anySwapOutUnderlying(anytoken,toAddress,amount,toChainID)',
//             spender: '',
//             symbol: 'APT',
//             tokenType: 'NATIVE',
//             tokenid: '',
//             type: 'GAS',
//             underlying: false
//           }
//         }
//       },
//       logoUrl: '',
//       name: 'BSC',
//       price: 0.2,
//       symbol: 'BNB',
//       tokenType: 'NATIVE'
//     }
//   }
// }

export const noEvmChainMenu: any = {
  APT_TEST: '1000004280406'
}
export const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'mpc_',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'decimal_',
        type: 'uint256'
      },
      {
        internalType: 'address[]',
        name: 'managers_',
        type: 'address[]'
      },
      {
        internalType: 'uint256[3]',
        name: 'defaultThreshold_',
        type: 'uint256[3]'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'decimal',
        type: 'uint256'
      }
    ],
    name: 'InitCurrencyInfo',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oldMPC',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newMPC',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'applyTime',
        type: 'uint256'
      }
    ],
    name: 'LogApplyMPC',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oldMPC',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newMPC',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'effectiveTime',
        type: 'uint256'
      }
    ],
    name: 'LogChangeMPC',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      }
    ],
    name: 'PriceUpdate',
    type: 'event'
  },
  {
    inputs: [],
    name: '_decimal',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: '_defaultThreshold',
    outputs: [
      {
        internalType: 'uint48',
        name: 'low',
        type: 'uint48'
      },
      {
        internalType: 'uint80',
        name: 'mid',
        type: 'uint80'
      },
      {
        internalType: 'uint128',
        name: 'high',
        type: 'uint128'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: '_managers',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: '_pauseAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: '_pauseOne',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'applyMPC',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_mpc',
        type: 'address'
      }
    ],
    name: 'changeMPC',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'delay',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'delayMPC',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      }
    ],
    name: 'getCurrencyInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'decimal',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'lastUpdateTime',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      }
    ],
    name: 'getDecimal',
    outputs: [
      {
        internalType: 'uint256',
        name: 'decimal',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      }
    ],
    name: 'getPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      }
    ],
    name: 'getSwapThreshold',
    outputs: [
      {
        internalType: 'uint256',
        name: 'low',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'mid',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'high',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'decimal',
        type: 'uint256'
      }
    ],
    name: 'initCurrencyInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'mpc',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'flag',
        type: 'bool'
      }
    ],
    name: 'pauseAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'flag',
        type: 'bool'
      }
    ],
    name: 'pauseOne',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pendingMPC',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'manager',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'flag',
        type: 'bool'
      }
    ],
    name: 'setManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'managers',
        type: 'address[]'
      },
      {
        internalType: 'bool[]',
        name: 'flags',
        type: 'bool[]'
      }
    ],
    name: 'setManagersBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      }
    ],
    name: 'setPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'chainIDs',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: 'prices',
        type: 'uint256[]'
      }
    ],
    name: 'setPricesBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      },
      {
        internalType: 'uint256[3]',
        name: 'threshold',
        type: 'uint256[3]'
      }
    ],
    name: 'setSwapThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getAllChainIDs',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainID',
        type: 'uint256'
      }
    ],
    name: 'getChainConfig',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'BlockChain',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'RouterContract',
            type: 'string'
          },
          {
            internalType: 'uint64',
            name: 'Confirmations',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'InitialHeight',
            type: 'uint64'
          },
          {
            internalType: 'string',
            name: 'Extra',
            type: 'string'
          }
        ],
        internalType: 'struct RouterConfig.ChainConfig',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
export default chains
