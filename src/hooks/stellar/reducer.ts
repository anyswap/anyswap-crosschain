import { createReducer } from '@reduxjs/toolkit'
import { xlmAddress, balanceList } from './actions'

export interface BurnState {
  readonly xlmAddress: any
  readonly balanceList: any
}

const initialState: BurnState = {
  xlmAddress: '',
  balanceList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(xlmAddress, (state, { payload: { address } }) => {
      state.xlmAddress = address
    })
    .addCase(balanceList, (state, { payload: { list } }) => {
      state.balanceList = list
    })
)
