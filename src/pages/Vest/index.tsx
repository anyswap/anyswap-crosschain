import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

// import GifIon from '../../assets/images/icon/GIF.svg'
// import BulbIcon from '../../assets/images/icon/bulb.svg'

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
import {
  useVeshare,
  useClaimVeshareRewardCallback,
  veSHARE
} from './veshare'

import {useClaimRewardCallback, useWithdrawCallback} from './hooks'
import axios from "axios";
import {thousandBit} from '../../utils/tools/tools'


import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'

// import {VE_MULTI_REWARD_INTERFACE} from '../../constants/abis/veMULTIReward'

const VestContent = styled.div`
${({ theme }) => theme.flexSC};
  width: 100%;
  max-width: 1200px;
`

const CreateLock = styled(TokenActionBtn)`
  background:${({ theme }) => theme.primary1};
  width: 120px;
  color:#fff;
  margin-bottom:10px;
  padding-left: 12px;
  padding-right: 12px;
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
          white-space:nowrap;
        }
        .value {
          font-size:16px;
          color:${({ theme }) => theme.textColorBold};
          margin-bottom:0;
          font-weight:bold;
          text-align:center;
          white-space:nowrap;
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
  ${({ theme }) => theme.mediaWidth.upToMedium`
    .list {
      .item {
        width: 48%;
        .content {
          padding: 1rem 1rem;
          .title {
            white-space:nowrap;
          }
        }
      }
    }
  `}
`

const TokenTableLogoWrapper = styled(TokenTableLogo)`
  img {
    max-width: 100%;
    max-height: 100%;
  }
`

