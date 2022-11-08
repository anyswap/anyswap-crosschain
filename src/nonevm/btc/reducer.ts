import { createReducer } from '@reduxjs/toolkit'
import { btcBalanceList } from './actions'

export interface BurnState {
  readonly btcBalanceList: any
}

const initialState: BurnState = {
  btcBalanceList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(btcBalanceList, (state, { payload: { list } }) => {
      // console.log(list)
      state.btcBalanceList = list
    })
)