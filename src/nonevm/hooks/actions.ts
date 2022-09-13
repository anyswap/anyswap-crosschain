import { createAction } from '@reduxjs/toolkit'

export const nonevmAddress = createAction<{ address: any }>('nonevm/nonevmAddress')
export const nonevmBalanceList = createAction<{ list: any }>('nonevm/nonevmBalanceList')
