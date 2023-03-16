import { createReducer } from '@reduxjs/toolkit'
import { reefBalanceList, reefApproveList, reefEvmAddress } from './actions'

export interface BurnState {
  readonly reefBalanceList: any
  readonly reefApproveList: any
  readonly reefEvmAddress: any
}

const initialState: BurnState = {
  reefBalanceList: {},
  reefApproveList: {},
  reefEvmAddress: '',
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(reefBalanceList, (state, { payload: { list } }) => {
      state.reefBalanceList = list
    })
    .addCase(reefEvmAddress, (state, { payload: { address } }) => {
      // console.log('reefEvmAddress', address)
      state.reefEvmAddress = address
    })
    .addCase(reefApproveList, (state, { payload: { token, result } }) => {
      // state.trxApproveList = list
      if (!state.reefApproveList) state.reefApproveList = {}
      state.reefApproveList[token] = result
    })
)
