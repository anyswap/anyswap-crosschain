import { createReducer } from '@reduxjs/toolkit'
import { solAddress, solBalanceList, solApproveList } from './actions'

export interface BurnState {
  readonly solAddress: any
  readonly solBalanceList: any
  readonly solApproveList: any
}

const initialState: BurnState = {
  solAddress: '',
  solBalanceList: {},
  solApproveList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(solAddress, (state, { payload: { address } }) => {
      state.solAddress = address
    })
    .addCase(solBalanceList, (state, { payload: { list } }) => {
      state.solBalanceList = list
    })
    .addCase(solApproveList, (state, { payload: { token, result } }) => {
      // state.trxApproveList = list
      if (!state.solApproveList) state.solApproveList = {}
      state.solApproveList[token] = result
    })
)
