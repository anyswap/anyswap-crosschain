import { createAction } from '@reduxjs/toolkit'

export const aptosAddress = createAction<{ address: any }>('aptos/aptosAddress')
export const aptosBalanceList = createAction<{ list: any }>('aptos/aptosBalanceList')
export const aptosApproveList = createAction<{ token: any, result: any }>('aptos/aptosApproveList')
