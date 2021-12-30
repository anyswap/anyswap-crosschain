import React, { useEffect, useState } from "react"
import axios from "axios"
import styled from "styled-components"
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import {useActiveReact} from '../../hooks/useActiveReact'

import {shortenAddress1} from '../../utils'
import {timesFun, thousandBit} from '../../utils/tools/tools'

import config from '../../config'
import {getStatus} from '../../config/status'

import AppBody from "../AppBody"

import {getSymbol, getFromChainId, getToChainId} from './hooks'

const HistoryBox = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.contentBg};
  padding: 20px;
  border-radius: 20px;
  .item {
    width: 100%;
  }
`

export const DBTables = styled.table`
  min-width: 100%;
  table-layer: fixed;
  border-spacing:0px 0px;
  thead {
    border-bottom: 1px solid #ddd;
  }
  tr {
    th {
      padding: 8px 0px;
      color: ${({ theme }) => theme.textColorBold};
    }
    td {
      border-bottom: 1px solid #ddd;
      padding: 8px 0px;
      font-size: 14px;
      .p {
        margin: 5px 0;
        font-size: 12px;
        color: ${({ theme }) => theme.textColorBold};
      }
      .a {
        color: ${({theme}) => theme.primary4};
      }
    }
  }
`

const Link2 = styled(NavLink)``

export default function History () {
  const {account} = useActiveReact()
  const { t } = useTranslation()

  const [historyList, setHistoryList] = useState<any>([])

  useEffect(() => {
    if (account) {
      const url = `${config.bridgeApi}/v2/all/history/${account}/all/all/all?offset=0&limit=50&status=8,9,10`
      axios.get(url).then(res => {
        const {data, status} = res
        // console.log(data)
        // console.log(status)
        if (status === 200 && data.msg === 'Success') {
          setHistoryList(data.info)
        } else {
          setHistoryList([])
        }
      }).catch(() => {
        setHistoryList([])
      })
    } else {
      setHistoryList([])
    }
  }, [account])
  return (
    <>
      <AppBody>
        <HistoryBox>
          <DBTables>
            <thead>
              <tr>
                <th align="left">{t('Coins')}</th>
                <th align="left">{t('Amount')}</th>
                <th align="left">{t('send')}</th>
                <th align="left">{t('Receive')}</th>
                <th align="left">{t('Age')}</th>
                <th align="right">{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={6}></td></tr>
              {historyList.length > 0 ? historyList.map((item:any, index:any) => {
                return (
                  <tr key={index} className="item">
                    <td align="left">
                      {getSymbol(item.pairid)}
                    </td>
                    <td align="left">
                      <p className="p">Sent: {thousandBit(item.formatvalue, 2)}</p>
                      <p className="p">Received: {thousandBit(item.formatswapvalue, 2)}</p>
                    </td>
                    <td align="left">
                      <p className="p">{config.getCurChainInfo(getFromChainId(item)).networkName}</p>
                      <Link2 className="p a" to={`/history/details?hash=${item.txid}`}>{shortenAddress1(item.txid)}</Link2>
                    </td>
                    <td align="left">
                      <p className="p">{config.getCurChainInfo(getToChainId(item)).networkName}</p>
                      <Link2 className="p a" to={`/history/details?hash=${item.txid}`}>{shortenAddress1(item.swaptx)}</Link2>
                    </td>
                    <td align="left">
                      {timesFun(item.timestamp)}
                    </td>
                    <td align="right">
                      {getStatus(item.status)}
                    </td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={6} align="center">Null</td></tr>
              )}
            </tbody>
          </DBTables>
          {/* {historyList.length > 0 ? historyList.map((item, index) => {
            return (
              <div key={index} className="item">

              </div>
            )
          }) : ''} */}
        </HistoryBox>
      </AppBody>
    </>
  )
}