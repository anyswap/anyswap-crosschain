import { Web3Provider } from '@ethersproject/providers'
// import { Contract } from '@ethersproject/contracts'
import { isAddress } from 'web3-utils'
import { getWeb3Library } from './getLibrary'
import AnyswapERC20 from '../constants/abis/app/AnyswapV6ERC20.json'
import AnyswapV6Router from '../constants/abis/app/AnyswapV6Router.json'
import RouterConfig from '../constants/abis/app/RouterConfig.json'

const doNothing = () => null

export const isValidAddressFormat = (address: string) => {
  return typeof address === 'string' && /^0x[A-Fa-f0-9]{40}$/.test(address)
}

export const isValidAddress = (library: Web3Provider, address: string) => {
  if (!isValidAddressFormat(address) || !library) return false

  try {
    return isAddress(address)
  } catch (error) {
    console.error(error)
    return false
  }
}

export const getContractInstance = (library: Web3Provider, address: string, abi: any) => {
  const web3 = getWeb3Library(library.provider)

  return new web3.eth.Contract(abi, address)
}

export const deployContract = async (params: any) => {
  const { abi, byteCode, library, account, onDeploy = doNothing, onHash = doNothing, deployArguments } = params

  let contract

  try {
    const web3 = getWeb3Library(library.provider)

    contract = new web3.eth.Contract(abi)

    const transaction = contract.deploy({
      data: byteCode,
      arguments: deployArguments
    })

    const gas = await transaction.estimateGas({ from: account })

    return await transaction
      .send({
        from: account,
        gas
      })
      .on('transactionHash', (hash: string) => onHash(hash))
      .on('error', (error: any) => console.error(error))
      .on('receipt', (receipt: any) => onDeploy(receipt))
  } catch (error) {
    throw error
  }
}

export const deployAnyswapERC20 = async (params: any) => {
  const { library, onHash, name, symbol, decimals, underlying, vault, minter } = params
  const { abi, bytecode } = AnyswapERC20

  return deployContract({
    abi,
    byteCode: bytecode,
    deployArguments: [name, symbol, decimals, underlying, vault, minter],
    library,
    onHash
  })
}

export const deployAnyswapRouter = async (params: any) => {
  const { library, onHash, factory, wNative, mpc } = params
  const { abi, bytecode } = AnyswapV6Router

  return deployContract({
    abi,
    byteCode: bytecode,
    deployArguments: [factory, wNative, mpc],
    library,
    onHash
  })
}

export const deployRouterConfig = async (params: any) => {
  const { library, onHash } = params
  const { abi, bytecode } = RouterConfig

  return deployContract({
    abi,
    byteCode: bytecode,
    deployArguments: [],
    library,
    onHash
  })
}
