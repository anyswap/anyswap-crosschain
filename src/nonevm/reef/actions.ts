import { createAction } from '@reduxjs/toolkit'

export const reefBalanceList = createAction<{ list: any }>('reef/reefBalanceList')
export const reefApproveList = createAction<{ token: any, result: any }>('reef/reefApproveList')
export const reefEvmAddress = createAction<{ address: any}>('reef/reefEvmAddress')