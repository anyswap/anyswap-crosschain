import { createAction } from '@reduxjs/toolkit'

export const flowAddress = createAction<{ address: any }>('flow/flowAddress')
export const flowBalanceList = createAction<{ list: any }>('flow/flowBalanceList')
