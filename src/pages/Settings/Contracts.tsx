import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useDispatch } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { updateAppOptions, updateAppSettings, updateRouterData } from '../../state/application/actions'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useAppState } from '../../state/application/hooks'

import { chainInfo } from '../../config/chainConfig'
import { updateStorageData } from '../../utils/storage'
import { getWeb3Library } from '../../utils/getLibrary'
import { useRouterConfigContract } from '../../hooks/useContract'
import { ZERO_ADDRESS, API_REGEXP, EVM_ADDRESS_REGEXP } from '../../constants'
import { ButtonPrimary, ButtonOutlined, CleanButton } from '../../components/Button'
import Accordion from '../../components/Accordion'
import Lock from '../../components/Lock'
import DeployRouterConfig from './DeployRouterConfig'
import DeployRouter from './DeployRouter'
import DeployCrosschainToken from './DeployCrosschainToken'
import SwapSettings from './SwapSettings'
import OptionLabel from './OptionLabel'
import { Notice } from './index'
import { selectNetwork } from '../../config/tools/methods'
import config from '../../config'

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.3rem 0;
`

export const Select = styled.select`
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

export const SelectOption = styled.option`
  width: 100%;
  padding: 0.4rem 0;
  margin: 0.2rem 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.text3};
  outline: none;
  font-size: inherit;
  background-color: rgb(21,26,47);
  color: inherit;
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

const SubTitle = styled.h4<{ margin?: string }>`
  margin: ${({ margin }) => margin || '0 0 0.5rem'};
`

const ConfigInfo = styled.div`
  font-weight: 500;
`

const ConfigLink = styled.a`
  word-break: break-all;
`

const Textarea = styled.textarea`
  resize: vertical;
  padding: 0.3rem;
  margin: 0 0 0.3rem;
  font-size: inherit;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme }) => theme.text3};
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
`

const CopyButton = styled(CleanButton)`
  border: 1px solid ${({ theme }) => theme.text2};
  transition: 0.1s;

  :hover {
    opacity: 0.6;
    background-color: ${({ theme }) => theme.bg2};
  }
