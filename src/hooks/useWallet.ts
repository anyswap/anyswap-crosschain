
import { useCallback } from 'react'
import { useWallet, ConnectType } from '@terra-money/wallet-provider'
// import { useDispatch } from 'react-redux'
// import { setOpenModal, ApplicationModal } from '../state/application/actions'
import { useWalletModalToggle } from '../state/application/hooks'
// import { AppDispatch } from '../state/index'
import { useUserSelectChainId } from '../state/user/hooks'

import { ChainId } from '../config/chainConfig/chainId'

import {useActiveReact} from './useActiveReact'
import {useLogin} from '../nonevm/near'
import {connectXlmWallet} from '../nonevm/stellar'
import {useLoginTrx} from '../nonevm/trx'
import {useAdaLogin} from '../nonevm/cardano'

export function useConnectWallet () {
  const {account} = useActiveReact()
  // const dispatch = useDispatch<AppDispatch>()
  const {selectNetworkInfo} = useUserSelectChainId()
  const toggleWalletModal = useWalletModalToggle()
  const { connect } = useWallet()
  const {login} = useLogin()
  const {loginXlm} = connectXlmWallet()
  const {loginTrx} = useLoginTrx()
  const loginAda = useAdaLogin()
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
    } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(selectNetworkInfo?.label)) {
      if (!account) {
        loginTrx()
      } else {
        toggleWalletModal()
      }
    } else if ([ChainId.ADA, ChainId.ADA_TEST].includes(selectNetworkInfo?.label)) {
      if (!account) {
        loginAda()
      } else {
        toggleWalletModal()
      }
    } else {
      toggleWalletModal()
    }
  }, [selectNetworkInfo, toggleWalletModal, account])
}