import { createAction } from '@reduxjs/toolkit'

export const trxAddress = createAction<{ address: any }>('trx/trxAddress')
export const trxBalanceList = createAction<{ list: any }>('trx/trxBalanceList')
export const trxApproveList = createAction<{ token: any, result: any }>('trx/trxApproveList')
