
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment';
import { tryParseAmount } from '../../state/swap/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import {useTxnsErrorTipOpen} from '../../state/application/hooks'
// import { useAddPopup } from '../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useVeMULTIContract, useVeMULTIRewardContract } from '../../hooks/useContract'

import {
  MIN_DAY
} from './data'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }



export function useCreateLockCallback(
  veMULTI: string | undefined,
  inputCurrency: any | undefined,
  typedValue: string | undefined,
  lockDuration: number | undefined,
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const contract = useVeMULTIContract(veMULTI)
  // const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // console.log(balance?.raw.toString(16))
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(veMULTI)
    // console.log(contract)
    if (!contract || !chainId || !inputCurrency || !lockDuration) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              const results:any = {}
              try {
                // console.log(contract)
                const time = Number(lockDuration) - parseInt((Date.now() / 1000) + '')
                console.log(lockDuration)
                const txReceipt = await contract.create_lock(
                  `0x${inputAmount.raw.toString(16)}`,
                  time + '',
                )
                addTransaction(txReceipt, {
                  summary: `Create lock ${typedValue} ${inputCurrency?.symbol}`,
                  value: inputAmount.toSignificant(6),
                  symbol: inputCurrency?.symbol,
                  token: inputCurrency?.address,
                })
                results.hash = txReceipt?.hash
                // onChangeViewDtil(txReceipt?.hash, true)
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
              return results
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [contract, chainId, inputCurrency, inputAmount, balance, addTransaction, t, lockDuration])
}



export function useInCreaseAmountCallback(
  veMULTI: string | undefined,
  inputCurrency: any | undefined,
  typedValue: string | undefined,
  tokenid: number | undefined,
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const contract = useVeMULTIContract(veMULTI)
  // const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // console.log(balance?.raw.toString(16))
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(veMULTI)
    // console.log(contract)
    if (!contract || !chainId || !inputCurrency || !tokenid) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              const results:any = {}
              try {
                const txReceipt = await contract.increase_amount(
                  tokenid + '',
                  `0x${inputAmount.raw.toString(16)}`,
                )
                addTransaction(txReceipt, {
                  summary: `Increase amount ${typedValue} ${inputCurrency?.symbol}`,
                  value: inputAmount.toSignificant(6),
                  symbol: inputCurrency?.symbol,
                  token: inputCurrency?.address,
                })
                results.hash = txReceipt?.hash
                // onChangeViewDtil(txReceipt?.hash, true)
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
              return results
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [contract, chainId, inputCurrency, inputAmount, balance, addTransaction, t, tokenid])
}


export function useInCreaseUnlockTimeCallback(
  veMULTI: string | undefined,
  inputCurrency: any | undefined,
  lockDuration: number | undefined,
  tokenid: number | undefined,
  lockEnds: number | undefined,
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { chainId } = useActiveWeb3React()
  const contract = useVeMULTIContract(veMULTI)
  // const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  // console.log(balance?.raw.toString(16))
  // console.log(lockDuration)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(veMULTI)
    // console.log(contract)
    if (!contract || !chainId || !inputCurrency || !tokenid || !lockDuration || !lockEnds) return NOT_APPLICABLE
    // console.log(typedValue)
    return {
      wrapType: WrapType.WRAP,
      execute:
        async () => {
          const results:any = {}
          try {
            console.log(lockDuration)
            const now = parseInt((Date.now() / 1000) + '')
            const time = Number(lockDuration) - now
            const oldtime = lockEnds - now
            if ((time - oldtime) < (60*60*24*7)) {
              onChangeViewErrorTip('Selection time must be greater than:' + moment.unix(lockEnds).add(7, 'days').format('YYYY-MM-DD'), true)
              return results
            }
            // console.log(lockDuration)
            // console.log(now)
            // console.log(lockDuration-now)
            // const now = moment()
            // const expiry = moment(selectedDate).add(1, 'days')
            // const secondsToExpire = expiry.diff(now, 'seconds')
            const txReceipt = await contract.increase_unlock_time(
              tokenid + '',
              time + '',
            )
            addTransaction(txReceipt, {
              summary: `Add lock time`,
              symbol: inputCurrency?.symbol,
              token: inputCurrency?.address,
            })
            results.hash = txReceipt?.hash
            // onChangeViewDtil(txReceipt?.hash, true)
          } catch (error) {
            console.error('Could not swapout', error)
            onChangeViewErrorTip(error, true)
          }
          return results
        },
      inputError: undefined
    }
  }, [contract, chainId, inputCurrency, addTransaction, t, tokenid, lockDuration, lockEnds])
}

