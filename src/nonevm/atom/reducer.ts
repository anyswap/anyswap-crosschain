import { createReducer } from '@reduxjs/toolkit'
import { atomBalanceList, atomApproveList } from './actions'

export interface BurnState {
  readonly atomBalanceList: any
  readonly atomApproveList: any
}

const initialState: BurnState = {
  atomBalanceList: {},
  atomApproveList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(atomBalanceList, (state, { payload: { list } }) => {
      state.atomBalanceList = list
    })
    .addCase(atomApproveList, (state, { payload: { token, result } }) => {
      // state.trxApproveList = list
      if (!state.atomApproveList) state.atomApproveList = {}
      state.atomApproveList[token] = result
    })
)
