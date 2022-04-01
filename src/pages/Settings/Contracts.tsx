import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../../hooks'
import { useAppState } from '../../state/application/hooks'
import { chainInfo } from '../../config/chainConfig'
import { updateStorageData } from '../../utils/storage'
import { getWeb3Library } from '../../utils/getLibrary'
import { useRouterConfigContract } from '../../hooks/useContract'
import { EVM_ADDRESS_REGEXP, ZERO_ADDRESS } from '../../constants'
import Accordion from '../../components/Accordion'
import DeployRouterConfig from './DeployRouterConfig'
import DeployRouter from './DeployRouter'
import DeployCrosschainToken from './DeployCrosschainToken'
import SwapSettings from './SwapSettings'
import { Notice, Lock } from './index'
import config from '../../config'

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.3rem 0;
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

const ConfigInfo = styled.div`
  margin: 0 0 0.5rem;
  padding: 0;
  font-weight: 500;

  h4 {
    margin: 0 0 0.3rem;
  }
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

  const routerConfig = useRouterConfigContract(stateRouterConfigAddress, stateRouterConfigChainId || 0)
  const routerConfigSigner = useRouterConfigContract(stateRouterConfigAddress, stateRouterConfigChainId || 0, true)

  const [routerConfigChainId, setRouterConfigChainId] = useState<string>(`${stateRouterConfigChainId}` || '')
  const [routerConfigAddress, setRouterConfigAddress] = useState<string>(stateRouterConfigAddress)

  const saveRouterConfig = (routerConfigAddress: string, configChainId: number) => {
    if (!account) return

    return updateStorageData({
      provider: library?.provider,
      owner: account,
      data: {
        routerConfigAddress,
        routerConfigChainId: configChainId
      },
      onReceipt: (receipt: any) => {
        // we set a new config. Update interface to be able to use other settings
        console.log('save router config: ', receipt)
      }
    })
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
  }, [chainId, stateRouterAddress[chainId || 0]])

  const setChainConfig = async (routerAddress: string, routerChainId: number) => {
    if (!routerChainId || !routerConfigSigner || stateRouterConfigChainId !== chainId) return

    try {
      const { name } = chainInfo[routerChainId]

      await routerConfigSigner.setChainConfig(routerChainId, {
        BlockChain: name,
        RouterContract: routerAddress,
        Confirmations: 3,
        InitialHeight: 0
      })
    } catch (error) {
      console.error(error)
    }
  }

  const [underlyingNetworkId, setUnderlyingNetworkId] = useState('')
  const [underlyingToken, setUnderlyingToken] = useState('')
  const [underlyingName, setUnderlyingName] = useState('')
  const [underlyingSymbol, setUnderlyingSymbol] = useState('')
  const [underlyingDecimals, setUnderlyingDecimals] = useState(-1)
  const [crosschainToken, setCrosschainToken] = useState('')
  const [crosschainTokenChainId, setCrosschainTokenChainId] = useState('')

  useEffect(() => {
    const fetchUnderlyingInfo = async () => {
      if (!underlyingToken || !underlyingNetworkId) return

      try {
        if (routerConfig) {
          const tokenConfig = await routerConfig.methods.getTokenConfig(underlyingToken, underlyingNetworkId).call()

          console.group('%c token config', 'color: brown')
          console.log(tokenConfig)
          console.groupEnd()

          if (tokenConfig.ContractAddress !== ZERO_ADDRESS) {
            setCrosschainTokenChainId(underlyingNetworkId)
            setCrosschainToken(tokenConfig.ContractAddress)
          } else {
            setCrosschainTokenChainId('')
            setCrosschainToken('')
          }
        }

        const underlyingConfig = chainInfo[underlyingNetworkId]

        if (!underlyingConfig) return

        const { nodeRpc } = underlyingConfig
        const web3 = getWeb3Library(nodeRpc)
        const code = await web3.eth.getCode(underlyingToken)

        if (code === '0x') return console.log('wrong address for this network')

        //@ts-ignore
        const contract = new web3.eth.Contract(ERC20_ABI, underlyingToken)
        const name = await contract.methods.name().call()
        const symbol = await contract.methods.symbol().call()
        const decimals = await contract.methods.decimals().call()

        setUnderlyingName(name)
        setUnderlyingSymbol(symbol)
        setUnderlyingDecimals(decimals)
      } catch (error) {
        console.error(error)
      }
    }

    if (underlyingNetworkId && underlyingToken.match(EVM_ADDRESS_REGEXP)) {
      fetchUnderlyingInfo()
    }
  }, [underlyingToken, chainId, underlyingNetworkId])

  const setTokenConfig = async () => {
    if (!routerConfigSigner || !underlyingToken) return

    const VERSION = 6

    try {
      await routerConfigSigner.setTokenConfig(underlyingToken, crosschainTokenChainId, {
        Decimals: underlyingDecimals,
        ContractAddress: crosschainToken,
        ContractVersion: VERSION
      })
    } catch (error) {
      console.error(error)
    }
  }

  const [onConfigNetwork, setOnConfigNetwork] = useState(false)

  useEffect(() => {
    setOnConfigNetwork(Boolean(stateRouterConfigChainId && chainId === stateRouterConfigChainId))
  }, [chainId, stateRouterConfigChainId])

  const [hasUnderlyingInfo, setHasUnderlyingInfo] = useState(false)

  useEffect(() => {
    setHasUnderlyingInfo(
      Boolean(underlyingNetworkId && underlyingToken && underlyingName && underlyingSymbol && underlyingDecimals)
    )
  }, [underlyingNetworkId, underlyingToken, underlyingName, underlyingSymbol, underlyingDecimals])

  const underlying = {
    networkId: underlyingNetworkId,
    address: underlyingToken,
    name: underlyingName,
    symbol: underlyingSymbol,
    decimals: Number(underlyingDecimals)
  }

  return (
    <>
      <Notice margin="0.5rem 0 0">
        {stateRouterConfigChainId && stateRouterConfigAddress ? (
          <>
            <ConfigInfo>
              <h4>{t('configInformation')}:</h4>
              {chainInfo[stateRouterConfigChainId]?.networkName || ''}:{' '}
              <a
                href={`${chainInfo[stateRouterConfigChainId]?.lookAddr}${stateRouterConfigAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                {stateRouterConfigAddress}
              </a>
            </ConfigInfo>
            {t('youHaveToBeOnConfigNetwork')}. {t('saveAllInfoWhenYouDeployAnything')}.{' '}
            {t('setDeploymentInfoOnConfigNetwork')}.
          </>
        ) : (
          <>
            {t('youNeedToDeployConfigFirst')}. {t('youCanDeployConfigToAnyNetwork')}. {t('youNeedOnlyOneConfig')}.
          </>
        )}
      </Notice>

      {!stateRouterConfigAddress && (
        <ZoneWrapper>
          <DeployRouterConfig />
          <OptionWrapper>
            {t('afterDeploymentFillTheseInputsAndSaveInfo')}.{' '}
            {t('beOnStorageNetworkToSaveConfig', {
              network: chainInfo[config.STORAGE_CHAIN_ID]?.name
            })}
            <OptionLabel>
              {t('configChainId')}
              <Input type="number" placeholder="0x..." onChange={event => setRouterConfigChainId(event.target.value)} />
              {t('configAddress')}
              <Input type="text" placeholder="0x..." onChange={event => setRouterConfigAddress(event.target.value)} />
            </OptionLabel>
          </OptionWrapper>
          <Button onClick={() => saveRouterConfig(routerConfigAddress, Number(routerConfigChainId))}>
            {t('saveConfig')}
          </Button>
        </ZoneWrapper>
      )}

      <Lock enabled={!stateRouterConfigAddress || !stateRouterConfigChainId}>
        <ZoneWrapper blocked={!routerConfigAddress}>
          {chainId && !stateRouterAddress[chainId] && (
            <>
              <Notice>{t('youNeedOneRouterForEachNetwork')}</Notice>
              <DeployRouter />
            </>
          )}

          <OptionWrapper>
            {chainId && !stateRouterAddress[chainId] && (
              <Notice>
                {t('afterDeploymentFillTheseInputsAndSaveInfo')}.{' '}
                {t('beOnConfigNetworkToSaveRouterInfo', { network: chainInfo[routerConfigChainId]?.networkName })}
              </Notice>
            )}

            {chainId && !onConfigNetwork && !stateRouterAddress[chainId] && (
              <Notice warning>{t('switchToConfigNetworkToSaveRouterInfo')}</Notice>
            )}
            <Lock enabled={!chainId || !!stateRouterAddress[chainId] || !onConfigNetwork}>
              <OptionLabel>
                {t('routerChainId')}
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="0x..."
                  defaultValue={routerChainId}
                  onChange={event => setRouterChainId(event.target.value)}
                />
                {t('routerAddress')}
                <Input
                  type="text"
                  placeholder="0x..."
                  defaultValue={routerAddress}
                  onChange={event => setRouterAddress(event.target.value)}
                />
              </OptionLabel>
              <Button onClick={() => setChainConfig(routerAddress, Number(routerChainId))}>
                {t('setChainConfig')}
              </Button>
            </Lock>
          </OptionWrapper>
        </ZoneWrapper>

        <ZoneWrapper blocked={!routerConfigAddress || !routerAddress}>
          <Notice>{t('youNeedCrosschainTokenForEachErc20TokenOnEachNetwork')}</Notice>
          <OptionWrapper>
            <OptionLabel>
              {t('erc20ChainId')}
              <Input type="number" min="1" onChange={event => setUnderlyingNetworkId(event.target.value)} />
              {t('erc20TokenAddress')}
              <Input type="text" placeholder="0x..." onChange={event => setUnderlyingToken(event.target.value)} />
            </OptionLabel>
          </OptionWrapper>

          <DeployCrosschainToken routerAddress={routerAddress} underlying={underlying} />

          {!onConfigNetwork && <Notice warning>{t('switchToConfigNetworkToAccessTheseOptions')}</Notice>}
          {!hasUnderlyingInfo && <Notice warning>{t('fillErc20InputsToUnlockTheseSettings')}</Notice>}

          <Lock enabled={!hasUnderlyingInfo || !onConfigNetwork}>
            <Accordion title={t('tokenConfig')} margin="0.5rem 0">
              <OptionWrapper>
                <OptionLabel>
                  {t('idOfCrosschainTokenNetwork')}
                  <Input
                    defaultValue={crosschainTokenChainId}
                    type="number"
                    min="1"
                    step="1"
                    onChange={event => setCrosschainTokenChainId(event.target.value)}
                  />
                  {t('crosschainTokenAddress')}
                  <Input
                    defaultValue={crosschainToken}
                    type="text"
                    placeholder="0x..."
                    onChange={event => setCrosschainToken(event.target.value)}
                  />
                  <Button onClick={setTokenConfig}>{t('setTokenConfig')}</Button>
                </OptionLabel>
              </OptionWrapper>
            </Accordion>

            <SwapSettings underlying={underlying} />
          </Lock>
        </ZoneWrapper>
      </Lock>
    </>
  )
}
