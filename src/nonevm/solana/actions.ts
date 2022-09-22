import { createAction } from '@reduxjs/toolkit'

export const solAddress = createAction<{ address: any }>('sol/solAddress')
export const solBalanceList = createAction<{ list: any }>('sol/solBalanceList')
export const solApproveList = createAction<{ token: any, result: any }>('sol/solApproveList')
