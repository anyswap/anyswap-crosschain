import { useActiveWeb3React } from './index'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { useUserSelectChainId } from '../state/user/hooks'
import { useMemo } from 'react'

export function useAccounts () {
  const { account } = useActiveWeb3React()
  const connectedWallet = useConnectedWallet()
  const [selectNetworkInfo] = useUserSelectChainId()
  return useMemo(() => {
    if (selectNetworkInfo?.label === 'TERRA') {
      return connectedWallet?.walletAddress
    }
    return account
  }, [account, connectedWallet, selectNetworkInfo])
}