
import { useCallback } from 'react'
import { useWallet, ConnectType } from '@terra-money/wallet-provider'
import { useWalletModalToggle } from '../state/application/hooks'
import { useUserSelectChainId } from '../state/user/hooks'

import { ChainId } from '../config/chainConfig/chainId'

import {useLogin} from './near'

export function useConnectWallet () {
  const {selectNetworkInfo} = useUserSelectChainId()
  const toggleWalletModal = useWalletModalToggle()
  const { connect } = useWallet()
  const {login} = useLogin()
  return useCallback(() => {
    if (selectNetworkInfo?.label === ChainId.TERRA) {
      if (connect) {
        try {
          connect(ConnectType.CHROME_EXTENSION)
        } catch (error) {
          alert('Please install Terra Station!')
        }
      } else {
        alert('Please install Terra Station!')
      }
    } else if (selectNetworkInfo?.label === ChainId.BTC) {
      
    } else if (selectNetworkInfo?.label === ChainId.NAS) {
      
    } else if (selectNetworkInfo?.label === ChainId.NEAR) {
      login()
    } else {
      toggleWalletModal()
    }
  }, [selectNetworkInfo, toggleWalletModal])
}