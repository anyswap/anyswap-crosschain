import { useActiveWeb3React } from './index'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { useUserSelectChainId } from '../state/user/hooks'
import { useMemo } from 'react'

import { useCurrentAddress } from './nas'

import { ChainId } from '../config/chainConfig/chainId'

export function useActiveReact () {
  const { account, chainId } = useActiveWeb3React()
  const connectedWallet = useConnectedWallet()
  const {selectNetworkInfo} = useUserSelectChainId()
  const nebAddress = useCurrentAddress()
  return useMemo(() => {
    let useAccount = account
    let useChainId:any = chainId
    if (selectNetworkInfo?.label === ChainId.TERRA) {
      useAccount = connectedWallet?.walletAddress
      useChainId = selectNetworkInfo?.chainId
    } else if (selectNetworkInfo?.label === ChainId.BTC) {
      useAccount = ''
      useChainId = selectNetworkInfo?.chainId
    } else if (selectNetworkInfo?.label === ChainId.NAS) {
      useAccount = nebAddress
      useChainId = selectNetworkInfo?.chainId
    }
    return {
      account: useAccount,
      chainId: useChainId,
      evmAccount: account
    }
  }, [account, connectedWallet, selectNetworkInfo, chainId, nebAddress])
}