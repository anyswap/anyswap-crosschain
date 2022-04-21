import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { Token } from 'anyswap-sdk'
// import { NavLink } from 'react-router-dom'
import styled from "styled-components"
import { useTranslation } from 'react-i18next'
import moment from 'moment';

import { useActiveWeb3React } from '../../hooks'
import { 
  useVeMULTIContract,
  useVeMULTIRewardContract,
  useTokenContract,
  // useMulticallContract
} from '../../hooks/useContract'
import useInterval from '../../hooks/useInterval'

import {BigAmount} from '../../utils/formatBignumber'
// import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'

import TokenLogo from '../../components/TokenLogo'
import { ButtonLight } from '../../components/Button'
// import Modal from "../../components/Modal";
import ModalContent from "../../components/Modal/ModalContent";
import QuestionHelper from '../../components/QuestionHelper'

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
import axios from "axios";
import {thousandBit} from '../../utils/tools/tools'
// import config from "../../config";

// import {VE_MULTI_REWARD_INTERFACE} from '../../constants/abis/veMULTIReward'

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
  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.primary1};
    opacity: 0.99
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

const RewardLoading = styled.div`
  ${({ theme }) => theme.flexC};
  width: 100%;
  padding: 50px 0;
  color: ${({ theme }) => theme.textColorBold};
`

const LogoBox = styled.div`
  ${({ theme }) => theme.flexC};
  width: 46px;
  height: 46px;
  object-fit: contain;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 0.5px rgba(0, 0, 0, 0.1);
  border-radius:100%;
  margin: auto;

  img{
    // height: 24px;
    // width: 24px;
    display:block;
  }
`

const DataViews = styled.div`
  width:100%;
  .list {
    width:100%;
    ${({ theme }) => theme.flexBC};
    flex-wrap:wrap;
    .item {
      width: 32%;
      padding: 10px 0;
      .content {
        width:100%;
        box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
        background-color: ${({ theme }) => theme.contentBg};
        border-radius: 0.5625rem;
        padding: 1rem 2.5rem;
        .title {
          font-size: 14px;
          color:${({ theme }) => theme.text1};
          margin: 0 0 15px;
          font-weight:500;
        }
        .value {
          font-size:16px;
          color:${({ theme }) => theme.textColorBold};
          margin-bottom:0;
          font-weight:bold;
          text-align:center;
        }
        .loading {
          font-size:14px;
          color:${({ theme }) => theme.text1};
          margin-bottom:0;
          text-align:center;
        }
      }
    }
  }
`

