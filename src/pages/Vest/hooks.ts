import { Currency } from 'anyswap-sdk'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { tryParseAmount } from '../../state/swap/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import {useTxnsErrorTipOpen} from '../../state/application/hooks'
// import { useAddPopup } from '../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useVeMULTIContract } from '../../hooks/useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }



export function useCreateLockCallback(
  veMULTI: string | undefined,
  inputCurrency: Currency | undefined,
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
                console.log(contract)
                console.log(veMULTI)
                console.log(inputAmount.raw.toString(16))
                console.log(lockDuration)
                const time = Number(lockDuration) - parseInt((Date.now() / 1000) + '')
                const txReceipt = await contract.create_lock(
                  `0x${inputAmount.raw.toString(16)}`,
                  time + '',
                )
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${inputAmount.toSignificant(6)} ${inputCurrency?.symbol}`,
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
