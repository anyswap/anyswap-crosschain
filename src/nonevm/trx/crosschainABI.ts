export const ABI_TO_ADDRESS = [
  {
    "inputs": [
      {
        "name": "token",
        "type": "address"
      },
      {
        "name": "to",
        "type": "string"
      },
      {
        "name": "toChainID",
        "type": "uint256"
      }
    ],
    "name": "anySwapOutNative",
    "stateMutability": "Payable",
    "type": "Function"
  },
  {
    "inputs": [
      {
        "name": "token",
        "type": "address"
      },
      {
        "name": "to",
        "type": "string"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "toChainID",
        "type": "uint256"
      }
    ],
    "name": "anySwapOutUnderlying",
    "stateMutability": "Nonpayable",
    "type": "Function"
  },
  {
    "inputs": [
      {
        "name": "token",
        "type": "address"
      },
      {
        "name": "to",
        "type": "string"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "toChainID",
        "type": "uint256"
      }
    ],
    "name": "anySwapOut",
    "stateMutability": "Nonpayable",
    "type": "Function"
  }
]

export const ABI_TO_STRING = [
  {
    "inputs": [
      {
        "name": "token",
        "type": "address"
      },
      {
        "name": "to",
        "type": "string"
      },
      {
        "name": "toChainID",
        "type": "uint256"
      }
    ],
    "name": "anySwapOutNative",
    "stateMutability": "Payable",
    "type": "Function"
  },
  {
    "inputs": [
      {
        "name": "token",
        "type": "address"
      },
      {
        "name": "to",
        "type": "string"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "toChainID",
        "type": "uint256"
      }
    ],
    "name": "anySwapOutUnderlying",
    "stateMutability": "Nonpayable",
    "type": "Function"
  },
  {
    "inputs": [
      {
        "name": "token",
        "type": "address"
      },
      {
        "name": "to",
        "type": "string"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "toChainID",
        "type": "uint256"
      }
    ],
    "name": "anySwapOut",
    "stateMutability": "Nonpayable",
    "type": "Function"
  }
]

export const POOL_ABI = [
  {
    "outputs": [
      {
        "type": "uint256"
      }
    ],
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "stateMutability": "Nonpayable",
    "type": "Function"
  },
  {
    "outputs": [
      {
        "type": "uint256"
      }
    ],
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "stateMutability": "Nonpayable",
    "type": "Function"
  },
]