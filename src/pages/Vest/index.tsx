import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Token } from 'anyswap-sdk'
// import { NavLink } from 'react-router-dom'
import styled from "styled-components"
import { useTranslation } from 'react-i18next'
import moment from 'moment';

import { useActiveWeb3React } from '../../hooks'
import { useVeMULTIContract, useVeMULTIRewardContract } from '../../hooks/useContract'
import useInterval from '../../hooks/useInterval'

import {BigAmount} from '../../utils/formatBignumber'
// import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'

import TokenLogo from '../../components/TokenLogo'
import { ButtonLight } from '../../components/Button'
// import Modal from "../../components/Modal";
import ModalContent from "../../components/Modal/ModalContent";

import {
  BottomGrouping
} from '../../components/swap/styleds'
import { ButtonPrimary } from '../../components/Button'

import AppBody from '../AppBody'

import {
  DBTables,
  DBThead,
  DBTh,
  DBTbody,
  DBTd,
  TokenTableCoinBox,
  TokenTableLogo,
  TokenNameBox,
  MyBalanceBox,
  TokenActionBtn,
  Flex,
  // ChainCardList
} from '../Dashboard/styleds'

import {veMULTI,MULTI_TOKEN,REWARD,REWARD_TOKEN} from './data'

import {useClaimRewardCallback} from './hooks'

const VestContent = styled.div`
  width: 100%;
  max-width: 1200px;
`

const CreateLock = styled(TokenActionBtn)`
  background:${({ theme }) => theme.primary1};
  color:#fff;
  margin-bottom:10px;
  &.disabled {
    opacity: 0.2;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 28px;
    margin-bottom: 10px;
  `}
`

const TokenActionBtn1 = styled(ButtonLight)`
  ${({ theme }) => theme.flexC};
  font-family: 'Manrope';
  min-width: auto!important;
  max-width: auto!important;
  width: auto;
  height: 38px;
  padding: 0 15px;
  word-break:break-all!important;

  border-radius: 0.5625rem;
  background: ${({ theme }) => theme.selectedBg};
  margin-right: 0.125rem;

  font-size: 0.75rem;
  font-weight: 500;

  line-height: 1;

  color: ${({ theme }) => theme.textColorBold};
  box-shadow: none;
  // padding: 0 8px;
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.selectedBg};
  }
  &.disabled {
    opacity: 0.2;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 28px;
    margin-bottom: 10px;
  `}
`

const TokenActionBtn2 = styled(TokenActionBtn)`
  min-width: auto!important;
  max-width: auto!important;
  width: auto;
  height: 38px;
  padding: 0 15px;
  &.disabled {
    opacity: 0.2;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 28px;
    margin-bottom: 10px;
  `}
`

const RewardView = styled.div`
  width:100%;
  ${({ theme }) => theme.flexC};
  padding: 30px 0;
