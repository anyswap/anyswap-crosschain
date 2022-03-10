// import { useEffect, useMemo, useState, useCallback } from 'react'
import {  useMemo, useState, useCallback } from 'react'
import nebulas from 'nebulas'
// import { tryParseAmount3 } from '../../state/swap/hooks'
import { tryParseAmount3 } from '../../state/swap/hooks'
import {useTxnsDtilOpen} from '../../state/application/hooks'
import {useActiveReact} from '../useActiveReact'
import { Currency, JSBI, Fraction } from 'anyswap-sdk'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
// import qs from 'qs'
import { useTransactionAdder } from '../../state/transactions/hooks'
import useInterval from '../../hooks/useInterval'
import {recordsTxns} from '../../utils/bridge/register'

import config from '../../config'
import NebPay from 'nebpay.js'
import { BigNumber } from 'ethers'

const Base58 = require('bs58')
const cryptoUtils = require('./crypto-utils')

// const NAS_URL = 'https://testnet.nebulas.io'
const NAS_URL = 'https://mainnet.nebulas.io'

export const toNasBasic = (value: string) => {
  const baseDecimals = 18
  const baseAmount = BigNumber.from(10).pow(BigNumber.from(baseDecimals))

  const stringAmount = baseAmount.mul(value)
  return stringAmount.toString()
}

const AddressLength = 26;
const AddressPrefix = 25;
const NormalType = 87;
const ContractType = 88;

// const KeyVersion3 = 3;
// const KeyCurrentVersion = 4;
const isString = function (obj:any) {
  return typeof obj === 'string' && obj.constructor === String;
}
const isNumber = function (object:any) {
	return typeof object === 'number';
}
export const isValidAddress = function (addr:any, type?:any) {
  /*jshint maxcomplexity:10 */

  if (isString(addr)) {
      try {
          addr = Base58.decode(addr);
      } catch (e) {
          console.log("invalid address.");
          // if address can't be base58 decode, return false.
          return false;
      }
  } else if (!Buffer.isBuffer(addr)) {
      return false;
  }
  // address not equal to 26
  if (addr.length !== AddressLength) {
      return false;
  }

  // check if address start with AddressPrefix
  const buff = Buffer.from(addr);
  if (buff.readUIntBE(0, 1) !== AddressPrefix) {
      return false;
  }

  // check if address type is NormalType or ContractType
  const t = buff.readUIntBE(1, 1);
  if (isNumber(type) && (type === NormalType || type === ContractType)) {
      if (t !== type) {
          return false;
      }
  } else if (t !== NormalType && t !== ContractType) {
      return false;
  }
  const content = addr.slice(0, 22);
  const checksum = addr.slice(-4);
  return Buffer.compare(cryptoUtils.sha3(content).slice(0, 4), checksum) === 0;
}

export const isExtWalletInstall = () => {
  return 'NasExtWallet' in window
}

export const useCurrentAddress = () => {
  // const { chainId } = useActiveReact()
  const [address, setAddress] = useState<string>('')

  const getUserAddress = useCallback(() => {
    if (isExtWalletInstall() && !address) {
      // console.log(NasExtWallet)
      NasExtWallet.getUserAddress((addr: string) => {
        setAddress(addr)
        // console.log('user nas address: ' + address + Date.now())
      })
    }
  }, [address])

  getUserAddress()

  return useMemo(() => {
    return address
  }, [address])
}

