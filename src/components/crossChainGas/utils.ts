const Web3 = require("web3");

export function getWeb3(rpc: string, provider?: any) {
  rpc = rpc ? rpc : "";
  if (provider) {
    // console.log(library)
    const wFn = new Web3(provider);
    // console.log(wFn)
    return wFn;
  } else {
    // console.log(rpc)
    const wFn = new Web3(new Web3.providers.HttpProvider(rpc));
    return wFn;
  }
}
export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "mpc_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "decimal_",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "managers_",
        type: "address[]",
      },
      {
        internalType: "uint256[3]",
        name: "defaultThreshold_",
        type: "uint256[3]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "decimal",
        type: "uint256",
      },
    ],
    name: "InitCurrencyInfo",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldMPC",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newMPC",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "applyTime",
        type: "uint256",
      },
    ],
    name: "LogApplyMPC",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldMPC",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newMPC",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "effectiveTime",
        type: "uint256",
      },
    ],
    name: "LogChangeMPC",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "PriceUpdate",
    type: "event",
  },
  {
    inputs: [],
    name: "_decimal",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_defaultThreshold",
    outputs: [
      {
        internalType: "uint48",
        name: "low",
        type: "uint48",
      },
      {
        internalType: "uint80",
        name: "mid",
        type: "uint80",
      },
      {
        internalType: "uint128",
        name: "high",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "_managers",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_pauseAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_pauseOne",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "applyMPC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mpc",
        type: "address",
      },
    ],
    name: "changeMPC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "delay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "delayMPC",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
    ],
    name: "getCurrencyInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "decimal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdateTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
    ],
    name: "getDecimal",
    outputs: [
      {
        internalType: "uint256",
        name: "decimal",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
    ],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
    ],
    name: "getSwapThreshold",
    outputs: [
      {
        internalType: "uint256",
        name: "low",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mid",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "high",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "decimal",
        type: "uint256",
      },
    ],
    name: "initCurrencyInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mpc",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "flag",
        type: "bool",
      },
    ],
    name: "pauseAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "flag",
        type: "bool",
      },
    ],
    name: "pauseOne",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingMPC",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "manager",
        type: "address",
      },
      {
        internalType: "bool",
        name: "flag",
        type: "bool",
      },
    ],
    name: "setManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "managers",
        type: "address[]",
      },
      {
        internalType: "bool[]",
        name: "flags",
        type: "bool[]",
      },
    ],
    name: "setManagersBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "setPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "chainIDs",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "prices",
        type: "uint256[]",
      },
    ],
    name: "setPricesBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
      {
        internalType: "uint256[3]",
        name: "threshold",
        type: "uint256[3]",
      },
    ],
    name: "setSwapThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllChainIDs",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainID",
        type: "uint256",
      },
    ],
    name: "getChainConfig",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "BlockChain",
            type: "string",
          },
          {
            internalType: "string",
            name: "RouterContract",
            type: "string",
          },
          {
            internalType: "uint64",
            name: "Confirmations",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "InitialHeight",
            type: "uint64",
          },
          {
            internalType: "string",
            name: "Extra",
            type: "string",
          },
        ],
        internalType: "struct RouterConfig.ChainConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
