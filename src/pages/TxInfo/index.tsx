import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppBody from '../AppBody'
import { useAppState } from '../../state/application/hooks'
import { getUrlData, postUrlData} from '../../utils/tools/axios'
import { ButtonPrimary } from '../../components/Button'
import { getEtherscanLink } from '../../utils'
import { ExternalLink } from '../../theme/components'
import config from '../../config'


export default function TxInfo() {
  const {
    chainId,
    txId
  } = useParams()
  const {
    apiAddress
  } = useAppState()

  const { t } = useTranslation()

  const [isFetching, setIsFetching] = useState(false)
  const [isErrorFetch, setIsErrorFetch] = useState(false)
  const [txStatus, setTxStatus] = useState('')
  const [toChainId, setToChainId] = useState('')
  const [swapTx, setSwapTx] = useState('')
  const [notExists, setNotExists] = useState(false)

  if (false) console.log(isErrorFetch)


  const fetchTxStatus = () => {
    const url = `${apiAddress}/swap/status/${chainId}/${txId}`
    if (isFetching) return
    setIsFetching(true)
    setIsErrorFetch(false)
    getUrlData(url)
      .then((txStatus: any) => {
        setIsFetching(false)
        if (txStatus && txStatus?.msg && txStatus?.msg === `Success` && txStatus?.data) {
          const data = txStatus.data
          if (data === `mgoError: Swap is not found`) {
            setNotExists(true)
          }
          if (data.swaptx !== undefined && data.status !== undefined) {
            const {
              swaptx,
              toChainID,
              status,
            } = txStatus.data
            setTxStatus(status)
            setToChainId(toChainID)
            setSwapTx(swaptx)
            setNotExists(false)
          }
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

  const [isDoRegisterSwap, setIsDoRegisterSwap] = useState(false)
  const doRegisterSwap = () => {
    if (isDoRegisterSwap) return
    setIsDoRegisterSwap(true)

    const url = `${apiAddress}/swap/register/${chainId}/${txId}`

    postUrlData(url, {
      logindex: 0
    })
      .then((res: any) => {
        console.log('Router response: ', res)
        setIsDoRegisterSwap(false)
        fetchTxStatus()
      })
      .catch(error => {
        setIsDoRegisterSwap(false)
        console.error('Router error: ', error)
      })
  }

  return (
    <AppBody>
      <div>{t('swapTxInfo_Header')}</div>
      {((`${txStatus}` === `9` || `${txStatus}` === `10`) && swapTx) && (
        <>
          <h2>{t('swapTxInfo_Ready')}</h2>
          <ExternalLink href={getEtherscanLink(toChainId, swapTx, 'transaction')}>
            {t('ViewOn')} {config.getCurChainInfo(toChainId).name}
          </ExternalLink>
        </>
      )}
      {isErrorFetch && (
        <>
          <h2>{t('swapTxInfo_FailFetchInformation')}</h2>
          <ButtonPrimary onClick={fetchTxStatus} disabled={isFetching}>
            {t('swapTxInfo_TryFetchAgain')}
          </ButtonPrimary>
        </>
      )}
      {notExists && (
        <>
          <h2>{t('swapTxInfo_TxNotFound')}</h2>
          <ButtonPrimary onClick={doRegisterSwap} disabled={isDoRegisterSwap}>
            {t('swapTxInfo_AddTransaction')}
          </ButtonPrimary>
        </>
      )}
    </AppBody>
  )
}
