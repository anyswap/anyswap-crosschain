import { useEffect, useMemo, useState, useCallback } from "react"
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { TokenAmount, CurrencyAmount, ETHER } from 'anyswap-sdk'
import { useTokenAllowance } from '../data/Allowances'
import { useAppState } from '../state/application/hooks'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { recordsApprove } from '../utils/bridge/register'
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
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account, chainId } = useActiveWeb3React()
  const { apiAddress } = useAppState()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
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

    if (!apiAddress) {
      return console.error('empty API address for approval')
    }

    if (approvalState !== ApprovalState.NOT_APPROVED) {
      return console.error('approve was called unnecessarily')
    }

    if (!token) {
      return console.error('no token')
    }

    if (!tokenContract) {
      return console.error('tokenContract is null')
    }

    if (!amountToApprove) {
      return console.error('missing amount to approve')
    }

    if (!spender) {
      return console.error('no spender')
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
          api: apiAddress,
          token: token?.address,
          spender: spender,
          account: account,
          amount: useExact ? amountToApprove.raw.toString() : MaxUint256,
          symbol: amountToApprove.currency.symbol,
          decimals: amountToApprove.currency.decimals,
          hash: response?.hash,
          chainId: chainId,
          type: "Approve",
        })
        addTransaction(response, {
          summary: 'Approve ' + config.getBaseCoin(amountToApprove.currency.symbol, chainId),
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
  const { apiAddress } = useAppState()
  const pendingApproval = useHasPendingApproval(token ?? undefined, spender ?? undefined)

  const [isSetApprove, setIsSetApprove] = useState<any>(false)
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
    if (!apiAddress || !tokenContract || !spender || !account || !symbol || !chainId) return

    return tokenContract.approve(spender, '0x0').then((response: TransactionResponse) => {
      recordsApprove({
        api: apiAddress,
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
}
