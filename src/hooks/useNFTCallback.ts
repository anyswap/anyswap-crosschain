import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { tryParseAmount } from '../state/swap/hooks'
import { tryParseAmount2 } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useETHBalances } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useNFTContract, useNFT721Contract, useNFT1155Contract, useAnycallNFTContract } from './useContract'
import {useTxnsErrorTipOpen} from '../state/application/hooks'
import {recordsTxns} from '../utils/bridge/register'
import config from '../config'
import { ERC_TYPE } from '../state/nft/hooks'
import { BigAmount } from '../utils/formatBignumber'
export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }


// export function getIPFSImg () {
//   const url = `https://gateway.pinata.cloud/ipfs/QmXA5ooR2eCj3k85WzG9gDPgjX6FJTZoczd85qEQebjKSK/1.json`
//   return new Promise(resolve => {

//   })
// }

/**
 * 跨链any token
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useNFT721Callback(
  routerToken: string | undefined,
  inputCurrency: any,
  toAddress:  any,
  tokenid: string | undefined,
  toChainID: string | undefined,
  fee: any,
  destConfig: any
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const [nftBalance, setNftBalance] = useState<any>()
  

  const contract = useNFTContract(routerToken)

  const contract721 = useNFT721Contract(inputCurrency?.address)

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
                    inputCurrency?.address,
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
                    version: destConfig?.type
                  }
                  recordsTxns(data)
                }
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [contract, chainId, inputCurrency, ethBalance, addTransaction, t, toAddress, toChainID, tokenid, nftBalance, account, destConfig])
}

/**
 * 跨链any token
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useNFT1155Callback(
  routerToken: string | undefined,
  inputCurrency: any,
  toAddress:  any,
  tokenid: string | undefined,
  toChainID: string | undefined,
  fee: any,
  amount: any,
  destConfig: any,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()

  const [nftBalance, setNftBalance] = useState<any>()
  
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const contract = useNFTContract(routerToken)

  const contract1155 = useNFT1155Contract(inputCurrency?.address)

  const { t } = useTranslation()
  
  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const addTransaction = useTransactionAdder()

  useEffect(() => {
    if (contract1155 && tokenid) {
      contract1155.balanceOf(account, tokenid).then((res:any) => {
        // console.log(res)
        if (res) {
          setNftBalance(tryParseAmount2(res.toString(), inputCurrency?.decimals ?? 0))
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
  }, [contract1155, tokenid, account])

  const inputAmount = useMemo(() => inputCurrency ? tryParseAmount2(amount, inputCurrency?.decimals ?? 0) : '', [inputCurrency, amount])

  return useMemo(() => {
    // console.log(tokenid)
    if (!contract || !chainId || !inputCurrency || !toAddress || !toChainID || !inputAmount || !tokenid || !nftBalance) return NOT_APPLICABLE

    const sufficientBalance = ethBalance && inputAmount && nftBalance && !nftBalance.lessThan(inputAmount)
    const value = Number(inputAmount.raw.toString())
    const data = '0x'

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && tokenid
          ? async () => {
              try {
                const txReceipt = await contract.nft1155SwapOut(
                  ...[
                    inputCurrency?.address,
                    toAddress,
                    tokenid,
                    value,
                    data,
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
                    version: destConfig?.type
                  }
                  recordsTxns(data)
                }
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [contract, chainId, inputCurrency, ethBalance, addTransaction, t, toAddress, toChainID, tokenid, nftBalance, account, inputAmount, destConfig])
}



/**
 * 跨链any token
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useAnycallNFT721Callback(
  routerToken: string | undefined,
  inputCurrency: any,
  toAddress:  any,
  tokenid: string | undefined,
  toChainID: string | undefined,
  fee: any,
  destConfig: any,
  nfttype: any,
  amount: any,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const [nftBalance, setNftBalance] = useState<any>()
  

  const contract = useAnycallNFTContract(routerToken, nfttype)

  const contract721 = useNFT721Contract(inputCurrency?.address)
  const contract1155 = useNFT1155Contract(inputCurrency?.address)

  const { t } = useTranslation()
  
  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const addTransaction = useTransactionAdder()

  const inputAmount = useMemo(() => inputCurrency && amount ? tryParseAmount2(amount, inputCurrency?.decimals ?? 0) : '', [inputCurrency, amount])
  const inputFee = useMemo(() => fee ? BigAmount.format(18, fee) : '', [fee])

  useEffect(() => {
    if (nfttype === ERC_TYPE.erc721) {
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
    } else {
      if (contract1155 && tokenid) {
        contract1155.balanceOf(account, tokenid).then((res:any) => {
          // console.log(res)
          if (res) {
            setNftBalance(tryParseAmount2(res.toString(), inputCurrency?.decimals ?? 0))
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
    }
  }, [contract721, contract1155, tokenid, nfttype])



  const sufficientBalance = useMemo(() => {
    // console.log(ethBalance)
    // console.log(inputFee)
    if (nfttype === ERC_TYPE.erc721) {
      return ethBalance && inputFee && inputFee.lessThan(ethBalance) && nftBalance?.toLowerCase() === account?.toLowerCase()
    } else {
      return ethBalance && inputFee && inputFee.lessThan(ethBalance) && inputAmount && nftBalance && !nftBalance.lessThan(inputAmount)
    }
  }, [ethBalance, nftBalance, account, inputAmount, inputFee])

  return useMemo(() => {
    // console.log(contract)
    // console.log(chainId)
    // console.log(inputCurrency)
    // console.log(toAddress)
    // console.log(nftBalance)
    // console.log(tokenid)
    if (!contract || !chainId || !inputCurrency || !toAddress || !toChainID || (!inputAmount && nfttype === ERC_TYPE.erc1155)) return NOT_APPLICABLE

    let params:any = []
    if (nfttype === ERC_TYPE.erc721) {
      params = [
        tokenid,
        toAddress,
        toChainID
      ]
    } else {
      params = [
        tokenid,
        inputAmount ? Number(inputAmount.raw.toString()) : '',
        toAddress,
        toChainID
      ]
    }
    
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && tokenid
          ? async () => {
              try {
                // console.log(11111)
                // console.log(fee)
                // console.log(inputFee)
                const txReceipt = await contract.Swapout_no_fallback(
                  ...params,
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
                    version: destConfig?.type
                  }
                  recordsTxns(data)
                }
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [contract, chainId, inputCurrency, addTransaction, t, toAddress, toChainID, tokenid, account, destConfig, sufficientBalance, nfttype, inputAmount])
}