export default function Vest () {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const {setUserSelectNetwork} = useUserSelectChainId()

  const {getVeshareNFTs, useVeshareRewardToken} = useVeshare()

  const [vestNFTs, setvestNFTs] = useState<any>()
  const [veshareNFTs, setVeshareNFTs] = useState<any>()
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
  const [totalAPR, setTotalAPR] = useState<any>()

  const [disabled, setDisabled] = useState(false)
  // const viewDatas = useRef<any>({})

  const supportChainList = useMemo(() => {
    const arr:any = []
    for (const c in veSHARE) {
      if (arr.includes(c)) continue
      arr.push(c)
    }
    for (const c in veMULTI) {
      if (arr.includes(c)) continue
      arr.push(c)
    }
    return arr
  }, [veSHARE, veMULTI])
  // console.log(supportChainList)

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
    // console.log(MULTI_TOKEN)
    // console.log(chainId)
    if (chainId && MULTI_TOKEN[chainId]) {
      return MULTI_TOKEN[chainId]
    }
    return undefined
  }, [chainId])
  // console.log(useLockToken)

  const rewardInfo = useMemo(() => {
    if (
      claimRewardId?.id && rewardList && rewardList[claimRewardId?.id]
    ) {
      setLoadingStatus(1)
      return {...rewardList[claimRewardId?.id], id: claimRewardId?.id}
    }
    setLoadingStatus(0)
    return undefined
  }, [claimRewardId, rewardList])

  // const isSupport = useMemo(() => {
  //   if (!useLockToken) {
  //     return false
  //   }
  //   return true
  // }, [useLockToken])

  const nftList = useMemo(() => {
    const arr = []
    if (vestNFTs) {
      arr.push(...vestNFTs)
    }
    if (veshareNFTs) {
      arr.push(...veshareNFTs)
    }
    return arr
  }, [veshareNFTs, vestNFTs])

  const contract = useVeMULTIContract(useVeMultiToken?.address)
  const rewardContract = useVeMULTIRewardContract(useVeMultiRewardToken?.address)
  const ercContract = useTokenContract(useLockToken?.address)
  // const multicallContract = useMulticallContract()


  const {execute: onWrap} = useClaimRewardCallback(
    useVeMultiRewardToken?.address,
    rewardInfo?.id,
    rewardInfo?.list
  )

  const {execute: onVeshareWrap} = useClaimVeshareRewardCallback(claimRewardId)

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
      const limit = 30
      // const limit = 10
      const len = Number(epochId) + 1
      const initStart = rewardEpochIdList?.current && rewardEpochIdList?.current[nfts?.id] ? rewardEpochIdList.current[nfts?.id] : 0
      for (let i = initStart; i < len; i+=limit) {
        const nextIndex = i + limit > len ? len : i + limit
        // console.log(nfts.id, i, nextIndex - 1)
        try {
          let data = await rewardContract.pendingReward(nfts.id, i, nextIndex - 1)
          data = data && data[0] ? data[0] : ''
          if (!data) continue
          if (!totalReward && data.reward) {
            // console.log(1)
            totalReward = data.reward
          } else if (data.reward) {
            // console.log(2)
            totalReward = totalReward.add(data.reward)
          }
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
          if ((Number(obj.endEpoch)) === Number(item.startEpoch) -1) {
            if (Number(item.endEpoch) - Number(arr1[len].startEpoch) <= limit) {
              arr1[len].endEpoch = item.endEpoch
            } else if (Number(item.endEpoch) - Number(arr1[len].startEpoch) > limit) {
              const a1s:any = Number(arr1[len].startEpoch)
              arr1[len].endEpoch = a1s + limit - 1 + ''
              arr1.push({startEpoch: a1s + limit + '', endEpoch: item.endEpoch})
            } else {
              arr1.push({startEpoch: item.startEpoch, endEpoch: item.endEpoch})
            }
          } else {
            arr1.push({startEpoch: item.startEpoch, endEpoch: item.endEpoch})
          }
        }
      }
      return {list: arr1, totalReward: totalReward?.toString()}
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
      && useLockToken
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
      try {
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
              type: 'VEMULTI'
            }
          })
        )
        console.log(nfts)
        setvestNFTs(nfts)
      } catch (error) {
        console.log(error)
      }
      
    }
    
    getVeshareNFTs().then(res => {
      // console.log(res)
      setVeshareNFTs(res)
    })
  }, [contract, account, useLockToken])

  const getAllNft = useCallback(() => {
    getVestNFTs()
    getVeshareNFTs().then(res => {
      // console.log(res)
      setVeshareNFTs(res)
    })
  }, [getVeshareNFTs, getVestNFTs])

  useEffect(() => {
    getAllNft()
  }, [contract, account, useLockToken])
  
  useInterval(getAllNft, 1000 * 10)

  const getCurrentEpochId = useCallback(() => {
    console.log(rewardContract)
    if (rewardContract) {
      rewardContract.getCurrentEpochId().then((res:any) => {
        console.log(res.toString())
        setEpochId(res.toString())
      }).catch((err:any) => {
        console.log(err)
        setEpochId('0')
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
  }, [])
  useEffect(() => {
    getCirc()
  }, [])

  useEffect(() => {
    if (useLockToken?.label) {
      getLabelPrice(useLockToken?.label).then(res => {
        // console.log(useLockToken)
        // console.log(res)
        if (res) {
          setPrice(res)
        }
      })
    }
  }, [useLockToken])

  const DataList = useMemo(() => {
    const list = []
    if (veMultiTotalSupply && useVeMultiToken) {
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
    if (LockedMULTI && useLockToken) {
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
    if (LockedMULTI && circulatingsupply && useLockToken) {
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
    if (veMultiTotalSupply && LockedMULTI && useVeMultiToken && useLockToken) {
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
    if (curEpochInfo && useRewardToken) {
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
    if ((latestEpochInfo || curEpochInfo) && totalPower && price && useRewardToken && useVeMultiToken) {
      const usrEpochInfo = latestEpochInfo && latestEpochInfo?.totalReward !== '0' ? latestEpochInfo : curEpochInfo
      const tr = BigAmount.format(useRewardToken.decimals, usrEpochInfo?.totalReward ? usrEpochInfo?.totalReward : '0')
      const tp = BigAmount.format(useVeMultiToken.decimals, totalPower)
      const tokenPrice = BigAmount.format(0, parseInt(price) + '')
      const oneYear = BigAmount.format(0, (60*60*24*365) + '')
      const time = BigAmount.format(0, usrEpochInfo?.endTime ? (Number(usrEpochInfo.endTime)-Number(usrEpochInfo.startTime)) + '' : '0')
      const per = BigAmount.format(0, '100')
      // console.log(latestEpochInfo)
      // console.log(curEpochInfo)
      // console.log(tr.toExact())
      // console.log(tp.toExact())
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
        setTotalAPR(apr.toSignificant(2) + '%')
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
  }, [totalPower, curEpochInfo, circulatingsupply, LockedMULTI, veMultiTotalSupply, latestEpochInfo, price, useVeMultiToken, useLockToken])

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

  useInterval(getMultiInfo, 1000 * 10)

  const getEpochInfo = useCallback(async() => {
    console.log(epochId)
    if (
      rewardContract
      && epochId
    ) {
      // const EpochId = await rewardContract.getCurrentEpochId()
      rewardContract.getEpochInfo(epochId).then((res:any) => {
        // console.log(res)
        const data = {
          startTime: res[0].toString(),
          endTime: res[1].toString(),
          totalReward: res[2].toString(),
        }
        setCurEpochInfo(data)
        setlatestEpochInfo(data)
      }).catch((err:any) => {
        console.log(err)
        setCurEpochInfo('')
      })
      // rewardContract.getEpochInfo(Number(epochId) === 0 ? 0 : Number(epochId) + 1).then((res:any) => {
      //   // console.log(res)
      //   setlatestEpochInfo({
      //     startTime: res[0].toString(),
      //     endTime: res[1].toString(),
      //     totalReward: res[2].toString(),
      //   })
      // }).catch((err:any) => {
      //   console.log(err)
      // })
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

  useInterval(getEpochInfo, 1000 * 10)

  function getUserAPR (UserPower:any, UserMulti:any) {
    // const usrEpochInfo = latestEpochInfo ? latestEpochInfo : curEpochInfo
    const usrEpochInfo = latestEpochInfo && latestEpochInfo?.totalReward !== '0' ? latestEpochInfo : curEpochInfo
    const tr = usrEpochInfo?.totalReward && useRewardToken.decimals ? BigAmount.format(useRewardToken.decimals, usrEpochInfo.totalReward).toExact() : ''
    const time = usrEpochInfo ? Number(usrEpochInfo.endTime)-Number(usrEpochInfo.startTime) : ''
    const tokenPrice = price ? Number(price) : ''
    const tp = totalPower && useVeMultiToken.decimals ? BigAmount.format(useVeMultiToken.decimals, totalPower).toExact() : ''
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
    if (claimRewardId?.type === 'VESHARE') {
      const totalReward = claimRewardId?.reward && useVeshareRewardToken ? thousandBit(claimRewardId?.reward,2) : ''
      console.log(totalReward)
      if (!totalReward || !Number(totalReward)) {
        return (
          <>
            <RewardLoading>{t('No reward.')}</RewardLoading>
          </>
        )
      }
      return (
        <>
          <LogoBox>
            <TokenLogo symbol={useVeshareRewardToken?.symbol} size={'3rem'}></TokenLogo>
          </LogoBox>
          <RewardView>{totalReward} {useVeshareRewardToken?.symbol}</RewardView>
          <BottomGrouping>
            <ButtonPrimary disabled={disabled} onClick={() => {
              if (onVeshareWrap) {
                setDisabled(true)
                onVeshareWrap().then(() => {
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
      {/* <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0IiB2aWV3Qm94PSIwIDAgMzUwIDM1MCI+PHN0eWxlPi5iYXNlIHsgZmlsbDogd2hpdGU7IGZvbnQtZmFtaWx5OiBzZXJpZjsgZm9udC1zaXplOiAxNHB4OyB9PC9zdHlsZT48ZGVmcz48cGF0dGVybiBpZD0iaW1nMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGltYWdlIHhsaW5rOmhyZWY9Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9nYW96aGVuZ3hpbi9hc3NldHMvbWFpbi9NYXJrZXRpbmdORlQuZ2lmIiB3aWR0aD0iNDUlIiBoZWlnaHQ9IjQ1JSIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaW1nMSkiIC8+PHRleHQgeD0iNSIgeT0iMTUwIiBjbGFzcz0iYmFzZSI+NDwvdGV4dD48L3N2Zz4=" />

      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPjx0ZXh0IHg9IjEwIiB5PSIyMCIgY2xhc3M9ImJhc2UiPnRva2VuIDE0NzwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNDAiIGNsYXNzPSJiYXNlIj5iYWxhbmNlT2YgMDwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjAiIGNsYXNzPSJiYXNlIj5sb2NrZWRfZW5kIDE2NTcxNTIwMDA8L3RleHQ+PHRleHQgeD0iMTAiIHk9IjgwIiBjbGFzcz0iYmFzZSI+dmFsdWUgMTAwMDAwMDAwMDAwMDAwMDAwMDwvdGV4dD48L3N2Zz4=" /> */}

      {/* <GifIon /> */}
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
          (!chainId || !supportChainList.includes(chainId.toString())) ? (
            <>
              {
                supportChainList.map((item:any, index:any) => {
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
        {/* <CreateLock to={'/vest/veshare'}>{t('Claim veMULTI')}</CreateLock> */}
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
              // vestNFTs && vestNFTs.map((item:any, index:any) => {
              nftList.map((item:any, index:any) => {
                return <tr key={index}>
                  <DBTd>
                    <TokenTableCoinBox>
                      <TokenTableLogoWrapper onClick={() => {
                        setNftLogo(item?.image)
                        setNftLogoModel(true)
                      }} style={{cursor: 'pointer'}}>
                        <img src={item?.image} />
                      </TokenTableLogoWrapper>
                      <TokenNameBox>
                        <h3>{item.id}</h3>
                        {/* <p>{config.getBaseCoin(item?.name, chainId, 1)}</p> */}
                      </TokenNameBox>
                    </TokenTableCoinBox>
                  </DBTd>
                  <DBTd className="l">{item.lockAmount ? thousandBit(item.lockAmount, 2) : '-'}</DBTd>
                  <DBTd className="l">{item.lockValue ? thousandBit(item.lockValue, 2) : '-'}</DBTd>
                  <DBTd className="c">{item.lockEnds ? moment.unix(item.lockEnds).format('YYYY-MM-DD') : ''}</DBTd>
                  <DBTd className="l">{item.type === 'VEMULTI' ? getUserAPR(item.lockValue, item.lockAmount) : (totalAPR ? totalAPR : '-')}</DBTd>
                  <DBTd className="c" width={'260px'}>
                    <Flex>
                      <TokenActionBtn2 className={item.type === 'VESHARE' ? 'disabled' : ''} to={item.type === 'VESHARE' ? "/vest" : "/vest/manger?id=" + item.index}>Manage</TokenActionBtn2>
                      <TokenActionBtn1 onClick={() => {
                        setClaimRewardId(item)
                        setModalOpen(true)
                      }}>{t('Claim')}</TokenActionBtn1>
                      <TokenActionBtn1 disabled={parseInt(Date.now() / 1000 + '') < Number(item.lockEnds) || disabled || item.type === 'VESHARE'} onClick={() => {
                        // console.log(rewardList)
                        // console.log(item)
                        const rewardCount = useVeMultiToken?.decimals && rewardList?.[item.id]?.totalReward? BigAmount.format(useVeMultiToken.decimals, rewardList[item.id].totalReward).toExact() : ''
                        if (rewardCount && Number(rewardCount) >= 0.001) {
                          console.log(rewardCount)
                          alert('Please claim the reward first')
                        } else if (
                          !rewardList
                          || !rewardList[item.id]
                          || parseInt(Date.now() / 1000 + '') < Number(item.lockEnds)
                        ) {
                          alert('Loading')
                        } else {
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