import React, { useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import axios from "axios"
import { transparentize } from 'polished'

import {getParams} from '../../config/tools/getUrlParams'

import config from '../../config'
import {getStatus, Status} from '../../config/status'

import HistoryDetails from "../../components/Transaction/details"

const HistoryBox = styled.div`
  background-color: ${({ theme }) => theme.contentBg};
  box-shadow: 0 0.25rem 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
  padding: 20px 20px 20px;
  width: 100%;
  max-width: 600px;
  margin: auto;
  border-radius: 20px;
`

function getSymbol (pairid:any) {
  if (pairid === 'any') {
    return pairid.toUpperCase()
  }
  const symbol = pairid ? pairid.replace(/v[0-9]+$/, '').replace('any', '').toUpperCase() : ''
  return symbol
}

export default function HistoryDetailsView () {
  const hash = getParams('hash')
  const [tx, setTx] = useState<any>({})

  useEffect(() => {
    if (hash) {
      const url = `${config.bridgeApi}/v2/history/details?params=${hash}`
      axios.get(url).then(res => {
        const {data, status} = res
        if (status === 200 && data.msg === 'Success') {
          setTx(data.info)
        } else {
          setTx({})
        }
      }).catch(() => {
        setTx({})
      })
    } else {
      setTx({})
    }
  }, [hash])
  // console.log(tx)
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
  return (
    <>
      <HistoryBox>
        <HistoryDetails
          symbol={getSymbol(tx?.pairid)}
          from={tx?.from}
          to={tx?.bind}
          fromChainID={tx.fromChainID}
          toChainID={tx.toChainID}
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
      </HistoryBox>
    </>
  )
}