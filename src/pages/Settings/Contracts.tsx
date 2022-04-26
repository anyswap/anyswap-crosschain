import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useDispatch } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { updateAppOptions } from '../../state/application/actions'
import { useAppState } from '../../state/application/hooks'
import { chainInfo } from '../../config/chainConfig'
import { updateStorageData } from '../../utils/storage'
import { getWeb3Library } from '../../utils/getLibrary'
import { useRouterConfigContract } from '../../hooks/useContract'
import { ZERO_ADDRESS, API_REGEXP, EVM_ADDRESS_REGEXP } from '../../constants'
import { ButtonPrimary } from '../../components/Button'
import Accordion from '../../components/Accordion'
import Lock from '../../components/Lock'
import DeployRouterConfig from './DeployRouterConfig'
import DeployRouter from './DeployRouter'
import DeployCrosschainToken from './DeployCrosschainToken'
import SwapSettings from './SwapSettings'
import OptionLabel from './OptionLabel'
import { Notice } from './index'
import config from '../../config'

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.3rem 0;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.4rem 0;
  margin: 0.2rem 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.text3};
  outline: none;
  font-size: inherit;
  background-color: transparent;
  color: inherit;
`

const Title = styled.h2<{ noMargin?: boolean }>`
  margin: ${({ noMargin }) => (!noMargin ? '1.6rem 0 0.8rem' : '0')};

  :first-child {
    margin-top: 1rem;
  }
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
  font-weight: 500;

  h4 {
    margin: 0 0 0.3rem;
  }
`

const ConfigLink = styled.a`
  word-break: break-all;
