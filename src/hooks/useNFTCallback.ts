import { useCallback, useEffect, useMemo, useState } from 'react'
import { JSBI } from 'anyswap-sdk'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
// import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
// import { useCurrencyBalance, useETHBalances } from '../state/wallet/hooks'
import { useETHBalances } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useNFTContract, useNFT721Contract, useMulticallContract } from './useContract'
// import { useNFTContract, useNFT721Contract } from './useContract'

import {recordsTxns} from '../utils/bridge/register'
import config from '../config'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }


export const TokenidImage:any = {}


export function getImage (chainId: any, selectCurrency: any, list: any) {
  const { account } = useActiveWeb3React()
  const multicallContract = useMulticallContract()
  const contract721 = useNFT721Contract(selectCurrency)

  const [imageList, setImageList] = useState<any>()
  const [tokenidList, setTokenidList] = useState<any>()

  if (!TokenidImage[chainId]) TokenidImage[chainId] = {}
  const methodName = 'tokenURI'
  const fragment:any = useMemo(() => contract721?.interface?.getFunction(methodName), [contract721, methodName])

  const noTokenidImg = useMemo(() => {
    if (list && list.length > 0 && chainId && TokenidImage[chainId]) {
      const arr = []
      for (let i = 0; i < list.length; i++) {
        if (!TokenidImage[chainId][list[i]]) {
          arr.push(list[i])
        }
      }
      return arr
    } else if (list && list.length > 0 && chainId && !TokenidImage[chainId]) {
      return list
    }
    return []
  }, [TokenidImage, chainId, list])

  const calls = useMemo(
    () => {
      const arr:any = []
      if (noTokenidImg && contract721 && fragment) {
        for (let i = 0; i < noTokenidImg.length; i++) {
          arr.push({
            address: selectCurrency,
            callData: contract721?.interface?.encodeFunctionData(fragment, [noTokenidImg[i]])
          })
        }
      }
      return arr
    },
    [contract721, noTokenidImg, fragment]
  )

  // const getUriData = useCallback((imageList) => {
  useEffect(() => {
    if (imageList) {
      const arr:any = []
      for (const obj of imageList) {
        arr.push(axios.get(obj.uri))
      }
      if (arr.length > 0) {
        axios.all(arr).then((res:any) => {
          // console.log(res)
          for (let i = 0; i < noTokenidImg.length; i++) {
            TokenidImage[chainId][noTokenidImg[i]] = {
              ...imageList[i],
              ...res[i].data
            }
          }
          const tList:any = {}
          for (let i = 0; i < list.length; i++) {
            tList[list[i]] = TokenidImage[chainId][list[i]]
          }
          setTokenidList(tList)
          // console.log(TokenidImage)
        }).catch((err:any) => {
          console.log(err)
        })
      }
    }
  }, [imageList, noTokenidImg])
  
  useEffect(() => {
    // const getTokenidList = useCallback(() => {
    if (multicallContract && calls.length > 0) {
      multicallContract.aggregate(calls.map((obj:any) => [obj.address, obj.callData])).then((res:any) => {
        const arr = []
        for (let i = 0; i < noTokenidImg.length; i++) {
          const obj = res.returnData[i]
          arr.push({uri: contract721?.interface?.decodeFunctionResult(fragment, obj)[0], tokenid: noTokenidImg[i]})
        }
        // console.log(arr)
        setImageList(arr)
        // getUriData(arr)
      }).catch((err:any) => {
        console.log(err)
        setImageList('')
      })
    } else {
      setImageList('')
    }
  }, [multicallContract, calls, noTokenidImg])

  return useMemo(() => {
    if (!chainId || !account) return {}
    return {
      tokeidInfoList: tokenidList
    }
  }, [tokenidList, chainId, account])
}


export function useNFT721GetTokenidListCallback(
  selectCurrency: any
) {
  const { chainId, account, library } = useActiveWeb3React()
  const multicallContract = useMulticallContract()
  const contract721 = useNFT721Contract(selectCurrency)

  const [index, setIndex] = useState<any>()
  const [tokenidList, setTokenidList] = useState<any>()

  const {tokeidInfoList} = getImage(chainId, selectCurrency, tokenidList)
  // console.log(tokeidInfoList)
  const methodName = 'tokenOfOwnerByIndex'
  const fragment = useMemo(() => contract721?.interface?.getFunction(methodName), [contract721, methodName])
  const calls = useMemo(
    () => {
      const arr:any = []
      if (index && contract721 && fragment) {
        for (let i = 0; i < index; i++) {
          arr.push({
            address: selectCurrency,
            callData: contract721?.interface?.encodeFunctionData(fragment, [account, i])
          })
        }
      }
      return arr
    },
    [contract721, index, fragment]
  )
  
  useEffect(() => {
  // const getTokenidList = useCallback(() => {
    if (multicallContract && calls.length > 0) {
      multicallContract.aggregate(calls.map((obj:any) => [obj.address, obj.callData])).then((res:any) => {
        const arr = []
        for (const obj of res.returnData) {
          arr.push(JSBI.BigInt(obj.toString()).toString())
        }
        setTokenidList(arr.sort())
      }).catch((err:any) => {
        console.log(err)
        setTokenidList([])
      })
    } else {
      setTokenidList([])
    }
  }, [multicallContract, calls])

  // useEffect(() => {
    const getTokenidList = useCallback(() => {
    if (contract721 && account && chainId) {
      contract721.balanceOf(account).then(async(res:any) => {
        console.log(res?.toNumber())
        const count = res?.toNumber()
        if (count) {
          setIndex(count)
        } else {
          setIndex('')
        }
      }).catch((err:any) => {
        console.log(err)
        setIndex('')
      })
    } else {
      setIndex('')
    }
  }, [contract721, account, chainId, library])

  useEffect(() => {
    if (!library || !chainId) return undefined

    library
      .getBlockNumber()
      .then(getTokenidList)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))
    
    library.on('block', getTokenidList)
    return () => {
      library.removeListener('block', getTokenidList)
    }
  }, [account, chainId, library, getTokenidList])

  return {
    tokenidList: tokeidInfoList
  }
}

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