`

export default function Vest () {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()

  const [vestNFTs, setvestNFTs] = useState<any>()
  const [modalOpen, setModalOpen] = useState(false)
  const [rewardInfo, setRewardInfo] = useState<any>()
  const [loadingStatus, setLoadingStatus] = useState<any>(0)
  // const [rewradNumber, setRewradNumber] = useState<any>()
  // const [epoch, setEpoch] = useState<any>()
  const [epochId, setEpochId] = useState<any>()
  const [rewardList, setRewardList] = useState<any>()

  const useVeMultiToken = useMemo(() => {
    if (chainId && veMULTI[chainId]) return veMULTI[chainId]
    return undefined
  }, [chainId])
  
  const useVeMultiRewardToken = useMemo(() => {
    if (chainId && REWARD[chainId]) return REWARD[chainId]
    return undefined
  }, [chainId])

  const useRewardToken = useMemo(() => {
    if (chainId && REWARD_TOKEN[chainId]) return REWARD_TOKEN[chainId]
    return undefined
  }, [chainId])

  

  const useLockToken = useMemo(() => {
    if (chainId && MULTI_TOKEN[chainId]) {
      return MULTI_TOKEN[chainId]
    }
    return undefined
  }, [chainId])

  const contract = useVeMULTIContract(useVeMultiToken?.address)
  const rewardContract = useVeMULTIRewardContract(useVeMultiRewardToken?.address)

  const {execute: onWrap} = useClaimRewardCallback(
    useVeMultiRewardToken?.address,
    rewardInfo?.id,
    rewardInfo?.list
  )
  // const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, useVeMultiToken)
  const getPendingReward = useCallback(async(nfts) => {
    if (rewardContract && nfts?.id && epochId) {
      // console.log(nfts.id)
      const arr = []
      let totalReward:any = ''
      const limit = 30
      const len = Number(epochId)
      for (let i = 0; i < len; i+=limit) {
        // console.log(nfts.id, i, i + limit > len ? len : i + limit)
        try {
          let data = await rewardContract.pendingReward(nfts.id, i, i + limit > len ? len : i + limit)
          data = data && data[0] ? data[0] : ''
          if (!data) continue
          if (!totalReward && data.reward) totalReward = data.reward
          else if (data.reward) {
            totalReward.add(data.reward)
          }
          // console.log(data)
          // console.log('endEpoch',data.endEpoch.toString())
          // console.log('reward',data.reward.toString())
          // console.log('startEpoch',data.startEpoch.toString())
          arr.push({
            startEpoch: data.startEpoch.toString(),
            endEpoch: data.endEpoch.toString(),
            reward: data.reward.toString(),
          })
        } catch (error) {
          
        }
      }
      console.log(arr)
      console.log(totalReward)
      // setLoadingStatus(1)
      // setRewradNumber('res')
      // setEpoch([])
      return {list: arr, totalReward: totalReward?.toString()}
    }
    return undefined
  }, [rewardContract, epochId])
  const getAllRewards = useCallback(async() => {
    if (
      epochId
      && vestNFTs
      && vestNFTs.length > 0
    ) {
      const list:any = {}
      for (const obj of vestNFTs) {
        const data:any = await getPendingReward(obj)
        if (data) {
          list[obj.id] = data
        }
      }
      console.log(list)
      setRewardList(list)
    }
  }, [epochId, vestNFTs])
  useEffect(() => {
    getAllRewards()
  }, [epochId, vestNFTs])

  const getVestNFTs = useCallback(async() => {
    // console.log(useVeMultiToken)
    if (
      contract
      && account
    ) {
      // console.log(contract)
      // console.log(account)
      const nftsLength = await contract.balanceOf(account)
      const totalSupply = await contract.totalSupply()
      console.log('totalSupply',totalSupply.toString())
      const arr = Array.from({length: parseInt(nftsLength)}, (v, i) => i)
      // console.log(nftsLength)
      // console.log(arr)
      const nfts = await Promise.all(
        arr.map(async (idx) => {
  
          const tokenIndex = await contract.tokenOfOwnerByIndex(account, idx)
          const locked = await contract.locked(tokenIndex)
          const lockValue = await contract.balanceOfNFT(tokenIndex)
  
          // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
          return {
            index: idx,
            id: tokenIndex?.toString(),
            lockEnds: locked.end.toNumber(),
            lockAmount: BigAmount.format(useLockToken.decimals, locked.amount).toExact(),
            lockValue: BigAmount.format(useVeMultiToken.decimals, lockValue).toExact()
          }
        })
      )
      console.log(nfts)
      setvestNFTs(nfts)
    }
  }, [contract, account])
  useEffect(() => {
    getVestNFTs()
  }, [contract, account, useLockToken])
  useInterval(getVestNFTs, 1000 * 10)

  const getCurrentEpochId = useCallback(() => {
    if (rewardContract) {
      rewardContract.getCurrentEpochId().then((res:any) => {
        console.log(res.toString())
        setEpochId(res.toString())
      })
    }
  }, [rewardContract])
  useEffect(() => {
    getCurrentEpochId()
  }, [rewardContract])
  useInterval(getCurrentEpochId, 1000 * 10)

  const getAPR = useCallback(async() => {
    if (
      rewardContract
      && epochId
    ) {
      // const EpochId = await rewardContract.getCurrentEpochId()
      try {
        const EpochInfo = await rewardContract.getEpochInfo(epochId)
        const TotalPower = await rewardContract.getEpochTotalPower(epochId)
        console.log(EpochInfo[0].toString())
        console.log(EpochInfo[1].toString())
        console.log(EpochInfo[2].toString())
        console.log(TotalPower.toString())
      } catch (error) {
        console.error(error)
      }
      // const apr = EpochInfo?.totalReward * 4 / (endTime - startTime) / TotalPower
    }
  }, [rewardContract, epochId])
  useEffect(() => {
    getAPR()
  }, [rewardContract, epochId])

  function ClaimView (stutus:number) {
    if (stutus === 0) {
      return (
        <>Loading</>
      )
    } else if (stutus === 2) {
      return (
        <>Error</>
      )
    } else {
      const totalReward = rewardInfo?.totalReward && useRewardToken ? BigAmount.format(useRewardToken?.decimals, rewardInfo?.totalReward).toSignificant(6) : ''
      return (
        <>
          <TokenLogo symbol={rewardInfo?.symbol}></TokenLogo>
          <RewardView>{totalReward}</RewardView>
          <BottomGrouping>
            <ButtonPrimary onClick={() => {
              if (onWrap) {
                onWrap()
              }
            }}>
              {t('Claim Reward')}
            </ButtonPrimary>
          </BottomGrouping>
        </>
      )
    }
  }
  return (
    <AppBody>
      <ModalContent
        isOpen={modalOpen}
        onDismiss={() => {
          setModalOpen(false)
        }}
        title={t('Claim Reward')}
      >
        {rewardInfo?.id}
        {ClaimView(loadingStatus)}
      </ModalContent>
      <VestContent>
        <CreateLock to={'/vest/create'}>{t('Create Lock')}</CreateLock>
      </VestContent>

      <MyBalanceBox>
        <DBTables>
          <DBThead>
            <tr>
              <DBTh className="l">{t('tokens')}</DBTh>
              <DBTh className="l">{t('Vest Amount')}</DBTh>
              <DBTh className="l">{t('Vest Value')}</DBTh>
              <DBTh className="c">{t('Vest Expires')}</DBTh>
              <DBTh className="c">{t('Action')}</DBTh>
            </tr>
          </DBThead>
          <DBTbody>
            {
              vestNFTs && vestNFTs.map((item:any, index:any) => {
                return <tr key={index}>
                  <DBTd>
                    <TokenTableCoinBox>
                      <TokenTableLogo>
                        <TokenLogo
                          symbol={'MULTI'}
                          // logoUrl={item.logoUrl}
                          size={'1.625rem'}
                        ></TokenLogo>
                      </TokenTableLogo>
                      <TokenNameBox>
                        <h3>{item.id}</h3>
                        {/* <p>{config.getBaseCoin(item?.name, chainId, 1)}</p> */}
                      </TokenNameBox>
                    </TokenTableCoinBox>
                  </DBTd>
                  <DBTd className="l">{item.lockAmount}</DBTd>
                  <DBTd className="l">{item.lockValue}</DBTd>
                  <DBTd className="c">{moment.unix(item.lockEnds).format('YYYY-MM-DD')}</DBTd>
                  <DBTd className="c">
                    <Flex>
                      <TokenActionBtn2 to={"/vest/manger?id=" + item.index}>Manger</TokenActionBtn2>
                      <TokenActionBtn1 onClick={() => {
                        
                        // getPendingReward(item)
                        if (rewardList && rewardList[item.id]) {
                          setRewardInfo({...rewardList[item.id], id: item.id})
                          setModalOpen(true)
                          setLoadingStatus(1)
                        }
                      }}>{t('Claim Reward')}</TokenActionBtn1>
                    </Flex>
                  </DBTd>
                </tr>
              })
            }
          </DBTbody>
        </DBTables>
      </MyBalanceBox>
    </AppBody>
  )
}