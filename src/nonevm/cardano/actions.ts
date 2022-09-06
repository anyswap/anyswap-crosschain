import { createAction } from '@reduxjs/toolkit'

export const adaAddress = createAction<{ address: any }>('trx/adaAddress')
export const adaBalanceList = createAction<{ list: any }>('trx/adaBalanceList')
