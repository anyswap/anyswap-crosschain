import { useEffect, useMemo, useState, useCallback } from "react"
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { useTokenAllowance } from '../data/Allowances'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import {recordsApprove} from '../utils/bridge/register'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from './index'

import config from '../config'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: any,
  spender?: string,
  token?: any
): [ApprovalState, () => Promise<void>] {
  const { account, chainId } = useActiveWeb3React()
  // const token = amountToApprove?.token ? amountToApprove.token : undefined
  // console.log(amountToApprove)
  // console.log(amountToApprove ? amountToApprove.raw.toString() : '')
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  // console.log(currentAllowance)
  // console.log(amountToApprove)
  // console.log(token)
  // console.log(spender)
  // console.log(token)
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    console.log(amountToApprove ? amountToApprove.raw.toString() : '')
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
    })

    return tokenContract
      .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        recordsApprove({
          token: token?.address,
          spender: spender,
          account: account,
          amount: useExact ? amountToApprove.raw.toString() : MaxUint256,
          symbol: token.symbol,
          decimals: token.decimals,
          hash: response?.hash,
          chainId: chainId,
          type: "Approve",
        })
        addTransaction(response, {
          summary: config.getBaseCoin(token.symbol, chainId) + ' approved, you can continue the cross chain transaction',
          // summary: t('approvedTip', {
          //   symbol: config.getBaseCoin(amountToApprove.currency.symbol, chainId)
          // }),
          approval: { tokenAddress: token.address, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction])

  return [approvalState, approve]
}

export function useNonApproveCallback(
  token: any,
  spender: any,
  symbol: any,
) {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const pendingApproval = useHasPendingApproval(token ?? undefined, spender ?? undefined)

  const [isSetApprove, setIsSetApprove] = useState<any>(false)

  // const contract = useTokenContract(token, false)
  const tokenContract = useTokenContract(token)
  // if (!tokenContract || !spender || !account || !symbol || !chainId) return {
  //   isSetApprove: false,
  //   approve: () => {console.log()}
  // }
  useEffect(() => {
    if (
      tokenContract
      && account
      && chainId
      && spender
      && token
    ) {
      try {
        tokenContract.allowance(account, spender).then((res:any) => {
          console.log(res)
          if (res && res._hex && res.gt(BigNumber.from(0))) {
            setIsSetApprove(true)
          } else {
            setIsSetApprove(false)
          }
        }).catch((error: Error) => {
          console.debug('Failed to approve token', error)
          throw error
        })
      } catch (error) {
        console.debug('Failed to approve token', error)
          throw error
      }
    } else {
      setIsSetApprove(false)
    }
  }, [tokenContract, pendingApproval])

  const approve = useCallback(async (): Promise<void> => {
    if (!tokenContract || !spender || !account || !symbol || !chainId) return
    return tokenContract.approve(spender, '0x0').then((response: TransactionResponse) => {
      recordsApprove({
        token: token,
        spender: spender,
        account: account,
        amount: '0x0',
        symbol: symbol,
        decimals: 18,
        hash: response?.hash,
        chainId: chainId,
        type: "Revoke",
      })
      addTransaction(response, {
        summary: 'Approve ' + config.getBaseCoin(symbol, chainId),
        approval: { tokenAddress: token, spender: spender }
      })
    })
    .catch((error: Error) => {
      console.debug('Failed to approve token', error)
      throw error
    })
  }, [tokenContract, spender, account, chainId, addTransaction])

  
  return {
    isSetApprove,
    approve
  }
  // return useMemo(() => {
  // }, [isSetApprove, approve])
}
