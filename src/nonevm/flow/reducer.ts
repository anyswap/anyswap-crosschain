import { createReducer } from '@reduxjs/toolkit'
import { flowAddress, flowBalanceList } from './actions'

export interface BurnState {
  readonly flowAddress: any
  readonly flowBalanceList: any
  // readonly adaWallet: any
}

const initialState: BurnState = {
  flowAddress: '',
  flowBalanceList: {},
  // adaWallet: '',
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(flowAddress, (state, { payload: { address } }) => {
      state.flowAddress = address
    })
    .addCase(flowBalanceList, (state, { payload: { list } }) => {
      state.flowBalanceList = list
    })
)
