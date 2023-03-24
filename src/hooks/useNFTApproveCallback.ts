// import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { useNFT721Contract, useNFT1155Contract } from './useContract'
import { useActiveWeb3React } from './index'

import {ZERO_ADDRESS} from '../constants'

import config from '../config'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  inputCurrency: any,
  spender?: any,
  tokenid?: any,
): {approvalState: ApprovalState, approve: () => Promise<void>} {
  // const { account, chainId } = useActiveWeb3React()
  const { chainId } = useActiveWeb3React()
  
  const [approved, setApproved] = useState<any>()

  const contract = useNFT721Contract(inputCurrency?.address)
  const pendingApproval = useHasPendingApproval(tokenid, spender)
  // console.log(pendingApproval)
  // console.log(approved)
  // console.log(spender)
  // check the current approval status

  useEffect(() => {
    if (contract && tokenid) {
      contract.getApproved(tokenid).then((res:any) => {
        // console.log(res)
        if (ZERO_ADDRESS === res) {
          setApproved(1)
        } else {
          setApproved(res)
        }
      }).catch((err:any) => {
        console.log(err)
        setApproved(0)
      })
    } else {
      setApproved(0)
    }
  }, [contract, tokenid, pendingApproval])
  // console.log(approved)
  const approvalState: ApprovalState = useMemo(() => {
    if (!spender) return ApprovalState.UNKNOWN
    // we might not have enough data to know whether or not we need to approve
    if (!contract || !approved) return ApprovalState.UNKNOWN
    if (approved === 1) return ApprovalState.NOT_APPROVED

    // amountToApprove will be defined if currentAllowance is
    if (approved?.toLowerCase() === spender?.toLowerCase()) {
      return ApprovalState.APPROVED
    }
    return contract || !approved || approved?.toLowerCase() !== spender?.toLowerCase() ? (pendingApproval ? ApprovalState.PENDING : ApprovalState.NOT_APPROVED) : ApprovalState.APPROVED
  }, [contract, pendingApproval, spender, approved])

  const addTransaction = useTransactionAdder()
  // console.log(approvalState)
  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!spender) {
      console.error('no token')
      return
    }

    if (!contract) {
      console.error('tokenContract is null')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    // let useExact = false
    const estimatedGas = await contract.estimateGas.approve(spender, tokenid).catch(() => {
      // general fallback for tokens who restrict approval amounts
      // useExact = true
      return contract.estimateGas.approve(spender, tokenid)
    })

    return contract
      .approve(spender, tokenid, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + config.getBaseCoin(tokenid, chainId),
          approval: { tokenAddress: tokenid, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, spender, contract, addTransaction, tokenid])

  return {approvalState, approve}
}


// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApprove1155Callback(
  inputCurrency: any,
  spender?: any,
): {approvalState: ApprovalState, approve: () => Promise<void>} {
  const { account, chainId } = useActiveWeb3React()
  // const { chainId } = useActiveWeb3React()
  
  const [approved, setApproved] = useState<any>()
  const selectToken = inputCurrency?.address
  const contract = useNFT1155Contract(selectToken)
  const pendingApproval = useHasPendingApproval(selectToken, spender)

  useEffect(() => {
    if (contract && account && spender) {
      contract.isApprovedForAll(account, spender).then((res:any) => {
        console.log(res)
        if (!res) {
          setApproved(1)
        } else {
          setApproved(res)
        }
      }).catch((err:any) => {
        console.log(err)
        setApproved(0)
      })
    } else {
      setApproved(0)
    }
  }, [contract, account, pendingApproval, spender])

  const approvalState: ApprovalState = useMemo(() => {
    if (!spender) return ApprovalState.UNKNOWN
    // we might not have enough data to know whether or not we need to approve
    if (!contract || !approved) return ApprovalState.UNKNOWN
    if (approved === 1) return ApprovalState.NOT_APPROVED

    // amountToApprove will be defined if currentAllowance is
    if (approved === true) {
      return ApprovalState.APPROVED
    }
    return contract || approved === true ? (pendingApproval ? ApprovalState.PENDING : ApprovalState.NOT_APPROVED) : ApprovalState.APPROVED
  }, [contract, pendingApproval, spender, approved])

  const addTransaction = useTransactionAdder()
  // console.log(approvalState)
  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!spender) {
      console.error('no token')
      return
    }

    if (!contract) {
      console.error('tokenContract is null')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    // let useExact = false
    const estimatedGas = await contract.estimateGas.setApprovalForAll(spender, true).catch(() => {
      // general fallback for tokens who restrict approval amounts
      // useExact = true
      return contract.estimateGas.setApprovalForAll(spender, true)
    })

    return contract
      .setApprovalForAll(spender, true, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + config.getBaseCoin(inputCurrency?.symbol, chainId),
          approval: { tokenAddress: selectToken, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, spender, contract, addTransaction, inputCurrency])

  return {approvalState, approve}
}
