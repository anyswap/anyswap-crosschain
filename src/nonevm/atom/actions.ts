import { createAction } from '@reduxjs/toolkit'

export const atomBalanceList = createAction<{ list: any }>('atom/atomBalanceList')
export const atomApproveList = createAction<{ token: any, result: any }>('atom/atomApproveList')
