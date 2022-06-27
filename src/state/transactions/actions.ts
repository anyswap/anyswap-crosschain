import { createAction } from '@reduxjs/toolkit'
import { ChainId } from 'anyswap-sdk'

export interface SerializableTransactionReceipt {
  to: any
  from: string
  contractAddress: string
  transactionIndex: any
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export const addTransaction = createAction<{
  chainId: ChainId
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
}>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: ChainId }>('transactions/clearAllTransactions')
export const finalizeTransaction = createAction<{
  chainId: ChainId
  hash: string
  receipt: SerializableTransactionReceipt | undefined
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: ChainId
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')

export const updateTransaction = createAction<{
  chainId: ChainId
  hash: string
  info: any
}>('transactions/updateTransaction')

export const updateUnderlyingStatus = createAction<{
  chainId: ChainId
  hash: string
  isReceiveAnyToken: any
}>('transactions/updateUnderlyingStatus')
