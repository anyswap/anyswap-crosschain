import { createAction } from '@reduxjs/toolkit'

export const adaAddress = createAction<{ address: any }>('ada/adaAddress')
export const adaBalanceList = createAction<{ list: any }>('ada/adaBalanceList')
