import React from 'react';
import moment from 'moment';
// import { formatCurrency } from '../../utils';
import styled from 'styled-components';

const VestingInfoBox = styled.div``

const Typography = styled.div`
margin:0;
color: ${({ theme }) => theme.textColor};
`

function formatCurrency (value:any) {
  return value
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
  return (
    <VestingInfoBox>
      { currentNFT &&
        <>
          <Typography>Your current voting power is:</Typography>
          <div>
            <Typography>{ formatCurrency(currentNFT?.lockValue) } { veToken?.symbol}</Typography>
            <div>
              <Typography color='textSecondary'>{ formatCurrency(currentNFT.lockAmount) } { govToken?.symbol } locked expires { moment.unix(currentNFT?.lockEnds).fromNow() } </Typography>
              <Typography color='textSecondary'>Locked until { moment.unix(currentNFT?.lockEnds).format('YYYY / MM / DD') }</Typography>
            </div>
          </div>
        </>
      }
      {
        futureNFT &&
        <>
          <Typography>Your voting power will be:</Typography>
          <div>
            <Typography>{ formatCurrency(futureNFT?.lockValue) } { veToken?.symbol}</Typography>
            <div>
              <Typography>{ formatCurrency(futureNFT.lockAmount) } { govToken?.symbol } locked expires { moment.unix(futureNFT?.lockEnds).fromNow() } </Typography>
              <Typography>Locked until { moment.unix(futureNFT?.lockEnds).format('YYYY / MM / DD') }</Typography>
            </div>
          </div>
        </>
      }
      {
        showVestingStructure &&
        <div>
          <Typography>1 { govToken?.symbol } locked for 4 years = 1.00 { veToken?.symbol }</Typography>
          <Typography>1 { govToken?.symbol } locked for 3 years = 0.75 { veToken?.symbol }</Typography>
          <Typography>1 { govToken?.symbol } locked for 2 years = 0.50 { veToken?.symbol }</Typography>
          <Typography>1 { govToken?.symbol } locked for 1 years = 0.25 { veToken?.symbol }</Typography>
        </div>
      }
    </VestingInfoBox>
  )
}
