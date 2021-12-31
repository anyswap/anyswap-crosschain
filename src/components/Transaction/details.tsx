import React, { useEffect } from "react"
import styled from "styled-components"
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle } from 'react-feather'
import Loader from '../Loader'
import Copy from '../AccountDetails/Copy'

import { getEtherscanLink } from '../../utils'
import {useWeb3} from '../../utils/tools/web3UtilsV2'
// import {timeChange} from '../../utils/tools/tools'

import {useUpdateUnderlyingStatus} from '../../state/transactions/hooks'

import { ExternalLink } from '../../theme'

import {Status} from '../../config/status'
import config from '../../config'

import ScheduleIcon from '../../assets/images/icon/schedule.svg'

const HistoryDetailsBox = styled.div`
  width: 100%;
  padding: 0 20px 20px;
  .item {
    width: 100%;
    font-size: 14px;
    border-bottom: 1px solid ${({theme}) => theme.selectedBg};
    padding: 10px 15px 5px;
    &:last-child {
      border-bottom: none;
    }
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

const ChainStatusBox = styled.div`
  ${({ theme }) => theme.flexBC};
  width: 100%;
  font-size:12px;
  color: ${({ theme }) => theme.textColorBold};
  // color: #031a6e;
  font-weight:bold;
  padding: 12px 15px;
  border-radius:9px;
  margin-top:15px;
  .name {
    ${({ theme }) => theme.flexSC};
  }
  .status {
    ${({ theme }) => theme.flexEC};
  }
  &.yellow,&.Confirming,&.Crosschaining {
    border: 1px solid ${({ theme }) => theme.birdgeStateBorder};
    background: ${({ theme }) => theme.birdgeStateBg};
  }
  &.green,&.Success, &.Pending{
    border: 1px solid ${({ theme }) => theme.birdgeStateBorder1};
    background: ${({ theme }) => theme.birdgeStateBg1};
  }
  &.red,&.Failure, &.Timeout, &.BigAmount{
    border: 1px solid ${({ theme }) => theme.birdgeStateBorder2};
    background: ${({ theme }) => theme.birdgeStateBg2};
  }
`

const Link = styled(ExternalLink)``
const Link2 = styled(NavLink)`
  text-align:right;
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
  version,
  token,
  underlying,
  isReceiveAnyToken
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
  underlying?: any,
  isReceiveAnyToken?: any,
}) {
  const { t } = useTranslation()
  const {setUnderlyingStatus} = useUpdateUnderlyingStatus()
  useEffect(() => {
    if (underlying && swaptx && !isReceiveAnyToken) {
      useWeb3(toChainID, 'eth', 'getTransactionReceipt', [swaptx]).then((res:any) => {
        if (res && res.logs && res.logs.length === 1 && setUnderlyingStatus) {
          setUnderlyingStatus(fromChainID, txid, true)
        }
      })
    }
  }, [underlying, swaptx, toChainID])
  return (
    <>
      <HistoryDetailsBox>
        <div className="item">
          <div className="label">{config.getCurChainInfo(fromChainID)?.name} Hash</div>
          <div className="value">
            <Link className="a" href={getEtherscanLink(fromChainID, txid, 'transaction')} target="_blank">{txid}</Link>
            <Copy toCopy={txid}></Copy>
          </div>
        </div>
        <div className="item">
          <div className="label">{config.getCurChainInfo(toChainID)?.name} Hash</div>
          <div className="value">
            {swaptx ? (
              <>
                <Link className="a" href={getEtherscanLink(toChainID, swaptx, 'transaction')} target="_blank">{swaptx}</Link>
                <Copy toCopy={swaptx}></Copy>
              </>
            ) : '-'}
          </div>
        </div>
        <div className="item">
          <div className="label">{t('From')}</div>
          <div className="value">
            <Link className="a" href={getEtherscanLink(fromChainID, from, 'address')} target="_blank">{from}</Link>
            <Copy toCopy={from}></Copy>
          </div>
        </div>
        <div className="item">
          <div className="label">{t('Receive')}</div>
          <div className="value">
            {to ? (
              <>
                <Link className="value a" href={getEtherscanLink(toChainID, to, 'address')} target="_blank">{to}</Link>
                <Copy toCopy={to}></Copy>
              </>
            ) : '-'}
          </div>
        </div>
        
        <div className="item">
          <div className="label">Send Value</div>
          <div className="value">{value + ' ' + symbol}</div>
        </div>
        <div className="item">
          <div className="label">Receive Value</div>
          <div className="value bc">
            {swapvalue ? swapvalue + ' ' + symbol : '-'}
            {
              fromStatus === Status.Success && toStatus === Status.Success && !['swapin', 'swapout'].includes(version) && token && isReceiveAnyToken ? (
                <>
                  <Link2 className="a" to={`/pool/add?bridgetoken=${token}&bridgetype=withdraw`}>Remove the liquidity -&gt;</Link2>
                </>
              ) : ''
            }
          </div>
        </div>
        {/* <div className="item">
          <div className="label">{config.getCurChainInfo(fromChainID)?.name} Status</div>
          <div className={fromStatus + " value"}>{fromStatus}</div>
        </div>
        <div className="item">
          <div className="label">{config.getCurChainInfo(toChainID)?.name} Status</div>
          <div className={toStatus + " value"}>{toStatus ? toStatus : <Loader stroke="#5f6bfb" />}</div>
        </div> */}

        <ChainStatusBox className={fromStatus}>
          <div className="name">
            {
              fromStatus === Status.Success? (
                <CheckCircle size="16" style={{marginRight: '10px'}} />
              ) : <img src={ScheduleIcon} alt='' style={{marginRight: '10px'}}/>
            }
            {config.getCurChainInfo(fromChainID)?.name + ' Status'}
          </div>
          <span className="status">{fromStatus === Status.Pending ? (<><span style={{marginRight:'5px'}}>{fromStatus}</span> <Loader stroke="#5f6bfb" /></>) : fromStatus}</span>
        </ChainStatusBox>
        <ChainStatusBox className={toStatus ? toStatus : Status.Pending}>
          <div className="name">
            {
              toStatus === Status.Success? (
                <CheckCircle size="16" style={{marginRight: '10px'}} />
              ) : <img src={ScheduleIcon} alt='' style={{marginRight: '10px'}}/>
            }
            {config.getCurChainInfo(toChainID)?.name + ' Status'}
          </div>
          <span className="status">{toStatus ? toStatus : (<><span style={{marginRight:'5px'}}>{Status.Pending}</span> <Loader stroke="#5f6bfb" /></>)}</span>
        </ChainStatusBox>
        
        {
          fromStatus === Status.Success && !toStatus && (Date.now() - (timestamp.length <= 10 ? (Number(timestamp) * 1000) : Number(timestamp)) > (1000 * 60 * 30)) ? (
            <div className="item">
              <div className="tips">
                <Link className="a" href={`${config.explorer}?tabparams=tools&fromChainID=${fromChainID}&toChainID=${toChainID}&symbol=${symbol}&hash=${txid}`} target="_blank">Go to Explorer submit hash -&gt;</Link>
              </div>
            </div>
          ) : ''
        }
        {/* {
          fromStatus === Status.Success && toStatus === Status.Success && !['swapin', 'swapout'].includes(version) && token && isReceiveAnyToken ? (
            <div className="item">
              <div className="tips">
                <Link2 className="a" to={`/pool/add?bridgetoken=${token}&bridgetype=withdraw`}>Received? To remove the liquidity</Link2>
              </div>
            </div>
          ) : ''
        } */}
      </HistoryDetailsBox>
    </>
  )
}