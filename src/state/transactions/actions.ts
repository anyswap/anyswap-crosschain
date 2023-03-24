import { createAction } from '@reduxjs/toolkit'
// import {ChainId} from '../../config/chainConfig/chainId'

export interface SerializableTransactionReceipt {
  to?: any
  from?: string
  contractAddress?: string
  transactionIndex?: any
  blockHash?: string
  transactionHash?: string
  blockNumber?: number
  status?: number
}

export const addTransaction = createAction<{
  chainId: any
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  summary?: string
  value?: string
  toChainId?: string
  toAddress?: string
  symbol?: string
  version?: string
  routerToken?: string
  token?: string
  logoUrl?: string
  isLiquidity?: any
  fromInfo?: any
  toInfo?: any
}>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: any }>('transactions/clearAllTransactions')
export const finalizeTransaction = createAction<{
  chainId: any
  hash: string
  receipt: SerializableTransactionReceipt | undefined
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: any
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')

export const updateTransaction = createAction<{
  chainId: any
  hash: string
  info: any
}>('transactions/updateTransaction')

export const updateUnderlyingStatus = createAction<{
  chainId: any
  hash: string
  isReceiveAnyToken: any
}>('transactions/updateUnderlyingStatus')


export const noWalletTxList = createAction<{
  chainId: any
  hash: string
  summary?: string
  toChainId?: string
  toAddress?: string
  symbol?: string
  version?: string
  routerToken?: string
  token?: string
  logoUrl?: string
  isLiquidity?: any
  fromInfo?: any
  toInfo?: any
}>('transactions/noWalletTxList')
