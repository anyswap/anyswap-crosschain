import { createAction } from '@reduxjs/toolkit'

export const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

export const tokenBalanceList = createAction<{chainId: any, tokenList:any, account:any}>('wallet/tokenBalanceList')
export const walletViews = createAction<{type: any}>('wallet/walletViews')