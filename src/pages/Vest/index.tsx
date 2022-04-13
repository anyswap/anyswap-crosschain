import React, { useMemo } from "react";
// import { Token } from 'anyswap-sdk'
import { NavLink } from 'react-router-dom'
import styled from "styled-components"
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'
// import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'

import TokenLogo from '../../components/TokenLogo'


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
  // Flex,
  // ChainCardList
} from '../Dashboard/styleds'

import {veMULTI} from './data'

const VestContent = styled.div`
  width: 100%;
  max-width: 1200px;
`

const CreateLock = styled(NavLink)`
  color: rgb(6, 211, 215);
  width: 100%;
  background: rgb(23, 52, 72);
  font-weight: 700;
`

export default function Vest () {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()

  const useVeMultiToken = useMemo(() => {
    if (chainId && veMULTI[chainId]) return veMULTI[chainId]
    return undefined
  }, [chainId, account])

  // const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, useVeMultiToken)

  return (
    <AppBody>
      <VestContent>
        <CreateLock to={'/vest/create'}>{t('Create Lock')}</CreateLock>
        {useVeMultiToken}
      </VestContent>

      <MyBalanceBox>
        <DBTables>
          <DBThead>
            <tr>
              <DBTh className="l">{t('tokens')}</DBTh>
              <DBTh className="l">{t('Vest Amount')}</DBTh>
              <DBTh className="r">{t('Vest Value')}</DBTh>
              <DBTh className="c">{t('Vest Expires')}</DBTh>
              <DBTh className="c">{t('Action')}</DBTh>
            </tr>
          </DBThead>
          <DBTbody>
            <tr>
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
                    <h3>MULTI</h3>
                    {/* <p>{config.getBaseCoin(item?.name, chainId, 1)}</p> */}
                  </TokenNameBox>
                </TokenTableCoinBox>
              </DBTd>
            </tr>
          </DBTbody>
        </DBTables>
      </MyBalanceBox>
    </AppBody>
  )
}