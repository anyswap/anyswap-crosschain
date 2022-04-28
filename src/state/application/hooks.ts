import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'
import { ApplicationState } from './reducer'
import { AppSettingsData, RouterConfigDataList, ERC20TokenDataList, CrossChainTokenDataList } from './actions'
import { addPopup, ApplicationModal, PopupContent, removePopup, setOpenModal } from './actions'

export function useBlockNumber(initChainId?: any): number | undefined {
  const { chainId } = useActiveWeb3React()
  const useChainId = initChainId || chainId

  return useSelector((state: AppState) => state.application.blockNumber[useChainId ?? -1])
}

export function useAppState(): ApplicationState {
  return useSelector((state: AppState) => state.application)
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

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS)
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
  return useToggleModal(ApplicationModal.NETWORK)
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


// Settings page
/*
  apiAddress: string
  serverAdminAddress: string
  mainConfigChainId: number | undefined
  mainConfigAddress: string
  routerConfigs: RouterConfigDataList
  erc20Tokens: ERC20TokenDataList
  crosschainTokens: CrossChainTokenDataList
*/
export function useAppSettings(): AppSettingsData {
  return useSelector((state: AppState) => state.application.appSettings)
}

// URL бек-энда
export function useAppSettingsApiAddress(): string {
  return useSelector((state: AppState) => state.application.appSettings.apiAddress)
}

// Eth адресс бек-энда
export function useAppSettingsServerAddress(): string {
  return useSelector((state: AppState) => state.application.appSettings.serverAdminAddress)
}

// ChainId где лежит конфиг бек-энда
export function useAppSettingsConfigChainId(): number | undefined {
  return useSelector((state: AppState) => state.application.appSettings.mainConfigChainId)
}

// Eth адрес конфига бек-энда
export function useAppSettingsConfigAddress(): string {
  return useSelector((state: AppState) => state.application.appSettings.mainConfigAddress)
}

// Список известных роутеров 
export function useAppSettingsRouterConfigs(): RouterConfigDataList {
  return useSelector((state: AppState) => state.application.appSettings.routerConfigs)
}

// Список известных токенов
export function useAppSettingsERC20Tokens(): ERC20TokenDataList {
  return useSelector((state: AppState) => state.application.appSettings.erc20Tokens)
}

// Список известных крос-чейн токенов
export function useAppSettingsCrosschainTokens(): CrossChainTokenDataList {
  return useSelector((state: AppState) => state.application.appSettings.crosschainTokens)
}