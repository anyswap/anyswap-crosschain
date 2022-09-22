import { createReducer } from '@reduxjs/toolkit'
import { tempAddress, tempBalanceList, tempApproveList } from './actions'

export interface BurnState {
  readonly tempAddress: any
  readonly tempBalanceList: any
  readonly tempApproveList: any
}

const initialState: BurnState = {
  tempAddress: '',
  tempBalanceList: {},
  tempApproveList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(tempAddress, (state, { payload: { address } }) => {
      state.tempAddress = address
    })
    .addCase(tempBalanceList, (state, { payload: { list } }) => {
      state.tempBalanceList = list
    })
    .addCase(tempApproveList, (state, { payload: { token, result } }) => {
      // state.trxApproveList = list
      if (!state.tempApproveList) state.tempApproveList = {}
      state.tempApproveList[token] = result
    })
)
