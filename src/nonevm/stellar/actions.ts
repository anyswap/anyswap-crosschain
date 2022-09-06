import { createAction } from '@reduxjs/toolkit'

export const xlmAddress = createAction<{ address: any }>('xlm/xlmAddress')
export const balanceList = createAction<{ list: any }>('xlm/balanceList')
