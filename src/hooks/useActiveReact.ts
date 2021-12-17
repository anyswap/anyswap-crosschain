import { useActiveWeb3React } from './index'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { useUserSelectChainId } from '../state/user/hooks'
import { useMemo } from 'react'

export function useActiveReact () {
  const { account, chainId } = useActiveWeb3React()
  const connectedWallet = useConnectedWallet()
  const [selectNetworkInfo] = useUserSelectChainId()
  return useMemo(() => {
    let useAccount = account
    let useChainId:any = chainId
    if (selectNetworkInfo?.label === 'TERRA') {
      useAccount = connectedWallet?.walletAddress
      useChainId = 'TERRA'
    } else if (selectNetworkInfo?.label === 'BTC') {
      useAccount = ''
      useChainId = selectNetworkInfo?.label
    }
    return {
      account: useAccount,
      chainId: useChainId
    }
  }, [account, connectedWallet, selectNetworkInfo, chainId])
}