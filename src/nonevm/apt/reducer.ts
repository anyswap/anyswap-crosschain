import { createReducer } from '@reduxjs/toolkit'
import { aptBalanceList, aptApproveList } from './actions'

export interface BurnState {
  readonly aptBalanceList: any
  readonly aptApproveList: any
}

const initialState: BurnState = {
  aptBalanceList: {},
  aptApproveList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(aptBalanceList, (state, { payload: { list } }) => {
      // console.log(list)
      state.aptBalanceList = list
    })
    .addCase(aptApproveList, (state, { payload: { token, result } }) => {
      // state.trxApproveList = list
      if (!state.aptApproveList) state.aptApproveList = {}
      state.aptApproveList[token] = result
    })
)