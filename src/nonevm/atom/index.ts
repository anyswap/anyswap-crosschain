import { useCallback, useMemo } from "react"
import { useTranslation } from 'react-i18next'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import {
  AppState,
  AppDispatch
} from '../../state'
import {nonevmAddress} from '../hooks/actions'
import { useActiveReact } from '../../hooks/useActiveReact'
import { ChainId } from "../../config/chainConfig/chainId"
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { tryParseAmount3 } from '../../state/swap/hooks'
import {BigAmount} from '../../utils/formatBignumber'
import {recordsTxns} from '../../utils/bridge/register'

import config from '../../config'

import {atomChainConfig} from './walletConfig'

import {
  // assertIsBroadcastTxSuccess,
  SigningStargateClient,
  StargateClient
} from '@cosmjs/stargate'

const ChainIdList:any = {
  [ChainId.ATOM]: '',
  [ChainId.ATOM_SEI_TEST]: 'atlantic-1',
  [ChainId.ATOM_DCORE]: '',
  // [ChainId.ATOM_DCORE_TEST]: 'coreum-devnet-1',
  [ChainId.ATOM_DCORE_TEST]: 'coreum-testnet-1',
}
const seiAddressReg = /^sei[0-9A-Za-z]{39}$/
// const devdcoreAddressReg = /^devcore[0-9A-Za-z]{39}$/
const devdcoreAddressReg = /^testcore[0-9A-Za-z]{39}$/
const dcoreAddressReg = /^core[0-9A-Za-z]{39}$/
export function isAtomAddress (address:string, chainId:any):boolean | string {
  if ([ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST].includes(chainId)) {
    return seiAddressReg.test(address) ? address : false //true: address; false: false
  } else if ([ChainId.ATOM_DCORE].includes(chainId)) {
    return dcoreAddressReg.test(address) ? address : false //true: address; false: false
  } else if ([ChainId.ATOM_DCORE_TEST].includes(chainId)) {
    return devdcoreAddressReg.test(address) ? address : false //true: address; false: false
  }
  return false
}

/**
 * Connect wallet and get account address
 */
export function useLoginAtom () {
  const dispatch = useDispatch<AppDispatch>()
  const loginAtom = useCallback((chainId) => {
    if (window?.keplr?.enable) {
      window?.keplr?.enable(ChainIdList[chainId]).then(() => {
        // console.log(res)
        const offlineSigner = window.getOfflineSigner(ChainIdList[chainId])
        offlineSigner.getAccounts().then((res:any) => {
          console.log(res)
          if (res?.[0]?.address) {
            dispatch(nonevmAddress({chainId, account: res?.[0]?.address}))
          } else {
            dispatch(nonevmAddress({chainId, account: ''}))
          }
        })
      }).catch((error:any) => {
        console.log(error)
        if (atomChainConfig[chainId]) {
          window.keplr.experimentalSuggestChain(atomChainConfig[chainId]).then((res:any) => {
            console.log(res)
            loginAtom(chainId)
          }).catch((error:any) => {
            console.log(error)
            dispatch(nonevmAddress({chainId, account: ''}))
          })
        } else {
          dispatch(nonevmAddress({chainId, account: ''}))
        }
      })
    } else {
      if (confirm('Please install Petra Wallet.') === true) {
        window.open('https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap')
      }
    }
  }, [])
  return {
    loginAtom
  }
}

/**
 * Get native balance and token balance
 *
 * @param account wallet address
 * @param token token address
 */
export function useAtomBalance () {
  const atomBalanceList:any = useSelector<AppState, AppState['atom']>(state => state.atom.atomBalanceList)
  const getAtomSeiBalance = useCallback(({account, chainId}: {account: any, chainId:any}) => {
    return new Promise(async(resolve) => {
      if (account) {
        try {
          const client = await StargateClient.connect(
            config.chainInfo[chainId].nodeRpc
          )
          client.getAllBalances(account).then((res:any) => {
            // console.log(res)
            resolve(res)
          }).catch((error:any) => {
            console.log(error)
            resolve('')
          })
        } catch {
          // console.log(err.toString())
          resolve('')
        }
      }
    })
  }, []) 

  return {
    atomBalanceList,
    getAtomSeiBalance,
  }
}

/**
 * Get transaction info
 *
 * @param txid transaction hash
 */
