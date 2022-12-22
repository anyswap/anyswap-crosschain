import { createReducer } from '@reduxjs/toolkit'
import { reefBalanceList, reefApproveList } from './actions'

export interface BurnState {
  readonly reefBalanceList: any
  readonly reefApproveList: any
}

const initialState: BurnState = {
  reefBalanceList: {},
  reefApproveList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(reefBalanceList, (state, { payload: { list } }) => {
      state.reefBalanceList = list
    })
    .addCase(reefApproveList, (state, { payload: { token, result } }) => {
      // state.trxApproveList = list
      if (!state.reefApproveList) state.reefApproveList = {}
      state.reefApproveList[token] = result
    })
)
