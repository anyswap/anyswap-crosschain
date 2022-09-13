import { createReducer } from '@reduxjs/toolkit'
import { adaAddress, adaBalanceList } from './actions'

export interface BurnState {
  readonly adaAddress: any
  readonly adaBalanceList: any
  // readonly adaWallet: any
}

const initialState: BurnState = {
  adaAddress: '',
  adaBalanceList: {},
  // adaWallet: '',
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(adaAddress, (state, { payload: { address } }) => {
      state.adaAddress = address
    })
    .addCase(adaBalanceList, (state, { payload: { list } }) => {
      state.adaBalanceList = list
    })
)
