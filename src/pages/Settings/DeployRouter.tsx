import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { deployRouter } from '../../utils/contract'
import { chainInfo } from '../../config/chainConfig'
import { ButtonPrimary } from '../../components/Button'

export default function DeployRouter({ onNewRouter }: { onNewRouter: (hash: string) => void }) {
  const { account, library, active, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [wrappedToken, setWrappedToken] = useState('')

  useEffect(() => {
    if (chainId) {
      const { wrappedToken } = chainInfo[chainId]

      setWrappedToken(wrappedToken || '')
    }
  }, [chainId])

  const [canDeploy, setCanDeploy] = useState(false)

  useEffect(() => setCanDeploy(Boolean(active && wrappedToken)), [active, wrappedToken])

  const onDeployment = async () => {
    if (!chainId || !wrappedToken) return

    try {
      await deployRouter({
        library,
        account,
        onHash: (hash: string) => {
          console.log('router hash: ', hash)
        },
        onDeployment: onNewRouter,
        factory: account,
        wNative: wrappedToken,
        mpc: account
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <ButtonPrimary disabled={!canDeploy} onClick={onDeployment}>
        {t('deployRouter')}
      </ButtonPrimary>
    </>
  )
}
