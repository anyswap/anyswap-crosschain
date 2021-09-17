import { createReducer } from '@reduxjs/toolkit'
import { nftlist } from './actions'

export interface BurnState {
  readonly nftlist: any
}

const initialState: BurnState = {
  nftlist: {}
}

export default createReducer<BurnState>(initialState, builder =>
  builder.addCase(nftlist, (state, { payload: { chainId, account, nftlist } }) => {
    // console.log()
    if (!chainId || !account) return {...state}
    return {
      ...state,
      nftlist: {
        ...state.nftlist,
        [chainId]: {
          ...(state.nftlist[chainId] ? state.nftlist[chainId] : {}),
          [account]: {
            ...(state.nftlist[chainId] && state.nftlist[chainId][account] ? state.nftlist[chainId][account] : {}),
            ...nftlist
          }
        }
      }
    }
  })
)
