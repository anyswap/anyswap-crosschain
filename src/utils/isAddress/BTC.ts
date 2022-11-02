import { ChainId } from "../../config/chainConfig/chainId"
const bitcoin = require('bitcoinjs-lib')
const OPS = require('bitcoin-ops')

// const NETWORK = config.env === 'test' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
const NETWORK = bitcoin.networks.bitcoin
const LITECOIN = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe,
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
}

const BLOCK = {
  messagePrefix: '\x19Blocknet Signed Message:\n',
  bech32: 'block',
  bip32: {
   public: 0x0488B21E,
   private: 0x0488ADE4
  },
  
  pubKeyHash: 0x1a,
  scriptHash: 0x1c,
  wif: 0x9a,
}

const COLOSSUSXT = {
  messagePrefix: '\x19ColossusXT Signed Message:\n',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe,
  },
  pubKeyHash: 0x1e,
  scriptHash: 0x0d,
  wif: 0xd4,
}

function getNetwork (chainId?:string) {
  let network = NETWORK
  chainId = chainId ? chainId.toUpperCase() : ''
  if (chainId === ChainId.BTC) {
    network = bitcoin.networks.bitcoin
  } else if (chainId === ChainId.BTC_TEST) {
    network = bitcoin.networks.testnet
  } else if (chainId === ChainId.LTC) {
    network = LITECOIN
  } else if (chainId === ChainId.BLOCK) {
    network = BLOCK
  } else if (chainId === ChainId.COLX) {
    network = COLOSSUSXT
  } 
  return network
}

export function createAddress (address:string, chainId:string | undefined, initAddr:string) {
  const network = getNetwork(chainId)
  address = address.replace('0x', '')
  const {hash} = bitcoin.address.fromBase58Check(initAddr)

  const reddemScript = bitcoin.script.compile([
    Buffer.from(address, 'hex'),
    OPS.OP_DROP,
    OPS.OP_DUP,
    OPS.OP_HASH160,
    Buffer.from(hash,'hex'),
    OPS.OP_EQUALVERIFY,
    OPS.OP_CHECKSIG,
  ])
  const output = bitcoin.script.compile([
    OPS.OP_HASH160,
    bitcoin.crypto.hash160(reddemScript),
    OPS.OP_EQUAL,
  ])
  const p2shAddress = bitcoin.payments.p2sh({
    output: output,
    network: network,
  })
  // console.log(p2shAddress.address)
  return p2shAddress.address;
}

export const BTCARR = [ChainId.BTC, ChainId.BTC_TEST, ChainId.LTC, ChainId.BLOCK, ChainId.COLX]

export function isBTCAddress (address:string, chainId?:string) {
  const network = getNetwork(chainId)
  try {
    bitcoin.address.toOutputScript(address, network)
    return address
  } catch (error) {
    return false
  }
}