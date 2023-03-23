// import { useEffect, useMemo, useState, useCallback } from 'react'
import {  useMemo, useState, useCallback } from 'react'
import nebulas from 'nebulas'
import {
  useDispatch,
  // useSelector
} from 'react-redux'
import {
  // AppState,
  AppDispatch
} from '../../state'
import {nonevmAddress} from '../hooks/actions'
// import { tryParseAmount3 } from '../../state/swap/hooks'
import { tryParseAmount3 } from '../../state/swap/hooks'
import {useTxnsDtilOpen} from '../../state/application/hooks'
import {useActiveReact} from '../../hooks/useActiveReact'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
// import qs from 'qs'
import { useTransactionAdder } from '../../state/transactions/hooks'
import useInterval from '../../hooks/useInterval'
import {recordsTxns} from '../../utils/bridge/register'

import config from '../../config'
import NebPay from 'nebpay.js'
import { BigNumber } from 'ethers'

import { ChainId } from '../../config/chainConfig/chainId'
import { BigAmount } from '../../utils/formatBignumber'
import { isAddress } from '../../utils/isAddress'

// const NAS_URL = 'https://testnet.nebulas.io'
const NAS_URL = 'https://mainnet.nebulas.io'

export const toNasBasic = (value: string) => {
  const baseDecimals = 18
  const baseAmount = BigNumber.from(10).pow(BigNumber.from(baseDecimals))

  const stringAmount = baseAmount.mul(value)
  return stringAmount.toString()
}


export const isExtWalletInstall = () => {
  return 'NasExtWallet' in window
}

export function useNasLogin () {
  const dispatch = useDispatch<AppDispatch>()
  const loginNas = useCallback(async(chainId:any, type?:any) => {
    // console.log(window?.NasExtWallet)
    if (window?.NasExtWallet) {
      window?.NasExtWallet.getUserAddress((res:any) => {
        console.log(res)
        if (res) {
          dispatch(nonevmAddress({chainId, account: res}))
        } else {
          dispatch(nonevmAddress({chainId, account: ''}))
        }
      })
    } else if (!type) {
      if (confirm('Please install NasExtWallet Wallet.') === true) {
        window.open('https://chrome.google.com/webstore/detail/nasextwallet/gehjkhmhclgnkkhpfamakecfgakkfkco?hl=en')
      }
    }
  }, [])

  return {
    loginNas
  }
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

export function useNasTokenBalance () {
  const address = useCurrentAddress()
  const { chainId } = useActiveReact()
  const neb:any = new nebulas.Neb()
  const getNasTokenBalance = useCallback(async ({account, token}: any) => {
    if (![ChainId.NAS].includes(chainId) || !account || !token) return
    return new Promise(async(resolve, reject) => {
      const useAccount = account ? account : address
      try {
        if (!isAddress(useAccount, chainId) || !token) {
          resolve('')
        }
        const tx = await neb.api.call({
          chainID: 1,
          from: useAccount,
          to: token,
          value: 0,
          gasPrice: '20000000000',
          gasLimit: '8000000',
          contract: {
            function: 'balanceOf',
            args: JSON.stringify([useAccount])
          }
        })
  
        const result = JSON.parse(tx.result)
        resolve(result)
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  }, [address])
  return {
    getNasTokenBalance
  }
}

export const useCurrentWNASBalance = (token?:any) => {
  const [balance, setBalance] = useState<string>()
  const { chainId } = useActiveReact()
  const address = useCurrentAddress()
  const neb:any = new nebulas.Neb()
  neb.setRequest(new nebulas.HttpRequest(NAS_URL))

  const getWNASBalance = useCallback(async () => {
    if (![ChainId.NAS].includes(chainId)) return
    try {
      if (!isAddress(address, chainId) || !isAddress(token, chainId)) {
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
  }, [address, token])

  useInterval(getWNASBalance, 1000 * 10)

  return {
    getWNASBalance,
    balance,
    // balanceBig: balance ? new Fraction(JSBI.BigInt(balance), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))) : undefined
    balanceBig: balance ? BigAmount.format(18, balance) : undefined
  }
}

export const useCurrentNasBalance = () => {
  const { chainId } = useActiveReact()
  const address = useCurrentAddress()
  
  const getNasBalance = useCallback(async () => {
    if (![ChainId.NAS].includes(chainId)) return
    if (isAddress(address, chainId) && chainId === ChainId.NAS) {
      // const state = await neb.api.getAccountState(address)
      const state:any = await axios.post(`${NAS_URL}/v1/user/accountstate`, {address})
      // console.log(state)
      return state?.data?.result.balance
    }
    // setBalance('')
  }, [address, chainId])

  return {
    getNasBalance,
  }
}

interface UseBridgeCallbackInterface {
  inputCurrency: any | undefined
  typedValue: string | undefined
  DepositAddress: string | undefined
  chainId: string
  selectChain: string
  recipient: string
  pairid: string
  isLiquidity:any
  destConfig:any
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
  pairid,
  isLiquidity,
  destConfig
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
    if (balance && typedValue && recipient && DepositAddress) {
      const sufficientBalance = inputCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))

      const inputError = sufficientBalance ? undefined : t('Insufficient', { symbol: inputCurrency?.symbol })

      return {
        inputError,
        wrapType: WrapType.WRAP,
        execute: typedValue
          ? async () => {
            sendNasTx(inputCurrency?.address,DepositAddress,inputAmount, recipient).then((txData:any) => {
              if (txData.hash) {
                const data:any = {
                  hash: txData.hash,
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
                  toAddress: recipient,
                  symbol: inputCurrency?.symbol,
                  version: 'swapin',
                  routerToken: '',
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  isLiquidity: isLiquidity,
                  fromInfo: {
                    symbol: inputCurrency?.symbol,
                    name: inputCurrency?.name,
                    decimals: inputCurrency?.decimals,
                    address: inputCurrency?.address,
                  },
                  toInfo: {
                    symbol: destConfig?.symbol,
                    name: destConfig?.name,
                    decimals: destConfig?.decimals,
                    address: destConfig?.address,
                  },
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
  }, [balance, typedValue, address, DepositAddress, selectChain, pairid, inputCurrency, chainId,inputAmount, recipient, destConfig])
}


export function updateNasHash (hash:any): Promise<any> {
  const data:any = {
    msg: 'Error',
    info: ''
  }
  return new Promise(resolve => {
    fetch(`https://data.nebulas.io/api/tx/${hash}`).then(res => res.json()).then(json => {
      console.log(json)
      if (json) {
        if (json.msg !== "success") {
          data.msg = 'Failure'
          data.error = 'Txns is failure!'
        } else {
          data.msg = 'Success'
          data.info = json
        }
      } else {
        data.msg = 'Null'
        data.error = 'Query is empty!'
      }
      resolve(data)
    }).catch(err => {
      console.log(err.toString())
      data.error = 'Query is empty!'
      resolve(data)
    })
    // const url = `https://data.nebulas.io/api/tx/${hash}`
    // axios.get(url).then(res => {
    //   const {status, data} = res
    //   if (status === 200) {
    //     resolve(data)
    //   } else {
    //     resolve('')
    //   }
    // }).catch((err) => {
    //   console.log(err)
    //   resolve('')
    // })
  })
}