import { createReducer } from '@reduxjs/toolkit'
import { reefBalanceList, reefApproveList, reefEvmAddress,reefSigner, reefClient } from './actions'

export interface BurnState {
  readonly reefBalanceList: any
  readonly reefApproveList: any
  readonly reefEvmAddress: any
  readonly reefSigner: any
  readonly reefClient: any
}

const initialState: BurnState = {
  reefBalanceList: {},
  reefApproveList: {},
  reefEvmAddress: '',
  reefSigner: '',
  reefClient: '',
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(reefBalanceList, (state, { payload: { list } }) => {
      state.reefBalanceList = list
    })
    .addCase(reefEvmAddress, (state, { payload: { address } }) => {
      // console.log('reefEvmAddress', address)
      state.reefEvmAddress = address
    })
    .addCase(reefSigner, (state, { payload: { signer } }) => {
      console.log('signer', signer)
      state.reefSigner = signer
    })
    .addCase(reefClient, (state, { payload: { client } }) => {
      console.log('client', client)
      state.reefClient = client
    })
    .addCase(reefApproveList, (state, { payload: { token, result } }) => {
      // state.trxApproveList = list
      if (!state.reefApproveList) state.reefApproveList = {}
      state.reefApproveList[token] = result
    })
)
