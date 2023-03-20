import { createAction } from '@reduxjs/toolkit'

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>('user/updateMatchesDarkMode')
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>('user/updateUserDarkMode')
export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>('user/updateUserExpertMode')
export const updateInterfaceMode = createAction<{ userInterfaceMode: boolean }>('user/updateInterfaceMode')
export const updateInterfaceBalanceValid = createAction<{ userInterfaceBalanceValid: boolean }>('user/updateInterfaceBalanceValid')
export const updateUserSlippageTolerance = createAction<{ userSlippageTolerance: number }>(
  'user/updateUserSlippageTolerance'
)
export const updateUserBetaMessage = createAction<{ showBetaMessage: boolean }>(
  'user/updateUserBetaMessage'
)
export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline')
export const updatePairAddress = createAction<{ pairAddress: number }>('user/updatePairAddress')
export const addSerializedToken = createAction<{ serializedToken: SerializedToken }>('user/addSerializedToken')
export const removeSerializedToken = createAction<{ chainId: number; address: string }>('user/removeSerializedToken')
export const addSerializedPair = createAction<{ serializedPair: SerializedPair }>('user/addSerializedPair')
export const removeSerializedPair = createAction<{ chainId: number; tokenAAddress: string; tokenBAddress: string }>(
  'user/removeSerializedPair'
)
export const toggleURLWarning = createAction<void>('app/toggleURLWarning')
export const selectNetworkId = createAction<{ chainId: string, label: string }>('user/selectNetworkId')

export const starChain = createAction<{ account: any, chainId: any }>('application/starChain')
export const starToken = createAction<{ chainId: any, token: any }>('application/starToken')
export const addTokenToWallet = createAction<{ chainId: any, tokenInfo: any }>('application/addTokenToWallet')
export const removeTokenToWallet = createAction<{}>('application/removeTokenToWallet')
export const changeStarTab = createAction<{ type: any, index: any }>('application/changeStarTab')