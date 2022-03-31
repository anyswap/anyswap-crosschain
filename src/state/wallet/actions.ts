import { createAction } from '@reduxjs/toolkit'

export const tokenBalanceList = createAction<{chainId: any, tokenList:any, account:any}>('wallet/tokenBalanceList')