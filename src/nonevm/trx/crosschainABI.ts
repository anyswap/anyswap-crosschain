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
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "_owner", "type": "address" },
      { "name": "_spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "token",
      "type": "address"
    }, {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }, {
      "internalType": "address",
      "name": "to",
      "type": "address"
    }],
    "name": "withdrawNative",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "token",
      "type": "address"
    }, {
      "internalType": "address",
      "name": "to",
      "type": "address"
    }],
    "name": "depositNative",
    "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "stateMutability": "payable",
    "type": "function"
  }
]
