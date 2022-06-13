import { useActiveWeb3React } from './index'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { useUserSelectChainId } from '../state/user/hooks'
import { useMemo } from 'react'

import { useCurrentAddress } from './nas'
import {useNearAddress} from './near'

import { ChainId } from '../config/chainConfig/chainId'

export function useActiveReact () {
  const { account, chainId } = useActiveWeb3React()
  const connectedWallet = useConnectedWallet()
  const {selectNetworkInfo} = useUserSelectChainId()
  const nebAddress = useCurrentAddress()
  const nearAddress = useNearAddress()
  return useMemo(() => {
    let useAccount = account
    const useChainId:any = selectNetworkInfo?.chainId && selectNetworkInfo?.label ? selectNetworkInfo?.chainId : chainId
    if (selectNetworkInfo?.label === ChainId.TERRA) {
      useAccount = connectedWallet?.walletAddress
    } else if (selectNetworkInfo?.label === ChainId.BTC) {
      useAccount = ''
    } else if (selectNetworkInfo?.label === ChainId.NAS) {
      useAccount = nebAddress
    } else if (selectNetworkInfo?.label === ChainId.NEAR) {
      useAccount = nearAddress
    }
    return {
      account: useAccount,
      chainId: useChainId,
      evmAccount: account
    }
  }, [account, connectedWallet, selectNetworkInfo, chainId, nebAddress])
}