export function useWithdrawCallback(
  veMULTI: string | undefined,
): { wrapType: WrapType; execute?: undefined | ((tokenid: number | undefined) => Promise<any>); inputError?: string } {
  const { chainId } = useActiveWeb3React()
  const contract = useVeMULTIContract(veMULTI)
  // const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  // console.log(balance?.raw.toString(16))
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  // console.log(veMULTI)
  // console.log(contract)
  // console.log(tokenid)
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    if (!contract || !chainId) return NOT_APPLICABLE
    return {
      wrapType: WrapType.WRAP,
      execute:
        async (tokenid: number | undefined) => {
          const results:any = {}
          try {
            const txReceipt = await contract.withdraw(
              tokenid + '',
            )
            addTransaction(txReceipt, {
              summary: `Withdraw`,
            })
            results.hash = txReceipt?.hash
            // onChangeViewDtil(txReceipt?.hash, true)
          } catch (error) {
            // console.log(error)
            console.error('Could not swapout', error)
            onChangeViewErrorTip(error, true)
          }
          return results
        },
      inputError: undefined
    }
  }, [contract, chainId, addTransaction, t])
}


export function useClaimRewardCallback(
  rewardToken: string | undefined,
  tokenid: number | undefined,
  epoch: any,
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { chainId } = useActiveWeb3React()
  const contract = useVeMULTIRewardContract(rewardToken)
  // const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  // console.log(balance?.raw.toString(16))
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(veMULTI)
    // console.log(contract)
    if (!contract || !chainId || !tokenid || !epoch) return NOT_APPLICABLE
    // console.log(typedValue)
    return {
      wrapType: WrapType.WRAP,
      execute:
        async () => {
          const results:any = {}
          try {
            const txReceipt = await contract.claimReward(
              tokenid + '',
              epoch.map(({startEpoch, endEpoch}: {startEpoch:any, endEpoch:any}) => [startEpoch, endEpoch])
            )
            addTransaction(txReceipt, {
              summary: `Claim Reward`,
            })
            results.hash = txReceipt?.hash
            // onChangeViewDtil(txReceipt?.hash, true)
          } catch (error) {
            console.error('Could not swapout', error)
            onChangeViewErrorTip(error, true)
          }
          return results
        },
      inputError: undefined
    }
  }, [contract, chainId, epoch, addTransaction, t, tokenid])
}

export function useLockDurationTip (
  selectTime:any,
  min?:any,
  max?:any
) {
  return useMemo(() => {
    // const now = moment()
    if ( selectTime ) {
      const st = moment(selectTime).unix()
      if (min) {
        const mt = moment.unix(min).add(MIN_DAY, 'days').unix()
        if (st < mt) {
          return 'Locking time is too short'
        }
      } else {
        const now = moment().add(MIN_DAY, 'days').unix()
        if (st < now) {
          return 'Locking time is too short'
        }
      }
      if (max) {
        const mt = moment.unix(max).add(1461, 'days').unix()
        if (st > mt) {
          return 'The maximum locking time is 4 years'
        }
        return undefined
      }
      //  else {
      //   const now = moment().add(1461, 'days').unix()
      //   if (st > now) {
      //     return 'The maximum locking time is 4 years'
      //   }
      // }
    }
    return undefined
  }, [min, selectTime, max])
}