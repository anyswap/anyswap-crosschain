import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from 'anyswap-sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import ROUTER_CONFIG from '../constants/abis/app/RouterConfig.json'
import STORAGE from '../constants/abis/app/Storage.json'
import ROUTER from '../constants/abis/app/AnyswapV6Router.json'
import MasterChef from '../constants/abis/farm/MasterChef.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import WETH_ABI from '../constants/abis/weth.json'
import { MULTICALL_ABI } from '../constants/multicall'
import { V1_FACTORY_ABI } from '../constants/v1'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { chainInfo } from '../config/chainConfig'
import RouterSwapAction from '../constants/abis/bridge/RouterSwapAction.json'
import RouterAction from '../constants/abis/bridge/RouterAction.json'

import NFT from '../constants/abis/bridge/nft.json'
import NFT721 from '../constants/abis/bridge/erc721.json'
import NFT1155 from '../constants/abis/bridge/erc1155.json'
import config from '../config/index'

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

export function useRouterConfigContract(address?: string, chainId?: number, withSigner?: boolean): Contract | null {
  const { library } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !chainId || !library) return null

    try {
      const { nodeRpc } = chainInfo[chainId]
      const web3 = new Web3(nodeRpc)

      if (withSigner) {
        const routerConfig = getContract(address, ROUTER_CONFIG.abi, library, undefined)

        return routerConfig.connect(library.getSigner())
      }

      return new web3.eth.Contract(ROUTER_CONFIG.abi, address)
    } catch (error) {
      console.error('Failed to get Router config contract', error)
    }

    return null
  }, [address, chainId, library])
}

export function useRouterContract(chainId: number, address?: string) {
  return useMemo(() => {
    if (!address || !chainId) return null

    try {
      const { nodeRpc } = chainInfo[chainId]
      const web3 = new Web3(nodeRpc)

      return new web3.eth.Contract(ROUTER.abi, address)
    } catch (error) {
      console.error('Failed to get Router contract', error)
    }

    return null
  }, [chainId, address])
}

export function useStorageContract(chainId: number): Contract | null {
  return useMemo(() => {
    if (!chainId) return null

    try {
      const { storage, nodeRpc } = chainInfo[chainId]
      const web3 = new Web3(nodeRpc)

      return new web3.eth.Contract(STORAGE.abi, storage)
    } catch (error) {
      console.error('Failed to get Storage contract', error)
    }

    return null
  }, [chainId])
}

// returns null on errors
export function useRpcContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
  chainId: any
): Contract | null {
  return useMemo(() => {
    if (!address || !ABI || !chainId) return null
    const web3Fn = new Web3(config.getCurChainInfo(chainId).nodeRpc)
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

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useBridgeContract(routerToken?: any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(routerToken ? routerToken : undefined, RouterSwapAction, withSignerIfPossible)
}

export function useNFTContract(routerToken?: any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(routerToken ? routerToken : undefined, NFT, withSignerIfPossible)
}

export function useNFT721Contract(tokenAddress?: any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress ? tokenAddress : undefined, NFT721, withSignerIfPossible)
}

export function useNFT1155Contract(tokenAddress?: any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress ? tokenAddress : undefined, NFT1155, withSignerIfPossible)
}

export function useSwapUnderlyingContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, RouterAction, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  // return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
  // console.log(config.getCurChainInfo(chainId).multicalToken)
  return useContract(config.getCurChainInfo(chainId).multicalToken, MULTICALL_ABI, false)
}

export function useRpcMulticallContract(chainId: any): Contract | null {
  // return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
  return useRpcContract(config.getCurChainInfo(chainId).multicalToken, MULTICALL_ABI, false, chainId)
}

export function useFarmContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, MasterChef, withSignerIfPossible)
}
