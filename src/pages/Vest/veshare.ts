import {
  useCallback,
  // useEffect,
  useMemo,
  // useState
} from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next'

import { 
  useVeMULTIContract,
  useVeShareContract
} from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks'
import {useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import {BigAmount} from '../../utils/formatBignumber'

import { ChainId } from "../../config/chainConfig/chainId"
import {spportChainArr} from '../../config/chainConfig'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }

function useChain (data:any) {
  const list:any = {}
  // console.log(spportChainArr)
  for (const c in  data) {
    if (!spportChainArr.includes(c)) continue
    list[c] = {
      ...data[c]
    }
  }
  return list
}
export const BASE_INFO = {
  name: 'Multichain',
  symbol: 'MULTI',
  decimals: 18,
  label: 'multichain'
}

export const VENFT_BASE_INFO = {
  name: 'veMULTI NFT',
  symbol: 'veMULTI',
  decimals: 18
}


export const veMULTI:any = useChain({
  [ChainId.BNB_TEST]: {
    ...VENFT_BASE_INFO,
    address: '0x2aF78D056F2D32C130D791091333575DF592Bb06'
  },
})

export const MULTI_TOKEN:any = useChain({
  [ChainId.BNB_TEST]: {
    ...BASE_INFO,
    address: '0x89Ea10f213008e4e26483A2d2A6b6852E4997A49'
  },
})

export const REWARD_TOKEN:any = useChain({
  [ChainId.BNB_TEST]: {
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 18,
    address: '0x86e2c741Bf2BC6772Fed68a75eaa5bfab4a76d16'
  },
})

export const REWARD:any = useChain({
  [ChainId.BNB_TEST]: {
    address: '0xbAD169597E88404021435b743E809fC640b526f5'
  },
})

export const VESHARE:any = useChain({
  [ChainId.BNB_TEST]: {
    address: '0xA0bA02090D0e893558B81fA4e24Fda8D3dE56D13'
  },
})

export function useVeshare () {
  const { account, chainId } = useActiveWeb3React()
  const useLockToken:any = useMemo(() => {
    // console.log(MULTI_TOKEN)
    // console.log(chainId)
    if (chainId && MULTI_TOKEN[chainId]) {
      return MULTI_TOKEN[chainId]
    }
    return undefined
  }, [chainId])
  const useVeMultiToken = useMemo(() => {
    if (chainId && veMULTI[chainId]) return veMULTI[chainId]
    return undefined
  }, [chainId])
  const useVeshareToken = useMemo(() => {
    if (chainId && VESHARE[chainId]) return VESHARE[chainId]
    return undefined
  }, [chainId])
  const useRewardToken = useMemo(() => {
    if (chainId && REWARD_TOKEN[chainId]) return REWARD_TOKEN[chainId]
    return undefined
  }, [chainId])
  const veshareMultiContract = useVeMULTIContract(useVeMultiToken?.address)
  // const rewardContract = useVeMULTIRewardContract(useVeMultiRewardToken?.address)
  const veshareContract = useVeShareContract(useVeshareToken?.address)
  const getVeshareNFTs = useCallback(async() => {
    return new Promise(async(resolve) => {

      if (
        veshareMultiContract
        && account
        && useLockToken
        && veshareContract
      ) {
        let nftsLength:any = ''
        try {
          nftsLength = await veshareMultiContract.balanceOf(account)
        } catch (error) {
          console.log(error)
        }
        
        const arr = Array.from({length: parseInt(nftsLength)}, (v, i) => i)
        try {
          const nfts = await Promise.all(
            arr.map(async (idx) => {
      
              const tokenIndex = await veshareMultiContract.tokenOfOwnerByIndex(account, idx)
              const locked = await veshareContract.tokenInfo(tokenIndex)
              const endTime = locked['endTime'].toNumber()
              const tokenURI = await veshareMultiContract.tokenURI(tokenIndex)
              const {data} = await axios.get(tokenURI)
              // console.log(tokenURI)
              let reward:any
              try {
                // reward = await veshareContract.claimable(idx)
                reward = await veshareContract.claimable(tokenIndex)
              } catch (error) {
                
                console.log(error)
              }
              return {
                ...data,
                index: idx,
                id: tokenIndex?.toString(),
                lockEnds: endTime,
                lockStart: locked['startTime'].toNumber(),
                share: BigAmount.format(useVeMultiToken.decimals, locked['share'].toString()).toExact(),
                reward: reward ? BigAmount.format(useRewardToken.decimals, reward?.toString()).toExact() : 0
              }
            })
          )
          console.log(nfts)
          // setvestNFTs(nfts)
          resolve(nfts)
        } catch (error) {
          console.log(error)
          resolve([])
        }
      } else {
        resolve([])
      }
    })
  }, [veshareMultiContract, account, useLockToken, veshareContract, useRewardToken])
  // useEffect(() => {
  //   getVestNFTs()
  // }, [veshareMultiContract, account, useLockToken, veshareContract, useRewardToken])
  // useInterval(getVestNFTs, 1000 * 10)
  return {
    getVeshareNFTs
  }
}

export function useClaimVeshareRewardCallback(
  rewardToken: string | undefined,
  claimReward: any,
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { chainId } = useActiveWeb3React()
  const contract = useVeShareContract(rewardToken)
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
    if (!contract || !chainId || !claimReward) return NOT_APPLICABLE
    console.log(claimReward)
    return {
      wrapType: WrapType.WRAP,
      execute:
        async () => {
          const results:any = {}
          try {
            const txReceipt = await contract.claimReward( Number(claimReward.id) )
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
  }, [contract, chainId, addTransaction, t, claimReward])
}