export function getAtomTxnsStatus (txid:string, chainId:any) {
  const data:any = {
    msg: 'Error',
    info: ''
  }
  return new Promise(async(resolve) => {
    try {
      
      const client = await StargateClient.connect(
        config.chainInfo[chainId].nodeRpc
      )
      client.getTx(txid).then((json:any) => {
        // console.log(json)
        if (json) {
          if (json.status === 'ERROR') {
            data.msg = 'Null'
            data.error = 'Query is empty!'
          } else if (json.code === 0) {
            data.msg = 'Success'
            data.info = json
          } else {
            data.msg = 'Failure'
            data.error = 'Txns is failure!'
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
    } catch {
      // console.log(error.toString())
      data.error = 'Query is empty!'
      resolve(data)
    }
  })
}

// getAtomTxnsStatus('5215EAFB54324C2C33DF446AB40CB9A0EECC53891E9A611B12B7CAD46D5C671D', 'ATOM_SEI_TEST')


/**
 * Cross chain 
 *
 * @param routerToken router token address
 * @param inputToken any or underlying address
 * @param selectCurrency select current token info
 * @param selectChain to chainId
 * @param receiveAddress receive address
 * @param typedValue typed Value
 * @param destConfig to chain info
 */
export function useAtomCrossChain (
  routerToken: any,
  inputToken: any,
  selectCurrency: any,
  selectChain: any,
  receiveAddress: string | null | undefined,
  typedValue: string | undefined,
  destConfig: any,
  useToChainId: any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { account, chainId } = useActiveReact()
  const {atomBalanceList} = useAtomBalance()

  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  const balance:any = useMemo(() => {
    const token = selectCurrency?.address
    if (token) {
      if (selectCurrency?.tokenType === 'NATIVE' && atomBalanceList?.['NATIVE']?.balance) {
        return BigAmount.format(6, atomBalanceList?.['NATIVE']?.balance)
      } else if (atomBalanceList?.[token]?.balance) {
        return BigAmount.format(selectCurrency?.decimals, atomBalanceList?.[token]?.balance)
      }
      return BigAmount.format(selectCurrency?.decimals, '0')
    }
    return undefined
  }, [selectCurrency, atomBalanceList])

  let sufficientBalance:any = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }
  return useMemo(() => {
    if (!account || !chainId || !selectCurrency || !useToChainId) return {}
    return {
      balance: balance,
      execute: async () => {
        try {
          const useChainId = ChainIdList[chainId]
          // console.log(useChainId)
          const offlineSigner = window.getOfflineSigner(useChainId);
          // console.log(offlineSigner)
          // console.log(config.chainInfo[chainId].nodeRpc)
          const client = await SigningStargateClient.connectWithSigner(
            config.chainInfo[chainId].nodeRpc,
            offlineSigner
          )
          // console.log(client)
          const amountFinal = {
            denom: selectCurrency?.address,
            amount: inputAmount,
          }
          const fee = {
            amount: [{
              denom: selectCurrency?.address,
              amount: '5000',
            }],
            gas: '200000',
          }
          // const txReceipt = await client.sendTokens(account, routerToken, [amountFinal], fee, "")
          // const txResult = await client.sendTokens(account, routerToken, [amountFinal], "auto", receiveAddress + ':' + selectChain)
          const txResult = await client.sendTokens(account, routerToken, [amountFinal], fee, receiveAddress + ':' + useToChainId)
          console.log(txResult)
          const txReceipt = {hash: txResult?.transactionHash}
          // resolve({hash: txResult?.hash})
          if (txReceipt?.hash) {
            const data:any = {
              hash: txReceipt.hash,
              chainId: chainId,
              selectChain: selectChain,
              account: account,
              value: inputAmount,
              formatvalue: typedValue,
              to: receiveAddress,
              symbol: selectCurrency?.symbol,
              version: destConfig.type,
              pairid: selectCurrency?.symbol,
              routerToken: routerToken
            }
            addTransaction(txReceipt, {
              summary: `Cross bridge ${typedValue} ${selectCurrency?.symbol}`,
              value: typedValue,
              toChainId: selectChain,
              toAddress: receiveAddress?.indexOf('0x') === 0 ? receiveAddress?.toLowerCase() : receiveAddress,
              symbol: selectCurrency?.symbol,
              version: destConfig?.type,
              routerToken: routerToken,
              token: selectCurrency?.address,
              logoUrl: selectCurrency?.logoUrl,
              isLiquidity: destConfig?.isLiquidity,
              fromInfo: {
                symbol: selectCurrency?.symbol,
                name: selectCurrency?.name,
                decimals: selectCurrency?.decimals,
                address: selectCurrency?.address,
              },
              toInfo: {
                symbol: destConfig?.symbol,
                name: destConfig?.name,
                decimals: destConfig?.decimals,
                address: destConfig?.address,
              },
            })
            recordsTxns(data)
            onChangeViewDtil(txReceipt?.hash, true)
          }
        } catch (error) {
          // reject(error)
          console.log(error)
          onChangeViewErrorTip('Txns failure.', true)
        }
      },
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, balance, inputAmount, sufficientBalance, useToChainId])
}
