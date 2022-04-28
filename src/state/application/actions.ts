import { createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'

export type PopupContent =
  | {
      txn: {
        hash: string
        success: boolean
        summary?: string
      }
    }
  | {
      listUpdate: {
        listUrl: string
        oldList: TokenList
        newList: TokenList
        auto: boolean
      }
    }

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  DELEGATE,
  VOTE,
  NETWORK
}

export type RouterConfigData = {
  chainId: number | undefined
  address: string
}

export type ERC20TokenData = {
  chainId: number
  address: string
  decimals: number
  symbol: string
  name: string
  icon: string
}

export type CrossChainTokenData = {
  chainId: number
  address: string
  erc20address: string
}

export type RouterConfigDataList = {
  [ key: string ]: RouterConfigData
}

export type ERC20TokenDataList = {
  [ key: string ]: ERC20TokenData
}

export type CrossChainTokenDataList = {
  [ key: string ]: CrossChainTokenData
}

export type AppSettingsData = {
  apiAddress: string
  serverAdminAddress: string
  mainConfigChainId: number | undefined
  mainConfigAddress: string
  routerConfigs: RouterConfigDataList
  erc20Tokens: ERC20TokenDataList
  crosschainTokens: CrossChainTokenDataList
}

export type AppData = {
  owner: string
  logo: string
  projectName: string
  brandColor: string
  backgroundColorLight: string
  backgroundColorDark: string
  elementsColorLight: string
  elementsColorDark: string
  socialLinks: string[]
  disableSourceCopyright: boolean
  apiAddress: string
  routerConfigChainId: number | undefined
  routerConfigAddress: string
  serverAdminAddress: string
  appSettings: AppSettingsData
}

export type AppDataKeys = keyof AppData

export const updateRouterData = createAction<{ chainId: number; routerAddress: string }>('application/updateRouterData')
export const setAppManagement = createAction<{ status: boolean }>('application/setAppManagement')
export const retrieveAppData = createAction<null | AppData>('application/retrieveAppData')
export const updateAppOptions = createAction<{ key: AppDataKeys; value: AppData[AppDataKeys] }[]>(
  'application/updateAppOptions'
)
export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'application/addPopup'
)
export const removePopup = createAction<{ key: string }>('application/removePopup')
