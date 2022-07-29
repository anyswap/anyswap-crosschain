import { createReducer } from '@reduxjs/toolkit'
import { xlmAddress } from './actions'

export interface BurnState {
  readonly xlmAddress: any
}

const initialState: BurnState = {
  xlmAddress: '',
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(xlmAddress, (state, { payload: { address } }) => {
      state.xlmAddress = address
    })
)
