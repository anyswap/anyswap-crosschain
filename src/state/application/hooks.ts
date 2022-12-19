import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'
import { addPopup, ApplicationModal, PopupContent, removePopup, setOpenModal, viewTxnsDtils, viewTxnsErrorTip } from './actions'

import {useIsSafeAppConnection} from '../../connectors/gnosis-safe/hooks'
// import {gnosissafe} from '../../connectors'

export function useBlockNumber(initChainId?:any): number | undefined {
  const { chainId } = useActiveWeb3React()
  const useChainId = initChainId ? initChainId : chainId
  // console.log(useChainId)
  return useSelector((state: AppState) => { 
    // console.log(useChainId)
    // console.log(state.application.blockNumber)
    // console.log(state.application.blockNumber[useChainId ?? -1])
    return state.application.blockNumber[useChainId ?? -1]
  })
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal])
}

export function useCloseModals(): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET)
}

export function useNoWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.NO_WALLET)
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS)
}

export function useToggleNavMenu(key:any): () => void {
  return useToggleModal(key)
}

export function useShowClaimPopup(): boolean {
  return useModalOpen(ApplicationModal.CLAIM_POPUP)
}

export function useToggleShowClaimPopup(): () => void {
  return useToggleModal(ApplicationModal.CLAIM_POPUP)
}

export function useToggleSelfClaimModal(): () => void {
  return useToggleModal(ApplicationModal.SELF_CLAIM)
}

export function useToggleDelegateModal(): () => void {
  return useToggleModal(ApplicationModal.DELEGATE)
}

export function useToggleVoteModal(): () => void {
  return useToggleModal(ApplicationModal.VOTE)
}


export function useToggleNetworkModal(): () => void {
  const isGnosisSafe = useIsSafeAppConnection()
  const modal = ApplicationModal.NETWORK
  const open = useModalOpen(modal)
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => {
    // console.log(isGnosisSafe)
    // console.log(gnosissafe)
    if (isGnosisSafe) {
      return dispatch(setOpenModal(null))
    } else {
      return dispatch(setOpenModal(open ? null : modal))
    }
  }, [dispatch, modal, open, isGnosisSafe])





  // const dispatch = useDispatch<AppDispatch>()
  // const closeNetwork = useCallback(() => {
  //   dispatch(setOpenModal(null))
  // }, [dispatch, isGnosisSafe])
  // console.log(isGnosisSafe)
  // return isGnosisSafe ? closeNetwork : useToggleModal(ApplicationModal.NETWORK)
}
// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }))
    },
    [dispatch]
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter(item => item.show), [list])
}


export function useTxnsDtilOpen(): any {
  const viewTxnsDtilsData = useSelector((state: AppState) => state.application.viewTxnsDtils)
  const dispatch = useDispatch<AppDispatch>()
  const onChangeViewDtil = useCallback(
    (hash: any, isOpenModal: any) => {
      // console.log(field)
      // console.log(typedValue)
      // console.log(typeInput({ field, typedValue }))
      dispatch(viewTxnsDtils({ hash, isOpenModal }))
    },
    [dispatch]
  )

  return {
    ...(viewTxnsDtilsData ? viewTxnsDtilsData : {
      hash: '',
      isOpenModal: ''
    }),
    onChangeViewDtil
  }
}
export function useTxnsErrorTipOpen(): any {
  const viewTxnsErrorTipData = useSelector((state: AppState) => state.application.viewTxnsErrorTip)
  const dispatch = useDispatch<AppDispatch>()
  const onChangeViewErrorTip = useCallback(
    (errorTip: any, isOpenModal: any) => {
      console.log(errorTip)
      // console.log(typedValue)
      // console.log(typeInput({ field, typedValue }))
      let errorContent = ''
      if (errorTip?.data?.data) {
        if (errorTip?.data?.data.indexOf('burn amount exceeds minter total') !== -1) {
          errorContent = 'No bridging quota on conflux chain.'
        } else if (errorTip?.data?.message) {
          errorContent = errorTip?.data?.message
        }
      } else if (errorTip?.message) {
        errorContent = errorTip?.message
      } else {
        errorContent = errorTip.toString()
      }
      dispatch(viewTxnsErrorTip({ errorTip: errorContent, isOpenModal }))
    },
    [dispatch]
  )

  return {
    ...(viewTxnsErrorTipData ? viewTxnsErrorTipData : {
      errorTip: '',
      isOpenModal: ''
    }),
    onChangeViewErrorTip
  }
}