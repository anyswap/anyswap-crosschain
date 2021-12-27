import React from "react"
import styled from "styled-components"

import Loader from '../Loader'

import { getEtherscanLink } from '../../utils'
import {timeChange} from '../../utils/tools/tools'

import config from '../../config'

const HistoryDetailsBox = styled.div`
  width: 100%;
  .item {
    width: 100%;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
    padding: 10px 15px 5px;
    .label {
      width: 100%;
      color: ${({theme}) => theme.text2}
    }
    .value {
      ${({theme}) => theme.flexSC};
      width: 100%;
      color: ${({theme}) => theme.textColor};
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      display:block;
      height: 30px;
      line-height: 30px;
    }
    .a {
      color: ${({theme}) => theme.primary4};
      text-decoration: none;
      &:hover,&:focus,&:active{
        border:none;
      }
    }
    .Failure, .Timeout, .BigAmount {
      color: ${({theme}) => theme.red1};
    }
  }
`

export default function HistoryDetails ({
  symbol,
  from,
  to,
  fromChainID,
  toChainID,
  fromStatus,
  toStatus,
  swapvalue,
  timestamp,
  txid,
  swaptx,
  value,
}: {
  symbol?: any,
  from?: any,
  to?: any,
  fromChainID?: any,
  toChainID?: any,
  fromStatus?: any,
  toStatus?: any,
  swapvalue?: any,
  timestamp?: any,
  txid?: any,
  swaptx?: any,
  value?: any,
}) {
  return (
    <>
      <HistoryDetailsBox>
        <div className="item">
          <div className="label">From Hash</div>
          <a className="value a" href={getEtherscanLink(fromChainID, txid, 'transaction')} target="__blank">{txid}</a>
        </div>
        <div className="item">
          <div className="label">To Hash</div>
          {swaptx ? <a className="value a" href={getEtherscanLink(toChainID, swaptx, 'transaction')} target="__blank">{swaptx}</a> : <div className="value"><Loader stroke="#5f6bfb" /></div>}
        </div>
        <div className="item">
          <div className="label">From Address</div>
          <a className="value a" href={getEtherscanLink(fromChainID, txid, 'address')} target="__blank">{from}</a>
        </div>
        <div className="item">
          <div className="label">To Address</div>
          {to ? <a className="value a" href={getEtherscanLink(toChainID, txid, 'address')} target="__blank">{to}</a> : <div className="value"><Loader stroke="#5f6bfb" /></div>}
        </div>
        
        <div className="item">
          <div className="label">From Value</div>
          <div className="value">{value + ' ' + symbol}</div>
        </div>
        <div className="item">
          <div className="label">To Value</div>
          <div className="value">{swapvalue ? swapvalue + ' ' + symbol : <Loader stroke="#5f6bfb" />}</div>
        </div>
        <div className="item">
          <div className="label">{config.getCurChainInfo(fromChainID)?.name} Status</div>
          <div className={fromStatus + " value"}>{fromStatus}</div>
        </div>
        <div className="item">
          <div className="label">{config.getCurChainInfo(toChainID)?.name} Status</div>
          <div className={toStatus + " value"}>{toStatus ? toStatus : <Loader stroke="#5f6bfb" />}</div>
        </div>
        <div className="item">
          <div className="label">Date</div>
          <div className="value">{timeChange(timestamp, 'yyyy-mm-dd hh:mm')}</div>
        </div>
      </HistoryDetailsBox>
    </>
  )
}