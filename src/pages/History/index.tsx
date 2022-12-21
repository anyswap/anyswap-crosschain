import React, { useEffect, useState, useMemo, useCallback } from "react"
import axios from "axios"
import styled from "styled-components"
import { useTranslation } from 'react-i18next'
// import { NavLink } from 'react-router-dom'

import {useActiveReact} from '../../hooks/useActiveReact'

import {shortenAddress1} from '../../utils'
import {timesFun, thousandBit} from '../../utils/tools/tools'

import HistoryDetails from "../../components/Transaction/details"
import ModalContent from '../../components/Modal/ModalContent'

import config from '../../config'
// import {getStatus} from '../../config/status'
import {getStatus, Status} from '../../config/status'

import AppBody from "../AppBody"

import {getSymbol, getFromChainId, getToChainId} from './hooks'

const HistoryBox = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.contentBg};
  padding: 20px 0;
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
      padding: 2px 0px;
      color: ${({ theme }) => theme.textColorBold};
    }
    td {
      border-bottom: 1px solid ${({ theme }) => theme.tableBorder};
      padding: 8px 0px;
      font-size: 14px;
      color: ${({ theme }) => theme.textColorBold};
      .p {
        margin: 5px 0;
        font-size: 12px;
      }
      .a {
        color: ${({theme}) => theme.primary4};
      }
    }
    th:first-child, th:last-child,td:first-child, td:last-child {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
`

// const Link2 = styled(NavLink)``
const Link = styled.div`
  cursor:pointer;
`

export default function History () {
  const {account} = useActiveReact()
  const { t } = useTranslation()
  const [tx, setTx] = useState<any>({})
  const [openModal, setOpenModal] = useState(false)

  const [historyList, setHistoryList] = useState<any>([])

  useEffect(() => {
    if (account) {
      const url = `${config.scanApi}/v3/account/txns/${account}?offset=0&limit=50`
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

  const fromStatus = useMemo(() => {
    if (tx?.status === -1) {
      return Status.Pending
    } else if (tx?.status === -2) {
      return Status.Failure
    } else if (tx?.status >= 0) {
      return Status.Success
    } else {
      return Status.Pending
    }
  }, [tx])
  const toStatus = useMemo(() => {
    if (tx) {
      const statusType = getStatus(tx?.status)
      return statusType
    } else {
      return null
    }
  }, [tx])

  const onChangeViewDtil = useCallback((txData) => {
    if (txData) {
      setOpenModal(true)
      setTx(txData)
    } else {
      setOpenModal(false)
      setTx('')
    }
  }, [])

  return (
    <>
      <ModalContent
        isOpen={openModal}
        title={'Transaction Details'}
        onDismiss={() => {
          onChangeViewDtil('')
        }}
        padding={'0rem'}
      >
        <HistoryDetails
          symbol={getSymbol(tx?.pairid)}
          from={tx?.from}
          to={tx?.bind}
          fromChainID={getFromChainId(tx)}
          toChainID={getToChainId(tx)}
          fromStatus={fromStatus}
          toStatus={toStatus}
          txid={tx?.txid}
          swaptx={tx?.swaptx}
          swapvalue={tx?.formatswapvalue}
          timestamp={tx?.timestamp}
          value={tx?.formatvalue}
          avgTime={tx?.time}
          txData={tx}
        />
      </ModalContent>
      <AppBody>
        <HistoryBox>
          <DBTables>
            <thead>
              <tr>
                <th align="left">{t('Coins')}</th>
                <th align="left">{t('Value')}</th>
                <th align="left">{t('From')}</th>
                <th align="left">{t('Receives')}</th>
                <th align="left">{t('Date')}</th>
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
                      {/* <Link2 className="p a" to={`/history/details?hash=${item.txid}`}>{shortenAddress1(item.txid)}</Link2> */}
                      <Link className="p a" onClick={() => onChangeViewDtil(item)}>{shortenAddress1(item.txid)}</Link>
                    </td>
                    <td align="left">
                      <p className="p">{config.getCurChainInfo(getToChainId(item)).networkName}</p>
                      {/* <Link2 className="p a" to={`/history/details?hash=${item.txid}`}>{shortenAddress1(item.swaptx)}</Link2> */}
                      <Link className="p a" onClick={() => onChangeViewDtil(item)}>{shortenAddress1(item.swaptx)}</Link>
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
        </HistoryBox>
      </AppBody>
    </>
  )
}