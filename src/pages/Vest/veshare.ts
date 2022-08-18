import {
  useCallback,
  // useEffect,
  useMemo,
  // useState
} from "react";
// import axios from "axios";
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

import {getNftImage} from '../../utils/getNFTimage'

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

export const VENFT_BASE_INFO = {
  name: 'veMULTI NFT',
  symbol: 'veMULTI',
  decimals: 18
}


export const veSHARE:any = useChain({
  [ChainId.BNB_TEST]: {
    ...VENFT_BASE_INFO,
    address: '0x4d2E8b5FA1bB62C2e9bBA2b2b23902bf06230345'
  },
  [ChainId.BNB]: {
    ...VENFT_BASE_INFO,
    address: '0x55F8D898760240E6Eff3c2cc23974Ae8C8fcEEfD'
  },
})

export const REWARD_TOKEN:any = useChain({
  [ChainId.BNB_TEST]: {
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 18,
    address: '0x86e2c741Bf2BC6772Fed68a75eaa5bfab4a76d16'
  },
  [ChainId.BNB]: {
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 18,
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
  },
})

export const VESHARE:any = useChain({
  [ChainId.BNB_TEST]: {
    address: '0x76c11a1de011de898802b1C81bce768d22B431b1'
  },
  [ChainId.BNB]: {
    address: '0x13Ee726D95742D437ebb664Bf0d3fEff8Dbe2a26'
  },
})

export function useVeshare () {
  const { account, chainId } = useActiveWeb3React()
  // const useLockToken:any = useMemo(() => {
  //   // console.log(MULTI_TOKEN)
  //   // console.log(chainId)
  //   if (chainId && MULTI_TOKEN[chainId]) {
  //     return MULTI_TOKEN[chainId]
  //   }
  //   return undefined
  // }, [chainId])
  const useVeMultiToken = useMemo(() => {
    if (chainId && veSHARE[chainId]) return veSHARE[chainId]
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
              const data:any = await getNftImage(tokenURI)
              // console.log(tokenURI)
              // console.log(test)
              // const url = tokenURI.indexOf('ipfs://') === 0 ? tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/') : ''
              // const {data} = await axios.get(url)
              // console.log(data)
              let reward:any
              try {
                // reward = await veshareContract.claimable(idx)
                reward = await veshareContract.claimable(tokenIndex)
              } catch (error) {
                
                console.log(error)
              }
              return {
                // ...data,ipfs://QmdfCJixsGErp33CTCom3QiZt24N4q8qFZ58zkVbxQzcyF
                // image: tokenURI.indexOf('ipfs://') === 0 ? tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/') : '',
                // image: 'https://bafybeifin45dnnplmrtj66yxl4xkp6yxoxc52mh64pg5gck7kbuaeeri3u.ipfs.dweb.link/',
                image: data.imageUrl,
                index: idx,
                id: tokenIndex?.toString(),
                lockEnds: endTime,
                lockStart: locked['startTime'].toNumber(),
                lockAmount: BigAmount.format(useVeMultiToken.decimals, locked['share'].toString()).toExact(),
                reward: reward ? BigAmount.format(useRewardToken.decimals, reward?.toString()).toExact() : 0,
                type: 'VESHARE'
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
  }, [veshareMultiContract, account, veshareContract, useRewardToken])
  // useEffect(() => {
  //   getVestNFTs()
  // }, [veshareMultiContract, account, useLockToken, veshareContract, useRewardToken])
  // useInterval(getVestNFTs, 1000 * 10)
  return {
    getVeshareNFTs,
    useVeshareRewardToken: useRewardToken
  }
}

export function useClaimVeshareRewardCallback(
  claimReward: any,
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { chainId } = useActiveWeb3React()
  const rewardToken = useMemo(() => {
    if (chainId && VESHARE[chainId]) return VESHARE[chainId].address
    return undefined
  }, [chainId])
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