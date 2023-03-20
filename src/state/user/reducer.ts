import { INITIAL_ALLOWED_SLIPPAGE, DEFAULT_DEADLINE_FROM_NOW } from '../../constants'
import { createReducer } from '@reduxjs/toolkit'
import { updateVersion } from '../global/actions'
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedPair,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  updateMatchesDarkMode,
  updateUserDarkMode,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  updateUserDeadline,
  toggleURLWarning,
  selectNetworkId,
  updateUserBetaMessage,
  starChain,
  starToken,
  addTokenToWallet,
  removeTokenToWallet,
  changeStarTab,
  updateInterfaceMode,
  updateInterfaceBalanceValid
} from './actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  userDarkMode: boolean | null // the user's choice for dark mode or light mode
  matchesDarkMode: boolean // whether the dark mode media query matches

  userExpertMode: boolean
  showBetaMessage: boolean
  userInterfaceMode: boolean
  userInterfaceBalanceValid: boolean

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  pairAddress: any

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  timestamp: number
  URLWarningVisible: boolean
  selectNetworkId: any
  starChain: any
  starToken: any
  addTokenToWallet: any
  changeStarTab: any
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
  userDarkMode: true,
  matchesDarkMode: false,
  userExpertMode: false,
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  showBetaMessage: true,
  userInterfaceMode: false,
  userInterfaceBalanceValid: true,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  pairAddress: undefined,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
  selectNetworkId: {},
  starChain: {},
  starToken: {},
  addTokenToWallet: '',
  changeStarTab: {},
}

export default createReducer(initialState, builder =>
  builder
    .addCase(addTokenToWallet, (state, { payload: { chainId, tokenInfo} }) => {
      state.addTokenToWallet = {
        chainId,
        ...tokenInfo
      }
    })
    .addCase(changeStarTab, (state, { payload: {type, index} }) => {
      if (!state.changeStarTab) state.changeStarTab = {}
      state.changeStarTab[type] = index
    })
    .addCase(removeTokenToWallet, (state, { payload: {} }) => {
      state.addTokenToWallet = ''
    })
    .addCase(starToken, (state, { payload: { chainId, token} }) => {
      chainId = chainId ? chainId : 'all'
      if (!state.starToken) state.starToken = {}
      if (!state.starToken[chainId]) state.starToken[chainId] = {}
      if (state?.starToken?.[chainId]) {
        if (state?.starToken?.[chainId]?.[token]) {
          delete state.starToken[chainId][token]
        } else {
          state.starToken[chainId] = {
            ...(state.starToken[chainId] ? state.starToken[chainId] : {}),
            [token]: {timestamp: Date.now()}
          }
        }
      } else {
        state.starToken = {
          ...(state?.starToken ? state?.starToken : {}),
          [chainId]: {
            ...(state.starToken[chainId] ? state.starToken[chainId] : {}),
            [token]: {timestamp: Date.now()}
          }
        }
      }
    })
    .addCase(starChain, (state, { payload: { account, chainId} }) => {
      account = account ? account : 'all'
      if (!state.starChain) state.starChain = {}
      if (!state.starChain[account]) state.starChain[account] = {}
      if (state?.starChain?.[account]) {
        if (state?.starChain?.[account]?.[chainId]) {
          delete state.starChain[account][chainId]
        } else {
          state.starChain[account] = {
            ...(state.starChain[account] ? state.starChain[account] : {}),
            [chainId]: {timestamp: Date.now()}
          }
        }
      } else {
        state.starChain = {
          ...(state?.starChain ? state?.starChain : {}),
          [account]: {
            ...(state.starChain[account] ? state.starChain[account] : {}),
            [chainId]: {timestamp: Date.now()}
          }
        }
      }
    })
    .addCase(selectNetworkId, (state, { payload: { chainId, label } }) => {
      state.selectNetworkId = {
        chainId, label
      }
    })
    .addCase(updateVersion, state => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode
      // console.log(action.payload)
      state.timestamp = currentTimestamp()
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateInterfaceMode, (state, action) => {
      state.userInterfaceMode = action.payload.userInterfaceMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateInterfaceBalanceValid, (state, action) => {
      state.userInterfaceBalanceValid = action.payload.userInterfaceBalanceValid
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserExpertMode, (state, action) => {
      state.userExpertMode = action.payload.userExpertMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserBetaMessage, (state, action) => {
      state.showBetaMessage = action.payload.showBetaMessage
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedToken, (state, { payload: { address, chainId } }) => {
      state.tokens[chainId] = state.tokens[chainId] || {}
      delete state.tokens[chainId][address]
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedPair, (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
      if (state.pairs[chainId]) {
        // just delete both keys if either exists
        delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)]
        delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)]
      }
      state.timestamp = currentTimestamp()
    })
    .addCase(toggleURLWarning, state => {
      state.URLWarningVisible = !state.URLWarningVisible
    })
)
