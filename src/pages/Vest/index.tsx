import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Token } from 'anyswap-sdk'
// import { NavLink } from 'react-router-dom'
import styled from "styled-components"
import { useTranslation } from 'react-i18next'
import moment from 'moment';

import { useActiveWeb3React } from '../../hooks'
import { useVeMULTIContract } from '../../hooks/useContract'

import {BigAmount} from '../../utils/formatBignumber'
// import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'

import TokenLogo from '../../components/TokenLogo'
// import { ButtonLight } from '../../components/Button'


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
  // Flex,
  // ChainCardList
} from '../Dashboard/styleds'

import {veMULTI,MULTI_TOKEN} from './data'

const VestContent = styled.div`
  width: 100%;
  max-width: 1200px;
`

const CreateLock = styled(TokenActionBtn)`
  // color: rgb(6, 211, 215);
  // width: 100%;
  // background: rgb(23, 52, 72);
  // font-weight: 700;
  margin-bottom:10px;
  &.disabled {
    opacity: 0.2;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 28px;
    margin-bottom: 10px;
  `}
`

const TokenActionBtn2 = styled(TokenActionBtn)`
  &.disabled {
    opacity: 0.2;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 28px;
    margin-bottom: 10px;
  `}
`

export default function Vest () {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()

  const [vestNFTs, setvestNFTs] = useState<any>()

  const useVeMultiToken = useMemo(() => {
    if (chainId && veMULTI[chainId]) return veMULTI[chainId]
    return undefined
  }, [chainId, account])
  const useLockToken = useMemo(() => {
    if (chainId && MULTI_TOKEN[chainId]) {
      return MULTI_TOKEN[chainId]
    }
    return undefined
  }, [chainId])

  const contract = useVeMULTIContract(useVeMultiToken?.address)
  // const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, useVeMultiToken)

  const getVestNFTs = useCallback(async() => {
    // console.log(useVeMultiToken)
    if (
      contract
      && account
    ) {
      const nftsLength = await contract.balanceOf(account)
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

  return (
    <AppBody>
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
                    <TokenActionBtn2 to={"/vest/manger?id=" + item.index}>Manger</TokenActionBtn2>  
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