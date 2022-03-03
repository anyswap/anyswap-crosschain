import { useEffect, useMemo, useState, useCallback } from 'react'
import nebulas from 'nebulas'
// import { tryParseAmount3 } from '../../state/swap/hooks'
import { tryParseAmount3 } from '../../state/swap/hooks'
import { Currency, JSBI, Fraction } from 'anyswap-sdk'
import { useTranslation } from 'react-i18next'

// import { useTransactionAdder } from '../../state/transactions/hooks'
import useInterval from '../../hooks/useInterval'

import NebPay from 'nebpay.js'
import { BigNumber } from 'ethers'

interface SendNasProp {
  recipient: string
  value: string
}

export const toNasBasic = (value: string) => {
  const baseDecimals = 18
  const baseAmount = BigNumber.from(10).pow(BigNumber.from(baseDecimals))

  const stringAmount = baseAmount.mul(value)
  return stringAmount.toString()
}

// use neb pay chrome extension to post function
export const bridgeNas = ({ recipient, value }: SendNasProp) =>
  new Promise((resolve, reject) => {
    const callToAddress = 'n1uymn9w3xiEMVJ9XfgoeowpopnUbMC99sF'
    const callFunction = 'transfer'
    const depositAddress = 'n1avapCUsTfyZDkNkYYFofjtak3bmroSYmY'
    const callArgs = JSON.stringify([depositAddress, toNasBasic(value), recipient])
    const nebPay = new NebPay()
    nebPay.call(callToAddress, 0, callFunction, callArgs, {
      extension: {
        openExtension: true
      },
      gasPrice: '20000000000',
      gasLimit: '8000000',
      // debug: true,
      listener: (serialNumber: string, resp: string) => {
        try {
          console.log('bridgeNas resp', resp, serialNumber)
          resolve(serialNumber)
        } catch (err) {
          reject(err)
        }
      }
    })
  })

export const isExtWalletInstall = () => {
  return 'NasExtWallet' in window
}

export const useCurrentAddress = () => {
  const [address, setAddress] = useState<string>('')

  const getUserAddress = useCallback(() => {
    if (isExtWalletInstall() && !address) {
      NasExtWallet.getUserAddress((addr: string) => {
        setAddress(addr)
        console.log('user nas address: ' + address + Date.now())
      })
    }
  }, [address])

  getUserAddress()

  return useMemo(() => {
    return address
  }, [address])
}

export const useCurrentNasBalance = () => {
  const [balance, setBalance] = useState<string>()
  const address = useCurrentAddress()
  const neb = new nebulas.Neb()
  neb.setRequest(new nebulas.HttpRequest('https://testnet.nebulas.io'))
  console.log(address)
  const getNasBalance = useCallback(async () => {
    if (nebulas.Account.isValidAddress(address)) {
      const state = await neb.api.getAccountState(address)
      setBalance(state.balance)
      console.log('getNasBalance', address, state)
      return state.balance
    }
  }, [address])

  useEffect(() => {
    getNasBalance()
  }, [address])

  useInterval(getNasBalance, 1000 * 3)

  return {
    getNasBalance,
    balance,
    balanceBig: balance
      ? new Fraction(JSBI.BigInt(balance), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
      : undefined
  }
}

interface UseBridgeCallbackInterface {
  inputCurrency: Currency | undefined
  typedValue: string | undefined
  DepositAddress: string | undefined
  chainId: string
  selectChain: string
  recipient: string
  pairid: string
}

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

// const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }

export function useNebBridgeCallback({
  inputCurrency,
  typedValue,
  DepositAddress,
  chainId,
  selectChain,
  recipient,
  pairid
}: UseBridgeCallbackInterface): {
  wrapType?: WrapType
  inputError?: string
  execute?: undefined | (() => Promise<void>)
} {
  const { t } = useTranslation()
  const { balanceBig } = useCurrentNasBalance()
  const address = useCurrentAddress()
  // const addTransaction = useTransactionAdder()

  console.log(balanceBig)
  const inputAmount = useMemo(() => inputCurrency ? tryParseAmount3(typedValue, inputCurrency?.decimals) : undefined, [inputCurrency, typedValue])
  return useMemo(() => {
    if (balanceBig && typedValue) {
      const sufficientBalance = true

      const inputError = sufficientBalance ? undefined : t('Insufficient', { symbol: inputCurrency?.symbol })

      console.log('useNebBridgeCallback inputError', inputError)

      return {
        inputError,
        wrapType: WrapType.WRAP,
        execute: typedValue
          ? async () => {
              const callFunction = 'transfer'
              const depositAddress = DepositAddress
              const callArgs = JSON.stringify([depositAddress, inputAmount, recipient])
              const nebPay = new NebPay()
              return nebPay.call(inputCurrency?.address, 0, callFunction, callArgs, {
                extension: {
                  openExtension: true
                },
                gasPrice: '20000000000',
                gasLimit: '8000000',
                // debug: true,
                listener: (serialNumber: string, resp: string) => {
                  try {
                    console.log('bridgeNas resp', resp, serialNumber)
                    // resolve(serialNumber)
                    // if (txData.hash && account && terraRecipient) {
                    //   const data:any = {
                    //     hash: txData.hash?.toLowerCase(),
                    //     chainId: chainId,
                    //     selectChain: selectChain,
                    //     account: address,
                    //     value: inputAmount,
                    //     formatvalue: typedValue,
                    //     to: recipient,
                    //     symbol: inputCurrency?.symbol,
                    //     version: 'swapin',
                    //     pairid: pairid,
                    //   }
                    //   recordsTxns(data)
                    // }
                    // onChangeViewDtil(txData?.hash, true)
                  } catch (err) {
                    // reject(err)
                    console.log(err)
                  }
                }
              })
            }
          : undefined
      }
    }

    return {
      inputError: '',
      wrapType: WrapType.NOCONNECT
    }
  }, [balanceBig, typedValue, address, DepositAddress, selectChain, pairid, inputCurrency, chainId])
}
