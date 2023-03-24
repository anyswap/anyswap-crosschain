import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import swapMULTIABI from '../constants/abis/swapMULTIABI.json'
import MasterChef from '../constants/abis/farm/MasterChef.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'

import { MULTICALL_ABI } from '../constants/multicall'
import { V1_FACTORY_ABI } from '../constants/v1'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'

import RouterSwapAction from '../constants/abis/bridge/RouterSwapAction.json'
import RouterSwapActionV2 from '../constants/abis/bridge/RouterSwapActionV2.json'
import ClientABI from '../constants/abis/client.json'
import AnycallABI from '../constants/abis/anycall.json'
import RouterAction from '../constants/abis/bridge/RouterAction.json'
import swapBTCABI from '../constants/abis/bridge/swapBTCABI.json'
import swapETHABI from '../constants/abis/bridge/swapETHABI.json'
import veMULTI from '../constants/abis/veMULTI.json'
import veMultiReward from '../constants/abis/veMULTIReward.json'
import veshare from '../constants/abis/veshare.json'

import NFT from '../constants/abis/bridge/nft.json'
import anycallNFT721 from '../constants/abis/bridge/anycallNFT721.json'
import NFT721 from '../constants/abis/bridge/erc721.json'
import NFT1155 from '../constants/abis/bridge/erc1155.json'

import config from '../config/index'
import { ChainId } from '../config/chainConfig/chainId'
import { ERC_TYPE } from '../state/nft/hooks'

const Web3 = require('web3')

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

// returns null on errors
export function useRpcContract(address: string | undefined, ABI: any, withSignerIfPossible = true, chainId: any): Contract | null {

  return useMemo(() => {
    if (!address || !ABI || !chainId) return null
    const web3Fn = new Web3(new Web3.providers.HttpProvider(config.getCurChainInfo(chainId).nodeRpc))
    try {
      return new web3Fn.eth.Contract(ABI, address)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, withSignerIfPossible, chainId])
}

export function useV1FactoryContract(): Contract | null {
  return useContract(config.v1FactoryToken ? config.v1FactoryToken : undefined, V1_FACTORY_ABI, false)
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBridgeContract(routerToken?:any, version?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(routerToken ? routerToken : undefined, version === 'v2' ? RouterSwapActionV2 : RouterSwapAction, withSignerIfPossible)
}
export function usePermissonlessContract(routerToken?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(routerToken ? routerToken : undefined, ClientABI, withSignerIfPossible)
}

export function useAnycallContract(anytoken?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(anytoken ? anytoken : undefined, AnycallABI, withSignerIfPossible)
}

export function useVeMULTIContract(veToken?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(veToken ? veToken : undefined, veMULTI, withSignerIfPossible)
}
export function useVeMULTIRewardContract(veToken?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(veToken ? veToken : undefined, veMultiReward, withSignerIfPossible)
}
export function useVeShareContract(token?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(token ? token : undefined, veshare, withSignerIfPossible)
}

export function useNFTContract(routerToken?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(routerToken ? routerToken : undefined, NFT, withSignerIfPossible)
}

export function useAnycallNFTContract(routerToken?:any, nfttype?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(routerToken ? routerToken : undefined, nfttype ? (nfttype === ERC_TYPE.erc721 ? anycallNFT721 : NFT1155) : undefined, withSignerIfPossible)
}

export function useNFT721Contract(tokenAddress?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress ? tokenAddress : undefined, NFT721, withSignerIfPossible)
}

export function useNFT1155Contract(tokenAddress?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress ? tokenAddress : undefined, NFT1155, withSignerIfPossible)
}

export function useSwapUnderlyingContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, RouterAction, withSignerIfPossible)
}

export function useSwapBTCContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, swapBTCABI, withSignerIfPossible)
}

export function useSwapETHContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, swapETHABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId }:any = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId?.toString()) {
      case ChainId.ETH:
      case ChainId.GOERLI:
      // case ChainId.ROPSTEN:
      // case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
      case ChainId.BNB:
        address = '0x08ced32a7f3eec915ba84415e9c07a7286977956'
        break
      case ChainId.ARBITRUM:
        address = '0x4a067EE58e73ac5E4a43722E008DFdf65B2bF348'
        break
    }
  }
  // console.log(address)
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  const { chainId }:any = useActiveWeb3React()
  let useAddress: string | undefined
  if (chainId) {
    switch (chainId?.toString()) {
      case ChainId.ETH:
      case ChainId.GOERLI:
        useAddress = '0xA2C122BE93b0074270ebeE7f6b7292C7deB45047'
        break
      case ChainId.BNB:
        useAddress = '0x1DdA6feF836c0c1dE986aC15597922dEe95Ff98A'
        break
      case ChainId.ARBITRUM:
        useAddress = '0xfc81140Cd374Fe235c8398A0Ae57101Eac79Ae35'
        break
    }
  }
  return useContract(address ? address : useAddress, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useSwapMultiContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, swapMULTIABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  // return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
  // console.log(config.getCurChainInfo(chainId).multicalToken)
  return useContract(config.getCurChainInfo(chainId).multicalToken, MULTICALL_ABI, false)
}

export function useRpcMulticallContract(chainId:any): Contract | null {
  // return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
  return useRpcContract(config.getCurChainInfo(chainId).multicalToken, MULTICALL_ABI, false, chainId)
}



export function useFarmContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, MasterChef, withSignerIfPossible)
}
