import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
// import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
// import { useCurrencyBalance, useETHBalances } from '../state/wallet/hooks'
import { useETHBalances } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useNFTContract } from './useContract'

// import {recordsTxns} from '../utils/bridge/register'
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
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const bridgeContract = useNFTContract(routerToken)
  const { t } = useTranslation()
  
  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    
    if (!bridgeContract || !chainId || !inputCurrency || !toAddress || !toChainID) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = ethBalance

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && tokenid
          ? async () => {
              try {
                console.log(111)
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = await bridgeContract.nft721SwapOut(
                  ...[
                    inputToken,
                    toAddress,
                    tokenid,
                    toChainID
                  ],
                  {value: '0x2386f26fc10000'}
                )
                addTransaction(txReceipt, { summary: `Cross bridge ${tokenid} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}` })
                // registerSwap(txReceipt.hash, chainId)
                // if (txReceipt?.hash && account) {
                //   const data = {
                //     hash: txReceipt.hash?.toLowerCase(),
                //     chainId: chainId,
                //     selectChain: toChainID,
                //     account: account?.toLowerCase(),
                //     value: inputAmount.raw.toString(),
                //     formatvalue: inputAmount?.toSignificant(6),
                //     to: toAddress?.toLowerCase(),
                //     symbol: inputCurrency?.symbol,
                //     routerToken: routerToken,
                //     version: inputCurrency?.version
                //   }
                //   recordsTxns(data)
                // }
              } catch (error) {
                console.error('Could not swapout', error)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, chainId, inputCurrency, ethBalance, addTransaction, t, inputToken, toAddress, toChainID, tokenid])
}
