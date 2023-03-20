
import { useCallback, useMemo } from 'react'
import { useWallet, ConnectType } from '@terra-money/wallet-provider'
// import { useWallet as useSolWallet } from '@solana/wallet-adapter-react';
// import { useDispatch } from 'react-redux'
// import { setOpenModal, ApplicationModal } from '../state/application/actions'
import { useWalletModalToggle } from '../state/application/hooks'
// import { AppDispatch } from '../state/index'
import { useUserSelectChainId } from '../state/user/hooks'

import { ChainId } from '../config/chainConfig/chainId'
import config from '../config'

import {useActiveReact} from './useActiveReact'
import {useLogin} from '../nonevm/near'
import {connectXlmWallet} from '../nonevm/stellar'
import {useLoginTrx} from '../nonevm/trx'
import {useAdaLogin} from '../nonevm/cardano'
import {useLoginFlow} from '../nonevm/flow'
import {useLoginAptos} from '../nonevm/apt'
import {useLoginBtc} from '../nonevm/btc'
import {useLoginAtom} from '../nonevm/atom'
import {useLoginSol} from '../nonevm/solana'
import {useLoginReef} from '../nonevm/reef'
import {useNasLogin} from '../nonevm/nas'

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
  const {loginFlow} = useLoginFlow()
  const {loginAptos} = useLoginAptos()
  const {loginBtc} = useLoginBtc()
  const {loginAtom} = useLoginAtom()
  const {loginSol} = useLoginSol()
  const {loginReef} = useLoginReef()
  const {loginNas} = useNasLogin()

  const useChainId = useMemo(() => {
    return selectNetworkInfo?.chainId
  }, [selectNetworkInfo])
  // const {publicKey} = useSolWallet()
  // console.log(selectNetworkInfo)
  return useCallback(() => {
    if (useChainId === ChainId.TERRA) {
      if (connect) {
        try {
          // connect(ConnectType.CHROME_EXTENSION)
          if (!account) {
            connect(ConnectType.CHROME_EXTENSION)
          } else {
            toggleWalletModal()
            // dispatch(setOpenModal(ApplicationModal.WALLET))
          }
        } catch (error) {
          alert('Please install Terra Station!')
        }
      } else {
        alert('Please install Terra Station!')
      }
    } else if ([ChainId.BTC, ChainId.BTC_TEST].includes(useChainId) && config?.chainInfo?.[useChainId]?.chainType !== 'NOWALLET') {
      if (!account) {
        loginBtc(useChainId)
      } else {
        toggleWalletModal()
        // dispatch(setOpenModal(ApplicationModal.WALLET))
      }
    } else if (useChainId === ChainId.NAS) {
      if (!account) {
        loginNas(useChainId)
      } else {
        toggleWalletModal()
        // dispatch(setOpenModal(ApplicationModal.WALLET))
      }
    } else if ( [ChainId.NEAR, ChainId.NEAR_TEST].includes(useChainId) ) {
      if (!account) {
        login()
      } else {
        toggleWalletModal()
        // dispatch(setOpenModal(ApplicationModal.WALLET))
      }
    } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(useChainId)) {
      if (!account) {
        loginXlm()
      } else {
        toggleWalletModal()
        // dispatch(setOpenModal(ApplicationModal.WALLET))
      }
    } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(useChainId)) {
      if (!account) {
        loginTrx()
      } else {
        toggleWalletModal()
      }
    } else if ([ChainId.ADA, ChainId.ADA_TEST].includes(useChainId)) {
      if (!account) {
        loginAda()
      } else {
        toggleWalletModal()
      }
    } else if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(useChainId)) {
      if (!account) {
        loginFlow()
      } else {
        toggleWalletModal()
      }
    } else if ([ChainId.APT, ChainId.APT_TEST].includes(useChainId)) {
      if (!account) {
        loginAptos(useChainId)
      } else {
        toggleWalletModal()
      }
    } else if ([ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST, ChainId.ATOM_DCORE, ChainId.ATOM_DCORE_TEST].includes(useChainId)) {
      if (!account) {
        loginAtom(useChainId)
      } else {
        toggleWalletModal()
      }
    } else if ([ChainId.SOL, ChainId.SOL_TEST].includes(useChainId)) {
      if (!account) {
        loginSol()
      } else {
        toggleWalletModal()
      }
    } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(useChainId)) {
      if (!account) {
        loginReef(useChainId)
      } else {
        toggleWalletModal()
      }
    } else {
      toggleWalletModal()
    }
  }, [useChainId, toggleWalletModal, account])
}

export function useLogoutWallet () {
  const {selectNetworkInfo} = useUserSelectChainId()
  const {logoutFlow} = useLoginFlow()
  const {logoutNear} = useLogin()
  const useChainId = useMemo(() => {
    return selectNetworkInfo?.chainId
  }, [selectNetworkInfo])
  const logoutWallet = useCallback(() => {
    if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(useChainId)) {
      logoutFlow()
    } else if (ChainId.NEAR, ChainId.NEAR_TEST) {
      logoutNear()
    }
  }, [useChainId])

  const isSupportLogout = useMemo(() => {
    if ([ChainId.FLOW, ChainId.FLOW_TEST, ChainId.NEAR, ChainId.NEAR_TEST].includes(useChainId)) {
      return true
    }
    return false
  }, [useChainId])

  return {
    logoutWallet,
    isSupportLogout
  }
}