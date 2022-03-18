import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { deployRouterConfig } from '../../utils/contract'
import { ButtonPrimary } from '../../components/Button'

export default function DeployRouterConfig({ onNewConfig }: { onNewConfig: (hash: string) => void }) {
  const { account, library, active } = useActiveWeb3React()
  const { t } = useTranslation()
  const [canDeploy, setCanDeploy] = useState(false)

  useEffect(() => {
    setCanDeploy(!!(active && account && library))
  }, [active, account, library])

  const onDeployment = async () => {
    try {
      await deployRouterConfig({
        library,
        account,
        onHash: (hash: string) => {
          console.log('hash: ', hash)
        },
        onDeployment: onNewConfig
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
