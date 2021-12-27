import React, { useMemo } from "react"
// import styled from "styled-components"
import { useActiveReact } from '../../hooks/useActiveReact'
import { useAllTransactions } from '../../state/transactions/hooks'
import {getParams} from '../../config/tools/getUrlParams'
import AppBody from '../AppBody'

import {Status} from '../../config/status'

import HistoryDetails from "../../components/Transaction/details"

export default function HistoryDetailsView () {
  const allTransactions = useAllTransactions()
  const { chainId } = useActiveReact()
  // console.log(allTransactions)
  const hash = getParams('hash')
  const tx = allTransactions?.[hash]
  // console.log(tx)
  const fromStatus = useMemo(() => {
    if (tx) {
      if (!tx.receipt) {
        return Status.Pending
      } else if (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined') {
        return Status.Success
      } else {
        return Status.Failure
      }
    } else {
      return Status.Null
    }
  }, [tx])
  const toStatus = useMemo(() => {
    if (tx) {
      if (fromStatus === Status.Failure) {
        return Status.Failure
      } else if (!tx.info) {
        return null
      } else if (tx.info?.status) {
        const status = tx.info?.status
        let statusType = ''
        if ([2, 4, 6, 11, 14].includes(status)) {
          statusType = Status.Pending
        } else if ([0, 5, 8].includes(status)) {
          statusType = Status.Confirming
        } else if ([7, 9].includes(status)) {
          statusType = Status.Crosschaining
        } else if ([10].includes(status)) {
          statusType = Status.Success
        } else if ([1, 3, 16].includes(status)) {
          statusType = Status.Failure
        } else if ([20].includes(status)) {
          statusType = Status.Timeout
        } else if ([12].includes(status)) {
          statusType = Status.BigAmount
        }
        return statusType
      } else {
        return Status.Failure
      }
    } else {
      return null
    }
  }, [tx, fromStatus])
  return (
    <>
      <AppBody>
        <HistoryDetails
          symbol={tx?.symbol}
          from={tx?.from}
          to={tx?.toAddress}
          fromChainID={chainId}
          toChainID={tx?.toChainId}
          fromStatus={fromStatus}
          toStatus={toStatus}
          txid={tx?.hash}
          swaptx={fromStatus === Status.Failure || toStatus === Status.Failure ? 'Null' : tx?.info?.swaptx}
          swapvalue={fromStatus === Status.Failure || toStatus === Status.Failure ? 'Null' : tx?.info?.swapvalue}
          timestamp={tx?.addedTime}
          value={tx?.value}
        />
      </AppBody>
    </>
  )
}