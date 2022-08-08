import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Token } from 'anyswap-sdk'
// import { NavLink } from 'react-router-dom'
import styled from "styled-components"
import { useTranslation } from 'react-i18next'
import moment from 'moment';

import { useActiveWeb3React } from '../../hooks'
import { 
  useVeMULTIContract,
  // useVeMULTIRewardContract,
  useVeShareContract
  // useTokenContract,
  // useMulticallContract
} from '../../hooks/useContract'
import useInterval from '../../hooks/useInterval'
// import { useUserSelectChainId } from '../../state/user/hooks'

import {BigAmount} from '../../utils/formatBignumber'
// import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'

import TokenLogo from '../../components/TokenLogo'
import { ButtonLight } from '../../components/Button'
// import Modal from "../../components/Modal";
import ModalContent from "../../components/Modal/ModalContent";
// import QuestionHelper from '../../components/QuestionHelper'

import {
  BottomGrouping
} from '../../components/swap/styleds'
import { ButtonPrimary } from '../../components/Button'

// import {getLabelPrice} from '../../utils/tools/getPrice'

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
  // TokenActionBtn,
  Flex,
  // ChainCardList
} from '../Dashboard/styleds'

import {veMULTI,MULTI_TOKEN,REWARD,REWARD_TOKEN, VESHARE} from './data'

import {
  useClaimVeshareRewardCallback,
  // useWithdrawCallback
} from './hooks'
import axios from "axios";
import {thousandBit} from '../../utils/tools/tools'


// import config from '../../config'
// import {selectNetwork} from '../../config/tools/methods'

// import {VE_MULTI_REWARD_INTERFACE} from '../../constants/abis/veMULTIReward'

// const VestContent = styled.div`
// ${({ theme }) => theme.flexSC};
//   width: 100%;
//   max-width: 1200px;
// `

// const CreateLock = styled(TokenActionBtn)`
//   background:${({ theme }) => theme.primary1};
//   color:#fff;
//   margin-bottom:10px;
//   &.disabled {
//     opacity: 0.2;
//   }
//   &:hover,
//   &:focus,
//   &:active {
//     background: ${({ theme }) => theme.primary1};
//     opacity: 0.99
//   }
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     height: 28px;
//     margin-bottom: 10px;
//   `}
// `

// const CreateLock1 = styled(ButtonLight)`
//   width: auto;
//   height: 38px;
//   border-radius: 0.5625rem;
//   background: ${({ theme }) => theme.primary1};
//   margin: 0 5px 10px;
//   font-size:0.75rem;
//   color:#fff;
//   &.disabled {
//     opacity: 0.2;
//   }
//   &:hover,
//   &:focus,
//   &:active {
//     background: ${({ theme }) => theme.primary1};
//     opacity: 0.99
//   }
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     height: 28px;
//     margin-bottom: 10px;
//   `}
// `

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

// const TokenActionBtn2 = styled(TokenActionBtn)`
//   min-width: auto!important;
//   max-width: auto!important;
//   width: auto;
//   height: 38px;
//   padding: 0 15px;
//   &.disabled {
//     opacity: 0.2;
//   }
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     height: 28px;
//     margin-bottom: 10px;
//   `}
// `

const RewardView = styled.div`
  width:100%;
  ${({ theme }) => theme.flexC};
  padding: 30px 0;
`

// const RewardLoading = styled.div`
//   ${({ theme }) => theme.flexC};
//   width: 100%;
//   padding: 50px 0;
//   color: ${({ theme }) => theme.textColorBold};
// `

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


export default function Vest () {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  // const {setUserSelectNetwork} = useUserSelectChainId()

  const [vestNFTs, setvestNFTs] = useState<any>()
  const [modalOpen, setModalOpen] = useState(false)
  const [claimRewardId, setClaimRewardId] = useState<any>()
  // const [loadingStatus, setLoadingStatus] = useState<any>(0)

  // const [curEpochInfo, setCurEpochInfo] = useState<any>()
  // const [totalPower, setTotalPower] = useState<any>()
  // const [epochId, setEpochId] = useState<any>()
  // const [rewardList, setRewardList] = useState<any>()
  // const [latestEpochInfo, setlatestEpochInfo] = useState<any>()
  // const [price, setPrice] = useState<any>(12)
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
  const useVeshareToken = useMemo(() => {
    if (chainId && VESHARE[chainId]) return VESHARE[chainId]
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
  const veshareMultiContract = useVeMULTIContract(useVeMultiToken?.address)
  // const rewardContract = useVeMULTIRewardContract(useVeMultiRewardToken?.address)
  const veshareContract = useVeShareContract(useVeshareToken?.address)
  // const ercContract = useTokenContract(useLockToken?.address)
  // const multicallContract = useMulticallContract()


  const {execute: onWrap} = useClaimVeshareRewardCallback(
    useVeMultiRewardToken?.address,
    claimRewardId,
  )

  const getVestNFTs = useCallback(async() => {
    if (
      veshareMultiContract
      && account
      && useLockToken
      && veshareContract
    ) {
      let nftsLength:any = ''
      try {
        // console.log(nftsLength)
        nftsLength = await veshareMultiContract.balanceOf(account)
        // console.log(nftsLength)
      } catch (error) {
        console.log(error)
      }
      
      const arr = Array.from({length: parseInt(nftsLength)}, (v, i) => i)
      // console.log(nftsLength)
      // console.log(arr)
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
        setvestNFTs(nfts)
      } catch (error) {
        console.log(error)
      }
      
    }
  }, [veshareMultiContract, account, useLockToken, veshareContract, useRewardToken])
  useEffect(() => {
    getVestNFTs()
  }, [veshareMultiContract, account, useLockToken, veshareContract, useRewardToken])
  useInterval(getVestNFTs, 1000 * 10)

  function ClaimView () {
    const totalReward = claimRewardId?.reward && useRewardToken ? thousandBit(claimRewardId?.reward,2) : ''
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
        {ClaimView()}
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

      <MyBalanceBox>
        <DBTables>
          <DBThead>
            <tr>
              <DBTh className="l">{t('NFT ID')}</DBTh>
              <DBTh className="l">{t('Vest Amount')}</DBTh>
              {/* <DBTh className="l">{t('Vest Value')}</DBTh> */}
              <DBTh className="c">{t('Vest Start')}</DBTh>
              <DBTh className="c">{t('Vest Expires')}</DBTh>
              {/* <DBTh className="c">{t('APR')}</DBTh> */}
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
                        <img src={item?.image} />
                      </TokenTableLogo>
                      <TokenNameBox>
                        <h3>{item.id}</h3>
                      </TokenNameBox>
                    </TokenTableCoinBox>
                  </DBTd>
                  <DBTd className="l">{thousandBit(item.share, 2)}</DBTd>
                  {/* <DBTd className="l">{thousandBit(item.lockValue, 2)}</DBTd> */}
                  <DBTd className="c">{moment.unix(item.lockStart).format('YYYY-MM-DD')}</DBTd>
                  <DBTd className="c">{moment.unix(item.lockEnds).format('YYYY-MM-DD')}</DBTd>
                  {/* <DBTd className="l">{getUserAPR(item.lockValue, item.lockAmount)}</DBTd> */}
                  <DBTd className="c" width={'120px'}>
                    <Flex>
                      <TokenActionBtn1 onClick={() => {
                        setClaimRewardId(item)
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