`

export default function Contracts() {
  const { chainId, account, library } = useActiveWeb3React()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    apiAddress: stateApiAddress,
    routerConfigChainId: stateRouterConfigChainId,
    routerConfigAddress: stateRouterConfigAddress,
    routerAddress: stateRouterAddress,
    serverAdminAddress: stateServerAdminAddress
  } = useAppState()

  const [storageNetworkName] = useState(chainInfo[config.STORAGE_CHAIN_ID]?.networkName)
  const [configNetworkName] = useState(stateRouterConfigChainId ? chainInfo[stateRouterConfigChainId]?.networkName : '')

  const routerConfig = useRouterConfigContract(stateRouterConfigAddress, stateRouterConfigChainId || 0)
  const routerConfigSigner = useRouterConfigContract(stateRouterConfigAddress, stateRouterConfigChainId || 0, true)

  const [onStorageNetwork, setOnStorageNetwork] = useState(false)

  useEffect(() => {
    setOnStorageNetwork(chainId === config.STORAGE_CHAIN_ID)
  }, [chainId])

  const [apiAddress, setApiAddress] = useState(stateApiAddress)
  const [apiIsValid, setApiIsValid] = useState(false)

  useEffect(() => {
    setApiIsValid(apiAddress === '' || Boolean(apiAddress && apiAddress.match(API_REGEXP)))
  }, [apiAddress])

  const saveApiAddress = () => {
    if (!account) return

    try {
      updateStorageData({
        provider: library?.provider,
        owner: account,
        data: {
          apiAddress
        },
        onReceipt: (receipt, success) => {
          if (success) {
            dispatch(updateAppOptions([{ key: 'apiAddress', value: apiAddress }]))
          }
        }
      })
    } catch (error) {
      console.error('API address: ', error)
    }
  }

  const [mpcAddress, setMpcAddress] = useState(stateServerAdminAddress || '')
  const [validMpcOptions, setValidMpcOptions] = useState(false)

  useEffect(() => {
    setValidMpcOptions(Boolean(mpcAddress?.match(EVM_ADDRESS_REGEXP)))
  }, [mpcAddress])

  const saveServerAdminAddress = async () => {
    if (!account) return

    if (validMpcOptions) {
      await updateStorageData({
        provider: library?.provider,
        owner: account,
        data: {
          serverAdminAddress: mpcAddress
        },
        onReceipt: (receipt, success) => {
          if (success) {
            dispatch(updateAppOptions([{ key: 'serverAdminAddress', value: mpcAddress }]))
          }
        }
      })
    }
  }

  const [routerConfigChainId, setRouterConfigChainId] = useState<string>(`${stateRouterConfigChainId}` || '')
  const [routerConfigAddress, setRouterConfigAddress] = useState(stateRouterConfigAddress)

  const saveRouterConfig = () => {
    if (!account) return

    return updateStorageData({
      provider: library?.provider,
      owner: account,
      data: {
        routerConfigAddress,
        routerConfigChainId
      },
      onReceipt: (receipt, success) => {
        if (success) {
          dispatch(
            updateAppOptions([
              { key: 'routerConfigAddress', value: routerConfigAddress },
              { key: 'routerConfigChainId', value: routerConfigChainId }
            ])
          )
        }
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
      if (!underlyingToken?.match(EVM_ADDRESS_REGEXP) || !underlyingNetworkId) return

      try {
        const underlyingNetworkConfig = chainInfo[underlyingNetworkId]

        if (!underlyingNetworkConfig) return

        const { nodeRpc } = underlyingNetworkConfig
        const web3 = getWeb3Library(nodeRpc)
        //@ts-ignore
        const underlyingErc20 = new web3.eth.Contract(ERC20_ABI, underlyingToken)

        const name = await underlyingErc20.methods.name().call()
        const symbol = await underlyingErc20.methods.symbol().call()
        const decimals = await underlyingErc20.methods.decimals().call()

        setUnderlyingName(name)
        setUnderlyingSymbol(symbol)
        setUnderlyingDecimals(decimals)

        if (routerConfig) {
          const tokenConfig = await routerConfig.methods
            .getTokenConfig(symbol.toUpperCase(), underlyingNetworkId)
            .call()

          if (tokenConfig.ContractAddress !== ZERO_ADDRESS) {
            const { ContractAddress } = tokenConfig

            setCrosschainTokenChainId(underlyingNetworkId)
            setCrosschainToken(ContractAddress)
          } else {
            setCrosschainTokenChainId('')
            setCrosschainToken('')
          }

          console.groupEnd()
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (underlyingNetworkId && underlyingToken) {
      fetchUnderlyingInfo()
    }
  }, [underlyingToken, chainId, underlyingNetworkId])

  const setTokenConfig = async () => {
    if (!routerConfigSigner || !underlyingSymbol || !crosschainToken || !crosschainTokenChainId) return

    const VERSION = 6

    try {
      await routerConfigSigner.setTokenConfig(underlyingSymbol.toUpperCase(), crosschainTokenChainId, {
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

  const [canSaveRouterConfig, setCanSaveRouterConfig] = useState(false)

  useEffect(() => {
    setCanSaveRouterConfig(Boolean(onStorageNetwork && routerConfigChainId && routerConfigAddress))
  }, [onStorageNetwork, routerConfigChainId, routerConfigAddress])

  const [hasUnderlyingInfo, setHasUnderlyingInfo] = useState(false)

  useEffect(() => {
    setHasUnderlyingInfo(Boolean(underlyingNetworkId && underlyingName))
  }, [underlyingNetworkId, underlyingName])

  const underlying = {
    networkId: underlyingNetworkId,
    address: underlyingToken,
    name: underlyingName,
    symbol: underlyingSymbol,
    decimals: Number(underlyingDecimals)
  }

  const onDeployRouterConfig = (contractAddress: string, chainId: number, hash: string) => {
    console.log('>>> onDeployRouterConfig', contractAddress, chainId, hash)
    setRouterConfigChainId(`${chainId}`)
    setRouterConfigAddress(contractAddress)
  }

  const onDeployRouter = (contractAddress: string, chainId: number, hash: string) => {
    console.log('>>> onDeployRouter', contractAddress, chainId, hash)
    setRouterChainId(`${chainId}`)
    setRouterAddress(contractAddress)
  }

  const onDeployCrosschainToken = (contractAddress: string, chainId: number, hash: string) => {
    console.log('>>> onDeployCrosschainToken', contractAddress, chainId, hash)
    setCrosschainTokenChainId(`${chainId}`)
    setCrosschainToken(contractAddress)
  }

  return (
    <>
      <Title noMargin>{t('mainConfig')}</Title>
      <Notice margin="0.5rem 0 0">
        {stateRouterConfigChainId && stateRouterConfigAddress ? (
          <ConfigInfo>
            <h4>{t('configInformation')}</h4>
            {configNetworkName}:{' '}
            <ConfigLink
              href={`${chainInfo[stateRouterConfigChainId]?.lookAddr}${stateRouterConfigAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {stateRouterConfigAddress}
            </ConfigLink>
          </ConfigInfo>
        ) : (
          <>
            {t('youNeedToDeployAndSaveConfigFirst')}. {t('youCanDeployConfigToAnyNetwork')}. {t('youNeedOnlyOneConfig')}
            .
          </>
        )}
      </Notice>

      {!stateRouterConfigAddress ? (
        <Accordion title={t('deployAndSaveConfig')} margin="0.5rem 0">
          <DeployRouterConfig onDeploymentCallback={onDeployRouterConfig} />
          <OptionWrapper>
            <Notice warning margin="0.4rem 0 0.6rem">
              {t('afterDeploymentFillTheseInputsAndSaveInfo')}.{' '}
            </Notice>
            <OptionLabel displayChainsLink>
              {t('configChainId')}
              <Input
                type="number"
                min="1"
                placeholder=""
                value={routerConfigChainId}
                onChange={event => setRouterConfigChainId(event.target.value)}
              />
              {t('configAddress')}
              <Input
                type="text"
                placeholder="0x..."
                value={routerConfigAddress}
                onChange={event => setRouterConfigAddress(event.target.value)}
              />
            </OptionLabel>
          </OptionWrapper>
          <ButtonPrimary disabled={!canSaveRouterConfig} onClick={saveRouterConfig}>
            {t(onStorageNetwork ? 'saveConfig' : 'switchToNetwork', { network: storageNetworkName })}
          </ButtonPrimary>
        </Accordion>
      ) : (
        <>
          <Title>{t('validatorNodeSettings')}</Title>
          <OptionWrapper>
            <div>
              {t('validatorNodeAddress')} ({t('validatorNodeAddressDescription')}).
            </div>
            <Input type="text" defaultValue={apiAddress} onChange={event => setApiAddress(event.target.value)} />
            <ButtonPrimary onClick={saveApiAddress} disabled={!apiIsValid || !onStorageNetwork}>
              {t(onStorageNetwork ? 'saveAddress' : 'switchToNetwork', { network: storageNetworkName })}
            </ButtonPrimary>
          </OptionWrapper>

          <OptionWrapper>
            {t('validatorNodeNetworkAddress')}. {t('validatorNodeNetworkAddressDescription')}.
            <Input
              type="text"
              placeholder="0x..."
              defaultValue={mpcAddress}
              onChange={event => setMpcAddress(event.target.value)}
            />
            <ButtonPrimary onClick={saveServerAdminAddress} disabled={!validMpcOptions || !onStorageNetwork}>
              {t(onStorageNetwork ? 'saveAdminAddressData' : 'switchToNetwork', { network: storageNetworkName })}
            </ButtonPrimary>
          </OptionWrapper>
        </>
      )}

      <Title>{t('networkRouter')}</Title>
      <Accordion title={t('deployAndSetRouter')} margin="0.5rem 0">
        {chainId && !stateRouterAddress[chainId] ? (
          <>
            <Notice margin="0 0 0.5rem">{t('youNeedOneRouterForEachNetwork')}</Notice>
            <DeployRouter onDeploymentCallback={onDeployRouter} serverAdminAddress={mpcAddress} />
          </>
        ) : (
          <span />
        )}

        <OptionWrapper>
          <Notice warning margin="0.4rem 0">
            {t('afterDeploymentFillTheseInputsAndSaveInfo')}
          </Notice>
          <OptionLabel displayChainsLink>
            {t('routerChainId')}
            <Input
              type="number"
              min="1"
              step="1"
              placeholder=""
              value={routerChainId}
              defaultValue={routerChainId}
              onChange={event => setRouterChainId(event.target.value)}
            />
            {t('routerAddress')}
            <Input
              type="text"
              placeholder="0x..."
              value={routerAddress}
              defaultValue={routerAddress}
              onChange={event => setRouterAddress(event.target.value)}
            />
          </OptionLabel>
          <ButtonPrimary
            onClick={() => setChainConfig(routerAddress, Number(routerChainId))}
            disabled={!onConfigNetwork}
          >
            {t(onConfigNetwork ? 'setChainConfig' : 'switchToNetwork', { network: configNetworkName })}
          </ButtonPrimary>
        </OptionWrapper>
      </Accordion>

      <Title>{t('erc20Token')}</Title>
      <ZoneWrapper blocked={!routerAddress}>
        <Notice margin="0.4rem 0">{t('youNeedCrosschainTokenForEachErc20TokenOnEachNetwork')}</Notice>
        <OptionWrapper>
          <OptionLabel displayChainsLink>
            {t('erc20ChainId')}
            <Input type="number" min="1" onChange={event => setUnderlyingNetworkId(event.target.value)} />
            {t('erc20TokenAddress')}
            <Input type="text" placeholder="0x..." onChange={event => setUnderlyingToken(event.target.value)} />
            {/* {t('erc20TokenName')}
              <Input type="text" onChange={event => setUnderlyingName(event.target.value)} /> */}
          </OptionLabel>
        </OptionWrapper>

        <DeployCrosschainToken
          routerAddress={routerAddress}
          underlying={underlying}
          onDeploymentCallback={onDeployCrosschainToken}
        />

        {!onConfigNetwork && (
          <Notice warning margin="0.3rem 0">
            {t('switchToConfigNetworkToAccessTheseOptions')}
          </Notice>
        )}
        {!hasUnderlyingInfo && (
          <Notice warning margin="0.3rem 0">
            {t('fillErc20InputsToUnlockTheseSettings')}
          </Notice>
        )}

        <Lock enabled={!hasUnderlyingInfo || !onConfigNetwork}>
          <Accordion title={t('tokenConfig')} margin="0.5rem 0">
            <OptionWrapper>
              <OptionLabel>
                {t('idOfCrosschainTokenNetwork')}
                <Input
                  defaultValue={crosschainTokenChainId}
                  value={crosschainTokenChainId}
                  type="number"
                  min="1"
                  step="1"
                  onChange={event => setCrosschainTokenChainId(event.target.value)}
                />
                {t('crosschainTokenAddress')}
                <Input
                  defaultValue={crosschainToken}
                  value={crosschainToken}
                  type="text"
                  placeholder="0x..."
                  onChange={event => setCrosschainToken(event.target.value)}
                />
                <ButtonPrimary onClick={setTokenConfig}>{t('setTokenConfig')}</ButtonPrimary>
              </OptionLabel>
            </OptionWrapper>
          </Accordion>

          <SwapSettings underlying={underlying} />
        </Lock>
      </ZoneWrapper>
    </>
  )
}
