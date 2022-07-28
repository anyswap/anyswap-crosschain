
import { useCallback } from 'react'
import { useWallet, ConnectType } from '@terra-money/wallet-provider'
// import { useDispatch } from 'react-redux'
// import { setOpenModal, ApplicationModal } from '../state/application/actions'
import { useWalletModalToggle } from '../state/application/hooks'
// import { AppDispatch } from '../state/index'
import { useUserSelectChainId } from '../state/user/hooks'

import { ChainId } from '../config/chainConfig/chainId'

import {useLogin} from './near'
import {useActiveReact} from './useActiveReact'

import {connectXlmWallet} from './stellar'

export function useConnectWallet () {
  const {account} = useActiveReact()
  // const dispatch = useDispatch<AppDispatch>()
  const {selectNetworkInfo} = useUserSelectChainId()
  const toggleWalletModal = useWalletModalToggle()
  const { connect } = useWallet()
  const {login} = useLogin()
  const {loginXlm} = connectXlmWallet()
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
      
    } else if (
      selectNetworkInfo?.label === ChainId.NEAR
      || selectNetworkInfo?.label === ChainId.NEAR_TEST
    ) {
      if (!account) {
        login()
      } else {
        toggleWalletModal()
        // dispatch(setOpenModal(ApplicationModal.WALLET))
      }
    } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(selectNetworkInfo?.label)) {
      if (!account) {
        loginXlm()
      } else {
        toggleWalletModal()
        // dispatch(setOpenModal(ApplicationModal.WALLET))
      }
    } else {
      toggleWalletModal()
    }
  }, [selectNetworkInfo, toggleWalletModal, account])
}