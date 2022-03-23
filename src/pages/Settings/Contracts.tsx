import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useAppState } from '../../state/application/hooks'
import { chainInfo } from '../../config/chainConfig'
import DeployCrosschainToken from './DeployCrosschainToken'
import DeployRouter from './DeployRouter'
import DeployRouterConfig from './DeployRouterConfig'
import { Notice } from './index'

const ZoneWrapper = styled.div<{ blocked?: boolean }>`
  margin: 0.4rem 0;
  padding: 0.3rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.text4};

  ${({ blocked }) =>
    blocked
      ? `
      opacity: 0.5;
      pointer-events: none;
    `
      : ''}
`

export default function Contracts() {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const {
    routerConfigChainId,
    routerConfigAddress: stateRouterConfigAddress,
    routerAddress: stateRouterAddress
  } = useAppState()
  const [routerAddress, setRouterAddress] = useState('')
  const [routerConfigAddress, setRouterConfigAddress] = useState(stateRouterConfigAddress)

  useEffect(() => {
    if (chainId !== undefined && stateRouterAddress[chainId]) {
      setRouterAddress(stateRouterAddress[chainId])
    } else {
      setRouterAddress('')
    }
  }, [chainId])

  const onNewRouter = (address: string) => setRouterAddress(address)
  const onNewConfig = (address: string) => setRouterConfigAddress(address)

  const [configNetworkName, setConfigNetworkName] = useState('')

  useEffect(() => {
    if (routerConfigChainId) {
      setConfigNetworkName(chainInfo[routerConfigChainId]?.name)
    }
  }, [routerConfigChainId])

  return (
    <div>
      <Notice warning>
        {/* {t('youNeedToSaveAllDataInTheConfigContract')} */}
        You have to be on the Config contract network to configure settings. When you deploy anything save deployment
        information and switch to {configNetworkName || 'Unknown network'} to save it.
      </Notice>

      {!stateRouterConfigAddress && (
        <ZoneWrapper>
          <Notice>{t('youNeedToDeployOnlyOneRouterConfigContract')}</Notice>
          <DeployRouterConfig onNewConfig={onNewConfig} />
        </ZoneWrapper>
      )}

      {!routerAddress && (
        <ZoneWrapper blocked={!routerConfigAddress}>
          <Notice>
            {/* {t('youNeedToHaveOneRouterForEachNetwork')} */}
            You need to have one router for each targetnetwork.
          </Notice>
          <DeployRouter onNewRouter={onNewRouter} />
        </ZoneWrapper>
      )}

      <ZoneWrapper blocked={!(routerConfigAddress || routerAddress)}>
        <Notice>{t('youNeedToDeployCrosschainTokenForEachSourceTokenOnEachNetwork')}</Notice>
        <DeployCrosschainToken routerAddress={routerAddress} />
      </ZoneWrapper>
    </div>
  )
}
