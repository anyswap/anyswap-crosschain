import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { deployRouterConfig } from '../../utils/contract'
import { ButtonPrimary } from '../../components/Button'

const Button = styled(ButtonPrimary)`
  width: 100%;
`

export default function DeployRouterConfig({
  onDeploymentCallback
} : {
  onDeploymentCallback: (contractAddress: string, chainId: number, hash: string) => void
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
          addTransaction(
            { hash },
            {
              summary: `Deployment: chain ${chainId}; CONFIG ${contractAddress}`
            }
          )
          onDeploymentCallback(contractAddress, chainId, hash)
        }
      })
    } catch (error) {
      console.group('%c Router config deployment', 'color: red')
      console.error(error)
      console.groupEnd()
    }
  }

  return (
    <Button disabled={!canDeploy} onClick={onDeployment}>
      {t('deployConfig')}
    </Button>
  )
}
