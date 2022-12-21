import { createReducer } from '@reduxjs/toolkit'
import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  SerializableTransactionReceipt,
  updateTransaction,
  updateUnderlyingStatus,
  noWalletTxList
} from './actions'

const now = () => new Date().getTime()

export interface TransactionDetails {
  hash: string
  approval?: { tokenAddress: string; spender: string }
  summary?: string
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from?: string
  value?: string
  toChainId?: string
  toAddress?: string
  symbol?: string
  version?: string
  routerToken?: string
  info?: any
  token?: any
  logoUrl?: any
  isLiquidity?: any
  isReceiveAnyToken?: any,
  fromInfo?: any,
  toInfo?: any,
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {}

export default createReducer(initialState, builder =>
  builder
    .addCase(addTransaction, (transactions, { payload: {
      chainId,
      from,
      hash,
      approval,
      summary,
      claim,
      value,
      toChainId,
      toAddress,
      symbol,
      version,
      routerToken,
      token,
      logoUrl,
      isLiquidity,
      fromInfo,
      toInfo
    } }) => {
      if (transactions[chainId]?.[hash]) {
        throw Error('Attempted to add existing transaction.')
      }
      const txs = transactions[chainId] ?? {}
      txs[hash] = {
        hash,
        approval,
        summary,
        claim,
        from,
        addedTime: now(),
        value,
        toChainId,
        toAddress,
        symbol,
        version,
        routerToken,
        token,
        logoUrl,
        isLiquidity,
        fromInfo,
        toInfo
      }
      // console.log(txs)
      transactions[chainId] = txs
    })
    .addCase(clearAllTransactions, (transactions, { payload: { chainId } }) => {
      if (!transactions[chainId]) return
      transactions[chainId] = {}
    })
    .addCase(checkedTransaction, (transactions, { payload: { chainId, hash, blockNumber } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    })
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    })
    .addCase(updateTransaction, (transactions, { payload: { hash, chainId, info } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.info = {
        ...info
        // bind: info?.bind,
        // confirmations: info?.confirmations,
        // destChainID: info?.destChainID,
        // from: info?.from,
        // historyType: info?.historyType,
        // memo: info?.memo,
        // pairid: info?.pairid,
        // srcChainID: info?.srcChainID,
        // status: info?.status,
        // statusmsg: info?.statusmsg,
        // swapheight: info?.swapheight,
        // swapnonce: info?.swapnonce,
        // swaptx: info?.swaptx,
        // swaptype: info?.swaptype,
        // swapvalue: info?.swapvalue,
        // formatswapvalue: info?.formatswapvalue,
        // timestamp: info?.timestamp,
        // to: info?.to,
        // txheight: info?.txheight,
        // txid: info?.txid,
        // txto: info?.txto,
        // value: info?.value,
        // time: info?.time,
      }
    })
    .addCase(updateUnderlyingStatus, (transactions, { payload: { hash, chainId, isReceiveAnyToken } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.isReceiveAnyToken = isReceiveAnyToken
    })
    .addCase(noWalletTxList, (transactions, { payload: { 
      hash,
      chainId,
      summary,
      toChainId,
      toAddress,
      symbol,
      version,
      routerToken,
      token,
      logoUrl,
      isLiquidity,
      fromInfo,
      toInfo
     } }) => {
      if (transactions[chainId]?.[hash]) {
        throw Error('Transaction already registered.')
      }
      const txs = transactions[chainId] ?? {}
      txs[hash] = {
        hash: hash,
        addedTime: Date.now(),
        summary,
        toChainId,
        toAddress,
        symbol,
        version,
        routerToken,
        token,
        logoUrl,
        isLiquidity,
        fromInfo,
        toInfo
      }
      // console.log(txs)
      transactions[chainId] = txs
    })
)
