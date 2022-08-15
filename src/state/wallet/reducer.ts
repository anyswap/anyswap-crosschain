import { createReducer } from '@reduxjs/toolkit'
import { tokenBalanceList, walletViews, WALLET_VIEWS } from './actions'

// import config from '../../config'

export interface ListsState {
  readonly tokenBalanceList: any
  readonly walletViews: any
}

const initialState: ListsState = {
  tokenBalanceList: {},
  walletViews: WALLET_VIEWS.ACCOUNT,
}

export default createReducer(initialState, builder =>
  builder
    .addCase(walletViews, (state, { payload: { type } }) => {
      state.walletViews = type
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
