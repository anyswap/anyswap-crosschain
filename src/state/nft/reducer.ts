import { createReducer } from '@reduxjs/toolkit'
import { nftlist, nftlistinfo, updateNftlistTime } from './actions'

export interface BurnState {
  readonly nftlist: any
  readonly nftlistinfo: any
  readonly updateNftlistTime: any
}

const initialState: BurnState = {
  nftlist: {},
  nftlistinfo: {},
  updateNftlistTime: ''
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(nftlist, (state, { payload: { chainId, tokenList, version } }) => {
      state.nftlist= {
        [chainId]: {tokenList, timestamp: Date.now(), version}
      }
    })
    .addCase(nftlistinfo, (state, { payload: { chainId, tokenList } }) => {
      state.nftlistinfo= {
        [chainId]: {tokenList, timestamp: Date.now()}
      }
    })
    .addCase(updateNftlistTime, (state, { payload: {  } }) => {
      state.updateNftlistTime = Date.now()
    })
)