`


const updateAppSetupSettings = (appSettings: any, setAppSettings: any, dispatch: any, newAppSettings: any) => {
  setAppSettings({
    ...appSettings,
    ...newAppSettings
  })

  dispatch(
    updateAppSettings({
      appSettings: {
        ...appSettings,
        ...newAppSettings
      }
    })
  )

}

export default function Contracts() {
  const { chainId, account, library } = useActiveWeb3React()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    owner,
    apiAddress: stateApiAddress,
    routerConfigChainId: stateRouterConfigChainId,
    routerConfigAddress: stateRouterConfigAddress,
    routerAddress: stateRouterAddress,
    serverAdminAddress: stateServerAdminAddress,
    appSettings: stateAppSettings
  } = useAppState()
  const addTransaction = useTransactionAdder()

  const [appSettings, setAppSettings] = useState( stateAppSettings )

  const { STORAGE_CHAIN_ID, getCurChainInfo } = config

  const [storageNetworkName] = useState(chainInfo[STORAGE_CHAIN_ID]?.networkName)

  const [configNetworkName, setConfigNetworkName] = useState(
    stateRouterConfigChainId ? chainInfo[stateRouterConfigChainId]?.networkName : ''
  )

  useEffect(() => {
    if (stateRouterConfigChainId) {
      setConfigNetworkName(chainInfo[stateRouterConfigChainId]?.networkName || '')
    }
  }, [stateRouterConfigChainId])

  const routerConfig = useRouterConfigContract(appSettings.mainConfigAddress, appSettings.mainConfigChainId || 0)
  const routerConfigSigner = useRouterConfigContract(appSettings.mainConfigAddress, appSettings.mainConfigChainId || 0, true)

  const [onStorageNetwork, setOnStorageNetwork] = useState(false)

  useEffect(() => {
    setOnStorageNetwork(chainId === config.STORAGE_CHAIN_ID)
  }, [chainId])

  const [onConfigNetwork, setOnConfigNetwork] = useState(false)

  useEffect(() => {
    setOnConfigNetwork(Boolean(stateRouterConfigChainId && chainId === Number(stateRouterConfigChainId)))
  }, [chainId, stateRouterConfigChainId])

  const [apiAddress, setApiAddress] = useState(stateApiAddress)
  const [apiIsValid, setApiIsValid] = useState(false)

  useEffect(() => {
    setApiIsValid(apiAddress === '' || Boolean(apiAddress && apiAddress.match(API_REGEXP)))
  }, [apiAddress])

  const saveApiAddress = () => {
    if (!account) return

    try {
      updateStorageData({
        library,
        owner: account,
        data: {
          apiAddress
        },
        onReceipt: (receipt, success) => {
          if (success) {
            dispatch(updateAppOptions([{ key: 'apiAddress', value: apiAddress }]))
          }
        },
        onHash: (hash) => {
          addTransaction(
            { hash },
            {
              summary: `Server API address successfully saved`
            }
          )
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
        library,
        owner: account,
        data: {
          serverAdminAddress: mpcAddress
        },
        onReceipt: (receipt, success) => {
          if (success) {
            dispatch(updateAppOptions([{ key: 'serverAdminAddress', value: mpcAddress }]))
          }
        },
        onHash: (hash) => {
          addTransaction(
            { hash },
            {
              summary: `Validator node address saved`
            }
          )
        }
      })
    }
  }

  const [routerConfigChainId, setRouterConfigChainId] = useState<string>(`${appSettings.mainConfigChainId}` || '')
  const [routerConfigAddress, setRouterConfigAddress] = useState(appSettings.mainConfigAddress)
  const [routerConfigOwner, setRouterConfigOwner] = useState('')

  useEffect(() => {
    const fetch = async () => {
      if (!routerConfigAddress || !routerConfigChainId || !routerConfig) {
        return setRouterConfigOwner('')
      }

      const owner = await routerConfig.methods.owner().call()

      setRouterConfigOwner(owner)
    }

    fetch()
  }, [routerConfigAddress, routerConfigChainId, routerConfig])

  const saveRouterConfig = () => {
    if (!account) return

    return updateStorageData({
      library,
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
      },
      onHash: (hash) => {
        addTransaction(
          { hash },
          {
            summary: `Swap router ${routerConfigAddress} saved to node config`
          }
        )
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

  const [displayRouterSettings, setDisplayRouterSettings] = useState(!!stateRouterAddress[chainId || 0])

  useEffect(() => {
    setDisplayRouterSettings(!!stateRouterAddress[chainId || 0])
  }, [chainId, stateRouterAddress])

  const showRouterSettings = () => setDisplayRouterSettings(true)

  const [canSaveChainConfig, setCanSaveChainConfig] = useState(false)

  useEffect(() => {
    setCanSaveChainConfig(Boolean(onConfigNetwork && routerChainId && routerAddress))
  }, [onConfigNetwork, routerChainId, routerAddress])

  const setChainConfig = async () => {
    if (!routerConfigSigner) return

    try {
      const { name } = chainInfo[routerChainId]

      const tx = await routerConfigSigner.setChainConfig(routerChainId, {
        BlockChain: name,
        RouterContract: routerAddress,
        Confirmations: 3,
        InitialHeight: 0
      })

      const receipt = await tx.wait()

      if (receipt.status) {
        dispatch(updateRouterData({ chainId: Number(routerChainId), routerAddress: routerAddress }))
        addTransaction(
          { hash: receipt.transactionHash },
          {
            summary: `onChain swap router ${routerAddress} saved to node config`
          }
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [underlyingNetworkId, setUnderlyingNetworkId] = useState(`${chainId}`)
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

        updateAppSetupSettings(
          appSettings,
          setAppSettings,
          dispatch,
          {
            erc20Tokens: {
              ...appSettings.erc20Tokens,
              [`${underlyingNetworkId}:${underlyingToken}`]: {
                chainId: underlyingNetworkId,
                address: underlyingToken,
                decimals,
                symbol,
                name,
                icon: ''
              }
            }
          }
        )

        if (routerConfig) {
          const tokenConfig = await routerConfig.methods
            .getTokenConfig(symbol.toUpperCase(), underlyingNetworkId)
            .call()

          if (tokenConfig.ContractAddress !== ZERO_ADDRESS) {
            const { ContractAddress } = tokenConfig

            setCrosschainTokenChainId(underlyingNetworkId)
            setCrosschainToken(ContractAddress)
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
      const tx = await routerConfigSigner.setTokenConfig(underlyingSymbol.toUpperCase(), crosschainTokenChainId, {
        Decimals: underlyingDecimals,
        ContractAddress: crosschainToken,
        ContractVersion: VERSION
      })
      const receipt = await tx.wait()

      if (receipt.status) {
        addTransaction(
          { hash: receipt.transactionHash },
          {
            summary: `Crosschain token config ${crosschainToken} for chain ${crosschainTokenChainId} saved to main router`
          }
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [canSaveRouterConfig, setCanSaveRouterConfig] = useState(false)

  useEffect(() => {
    setCanSaveRouterConfig(
      Boolean(
        onStorageNetwork &&
          routerConfigChainId &&
          routerConfigAddress &&
          routerConfigOwner &&
          routerConfigOwner.toLowerCase() === owner.toLowerCase()
      )
    )
  }, [onStorageNetwork, routerConfigChainId, routerConfigAddress, routerConfigOwner])

  const [hasUnderlyingInfo, setHasUnderlyingInfo] = useState(false)

  useEffect(() => {
    setHasUnderlyingInfo(Boolean(underlyingNetworkId && underlyingName && underlyingSymbol))
  }, [underlyingNetworkId, underlyingName, underlyingSymbol])

  const underlying = {
    networkId: underlyingNetworkId,
    address: underlyingToken,
    name: underlyingName,
    symbol: underlyingSymbol,
    decimals: Number(underlyingDecimals)
  }

  const onDeployRouterConfig = (contractAddress: string, chainId: number) => {
    setRouterConfigChainId(`${chainId}`)
    setRouterConfigAddress(contractAddress)
    updateAppSetupSettings(
      appSettings,
      setAppSettings,
      dispatch,
      {
        mainConfigChainId: chainId,
        mainConfigAddress: contractAddress
      }
    )
  }

  const onDeployRouter = (contractAddress: string, chainId: number) => {
    setRouterChainId(`${chainId}`)
    setRouterAddress(contractAddress)
    updateAppSetupSettings(
      appSettings,
      setAppSettings,
      dispatch,
      {
        routerConfigs: {
          ...appSettings.routerConfigs,
          [`${chainId}:${contractAddress}`]: {
            chainId,
            address: contractAddress
          }
        }
      }
    )
  }

  const onDeployCrosschainToken = (contractAddress: string, chainId: number) => {
    setCrosschainTokenChainId(`${chainId}`)
    setCrosschainToken(contractAddress)
    updateAppSetupSettings(
      appSettings,
      setAppSettings,
      dispatch,
      {
        crosschainTokens: {
          ...appSettings.crosschainTokens,
          [`${chainId}:${contractAddress}`]: {
            chainId,
            contractAddress,
            underlying,
          }
        }
      }
    )
  }

  const setRouterData = (selectedContract: any) => {
    if (selectedContract !== `-`) {
      const {
        chainId,
        address
      } = appSettings.routerConfigs[selectedContract]
      setRouterChainId(`${chainId}`)
      setRouterAddress(address)
    } else {
      setRouterChainId(``)
      setRouterAddress(``)
    }
  }

  const setCrosschainTokenData = (selectedContract: any) => {
    if (selectedContract !== `-`) {
      const {
        chainId,
        contractAddress,
        underlying
      } = appSettings.crosschainTokens[selectedContract]

      setCrosschainTokenChainId(`${chainId}`)
      setCrosschainToken(contractAddress)
      
      setUnderlyingNetworkId(underlying.networkId)
      setUnderlyingToken(underlying.address)
      setUnderlyingDecimals(underlying.decimals)
      setUnderlyingName(underlying.name)
      setUnderlyingSymbol(underlying.symbol)

    } else {
      setCrosschainTokenChainId(``)
      setCrosschainToken(``)
      
      setUnderlyingNetworkId(``)
      setUnderlyingToken(``)
      setUnderlyingDecimals(0)
      setUnderlyingName(``)
      setUnderlyingSymbol(``)
    }
  }

  const [commandToStartServer, setCommandToStartServer] = useState('')

  useEffect(() => {
    const command = `/root/setup ${stateRouterConfigChainId} ${stateRouterConfigAddress} <YOUR PRIVATE KEY>`

    setCommandToStartServer(command)
  }, [stateRouterConfigAddress, stateRouterConfigChainId])

  const copyServerCommand = () => {
    window.navigator.clipboard.writeText(commandToStartServer)
  }

  const changeNetwork = (chainID: any) => {
    selectNetwork(chainID).then((res: any) => {
      console.log(res)
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', { label: getCurChainInfo(chainID).networkName }))
      }
    })
  }

  const switchToStorageNetwork = () => changeNetwork(STORAGE_CHAIN_ID)

  const SwitchToStorageNetworkButton = () => (
    <ButtonPrimary onClick={switchToStorageNetwork}>
      {t('switchToNetwork', { network: storageNetworkName })}
    </ButtonPrimary>
  )

  return (
    <>
      <Title noMargin>{t('mainConfig')}</Title>
      <Notice margin="0.5rem 0 0">
        {stateRouterConfigChainId && stateRouterConfigAddress ? (
          <ConfigInfo>
            <SubTitle>{t('configInformation')}</SubTitle>
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
                value={routerConfigChainId || chainId}
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
          {onStorageNetwork ? (
            <ButtonPrimary disabled={!canSaveRouterConfig} onClick={saveRouterConfig}>
              {t('saveConfig')}
            </ButtonPrimary>
          ) : (
            <SwitchToStorageNetworkButton />
          )}
        </Accordion>
      ) : (
        <>
          <Title>{t('validatorNodeSettings')}</Title>
          <div>
            1. Sign up to{' '}
            <ConfigLink href="https://aws.amazon.com/" target="_blank" rel="noreferrer">
              aws.amazon.com
            </ConfigLink>{' '}
            and go to{' '}
            <ConfigLink
              href="https://us-east-1.console.aws.amazon.com/ec2/v2/home?region=us-east-1#AMICatalog"
              target="_blank"
              rel="noreferrer"
            >
              AMI Catalog
            </ConfigLink>
          </div>
          <div>
            2. Find <strong>ami-0e44c502f03f004f4</strong> (in &quot;community ami&quot;) -&gt; select -&gt; run
            instance
          </div>
          <div>3. Run instance based on this AMI (no keypair, allow http port).</div>
          <div>
            4. Add your domain to{' '}
            <ConfigLink href="https://cloudflare.com/" target="_blank" rel="noreferrer">
              cloudflare.com
            </ConfigLink>{' '}
            and add subdomain &quot;api.your-domain.com&quot; (in the &quot;DNS&quot; section) linked to the IP
            you&apos;ve got from amazon (&quot;public IP of your instance&quot;. Enable orange cloud, enable SSL -&gt;
            flexible SSL).
            <br />
          </div>
          <div>
            5. Save &quot;https://api.your-domain.com&quot; as &quot;Validator Node Address&quot; to the below field:
          </div>
          <OptionWrapper>
            <strong>{t('validatorNodeAddress')}</strong>
            <Input type="text" value={apiAddress} onChange={event => setApiAddress(event.target.value)} />
            {onStorageNetwork ? (
              <ButtonPrimary onClick={saveApiAddress} disabled={!apiIsValid}>
                {t('saveAddress')}
              </ButtonPrimary>
            ) : (
              <SwitchToStorageNetworkButton />
            )}
          </OptionWrapper>
          <div>
            6. Create a new address in Metamask (or you can use an existing private key at your own risk) and export its
            private key (it will be used as &lt; YOUR PRIVATE KEY &gt; in 7 step) and save this new address as
            &quot;Validator Node Address&quot; to bellow field:
          </div>
          <OptionWrapper>
            <strong>{t('validatorNodeNetworkAddress')}</strong>
            <Input
              type="text"
              placeholder="0x..."
              value={mpcAddress}
              onChange={event => setMpcAddress(event.target.value)}
            />
            {onStorageNetwork ? (
              <ButtonPrimary onClick={saveServerAdminAddress} disabled={!validMpcOptions}>
                {t('saveAdminAddressData')}
              </ButtonPrimary>
            ) : (
              <SwitchToStorageNetworkButton />
            )}
          </OptionWrapper>

          {stateRouterConfigAddress && stateServerAdminAddress && (
            <>
              <SubTitle margin="1.4rem 0 0.5rem">7. {t('startServerWithThisCommand')}</SubTitle>
              <OptionWrapper>
                <Notice warning margin="0.4rem 0 0.6rem">
                  {t('replaceKeyWithValidatorNodeKey', {
                    privateKey: '<YOUR PRIVATE KEY>'
                  })}
                </Notice>
                <Textarea
                  value={commandToStartServer}
                  onChange={event => setCommandToStartServer(event.target.value)}
                />
                <CopyButton onClick={copyServerCommand}>{t('copy')}</CopyButton>
              </OptionWrapper>

              <div>8. Top-up for at least 0.12 in every network you plan to use (BSC, Polygon, etc)</div>
            </>
          )}
        </>
      )}

      <Title>{t('networkRouter')}</Title>
      <Accordion title={t('deployAndSetRouter')} margin="0.5rem 0">
        {chainId && !stateRouterAddress[chainId] ? (
          <>
            <Notice margin="0 0 0.5rem">{t('youNeedOneRouterForEachNetwork')}</Notice>
            <Notice margin="0 0 0.5rem">{t('networkRouterUseDeployed')}</Notice>
            <DeployRouter onDeploymentCallback={onDeployRouter} serverAdminAddress={stateServerAdminAddress} />
          </>
        ) : (
          <span />
        )}

        {!displayRouterSettings ? (
          <OptionWrapper>
            <ButtonOutlined onClick={showRouterSettings}>{t('iHaveAlreadyDeployedNetworkRouter')}</ButtonOutlined>
          </OptionWrapper>
        ) : (
          <OptionWrapper>
            <Notice warning margin="0.4rem 0">
              {t('afterDeploymentFillTheseInputsAndSaveInfo')}
            </Notice>
            <OptionLabel>
              <Select onChange={event => setRouterData(event.target.value)}>
                <SelectOption value="-">{t('networkRouterSelectDeployedOption')}</SelectOption>
                {Object.keys(appSettings.routerConfigs).map((routerKey) => {
                  const routerInfo = appSettings.routerConfigs[routerKey]

                  return (
                    <SelectOption key={routerKey} value={routerKey}>
                      Chain {routerInfo.chainId} ({routerInfo.address})
                    </SelectOption>
                  )
                })}
              </Select>
            </OptionLabel>
            <OptionLabel displayChainsLink>
              {t('routerChainId')}
              <Input
                type="number"
                min="1"
                step="1"
                placeholder=""
                value={routerChainId || chainId}
                onChange={event => setRouterChainId(event.target.value)}
              />
              {t('routerAddress')}
              <Input
                type="text"
                placeholder="0x..."
                value={routerAddress}
                onChange={event => setRouterAddress(event.target.value)}
              />
            </OptionLabel>
            {onConfigNetwork ? (
              <ButtonPrimary onClick={setChainConfig} disabled={!canSaveChainConfig}>
                {t('setChainConfig')}
              </ButtonPrimary>
            ) : (
              <SwitchToStorageNetworkButton />
            )}
          </OptionWrapper>
        )}
      </Accordion>

      <Title>{t('erc20Token')}</Title>
      <Lock enabled={!routerAddress} reason={t('deployRouterFirst')}>
        <Notice margin="0.4rem 0">{t('youNeedCrosschainTokenForEachErc20TokenOnEachNetwork')}</Notice>
        <Notice margin="0.4rem 0">{t('crosschainTokenUseDeployed')}</Notice>
        <OptionWrapper>
          <OptionLabel displayChainsLink>
            {t('erc20ChainId')}
            <Input
              type="number"
              min="1"
              value={underlyingNetworkId || chainId}
              onChange={event => setUnderlyingNetworkId(event.target.value)}
            />
            {t('erc20TokenAddress')}
            <Input type="text" placeholder="0x..." value={underlyingToken} onChange={event => setUnderlyingToken(event.target.value)} />
          </OptionLabel>
        </OptionWrapper>

        <DeployCrosschainToken
          routerAddress={routerAddress}
          underlying={underlying}
          onDeploymentCallback={onDeployCrosschainToken}
        />

        <Accordion title={t('tokenConfig')} margin="0.5rem 0">
          <OptionWrapper>
            <OptionLabel>
              <Select onChange={event => setCrosschainTokenData(event.target.value)}>
                <SelectOption value="-">{t('crosschainTokenSelectDeployedOption')}</SelectOption>
                {Object.keys(appSettings.crosschainTokens).map((ccTokenKey) => {
                  const ccTokenInfo = appSettings.crosschainTokens[ccTokenKey]

                  return (
                    <SelectOption key={ccTokenKey} value={ccTokenKey}>
                      Chain {ccTokenInfo.chainId} ({ccTokenInfo.underlying.symbol}) {ccTokenInfo.contractAddress}
                    </SelectOption>
                  )
                })}
              </Select>
            </OptionLabel>
            <OptionLabel>
              {t('idOfCrosschainTokenNetwork')}
              <Input
                value={crosschainTokenChainId || chainId}
                type="number"
                min="1"
                step="1"
                onChange={event => setCrosschainTokenChainId(event.target.value)}
              />
              {t('crosschainTokenAddress')}
              <Input
                value={crosschainToken}
                type="text"
                placeholder="0x..."
                onChange={event => setCrosschainToken(event.target.value)}
              />
              
              {onConfigNetwork ? (
                <ButtonPrimary onClick={setTokenConfig} disabled={!hasUnderlyingInfo || !onConfigNetwork}>
                  {t(!hasUnderlyingInfo ? 'fillUnderlyingInfo' : 'setTokenConfig')}
                </ButtonPrimary>
              ) : (
                <SwitchToStorageNetworkButton />
              )}
            </OptionLabel>
          </OptionWrapper>
        </Accordion>

        <SwapSettings
          underlying={underlying}
          onConfigNetwork={onConfigNetwork}
          configNetworkName={configNetworkName}
          switchToStorageNetwork={switchToStorageNetwork}
        />
      </Lock>
    </>
  )
}
