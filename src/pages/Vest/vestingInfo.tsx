import React, { useMemo } from 'react';
import moment from 'moment';
// import { formatCurrency } from '../../utils';
import styled from 'styled-components';

import {BASE_INFO, VENFT_BASE_INFO} from './data'

import {thousandBit} from '../../utils/tools/tools'

const VestingInfoBox = styled.div``

const TypographyTitle = styled.div`
  color: ${({ theme }) => theme.textColorBold};
  font-size: 12px !important;
  padding: 3px 0 !important;
`
const TypographyContent = styled.div`
${({ theme }) => theme.flexBC};
border-bottom: 1px solid ${({ theme }) => theme.selectedBorder};
padding-bottom: 10px;
margin-bottom:10px;
`

const TypographyLabel = styled.div`
  font-size: 20px !important;
  color: ${({ theme }) => theme.textColorBold};
`
const Typography = styled.div`
margin:0;
color: ${({ theme }) => theme.textColor};
font-size: 12px !important;
font-style: italic;
padding: 3px 0 !important;
`

function formatCurrency (value:any) {
  return value ? thousandBit(value, 2) : 0
}

export default function VestingInfo({
  currentNFT,
  futureNFT,
  veToken,
  govToken,
  showVestingStructure
}: {
  currentNFT?:any
  futureNFT?:any
  veToken?:any
  govToken?:any
  showVestingStructure?:any
}) {

  const govSymbol = useMemo(() => {
    if (govToken?.symbol) {
      return govToken?.symbol
    }
    return BASE_INFO.symbol
  }, [govToken?.symbol, BASE_INFO.symbol])

  const veSymbol = useMemo(() => {
    if (veToken?.symbol) {
      return veToken?.symbol
    }
    return VENFT_BASE_INFO.symbol
  }, [veToken?.symbol, VENFT_BASE_INFO.symbol])
  return (
    <VestingInfoBox>
      { currentNFT &&
        <>
          <TypographyTitle>Your current voting power is:</TypographyTitle>
          <TypographyContent>
            <TypographyLabel>{ formatCurrency(currentNFT?.lockValue) } { veSymbol}</TypographyLabel>
            <div>
              <Typography color='textSecondary'>{ formatCurrency(currentNFT.lockAmount) } { govSymbol } locked expires { moment.unix(currentNFT?.lockEnds).fromNow() } </Typography>
              <Typography color='textSecondary'>Locked until { moment.unix(currentNFT?.lockEnds).format('YYYY / MM / DD') }</Typography>
            </div>
          </TypographyContent>
        </>
      }
      {
        futureNFT &&
        <>
          <TypographyTitle>Your voting power will be:</TypographyTitle>
          <TypographyContent>
            <TypographyLabel>{ formatCurrency(futureNFT?.lockValue) } { veSymbol}</TypographyLabel>
            <div>
              <Typography>{ formatCurrency(futureNFT.lockAmount) } { govSymbol } locked expires { moment.unix(futureNFT?.lockEnds).fromNow() } </Typography>
              <Typography>Locked until { moment.unix(futureNFT?.lockEnds).format('YYYY / MM / DD') }</Typography>
            </div>
          </TypographyContent>
        </>
      }
      {
        showVestingStructure &&
        <div>
          <Typography>1 { govSymbol } locked for 4 years = 1.00 { veSymbol }</Typography>
          <Typography>1 { govSymbol } locked for 3 years = 0.75 { veSymbol }</Typography>
          <Typography>1 { govSymbol } locked for 2 years = 0.50 { veSymbol }</Typography>
          <Typography>1 { govSymbol } locked for 1 years = 0.25 { veSymbol }</Typography>
        </div>
      }
    </VestingInfoBox>
  )
}
