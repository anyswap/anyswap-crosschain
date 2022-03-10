import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { deployRouterConfig } from '../../utils/contract'

export default function DeployRouterConfig() {
  const { account, library, active } = useActiveWeb3React()
  const { t } = useTranslation()
  const [canDeploy, setCanDeploy] = useState(false)

  useEffect(() => {
    setCanDeploy(!!(active && account && library))
  }, [active, account, library])

  const onDeployment = async () => {
    try {
      const result = await deployRouterConfig({
        library,
        onHash: (hash: string) => {
          console.log('hash: ', hash)
        },
        account
      })

      console.log('result of config deployment: ', result)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <button disabled={!canDeploy} onClick={onDeployment}>
        {t('deployCrossChainToken')}
      </button>
    </>
  )
}
