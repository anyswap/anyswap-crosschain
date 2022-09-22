import { createAction } from '@reduxjs/toolkit'

export const tempAddress = createAction<{ address: any }>('temp/tempAddress')
export const tempBalanceList = createAction<{ list: any }>('temp/tempBalanceList')
export const tempApproveList = createAction<{ token: any, result: any }>('temp/tempApproveList')
