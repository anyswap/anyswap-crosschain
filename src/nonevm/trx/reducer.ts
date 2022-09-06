import { createReducer } from '@reduxjs/toolkit'
import { trxAddress, trxBalanceList,trxApproveList } from './actions'

export interface BurnState {
  readonly trxAddress: any
  readonly trxBalanceList: any
  readonly trxApproveList: any
}

const initialState: BurnState = {
  trxAddress: '',
  trxBalanceList: {},
  trxApproveList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(trxAddress, (state, { payload: { address } }) => {
      state.trxAddress = address
    })
    .addCase(trxBalanceList, (state, { payload: { list } }) => {
      state.trxBalanceList = list
    })
    .addCase(trxApproveList, (state, { payload: { token, result } }) => {
      // state.trxApproveList = list
      if (!state.trxApproveList) state.trxApproveList = {}
      state.trxApproveList[token] = result
    })
)
