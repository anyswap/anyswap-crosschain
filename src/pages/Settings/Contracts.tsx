import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useAppState } from '../../state/application/hooks'
import { chainInfo } from '../../config/chainConfig'
import { updateStorageData } from '../../utils/storage'
import { useRouterConfigContract } from '../../hooks/useContract'
import DeployCrosschainToken from './DeployCrosschainToken'
import DeployRouter from './DeployRouter'
import DeployRouterConfig from './DeployRouterConfig'
import { Notice } from './index'
import config from '../../config'

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

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  font-size: 1.2rem;
`

export const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
`

export const Input = styled.input`
  padding: 0.4rem 0;
  margin: 0.2rem 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.text3};
  outline: none;
  font-size: inherit;
  background-color: transparent;
  color: inherit;
`

export const Button = styled.button`
  cursor: pointer;
  width: 100%;
  font-size: inherit;
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem;
`

export default function Contracts() {
  const { chainId, account, library } = useActiveWeb3React()
  const { t } = useTranslation()

  const {
    routerConfigChainId: stateRouterConfigChainId,
    routerConfigAddress: stateRouterConfigAddress,
    routerAddress: stateRouterAddress
  } = useAppState()

  const routerConfig = useRouterConfigContract(stateRouterConfigAddress, stateRouterConfigChainId || 0, true)

  const [message, setMessage] = useState<
    | {
        content: string
        important: boolean
      }
    | undefined
  >(undefined)

  const [routerConfigChainId, setRouterConfigChainId] = useState<string>(`${stateRouterConfigChainId}` || '')
  const [routerConfigAddress, setRouterConfigAddress] = useState<string>(stateRouterConfigAddress)

  const saveRouterConfig = (routerConfigAddress: string, chainId: number) => {
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

  const onNewConfig = (address: string, chainId: number, saveInStorage?: boolean) => {
    setRouterConfigAddress(address)

    const { name } = chainInfo[config.STORAGE_CHAIN_ID]

    if (saveInStorage) {
      saveRouterConfig(address, chainId)
    } else {
      setMessage({
        content: t('pleaseSwitchToStorageNetworkAndSaveConfig', { network: name }),
        important: true
      })
    }
  }

  const [routerChainId, setRouterChainId] = useState('')
  const [routerAddress, setRouterAddress] = useState('')

  useEffect(() => {
    if (chainId !== undefined && stateRouterAddress[chainId]) {
      setRouterChainId(String(chainId))
      setRouterAddress(stateRouterAddress[chainId])
    } else {
      setRouterChainId('')
      setRouterAddress('')
    }
  }, [chainId])

  const [configNetworkName, setConfigNetworkName] = useState('')

  useEffect(() => {
    if (stateRouterConfigChainId) {
      setConfigNetworkName(chainInfo[stateRouterConfigChainId]?.name)
    }
  }, [stateRouterConfigChainId])

  const setChainConfig = async (routerAddress: string, chainId: number) => {
    if (!routerConfig || stateRouterConfigChainId !== chainId) return

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

  const onNewRouter = (address: string, chainId: number, setInConfig?: boolean) => {
    setRouterAddress(address)

    const { name } = chainInfo[config.STORAGE_CHAIN_ID]

    if (setInConfig) {
      setChainConfig(address, chainId)
    } else {
      setMessage({
        content: t('pleaseSwitchToStorageNetworkAndSaveRouter', { network: name }),
        important: true
      })
    }
  }

  return (
    <div>
      <Notice warning>
        {/* {t('youNeedToSaveAllDataInTheConfigContract')} */}
        You have to be on the Config contract network to configure settings. When you deploy anything save deployment
        information and switch to {configNetworkName || 'Unknown network'} to save it.
      </Notice>

      {message && <Notice warning={message.important}>{message.content}</Notice>}

      {!stateRouterConfigAddress && (
        <ZoneWrapper>
          <Notice>
            {t('youNeedToDeployOnlyOneRouterConfigContract')}
            {t('youCanDeployConfigToAnyNetwork')}
          </Notice>
          <DeployRouterConfig onNewConfig={onNewConfig} />

          {chainId !== Number(routerConfigChainId) && (
            <>
              <OptionWrapper>
                <OptionLabel>
                  {t('configChainId')}
                  <Input
                    // disabled={pending}
                    type="number"
                    placeholder="0x..."
                    onChange={event => setRouterConfigChainId(event.target.value)}
                  />
                  {t('configAddress')}
                  <Input
                    // disabled={pending}
                    type="text"
                    placeholder="0x..."
                    onChange={event => setRouterConfigAddress(event.target.value)}
                  />
                </OptionLabel>
              </OptionWrapper>
              <Button
                // disabled={pending}
                onClick={() => saveRouterConfig(routerConfigAddress, Number(routerConfigChainId))}
              >
                {t('saveConfig')}
              </Button>
            </>
          )}
        </ZoneWrapper>
      )}

      {(!routerAddress || true) && (
        <ZoneWrapper blocked={!routerConfigAddress}>
          <Notice>
            {t('youNeedToDeployOnlyOneRouterConfigContract')}. {t('youCanDeployConfigToAnyNetwork')}.
            {t('youNeedToHaveOneRouterForEachNetwork')}
          </Notice>
          <DeployRouter onNewRouter={onNewRouter} />

          {chainId !== Number(routerConfigChainId) && (
            <>
              <OptionWrapper>
                <OptionLabel>
                  {t('routerChainId')}
                  <Input
                    // disabled={pending}
                    type="number"
                    placeholder="0x..."
                    onChange={event => setRouterChainId(event.target.value)}
                  />
                  {t('routerAddress')}
                  <Input
                    // disabled={pending}
                    type="text"
                    placeholder="0x..."
                    onChange={event => setRouterAddress(event.target.value)}
                  />
                </OptionLabel>
              </OptionWrapper>
              <Button onClick={() => setChainConfig(routerAddress, Number(routerChainId))}>
                {t('setChainConfig')}
              </Button>
            </>
          )}
        </ZoneWrapper>
      )}

      <ZoneWrapper blocked={!(routerConfigAddress || routerAddress)}>
        <Notice>{t('youNeedToDeployCrosschainTokenForEachSourceTokenOnEachNetwork')}</Notice>
        <DeployCrosschainToken routerAddress={routerAddress} />
      </ZoneWrapper>
    </div>
  )
}
