import React from "react"
import styled from "styled-components"
import { NavLink } from 'react-router-dom'
import Loader from '../Loader'
import Copy from '../AccountDetails/Copy'

import { getEtherscanLink } from '../../utils'
import {timeChange} from '../../utils/tools/tools'

import { ExternalLink } from '../../theme'

import {Status} from '../../config/status'
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
      ${({theme}) => theme.flexBC};
      width: 100%;
      color: ${({theme}) => theme.textColor};
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      height: 21px;
      line-height: 21px;
    }
    .a {
      width: 80%;
      color: ${({theme}) => theme.primary4};
      text-decoration: none;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      display:block;
      &:hover,&:focus,&:active,&:focus-visible{
        border:none;
        background: none;
      }
    }
    .Failure, .Timeout, .BigAmount {
      color: ${({theme}) => theme.red1};
    }
    .Success, .Pending {
      color: ${({theme}) => theme.green1};
    }
    .tips {
      font-size: 14px;
      height: 21px;
      line-height: 21px;
      text-align:center;
      .a {
        width: 100%;
      }
    }
  }
`

const Link = styled(ExternalLink)``
const Link2 = styled(NavLink)``

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
  version,
  token,
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
  version?: any,
  token?: any,
}) {
  return (
    <>
      <HistoryDetailsBox>
        <div className="item">
          <div className="label">From Hash</div>
          <div className="value">
            <Link className="a" href={getEtherscanLink(fromChainID, txid, 'transaction')} target="_blank">{txid}</Link>
            <Copy toCopy={txid}></Copy>
          </div>
        </div>
        <div className="item">
          <div className="label">To Hash</div>
          <div className="value">
            {swaptx ? (
              <>
                <Link className="a" href={getEtherscanLink(toChainID, swaptx, 'transaction')} target="_blank">{swaptx}</Link>
                <Copy toCopy={swaptx}></Copy>
              </>
            ) : <Loader  stroke="#5f6bfb" />}
          </div>
        </div>
        <div className="item">
          <div className="label">From Address</div>
          <div className="value">
            <Link className="a" href={getEtherscanLink(fromChainID, from, 'address')} target="_blank">{from}</Link>
            <Copy toCopy={from}></Copy>
          </div>
        </div>
        <div className="item">
          <div className="label">To Address</div>
          <div className="value">
            {to ? (
              <>
                <Link className="value a" href={getEtherscanLink(toChainID, to, 'address')} target="_blank">{to}</Link>
                <Copy toCopy={to}></Copy>
              </>
            ) : <Loader stroke="#5f6bfb" />}
          </div>
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
        {
          fromStatus === Status.Success && !toStatus ? (
            <div className="item">
              <div className="tips">
                <Link className="a" href={`${config.explorer}?tabparams=tools&fromChainID=${fromChainID}&toChainID=${toChainID}&symbol=${symbol}&hash=${txid}`} target="_blank">Go to Explorer submit hash -&gt;</Link>
              </div>
            </div>
          ) : ''
        }
        {
          fromStatus === Status.Success && toStatus === Status.Success && !['swapin', 'swapout'].includes(version) && token ? (
            <div className="item">
              <div className="tips">
                <Link2 className="a" to={`/pool/add?bridgetoken=${token}&bridgetype=withdraw`}>Received? To remove the liquidity</Link2>
              </div>
            </div>
          ) : ''
        }
      </HistoryDetailsBox>
    </>
  )
}