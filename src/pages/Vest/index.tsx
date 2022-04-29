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
import { useUserSelectChainId } from '../../state/user/hooks'

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

import {getLabelPrice} from '../../utils/tools/getPrice'

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

import {useClaimRewardCallback, useWithdrawCallback} from './hooks'
import axios from "axios";
import {thousandBit} from '../../utils/tools/tools'


import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'

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

const CreateLock1 = styled(ButtonLight)`
  width: auto;
  height: 38px;
  border-radius: 0.5625rem;
  background: ${({ theme }) => theme.primary1};
  margin: 0 5px 10px;
  font-size:0.75rem;
  color:#fff;
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
  const {setUserSelectNetwork} = useUserSelectChainId()

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
  const [price, setPrice] = useState<any>(12)
  const [nftLogoModel, setNftLogoModel] = useState<any>(false)
  const [nftLogo, setNftLogo] = useState<any>()

  const [disabled, setDisabled] = useState(false)
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

  const isSupport = useMemo(() => {
    if (!useLockToken) {
      return false
    }
    return true
  }, [useLockToken])

  const contract = useVeMULTIContract(useVeMultiToken?.address)
  const rewardContract = useVeMULTIRewardContract(useVeMultiRewardToken?.address)
  const ercContract = useTokenContract(useLockToken?.address)
  // const multicallContract = useMulticallContract()


  const {execute: onWrap} = useClaimRewardCallback(
    useVeMultiRewardToken?.address,
    rewardInfo?.id,
    rewardInfo?.list
  )

  const {execute: onWithdrarWrap} = useWithdrawCallback(
    useVeMultiToken?.address
  )
  const rewardEpochIdList = useRef<any>({})
  // const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, useVeMultiToken)
  const getPendingReward = useCallback(async(nfts) => {
    if (rewardContract && nfts?.id && epochId) {
      // console.log(nfts.id)
      const arr = []
      let totalReward:any = ''
      // const limit = 30
      const limit = 10
      const len = Number(epochId)
      const initStart = rewardEpochIdList?.current && rewardEpochIdList?.current[nfts?.id] ? rewardEpochIdList.current[nfts?.id] : 0
      for (let i = initStart; i < len; i+=limit) {
        const nextIndex = i + limit > len ? len : i + limit
        // console.log(nfts.id, i, nextIndex)
        try {
          let data = await rewardContract.pendingReward(nfts.id, i, nextIndex)
          data = data && data[0] ? data[0] : ''
          if (!data) continue
          if (!totalReward && data.reward) {
            // console.log(1)
            totalReward = data.reward
          } else if (data.reward) {
            // console.log(2)
            totalReward = totalReward.add(data.reward)
          }
          // console.log(totalReward)
          // console.log(data.reward)
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
      const arr1 = []
      for (const item of arr) {
        if (arr1.length === 0) {
          arr1.push({startEpoch: item.startEpoch, endEpoch: item.endEpoch})
        } else {
          const len = arr1.length -1
          const obj = arr1[len]
          if ((Number(obj.endEpoch)) === Number(item.startEpoch)) {
            if (Number(item.endEpoch) - Number(arr1[len].startEpoch) <= limit) {
              arr1[len].endEpoch = item.endEpoch
            } else if (Number(item.endEpoch) - Number(arr1[len].startEpoch) > limit) {
              const a1s:any = Number(arr1[len].startEpoch)
              arr1[len].endEpoch = a1s + limit + ''
              arr1.push({startEpoch: a1s + limit + '', endEpoch: item.endEpoch})
            } else {
              arr1.push({startEpoch: item.startEpoch, endEpoch: item.endEpoch})
            }
          } else {
            arr1.push({startEpoch: item.startEpoch, endEpoch: item.endEpoch})
          }
        }
      }
      // console.log(arr)
      // console.log(arr1)
      // console.log(totalReward)
      // console.log(rewardEpochIdList.current)
      // setLoadingStatus(1)
      // setRewradNumber('res')
      // setEpoch([])
      return {list: arr1, totalReward: totalReward?.toString()}
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
          const tokenURI = await contract.tokenURI(tokenIndex)
          const {data} = await axios.get(tokenURI)
          // console.log(tokenURI)
          // console.log(data)
          // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
          return {
            ...data,
            index: idx,
            id: tokenIndex?.toString(),
            lockEnds: locked.end.toNumber(),
            lockAmount: BigAmount.format(useLockToken.decimals, locked.amount).toExact(),
            lockValue: BigAmount.format(useVeMultiToken.decimals, lockValue).toExact(),
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
        setCirculatingsupply(res.data)
      }
    })
    getLabelPrice(useLockToken?.label).then(res => {
      console.log(res)
      if (res) {
        setPrice(res)
      }
    })
  }, [useLockToken])
  useEffect(() => {
    getCirc()
  }, [])

  const DataList = useMemo(() => {
    const list = []
    if (veMultiTotalSupply) {
      list.push({
        name: 'veMULTI Supply',
        value: thousandBit(BigAmount.format(useVeMultiToken.decimals, veMultiTotalSupply).toExact(), 2),
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
      // console.log(BigAmount.format(0,'10').toExact())
      const value = BigAmount.format(useLockToken.decimals,LockedMULTI).toExact()
      list.push({
        name: 'Locked MULTI',
        value: thousandBit(value, 2),
        // value: value.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString(),
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
    if (veMultiTotalSupply && LockedMULTI) {
    // if (totalPower && LockedMULTI) {
      // const tp = BigAmount.format(useVeMultiToken.decimals, totalPower)
      // const lm = BigAmount.format(useLockToken.decimals, LockedMULTI)
      // const fourYear:any = 60*60*24*1460
      // const oneYear = BigAmount.format(0, (60*60*24*365) + '')
      // const value = tp.divide(lm).multiply(BigAmount.format(1, fourYear)).divide(oneYear)
      const vms = BigAmount.format(useVeMultiToken.decimals, veMultiTotalSupply)
      const lm = BigAmount.format(useLockToken.decimals, LockedMULTI)
      const fourYear:any = BigAmount.format(0, (60*60*24*1460) + '')
      const oneYear = BigAmount.format(0, (60*60*24*365) + '')
      const value = vms.divide(lm).multiply(fourYear).divide(oneYear)
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
      // console.log(curEpochInfo)
      const time = Number(curEpochInfo.endTime) - Number(curEpochInfo.startTime)
      const weektime = 60*60*24*7
      const per = weektime / time
      const value = BigAmount.format(useRewardToken.decimals, curEpochInfo.totalReward).toExact()
      // console.log(time)
      // console.log(per)
      list.push({
        name: 'Est. Yield Per Week',
        value: thousandBit(Number(value) * per, 2) + ' ' +  useRewardToken.symbol,
        loading: false
      })
    } else {
      list.push({
        name: 'Est. Yield Per Week',
        value: '',
        loading: true
      })
    }
    if ((latestEpochInfo || curEpochInfo) && totalPower && price) {
      const usrEpochInfo = latestEpochInfo ? latestEpochInfo : curEpochInfo
      const tr = BigAmount.format(useRewardToken.decimals, usrEpochInfo.totalReward)
      const tp = BigAmount.format(useVeMultiToken.decimals, totalPower)
      const tokenPrice = BigAmount.format(0, parseInt(price) + '')
      const oneYear = BigAmount.format(0, (60*60*24*365) + '')
      const time = BigAmount.format(0, (Number(usrEpochInfo.endTime)-Number(usrEpochInfo.startTime)) + '')
      const per = BigAmount.format(0, '100')
      // console.log(useRewardToken)
      // console.log(useVeMultiToken)
      if (
        tr.greaterThan('0')
        && tokenPrice.greaterThan('0')
        && time.greaterThan('0')
        && tp.greaterThan('0')
      ) {
        const apr = tr.divide(tokenPrice).multiply(oneYear).divide(time).divide(tp).multiply(per)
        list.push({
          name: 'APR',
          value: apr.toSignificant(2) + '%',
          loading: false,
          question: 'Assumes 1 veMULTI = 1 MULTI (1 MULTI locked 4 years)'
        })
      } else {
        list.push({
          name: 'APR',
          value: '- %',
          loading: false,
          question: 'Assumes 1 veMULTI = 1 MULTI (1 MULTI locked 4 years)'
        })
      }
    } else {
      list.push({
        name: 'APR',
        value: '',
        loading: true,
        question: 'Assumes 1 veMULTI = 1 MULTI (1 MULTI locked 4 years)'
      })
    }
    // console.log(list)
    return list
  }, [totalPower, curEpochInfo, circulatingsupply, LockedMULTI, veMultiTotalSupply, latestEpochInfo, price])

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
        // console.log(res)
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
        // console.log(res)
        setlatestEpochInfo({
          startTime: res[0].toString(),
          endTime: res[1].toString(),
          totalReward: res[2].toString(),
        })
      }).catch((err:any) => {
        console.log(err)
      })
      rewardContract.getEpochTotalPower(epochId).then((res:any) => {
        // console.log(res)
        setTotalPower(res.toString())
      }).catch((err:any) => {
        console.log(err)
        setTotalPower('')
      })
      
    }
  }, [rewardContract, epochId])
  useEffect(() => {
    getEpochInfo()
  }, [rewardContract, epochId])

  function getUserAPR (UserPower:any, UserMulti:any) {
    const usrEpochInfo = latestEpochInfo ? latestEpochInfo : curEpochInfo
    const tr = usrEpochInfo ? BigAmount.format(useRewardToken.decimals, usrEpochInfo.totalReward).toExact() : ''
    const time = usrEpochInfo ? Number(usrEpochInfo.endTime)-Number(usrEpochInfo.startTime) : ''
    const tokenPrice = price ? Number(price) : ''
    const tp = totalPower ? BigAmount.format(useVeMultiToken.decimals, totalPower).toExact() : ''
    const oneYear = 60*60*24*365
    if (
      tr
      && tokenPrice
      && tp
      && Number(tp) > 0
      && UserPower
      && UserMulti
      && time
    ) {
      const apr = (((Number(tr) / tokenPrice) * Number(UserPower) / Number(tp))*oneYear/time/Number(UserMulti)) * 100
      // console.log(apr)
      return thousandBit(apr, 2) + '%'
    }
    return '-'
  }

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
      if (latestEpochInfo?.startTime && !totalReward) {
        const time = Number(latestEpochInfo?.startTime) - parseInt(Date.now() / 1000 + '')
        let timeView = ''
        if (time < 60 && time > 0) {
          timeView = time + 's'
        } else if (time >= 60 && time < 60 * 60) {
          timeView = (time / 60).toFixed(2) + 'min'
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          timeView = (time / (60 * 60)).toFixed(2) + 'h'
        } else if (time >= 60 * 60 * 24) {
          timeView = (time / (60 * 60 * 24)).toFixed(2) + 'D'
        }
        if (!timeView) {
          return (
            <>
              <RewardLoading>{t('No reward.')}</RewardLoading>
            </>
          )
        }
        return (
          <>
            <RewardLoading>Remaining time for next collection:{timeView}</RewardLoading>
          </>
        )
      } else if (!totalReward) {
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
            <ButtonPrimary disabled={disabled} onClick={() => {
              if (onWrap) {
                setDisabled(true)
                onWrap().then(() => {
                  setDisabled(false)
                  setModalOpen(false)
                })
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

      <ModalContent
        isOpen={nftLogoModel}
        onDismiss={() => {
          setNftLogo('')
          setNftLogoModel(false)
        }}
        title={t('NFT')}
      >
        <img src={nftLogo} style={{width: '100%'}} />
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
        {
          !isSupport ? (
            <>
              {
                Object.keys(veMULTI).map((item, index) => {
                  return <CreateLock1 key={index} onClick={() => {
                    if (setUserSelectNetwork) {
                      setUserSelectNetwork({
                        chainId: config.getCurChainInfo(item).chainID,
                        label: config.getCurChainInfo(item)?.chainType
                      })
                    }
                    selectNetwork(item).then((res: any) => {
                      console.log(res)
                      if (res.msg === 'Error') {
                        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(item).networkName}))
                      }
                    })
                  }}>{t('ConnectedWith') + ' ' + config.getCurChainInfo(item).name}</CreateLock1>
                })
              }
            </>
          ) : (
            <CreateLock to={'/vest/create'}>{t('Create Lock')}</CreateLock>
          )
        }
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
                      <TokenTableLogo onClick={() => {
                        setNftLogo(item?.image)
                        setNftLogoModel(true)
                      }} style={{cursor: 'pointer'}}>
                        {/* <TokenLogo
                          symbol={'MULTI'}
                          // logoUrl={item.logoUrl}
                          size={'1.625rem'}
                        ></TokenLogo> */}
                        <img src={item?.image} />
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
                  <DBTd className="l">{getUserAPR(item.lockValue, item.lockAmount)}</DBTd>
                  <DBTd className="c" width={'260px'}>
                    <Flex>
                      <TokenActionBtn2 to={"/vest/manger?id=" + item.index}>Manage</TokenActionBtn2>
                      <TokenActionBtn1 onClick={() => {
                        setClaimRewardId(item.id)
                        setModalOpen(true)
                      }}>{t('Claim')}</TokenActionBtn1>
                      <TokenActionBtn1 disabled={parseInt(Date.now() / 1000 + '') < Number(item.lockEnds) || disabled} onClick={() => {
                        // console.log(onWithdrarWrap)
                        const now = parseInt(Date.now() / 1000 + '')
                        if (now >= Number(item.lockEnds)) {
                          if (onWithdrarWrap) {
                            // console.log(1)
                            setDisabled(true)
                            onWithdrarWrap(item.id).then(() => {
                              setDisabled(false)
                            })
                          }
                        }
                      }}>{t('Withdraw')}</TokenActionBtn1>
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