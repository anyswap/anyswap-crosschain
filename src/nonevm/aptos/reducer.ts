import { createReducer } from '@reduxjs/toolkit'
import { aptosAddress, aptosBalanceList, aptosApproveList } from './actions'

export interface BurnState {
  readonly aptosAddress: any
  readonly aptosBalanceList: any
  readonly aptosApproveList: any
}

const initialState: BurnState = {
  aptosAddress: '',
  aptosBalanceList: {},
  aptosApproveList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(aptosAddress, (state, { payload: { address } }) => {
      state.aptosAddress = address
    })
    .addCase(aptosBalanceList, (state, { payload: { list } }) => {
      state.aptosBalanceList = list
    })
    .addCase(aptosApproveList, (state, { payload: { token, result } }) => {
      // state.trxApproveList = list
      if (!state.aptosApproveList) state.aptosApproveList = {}
      state.aptosApproveList[token] = result
    })
)
