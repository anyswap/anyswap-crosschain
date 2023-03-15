import { createReducer } from '@reduxjs/toolkit'
import { tokenBalanceList, walletViews, WALLET_VIEWS, updateTokenBalance } from './actions'

// import config from '../../config'

export interface ListsState {
  readonly tokenBalanceList: any
  readonly tokenBalance: any
  readonly walletViews: any
}

const initialState: ListsState = {
  tokenBalanceList: {},
  tokenBalance: {},
  walletViews: WALLET_VIEWS.ACCOUNT,
}

export default createReducer(initialState, builder =>
  builder
    .addCase(walletViews, (state, { payload: { type } }) => {
      state.walletViews = type
    })
    .addCase(updateTokenBalance, (state, { payload: { chainId, token, account, balance, decimals } }) => {
      if (!state.tokenBalance) state.tokenBalance = {}
      if (!state.tokenBalance[chainId]) state.tokenBalance[chainId] = {}
      if (!state.tokenBalance[chainId][account]) state.tokenBalance[chainId][account] = {}
      // if (!state.tokenBalance[chainId][account][token]) state.tokenBalance[chainId][account][token] = {}
      state.tokenBalance[chainId][account][token] = {
        balance,
        decimals
      }
      // console.log(state, chainId, token, account, balance, decimals)
    })
    .addCase(tokenBalanceList, (state, { payload: { chainId, tokenList, account } }) => {
      // console.log(state.tokenBalanceList)
      if (state.tokenBalanceList && chainId && account) {
        // console.log(1)
        state.tokenBalanceList[account] = {
          ...state.tokenBalanceList[account],
          [chainId]: {
            ...(state.tokenBalanceList[account] ? state.tokenBalanceList[account][chainId] : {}),
            ...tokenList
          }
        }
      } else if (chainId && account) {
        // console.log(2)
        state.tokenBalanceList = {
          [account]: {
            [chainId]: {
              ...tokenList
            }
          }
        }
      }
    })
    
)
