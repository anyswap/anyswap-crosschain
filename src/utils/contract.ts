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
  const {
    chainId,
    abi,
    byteCode,
    library,
    account,
    onDeployment = doNothing,
    onHash = doNothing,
    deployArguments
  } = params

  let contract

  try {
    const web3 = getWeb3Library(library.provider)

    contract = new web3.eth.Contract(abi)

    const transaction = contract.deploy({
      data: byteCode,
      arguments: deployArguments
    })

    const gas = await transaction.estimateGas({ from: account })
    let txHash

    const contractInstance = await transaction
      .send({
        from: account,
        gas
      })
      .on('transactionHash', (hash: string) => {
        txHash = hash
        onHash(hash)
      })
      .on('error', (error: any) => console.error(error))

    onDeployment(contractInstance.options.address, chainId, txHash)

    return contractInstance
  } catch (error) {
    throw error
  }
}

export const deployCrosschainERC20 = async (params: any) => {
  const { chainId, library, account, onHash, name, symbol, decimals, underlying, vault, minter, onDeployment } = params
  const { abi, bytecode } = AnyswapERC20

  return deployContract({
    chainId,
    abi,
    byteCode: bytecode,
    deployArguments: [name, symbol, decimals, underlying, vault, minter],
    library,
    account,
    onHash,
    onDeployment: (address: string, chainId: number, hash: string) => {
      // forward name and symbol in case if the user changes smth from it in the form,
      // but we didn't set token config yet
      onDeployment({
        address,
        chainId,
        hash,
        name,
        symbol
      })
    }
  })
}

export const deployRouter = async (params: any) => {
  const { chainId, library, account, onHash, onDeployment, factory, wNative, mpc } = params
  const { abi, bytecode } = AnyswapV6Router

  return deployContract({
    chainId,
    abi,
    byteCode: bytecode,
    deployArguments: [factory, wNative, mpc],
    library,
    account,
    onHash,
    onDeployment
  })
}

export const deployRouterConfig = async (params: any) => {
  const { chainId, library, onHash, account, onDeployment } = params
  const { abi, bytecode } = RouterConfig

  return deployContract({
    chainId,
    abi,
    byteCode: bytecode,
    deployArguments: [],
    library,
    account,
    onHash,
    onDeployment
  })
}
