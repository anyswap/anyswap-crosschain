import { createReducer } from '@reduxjs/toolkit'
import { poolList, updatePoollistTime } from './actions'

export interface BurnState {
  // readonly poolLiquidity: any
  readonly poolList: any
  readonly updatePoollistTime: any
}

const initialState: BurnState = {
  // poolLiquidity: {},
  poolList: {},
  updatePoollistTime: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(updatePoollistTime, (state, { payload: {  } }) => {
      state.updatePoollistTime = Date.now()
    })
    // .addCase(poolLiquidity, (state, { payload: {poolLiquidity} }) => {
    //   state.poolLiquidity = poolLiquidity
    // })
    .addCase(poolList, (state, { payload: { chainId, tokenList, version } }) => {
      // console.log(state)
      state.poolList= {
        [chainId]: {tokenList, timestamp: Date.now(), version}
      }
      // if (state.poolList) {
      //   state.poolList[chainId] = {tokenList, timestamp: Date.now(), version}
      // } else {
      //   state.poolList = {
      //     [chainId]: {tokenList, timestamp: Date.now(), version}
      //   }
      // }
    })
)
