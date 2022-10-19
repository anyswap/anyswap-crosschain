import { createAction } from '@reduxjs/toolkit'

export const aptBalanceList = createAction<{ list: any }>('apt/aptBalanceList')
export const aptApproveList = createAction<{ token: any, result: any }>('apt/aptApproveList')