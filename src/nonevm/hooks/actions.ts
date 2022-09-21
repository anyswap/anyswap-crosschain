import { createAction } from '@reduxjs/toolkit'

export const nonevmAddress = createAction<{ address: any }>('nonevm/nonevmAddress')
export const nonevmBalanceList = createAction<{ list: any }>('nonevm/nonevmBalanceList')
export const approveList = createAction<{ chainId: any, account:any, token:any, spender:any, allowance:any}>('nonevm/approveList')
