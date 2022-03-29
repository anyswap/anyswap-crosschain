import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { deployRouter } from '../../utils/contract'
import { chainInfo } from '../../config/chainConfig'
import { ButtonPrimary } from '../../components/Button'
import { useRouterConfigContract } from '../../hooks/useContract'
import { useAppState } from '../../state/application/hooks'

export default function DeployRouter() {
  const { account, library, active, chainId: currentChainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const [wrappedToken, setWrappedToken] = useState('')
  const { routerConfigChainId, routerConfigAddress } = useAppState()
  const routerConfig = useRouterConfigContract(routerConfigAddress, routerConfigChainId || 0, true)

  useEffect(() => {
    if (currentChainId) {
      const { wrappedToken } = chainInfo[currentChainId]

      setWrappedToken(wrappedToken || '')
    }
  }, [currentChainId])

  const [canDeploy, setCanDeploy] = useState(false)

  useEffect(() => setCanDeploy(Boolean(active && wrappedToken)), [active, wrappedToken])

  const onDeployment = async () => {
    if (!currentChainId || !wrappedToken || !routerConfig) return

    try {
      await deployRouter({
        chainId: currentChainId,
        library,
        account,
        onHash: (hash: string) => {
          console.log('router hash: ', hash)
        },
        onDeployment: (contractAddress: string, chainId: number, hash: string) => {
          addTransaction(
            { hash },
            {
              summary: `Deployment: chain ${chainId}; ROUTER ${contractAddress}`
            }
          )
        },
        factory: account,
        wNative: wrappedToken,
        mpc: account
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ButtonPrimary disabled={!canDeploy} onClick={onDeployment}>
      {t('deployRouter')}
    </ButtonPrimary>
  )
}
