import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { ButtonPrimary } from '../../components/Button'
import { updateStorageData } from '../../utils/storage'
import { selectNetwork } from '../../config/tools/methods'
import { chainInfo } from '../../config/chainConfig'
import config from '../../config'

export default function FirstSetup() {
  const { t } = useTranslation()
  const { chainId, account, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const { STORAGE_CHAIN_ID, getCurChainInfo } = config

  const [onStorageChain, setOnStorageChain] = useState(false)
  const [storageNetworkName] = useState(chainInfo[STORAGE_CHAIN_ID]?.networkName)

  useEffect(() => {
    setOnStorageChain(!!chainId && chainId === config.STORAGE_CHAIN_ID)
  }, [chainId])

  const installOnDomainDo = async () => {
    if (!account || !library?.provider) return

    try {
      await updateStorageData({
        library,
        owner: account,
        data: {},
        onHash: (hash: string) => {
          addTransaction(
            { hash },
            {
              summary: `On domain installed sucessfull`
            }
          )
          location.reload()
        }
      })
    } catch (error) {
      console.group('%c storage data', 'color: red;')
      console.error(error)
      console.groupEnd()
    }
  }

  console.log('>>>> FirstSetup account', account)
  const changeNetwork = (chainID: any) => {
    selectNetwork(chainID).then((res: any) => {
      console.log(res)
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', { label: getCurChainInfo(chainID).networkName }))
      }
    })
  }

  const connectWallet = () => {
    console.log('>>> do connect wallet')
  }

  const switchToStorageNetwork = () => changeNetwork(STORAGE_CHAIN_ID)

  const SwitchToStorageNetworkButton = () => (
    <ButtonPrimary onClick={switchToStorageNetwork} fullWidth>
      {t('switchToNetwork', { network: storageNetworkName })}
    </ButtonPrimary>
  )

  return (
    <>
      <h1>{t('installOnDomainTitle')}</h1>
      {account === null ? (
        <>
          <ButtonPrimary onClick={connectWallet} fullWidth>
            {t('installOnDomainConnectWallet')}
          </ButtonPrimary>
        </>
      ) : (
        <>
          {onStorageChain ? (
            <ButtonPrimary onClick={installOnDomainDo} fullWidth>
              {t('installOnDomainDo')}
            </ButtonPrimary>
          ) : (
            <SwitchToStorageNetworkButton />
          )}
        </>
      )}
    </>
  )
}
