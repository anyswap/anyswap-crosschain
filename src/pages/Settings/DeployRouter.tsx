import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { deployRouter } from '../../utils/contract'
import { chainInfo } from '../../config/chainConfig'
import { ButtonPrimary } from '../../components/Button'
import { useRouterConfigContract } from '../../hooks/useContract'
import { useAppState } from '../../state/application/hooks'

export default function DeployRouter({ onNewRouter }: { onNewRouter: (hash: string) => void }) {
  const { account, library, active, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const [wrappedToken, setWrappedToken] = useState('')
  const { routerConfigChainId, routerConfigAddress, routerAddress: stateRouterAddress } = useAppState()
  const routerConfig = useRouterConfigContract(routerConfigAddress, routerConfigChainId || 0, true)

  useEffect(() => {
    if (chainId) {
      const { wrappedToken } = chainInfo[chainId]

      setWrappedToken(wrappedToken || '')
    }
  }, [chainId])

  const [routerChainId, setRouterChainId] = useState<number | string | undefined>(undefined)
  const [routerAddress, setRouterAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (chainId && stateRouterAddress[chainId]) {
      setRouterChainId(chainId)
      setRouterAddress(stateRouterAddress[chainId])
    }
  }, [chainId])

  const [canDeploy, setCanDeploy] = useState(false)

  useEffect(() => setCanDeploy(Boolean(active && wrappedToken)), [active, wrappedToken])

  const setChainConfig = async (routerAddress: string, chainId: number) => {
    if (!routerConfig || routerConfigChainId !== chainId) return

    try {
      const { name } = chainInfo[chainId]

      await routerConfig.setChainConfig(chainId, {
        BlockChain: name,
        RouterContract: routerAddress,
        Confirmations: 3,
        InitialHeight: 0
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onDeployment = async () => {
    if (!chainId || !wrappedToken || !routerConfig) return

    try {
      await deployRouter({
        chainId,
        library,
        account,
        onHash: (hash: string) => {
          console.log('router hash: ', hash)
        },
        onDeployment: (contractAddress: string, chainId: number, hash: string) => {
          setChainConfig(contractAddress, chainId)
          onNewRouter(contractAddress)
          addTransaction(
            { hash },
            {
              summary: `Deployment: chain ${chainId}; router ${contractAddress}`
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

  const [canModifyChainConfig, setCanModifyChainConfig] = useState(false)
  const [canSetChainConfig, setCanSetChainConfig] = useState(false)

  useEffect(() => {
    setCanModifyChainConfig(Boolean(chainId && !stateRouterAddress[chainId]))
    setCanSetChainConfig(Boolean(routerAddress && routerChainId && chainId && !stateRouterAddress[chainId]))
  }, [chainId])

  return (
    <>
      <ButtonPrimary disabled={!canDeploy} onClick={onDeployment}>
        {t('deployRouter')}
      </ButtonPrimary>

      <input
        type="number"
        defaultValue={routerChainId}
        onChange={event => setRouterChainId(event.target.value)}
        placeholder="Router chain id"
        disabled={!canModifyChainConfig}
      />
      <input
        type="text"
        defaultValue={routerAddress}
        onChange={event => setRouterAddress(event.target.value)}
        placeholder="Router address"
        disabled={!canModifyChainConfig}
      />
      <ButtonPrimary disabled={!canSetChainConfig} onClick={onDeployment}>
        {t('setChainConfig')}
      </ButtonPrimary>
    </>
  )
}
