import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Token } from 'anyswap-sdk'
// import { NavLink } from 'react-router-dom'
import styled from "styled-components"
import { useTranslation } from 'react-i18next'
import moment from 'moment';

import { useActiveWeb3React } from '../../hooks'
import { useVeMULTIContract, useVeMULTIRewardContract } from '../../hooks/useContract'

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

import {veMULTI,MULTI_TOKEN,REWARD} from './data'

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
  const [nfts, setNfts] = useState<any>()
  const [loadingStatus, setLoadingStatus] = useState<any>(0)
  const [rewradNumber, setRewradNumber] = useState<any>()
  const [epoch, setEpoch] = useState<any>()

  const useVeMultiToken = useMemo(() => {
    if (chainId && veMULTI[chainId]) return veMULTI[chainId]
    return undefined
  }, [chainId, account])
  
  const useVeMultiRewardToken = useMemo(() => {
    if (chainId && REWARD[chainId]) return REWARD[chainId]
    return undefined
  }, [chainId, account])

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
    nfts?.id,
    epoch && epoch[0] ? epoch[0] : undefined,
    epoch && epoch[1] ? epoch[1] : undefined,
  )
  // const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, useVeMultiToken)
  const getPendingReward = useCallback((nfts) => {
    if (rewardContract && nfts?.id) {
      setNfts(nfts)
      setModalOpen(true)
      console.log(nfts.id)
      rewardContract.pendingReward(nfts.id).then((res:any) => {
        console.log(res)
        setLoadingStatus(1)
        setRewradNumber(res)
        setEpoch(res)
      }).catch((err:any) => {
        console.log('err')
        console.log(err)
        setLoadingStatus(2)
      })
    }
  }, [rewardContract])

  const getVestNFTs = useCallback(async() => {
    console.log(useVeMultiToken)
    if (
      contract
      && account
    ) {
      console.log(contract)
      console.log(account)
      const nftsLength = await contract.balanceOf(account)
      console.log(nftsLength)
      const arr = Array.from({length: parseInt(nftsLength)}, (v, i) => i)
      console.log(nftsLength)
      console.log(arr)
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

  // const getAPR = useCallback(async() => {
  //   if (
  //     rewardContract
  //   ) {
  //     const EpochId = await rewardContract.getCurrentEpochId()
  //     const EpochInfo = await rewardContract.getEpochInfo(EpochId.toString())
  //     const TotalPower = await rewardContract.getTotalPower(EpochId.toString())
  //     const apr = EpochInfo?.totalReward * 4 / (endTime - startTime) / TotalPower
  //   }
  // }, [rewardContract])

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
      return (
        <>
          <RewardView>{rewradNumber}</RewardView>
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
        {nfts?.id}
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
                        
                        getPendingReward(item)
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