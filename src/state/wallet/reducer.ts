import { createReducer } from '@reduxjs/toolkit'
import { tokenBalanceList } from './actions'

// import config from '../../config'

export interface ListsState {
  readonly tokenBalanceList: any
}

const initialState: ListsState = {
  tokenBalanceList: {},
}

export default createReducer(initialState, builder =>
  builder
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
