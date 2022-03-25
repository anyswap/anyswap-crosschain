import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { deployRouterConfig } from '../../utils/contract'
import { ButtonPrimary } from '../../components/Button'
import config from '../../config'

export default function DeployRouterConfig({
  onNewConfig
}: {
  onNewConfig: (hash: string, chainId: number, saveInStorage?: boolean) => void
}) {
  const { account, library, active, chainId: currentChainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const [canDeploy, setCanDeploy] = useState(false)

  useEffect(() => {
    setCanDeploy(!!(active && account && library))
  }, [active, account, library])

  const onDeployment = async () => {
    try {
      await deployRouterConfig({
        chainId: currentChainId,
        library,
        account,
        onHash: (hash: string) => {
          console.log('hash: ', hash)
        },
        onDeployment: (contractAddress: string, chainId: number, hash: string) => {
          onNewConfig(contractAddress, chainId, currentChainId === config.STORAGE_CHAIN_ID)
          addTransaction(
            { hash },
            {
              summary: `Deployment: chain ${chainId}; router config ${contractAddress}`
            }
          )
        }
      })
    } catch (error) {
      console.group('%c Router config deployment', 'color: red')
      console.error(error)
      console.groupEnd()
    }
  }

  return (
    <ButtonPrimary disabled={!canDeploy} onClick={onDeployment}>
      {t('deployRouterConfig')}
    </ButtonPrimary>
  )
}
