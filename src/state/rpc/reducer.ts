import { createReducer } from '@reduxjs/toolkit'
import { rpclist } from './actions'

export interface BurnState {
  readonly rpclist: any
}

const initialState: BurnState = {
  rpclist: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(rpclist, (state, { payload: { chainId, rpclist } }) => {
      // console.log()
      if (!chainId) return {...state}
      if (
        state?.rpclist[chainId]?.time
        && state?.rpclist[chainId]?.time > rpclist.time
      ) {
        return {
          ...state,
          rpclist: {
            ...state.rpclist,
            [chainId]: {
              ...(rpclist ? rpclist : {})
            }
          }
        }
      } else if (!state?.rpclist[chainId]) {
        return {
          ...state,
          rpclist: {
            ...state.rpclist,
            [chainId]: {
              ...(rpclist ? rpclist : {})
            }
          }
        }
      } else {
        return {
          ...state,
          rpclist: {
            ...state.rpclist
          }
        }
      }
    })
)
