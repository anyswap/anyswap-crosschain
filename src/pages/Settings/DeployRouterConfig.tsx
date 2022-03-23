import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { deployRouterConfig } from '../../utils/contract'
import { updateStorageData } from '../../utils/storage'
import { ButtonPrimary } from '../../components/Button'

export default function DeployRouterConfig({ onNewConfig }: { onNewConfig: (hash: string) => void }) {
  const { account, library, active, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const [canDeploy, setCanDeploy] = useState(false)

  useEffect(() => {
    setCanDeploy(!!(active && account && library))
  }, [active, account, library])

  // get chainId from parameters, because user can switch to a different chain on deployment
  // and when we start this function it takes a wrong id from useActiveWeb3React()
  const update = (routerConfigAddress: string, chainId: number) => {
    if (!account) return

    return updateStorageData({
      provider: library?.provider,
      owner: account,
      data: {
        routerConfigAddress,
        routerConfigChainId: chainId
      },
      onHash: (hash: string) => {
        console.group('%c Log', 'color: orange; font-size: 14px')
        console.log('hash: ', hash)
        console.groupEnd()
      }
    })
  }

  const onDeployment = async () => {
    try {
      await deployRouterConfig({
        chainId,
        library,
        account,
        onHash: (hash: string) => {
          console.log('hash: ', hash)
        },
        onDeployment: (contractAddress: string, chainId: number, hash: string) => {
          onNewConfig(contractAddress)
          update(contractAddress, chainId)
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
    <>
      <ButtonPrimary disabled={!canDeploy} onClick={onDeployment}>
        {t('deployRouterConfig')}
      </ButtonPrimary>
    </>
  )
}
