import { createReducer } from '@reduxjs/toolkit'
import { approveList } from './actions'

export interface BurnState {
  readonly approveList: any
}

const initialState: BurnState = {
  approveList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(approveList, (state, { payload: { chainId, account, token, spender, allowance } }) => {
      if (!state.approveList) state.approveList = {}
      if (!state.approveList[chainId]) state.approveList[chainId] = {}
      if (!state.approveList[chainId][account]) state.approveList[chainId][account] = {}
      if (!state.approveList[chainId][account][token]) state.approveList[chainId][account][token] = {}
      state.approveList[chainId][account][token][spender] = {
        allowance
      }
    })
)
