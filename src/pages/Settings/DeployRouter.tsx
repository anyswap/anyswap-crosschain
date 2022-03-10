import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { deployRouterConfig } from '../../utils/contract'
import { chainInfo } from '../../config/chainConfig'

export default function DeployRouter() {
  // constructor(_factory _wNATIVE _mpc)

  const { account, library, active, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [mpc] = useState('')
  const [canDeploy, setCanDeploy] = useState(false)

  useEffect(() => {
    setCanDeploy(Boolean(active && account && library && mpc))
  }, [active, account, library, mpc])

  const onDeployment = async () => {
    if (!chainId) return

    const { wrappedToken } = chainInfo[chainId]

    if (!wrappedToken) return

    try {
      await deployRouterConfig({
        library,
        account,
        onHash: (hash: string) => {
          console.log('hash: ', hash)
        },
        factory: account,
        wNative: wrappedToken,
        mpc
      })
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
