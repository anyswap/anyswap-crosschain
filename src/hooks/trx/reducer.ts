import { createReducer } from '@reduxjs/toolkit'
import { trxAddress, trxBalanceList } from './actions'

export interface BurnState {
  readonly trxAddress: any
  readonly trxBalanceList: any
}

const initialState: BurnState = {
  trxAddress: '',
  trxBalanceList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(trxAddress, (state, { payload: { address } }) => {
      state.trxAddress = address
    })
    .addCase(trxBalanceList, (state, { payload: { list } }) => {
      state.trxBalanceList = list
    })
)