export const useCurrentWNASBalance = (token?:any) => {
  const [balance, setBalance] = useState<string>()
  const address = useCurrentAddress()
  const neb:any = new nebulas.Neb()
  neb.setRequest(new nebulas.HttpRequest(NAS_URL))

  const getWNASBalance = useCallback(async () => {
    try {
      if (!isValidAddress(address) || !token) {
        return false
      }
      const tx = await neb.api.call({
        chainID: 1,
        from: address,
        to: token,
        value: 0,
        gasPrice: '20000000000',
        gasLimit: '8000000',
        contract: {
          function: 'balanceOf',
          args: JSON.stringify([address])
        }
      })

      const result = JSON.parse(tx.result)
      setBalance(result)
      return result
    } catch (err) {
      console.error(err)
    }
  }, [address])

  useInterval(getWNASBalance, 1000 * 10)

  return {
    getWNASBalance,
    balance,
    balanceBig: balance
      ? new Fraction(JSBI.BigInt(balance), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
      : undefined
  }
}

export const useCurrentNasBalance = () => {
  const { chainId } = useActiveReact()
  const [balance, setBalance] = useState<string>()
  const address = useCurrentAddress()
  // const neb = new nebulas.Neb()
  // neb.setRequest(new nebulas.HttpRequest('https://testnet.nebulas.io'))
  // console.log(address)
  const getNasBalance = useCallback(async () => {
    if (isValidAddress(address) && chainId === 'NAS') {
      // const state = await neb.api.getAccountState(address)
      const state:any = await axios.post(`${NAS_URL}/v1/user/accountstate`, {address})
      // console.log(state)
      if (state?.data?.result) {
        setBalance(state?.data?.result.balance)
      }
      // console.log('getNasBalance', address, state)
      return state.balance
    }
    // setBalance('')
  }, [address, chainId])

  // useEffect(() => {
  //   getNasBalance()
  // }, [address])

  useInterval(getNasBalance, 1000 * 10)

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

function sendNasTx (token:any, DepositAddress:any,inputAmount:any,recipient:any) {
  return new Promise(resolve => {
    const callFunction = 'transfer'
    const depositAddress = DepositAddress
    const callArgs = JSON.stringify([depositAddress, inputAmount, recipient])
    const nebPay = new NebPay()
    nebPay.call(token, 0, callFunction, callArgs, {
      extension: {
        openExtension: true
      },
      gasPrice: '20000000000',
      gasLimit: '8000000',
      // debug: true,
      listener: (serialNumber: string, resp: any) => {
        try {
          console.log('bridgeNas resp')
          console.log(resp)
          console.log(serialNumber)
          resolve({hash: resp.txhash})
        } catch (err) {
          // reject(err)
          console.log(err)
          resolve('')
        }
      }
    })
  })
}

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
  const { balanceBig:balance } = useCurrentWNASBalance(inputCurrency?.address)
  const address = useCurrentAddress()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const addTransaction = useTransactionAdder()

  // console.log(balance)
  const inputAmount = useMemo(() => inputCurrency ? tryParseAmount3(typedValue, inputCurrency?.decimals) : undefined, [inputCurrency, typedValue])
  return useMemo(() => {
    if (balance && typedValue) {
      const sufficientBalance = inputCurrency && typedValue && balance && (Number(balance?.toSignificant(inputCurrency?.decimals)) > Number(typedValue))

      const inputError = sufficientBalance ? undefined : t('Insufficient', { symbol: inputCurrency?.symbol })

      // console.log('useNebBridgeCallback inputError', inputError)
      // console.log(isValidAddress(inputCurrency?.address))
      return {
        inputError,
        wrapType: WrapType.WRAP,
        execute: typedValue
          ? async () => {
            sendNasTx(inputCurrency?.address,DepositAddress,inputAmount, recipient).then((txData:any) => {
              if (txData.hash) {
                const data:any = {
                  hash: txData.hash?.toLowerCase(),
                  chainId: chainId,
                  selectChain: selectChain,
                  account: address,
                  value: inputAmount,
                  formatvalue: typedValue,
                  to: recipient,
                  symbol: inputCurrency?.symbol,
                  version: 'swapin',
                  pairid: pairid,
                }
                addTransaction(txData, {
                  summary: `Cross bridge ${typedValue} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}`,
                  value: typedValue,
                  toChainId: selectChain,
                  toAddress: recipient?.toLowerCase(),
                  symbol: inputCurrency?.symbol,
                  version: 'swapin',
                  routerToken: '',
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  underlying: inputCurrency?.underlying
                })
                recordsTxns(data)
                onChangeViewDtil(txData?.hash, true)
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
  }, [balance, typedValue, address, DepositAddress, selectChain, pairid, inputCurrency, chainId,inputAmount, recipient])
}


export function updateNasHash (hash:any): Promise<any> {
  return new Promise(resolve => {
    const url = `https://data.nebulas.io/api/tx/${hash}`
    axios.get(url).then(res => {
      const {status, data} = res
      if (status === 200) {
        resolve(data)
      } else {
        resolve('')
      }
    }).catch((err) => {
      console.log(err)
      resolve('')
    })
  })
}