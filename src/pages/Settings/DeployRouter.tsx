import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { deployRouter } from '../../utils/contract'
import { chainInfo } from '../../config/chainConfig'
import { ButtonPrimary } from '../../components/Button'
import { useRouterConfigContract } from '../../hooks/useContract'
import { useAppState } from '../../state/application/hooks'

const Button = styled(ButtonPrimary)`
  width: 100%;
`

export default function DeployRouter({
  onDeploymentCallback,
  serverAdminAddress
}: {
  onDeploymentCallback: (contractAddress: string, chainId: number, hash: string) => void
  serverAdminAddress: string | undefined
}) {
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

  useEffect(() => setCanDeploy(Boolean(active && wrappedToken && serverAdminAddress)), [
    active,
    wrappedToken,
    serverAdminAddress
  ])

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
          onDeploymentCallback(contractAddress, chainId, hash)
        },
        factory: account,
        wNative: wrappedToken,
        mpc: serverAdminAddress // https://github.com/noxonsu/CrossChain-Router/blob/main/README.md?plain=1#L19
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button disabled={!canDeploy} onClick={onDeployment}>
      {t(serverAdminAddress ? 'deployRouter' : 'saveValidatorNodeNetworkAddress')}
    </Button>
  )
}
