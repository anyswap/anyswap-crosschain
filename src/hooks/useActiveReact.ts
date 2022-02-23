import { useActiveWeb3React } from './index'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { useUserSelectChainId } from '../state/user/hooks'
import { useCurrentAddress } from './nebulas'
import { useMemo } from 'react'

export function useActiveReact() {
  const { account, chainId } = useActiveWeb3React()
  const connectedWallet = useConnectedWallet()
  const { selectNetworkInfo } = useUserSelectChainId()
  // for nebulas
  const nebAddress = useCurrentAddress()

  return useMemo(() => {
    let useAccount = account
    let useChainId: any = chainId
    if (selectNetworkInfo?.label === 'TERRA') {
      useAccount = connectedWallet?.walletAddress
      useChainId = selectNetworkInfo?.chainId
    } else if (selectNetworkInfo?.label === 'BTC') {
      useAccount = ''
      useChainId = selectNetworkInfo?.chainId
    } else if (selectNetworkInfo?.label === 'NEBULAS') {
      useAccount = nebAddress
      useChainId = selectNetworkInfo?.chainId
    }

    return {
      account: useAccount,
      chainId: useChainId,
      evmAccount: account
    }
  }, [account, connectedWallet, nebAddress, selectNetworkInfo, chainId])
}
