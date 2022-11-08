import { createAction } from '@reduxjs/toolkit'

export const btcBalanceList = createAction<{ list: any }>('btc/btcBalanceList')