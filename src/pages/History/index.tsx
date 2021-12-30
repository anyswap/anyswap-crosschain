import React, { useEffect, useState } from "react"
import axios from "axios"
import styled from "styled-components"
import { useTranslation } from 'react-i18next'

import {useActiveReact} from '../../hooks/useActiveReact'

import config from '../../config'

import AppBody from "../AppBody"

import {getSymbol} from './hooks'

const HistoryBox = styled.div`
  width: 100%;
  .item {
    width: 100%;
  }
`

export const DBTables = styled.table`
  min-width: 100%;
  table-layer: fixed;
  border-spacing:0px 10px;
`

export default function History () {
  const {account} = useActiveReact()
  const { t } = useTranslation()

  const [historyList, setHistoryList] = useState<any>([])

  useEffect(() => {
    if (account) {
      const url = `${config.bridgeApi}/v2/all/history/${account}/all/all/all?offset=0&limit=50&status=8,9,10`
      axios.get(url).then(res => {
        const {data, status} = res
        console.log(data)
        console.log(status)
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
                <th>{t('Coins')}</th>
                <th>{t('Amount')}</th>
              </tr>
            </thead>
            <tbody>
              {historyList.length > 0 ? historyList.map((item:any, index:any) => {
                return (
                  <tr key={index} className="item">
                    <td>
                      {getSymbol(item.pairid)}
                    </td>
                    <td>
                      <p>Sent: {item.formatvalue}</p>
                      <p>Received: {item.formatswapvalue}</p>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={2}></td>
                </tr>
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