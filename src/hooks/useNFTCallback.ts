import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
// import { useCurrencyBalance, useETHBalances } from '../state/wallet/hooks'
import { useETHBalances } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useNFTContract, useNFT721Contract } from './useContract'

import {recordsTxns} from '../utils/bridge/register'
import config from '../config'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }


/**
 * 跨链any token
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useNFT721Callback(
  routerToken: string | undefined,
  inputCurrency: any,
  inputToken: string | undefined,
  toAddress:  any,
  tokenid: string | undefined,
  toChainID: string | undefined,
  fee: any
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()

  const [nftBalance, setNftBalance] = useState<any>()
  

  const contract = useNFTContract(routerToken)

  const contract721 = useNFT721Contract(inputToken)

  const { t } = useTranslation()
  
  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const addTransaction = useTransactionAdder()

  useEffect(() => {
    if (contract721 && tokenid) {
      contract721.ownerOf(tokenid).then((res:any) => {
        // console.log(res)
        if (res) {
          setNftBalance(res)
        } else {
          setNftBalance('')
        }
      }).catch((err:any) => {
        console.log(err)
        setNftBalance('')
      })
    } else {
      setNftBalance('')
    }
  }, [contract721, tokenid])

  return useMemo(() => {
    
    if (!contract || !chainId || !inputCurrency || !toAddress || !toChainID || !(nftBalance?.toLowerCase() === account?.toLowerCase())) return NOT_APPLICABLE

    const sufficientBalance = ethBalance && nftBalance?.toLowerCase() === account?.toLowerCase()

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && tokenid
          ? async () => {
              try {
                // console.log(111)
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = await contract.nft721SwapOut(
                  ...[
                    inputToken,
                    toAddress,
                    tokenid,
                    toChainID
                  ],
                  {value: fee}
                )
                addTransaction(txReceipt, { summary: `Cross bridge ${tokenid} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}` })
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: '',
                    formatvalue: '',
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: inputCurrency?.version
                  }
                  recordsTxns(data)
                }
              } catch (error) {
                console.error('Could not swapout', error)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [contract, chainId, inputCurrency, ethBalance, addTransaction, t, inputToken, toAddress, toChainID, tokenid, nftBalance, account])
}