export default function Vest () {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()

  const [vestNFTs, setvestNFTs] = useState<any>()
  const [modalOpen, setModalOpen] = useState(false)
  const [claimRewardId, setClaimRewardId] = useState<any>()
  const [loadingStatus, setLoadingStatus] = useState<any>(0)

  const [veMultiTotalSupply, setVeMultiTotalSupply] = useState<any>()
  const [LockedMULTI, setLockedMULTI] = useState<any>()
  const [circulatingsupply, setCirculatingsupply] = useState<any>()
  const [curEpochInfo, setCurEpochInfo] = useState<any>()
  const [totalPower, setTotalPower] = useState<any>()
  const [epochId, setEpochId] = useState<any>()
  const [rewardList, setRewardList] = useState<any>()
  const [latestEpochInfo, setlatestEpochInfo] = useState<any>()
  // const viewDatas = useRef<any>({})
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

  

  const useLockToken:any = useMemo(() => {
    if (chainId && MULTI_TOKEN[chainId]) {
      return MULTI_TOKEN[chainId]
    }
    return undefined
  }, [chainId])

  const rewardInfo = useMemo(() => {
    if (claimRewardId && rewardList && rewardList[claimRewardId]) {
      setLoadingStatus(1)
      return {...rewardList[claimRewardId], id: claimRewardId}
    }
    setLoadingStatus(0)
    return undefined
  }, [claimRewardId, rewardList])

  const contract = useVeMULTIContract(useVeMultiToken?.address)
  const rewardContract = useVeMULTIRewardContract(useVeMultiRewardToken?.address)
  const ercContract = useTokenContract(useLockToken?.address)
  // const multicallContract = useMulticallContract()


  const {execute: onWrap} = useClaimRewardCallback(
    useVeMultiRewardToken?.address,
    rewardInfo?.id,
    rewardInfo?.list
  )
  const rewardEpochIdList = useRef<any>({})
  // const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, useVeMultiToken)
  const getPendingReward = useCallback(async(nfts) => {
    if (rewardContract && nfts?.id && epochId) {
      // console.log(nfts.id)
      const arr = []
      let totalReward:any = ''
      const limit = 30
      const len = Number(epochId)
      const initStart = rewardEpochIdList?.current && rewardEpochIdList?.current[nfts?.id] ? rewardEpochIdList.current[nfts?.id] : 0
      for (let i = initStart; i < len; i+=limit) {
        const nextIndex = i + limit > len ? len : i + limit
        // console.log(nfts.id, i, nextIndex)
        try {
          let data = await rewardContract.pendingReward(nfts.id, i, nextIndex)
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
          // console.log(i)
          if (!rewardEpochIdList.current[nfts?.id]) rewardEpochIdList.current[nfts?.id] = nextIndex
          else rewardEpochIdList.current[nfts?.id] = nextIndex
        }
      }
      
      // console.log(arr)
      // console.log(totalReward)
      // console.log(rewardEpochIdList.current)
      // setLoadingStatus(1)
      // setRewradNumber('res')
      // setEpoch([])
      return {list: arr, totalReward: totalReward?.toString()}
    }
    return undefined
  }, [rewardContract, epochId])

  // useEffect(() => {
  //   if (multicallContract && useVeMultiRewardToken?.address) {

  //     multicallContract.aggregate([
  //       [useVeMultiRewardToken?.address, 
  //         VE_MULTI_REWARD_INTERFACE?.encodeFunctionData('pendingReward', [2,0,30])],
  //       [useVeMultiRewardToken?.address, 
  //       VE_MULTI_REWARD_INTERFACE?.encodeFunctionData('pendingReward', [2,240,270])]
  //     ]
  //     ).then((res:any) => {
  //       console.log(res)
  //       console.log(ercContract)
  //     })
  //     // multicallContract.aggregate([
  //     //   [useVeMultiRewardToken?.address, 
  //     //   VE_MULTI_REWARD_INTERFACE?.encodeFunctionData('pendingReward', [2,0,30])]
  //     // ]
  //     // ).then((res:any) => {
  //     //   console.log(res)
  //     // })
  //   }
  // }, [multicallContract, useVeMultiRewardToken])
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
      // viewDatas.current['veMultiTotalSupply'] = totalSupply?.toString()
      // setViewDatas({
      //   ...viewDatas,
      //   veMultiTotalSupply: totalSupply?.toString()
      // })
      setVeMultiTotalSupply(totalSupply?.toString())
      // console.log('totalSupply',totalSupply.toString())
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
        // console.log(res.toString())
        setEpochId(res.toString())
      }).catch(() => {
        setEpochId('')
      })
    }
  }, [rewardContract])
  useEffect(() => {
    getCurrentEpochId()
  }, [rewardContract])
  useInterval(getCurrentEpochId, 1000 * 10)

  const getCirc = useCallback(() => {
    axios.get(`https://tokeninfo.multichain.org/multi/circulatingsupply`).then((res:any) => {
      console.log(res)
      if (res.data) {
        // viewDatas.current['circulatingsupply'] = res.data
        // setViewDatas({
        //   ...viewDatas,
        //   circulatingsupply: res.data
        // })
        setCirculatingsupply(res.data)
      }
    })
  }, [])
  useEffect(() => {
    getCirc()
  }, [])

  const DataList = useMemo(() => {
    const list = []
    if (veMultiTotalSupply) {
      list.push({
        name: 'veMULTI Supply',
        value: BigAmount.format(useVeMultiToken.decimals, veMultiTotalSupply).toSignificant(2),
        loading: false
      })
    } else {
      list.push({
        name: 'veMULTI Supply',
        value: '',
        loading: true
      })
    }
    if (LockedMULTI) {
      list.push({
        name: 'Locked MULTI',
        value: BigAmount.format(useLockToken.decimals,LockedMULTI).toSignificant(2),
        loading: false
      })
    } else {
      list.push({
        name: 'Locked MULTI',
        value: '',
        loading: true
      })
    }
    if (LockedMULTI && circulatingsupply) {
      const value:any = Number(BigAmount.format(useLockToken.decimals,LockedMULTI).toExact()) / circulatingsupply
      list.push({
        name: '% Circ. MULTI Locked',
        value: thousandBit(value * 100, 2) + '%',
        loading: false
      })
    } else {
      list.push({
        name: '% Circ. MULTI Locked',
        value: '',
        loading: true
      })
    }
    if (totalPower && LockedMULTI) {
      const tp = BigAmount.format(useVeMultiToken.decimals, totalPower)
      const lm = BigAmount.format(useLockToken.decimals, LockedMULTI)
      const fourYear:any = 60*60*24*1460
      const oneYear = BigAmount.format(1, (60*60*24*365) + '')
      const value = tp.divide(lm).multiply(BigAmount.format(1, fourYear)).divide(oneYear)
      list.push({
        name: 'Avg. Lock Time (years)',
        value: value.toSignificant(2),
        loading: false
      })
    } else {
      list.push({
        name: 'Avg. Lock Time (years)',
        value: '',
        loading: true
      })
    }
    if (curEpochInfo) {
      // const oneYear = BigAmount.format(1, (60*60*24*365) + '')
      console.log(curEpochInfo)
      list.push({
        name: 'Est. Yield Per Week',
        value: BigAmount.format(useRewardToken.decimals, curEpochInfo.totalReward).toSignificant(2),
        loading: false
      })
    } else {
      list.push({
        name: 'Est. Yield Per Week',
        value: '',
        loading: true
      })
    }
    if ((latestEpochInfo || curEpochInfo) && totalPower) {
      const usrEpochInfo = latestEpochInfo ? latestEpochInfo : curEpochInfo
      const tr = BigAmount.format(useRewardToken.decimals, usrEpochInfo.totalReward)
      const tp = BigAmount.format(useVeMultiToken.decimals, totalPower)
      const price = BigAmount.format(1, '12')
      const oneYear = BigAmount.format(1, (60*60*24*365) + '')
      const time = BigAmount.format(1, (Number(usrEpochInfo.endTime)-Number(usrEpochInfo.startTime)) + '')
      const per = BigAmount.format(1, '100')
      const apr = tr.divide(price).multiply(oneYear).divide(time).divide(tp).multiply(per)
      list.push({
        name: 'APR',
        value: apr.toSignificant(2) + '%',
        loading: false,
        question: 'Assumes 1 veMULTI = 1 MULTI (1 MULTI locked 4 years)'
      })
    } else {
      list.push({
        name: 'APR',
        value: '',
        loading: true,
        question: 'Assumes 1 veMULTI = 1 MULTI (1 MULTI locked 4 years)'
      })
    }
    console.log(list)
    return list
  }, [totalPower, curEpochInfo, circulatingsupply, LockedMULTI, veMultiTotalSupply, latestEpochInfo])

  const getMultiInfo = useCallback(() => {
    if (ercContract) {
      if (useVeMultiToken?.address) {
        ercContract.balanceOf(useVeMultiToken?.address).then((res:any) => {
          setLockedMULTI(res?.toString())
        })
      }
    }
  }, [ercContract, useVeMultiToken])

  useEffect(() => {
    getMultiInfo()
  }, [ercContract])

  const getEpochInfo = useCallback(async() => {
    if (
      rewardContract
      && epochId
    ) {
      // const EpochId = await rewardContract.getCurrentEpochId()
      rewardContract.getEpochInfo(epochId).then((res:any) => {
        console.log(res)
        setCurEpochInfo({
          startTime: res[0].toString(),
          endTime: res[1].toString(),
          totalReward: res[2].toString(),
        })
      }).catch((err:any) => {
        console.log(err)
        setCurEpochInfo('')
      })
      rewardContract.getEpochInfo(Number(epochId) + 1).then((res:any) => {
        console.log(res)
        setlatestEpochInfo({
          startTime: res[0].toString(),
          endTime: res[1].toString(),
          totalReward: res[2].toString(),
        })
      }).catch((err:any) => {
        console.log(err)
      })
      rewardContract.getEpochTotalPower(epochId).then((res:any) => {
        console.log(res)
        setTotalPower(res.toString())
      }).catch((err:any) => {
        console.log(err)
        setTotalPower('')
      })
      // try {
      //   console.log(1)
      //   const EpochInfo = await rewardContract.getEpochInfo(epochId)
      //   console.log(2)
      //   console.log(epochId)
      //   const nextEpochInfo = await rewardContract.getEpochInfo(Number(epochId) + 1)
      //   console.log(3)
      //   const TotalPower = await rewardContract.getEpochTotalPower(epochId)
      //   console.log(nextEpochInfo)
      //   setlatestEpochInfo({
      //     startTime: nextEpochInfo[0].toString(),
      //     endTime: nextEpochInfo[1].toString(),
      //     totalReward: nextEpochInfo[2].toString(),
      //   })
        
      //   setTotalPower(TotalPower.toString())
      //   setCurEpochInfo(EpochInfo[2].toString())
      //   console.log(TotalPower.toString())
      // } catch (error) {
      //   console.error(error)
      // }
      
    }
  }, [rewardContract, epochId])
  useEffect(() => {
    getEpochInfo()
  }, [rewardContract, epochId])

  function ClaimView (stutus:number) {
    if (stutus === 0) {
      return (
        <>
          <RewardLoading>{t('Reward query in progress...')}</RewardLoading>
        </>
      )
    } else if (stutus === 2) {
      return (
        <>Error</>
      )
    } else {
      const totalReward = rewardInfo?.totalReward && useRewardToken ? BigAmount.format(useRewardToken?.decimals, rewardInfo?.totalReward).toSignificant(6) : ''
      if (!totalReward) {
        return (
          <>
            <RewardLoading>{t('No reward.')}</RewardLoading>
          </>
        )
      }
      return (
        <>
        <LogoBox>
          <TokenLogo symbol={useRewardToken?.symbol} size={'3rem'}></TokenLogo>
        </LogoBox>
          <RewardView>{totalReward} {useRewardToken?.symbol}</RewardView>
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
          setClaimRewardId('')
          setModalOpen(false)
        }}
        title={t('Claim Reward')}
      >
        {/* {rewardInfo?.id} */}
        {ClaimView(loadingStatus)}
      </ModalContent>
      <DataViews>
        <div className="list">
          {
            DataList.map((item:any, index:any) => {
              return (
                <div className="item" key={index}>
                  <div className="content">
                    <h3 className="title">{item.name}{item.question ? <QuestionHelper text={item.question} /> : ''}</h3>
                    {
                      item.loading ? (
                        <p className="loading">Loading</p>
                      ) : (
                        <p className="value">{item.value}</p>
                      )
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </DataViews>
      <VestContent>
        <CreateLock to={'/vest/create'}>{t('Create Lock')}</CreateLock>
      </VestContent>

      <MyBalanceBox>
        <DBTables>
          <DBThead>
            <tr>
              <DBTh className="l">{t('NFT ID')}</DBTh>
              <DBTh className="l">{t('Vest Amount')}</DBTh>
              <DBTh className="l">{t('Vest Value')}</DBTh>
              <DBTh className="c">{t('Vest Expires')}</DBTh>
              <DBTh className="c">{t('APR')}</DBTh>
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
                  <DBTd className="l">{thousandBit(item.lockAmount, 2)}</DBTd>
                  <DBTd className="l">{thousandBit(item.lockValue, 2)}</DBTd>
                  <DBTd className="c">{moment.unix(item.lockEnds).format('YYYY-MM-DD')}</DBTd>
                  <DBTd className="c">
                    <Flex>
                      <TokenActionBtn2 to={"/vest/manger?id=" + item.index}>Mange</TokenActionBtn2>
                      <TokenActionBtn1 onClick={() => {
                        setClaimRewardId(item.id)
                        setModalOpen(true)
                      }}>{t('Claim')}</TokenActionBtn1>
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