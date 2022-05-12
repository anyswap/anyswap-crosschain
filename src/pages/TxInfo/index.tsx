// @ts-ignore
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// @ts-ignore
import styled from 'styled-components'
// @ts-ignore
import { useTranslation } from 'react-i18next'
// @ts-ignore
import { useActiveWeb3React } from '../../hooks'
// @ts-ignore
import AppBody from '../AppBody'
import { useAppState } from '../../state/application/hooks'
// @ts-ignore
import { getUrlData, postUrlData} from '../../utils/tools/axios'

export default function TxInfo() {
  const {
    chainId,
    txId
  } = useParams()
  const {
    apiAddress
  } = useAppState()

  const [isFetching, setIsFetching] = useState(false)
  const [isErrorFetch, setIsErrorFetch] = useState(false)
  const [txStatus, setTxStatus] = useState('')
  const [toChainId, setToChainId] = useState('')
  const [swapTx, setSwapTx] = useState('')
  const [txConfirmations, setTxConfirmations] = useState('')

  if (false) console.log(isErrorFetch)

  /*
  export function registerSwap(hash: string, chainId: any, apiAddress: string) {
    return new Promise((resolve, reject) => {
      console.log(`Swap > chain id: ${chainId}; hash: ${hash}`)

      const url = `${apiAddress}/swap/register/${chainId}/${hash}`

      postUrlData(url, {
        logindex: 0
      })
        .then((res: any) => {
          console.log('Router response: ', res)
          resolve(res)
        })
        .catch(error => {
          console.error('Router error: ', error)
          reject(error)
        })
    })
  }
  */

  const fetchTxStatus = () => {
    const url = `${apiAddress}/swap/status/${chainId}/${txId}`
    console.log('>>> url', isFetching, url)
    if (isFetching) return
    setIsFetching(true)
    setIsErrorFetch(false)
    getUrlData(url)
      .then((txStatus: any) => {
        console.log(txStatus)
        if (txStatus && txStatus?.msg && txStatus?.msg === `Success` && txStatus?.data) {
          const {
            swaptx,
            toChainID,
            status,
            confirmations
          } = txStatus.data
          setTxStatus(status)
          setToChainId(toChainID)
          setSwapTx(swaptx)
          setTxConfirmations(confirmations)
          setIsFetching(false)
        }
      })
      .catch(error => {
        console.debug(`Failed to fetch tx status `, error)
        setIsFetching(false)
        setIsErrorFetch(true)
      })
  }

  useEffect(() => {
    fetchTxStatus()
  }, [chainId, txId])

  console.log('>>>>> urlParams', chainId, txId, apiAddress)
  console.log('>>>>', txStatus, toChainId, swapTx, txConfirmations)
  return (
    <AppBody>
      <div>Tx info</div>
    </AppBody>
  )
}
