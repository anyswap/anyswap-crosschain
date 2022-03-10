import React from 'react'
// import { useTranslation } from 'react-i18next'
// import { useActiveWeb3React } from '../../hooks'
import DeployAnyERC20 from './DeployERC20'
import DeployRouter from './DeployRouter'
import DeployRouterConfig from './DeployRouterConfig'

export default function Contracts() {
  // const { library, account, chainId } = useActiveWeb3React()
  // const { t } = useTranslation()

  return (
    <div>
      <DeployAnyERC20 />
      <DeployRouter />
      <DeployRouterConfig />
    </div>
  )
}
