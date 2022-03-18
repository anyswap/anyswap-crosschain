import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useRouterConfigContract } from '../../hooks/useContract'
import { useAppState } from '../../state/application/hooks'
import DeployCrosschainToken from './DeployCrosschainToken'
import DeployRouter from './DeployRouter'
import DeployRouterConfig from './DeployRouterConfig'
import { ButtonPrimary } from '../../components/Button'
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

const InstructionsList = styled.ul`
  margin: 0;
  padding: 0 0 0 1.2rem;
  list-style: circle;
`

export default function Contracts() {
  const { chainId, account } = useActiveWeb3React()
  const { t } = useTranslation()

  const {
    routerConfigChainId,
    routerConfigAddress: stateRouterConfigAddress,
    routerAddress: stateRouterAddress
  } = useAppState()
  const [routerAddress, setRouterAddress] = useState('')
  const [routerConfigAddress, setRouterConfigAddress] = useState(stateRouterConfigAddress)

  useEffect(() => {
    console.group('%c addresses was updated', 'color: green')
    console.log('stateRouterAddress: ', stateRouterAddress)
    console.log('stateRouterConfigAddress: ', stateRouterConfigAddress)
    console.groupEnd()

    if (chainId !== undefined && stateRouterAddress[chainId]) {
      setRouterAddress(stateRouterAddress[chainId])
    } else {
      setRouterAddress('')
    }
  }, [chainId])

  const onNewRouter = (address: string) => setRouterAddress(address)
  const onNewConfig = (address: string) => setRouterConfigAddress(address)

  useEffect(() => {
    const fetchRouterAddresses = async () => {
      // setRouterAddress()
    }

    if (chainId && stateRouterConfigAddress) fetchRouterAddresses()
  }, [chainId, stateRouterConfigAddress])

  const routerConfig = useRouterConfigContract(routerConfigAddress, routerConfigChainId || 0)
  // const [canStartAddition] = useState(true)

  // useEffect(() => {
  //   setCanStartAddition()
  // }, [])

  const setChainConfig = async () => {
    if (!routerConfig) return

    try {
      // setChainConfig(uint256 chainID, ChainConfig config)
      // source chain id,[base currency symbol, "router address", 3, 0]
      await routerConfig.methods.setChainConfig().send({
        from: account
      })
      // target chain id,[base currency symbol, "router address", 3, 0]
      await routerConfig.methods.setChainConfig().send({
        from: account
      })
    } catch (error) {}
  }

  const setTokenConfig = async () => {
    if (!routerConfig) return

    try {
      /* 
      for the source network
      setTokenConfig(string tokenID, uint256 chainID, TokenConfig config)
      tokenId: symbol
      chainID: source chain id
      config: [decimals, "crosschain erc20 address", crosschain version]

      for the target network
      setTokenConfig(string tokenID, uint256 chainID, TokenConfig config)
      tokenId: symbol
      chainID: target chain id
      config: [decimals, "crosschain erc20 address", crosschain version]
      */
      await routerConfig.methods.setTokenConfig().send({
        from: account
      })
      await routerConfig.methods.setTokenConfig().send({
        from: account
      })
    } catch (error) {}
  }

  const setSwapConfig = async () => {
    if (!routerConfig) return

    try {
      /* 
      for the source network
      setSwapConfig(string tokenID, uint256 toChainID, SwapConfig config)
      tokenId: symbol
      chainID: source chain id
      // WEI value
      config: [MaximumSwap amount, MinimumSwap amount, BigValueThreshold, SwapFeeRatePerMillion, MaximumSwapFee, MinimumSwapFee]

      for the target network
      setSwapConfig(string tokenID, uint256 toChainID, SwapConfig config)
      tokenId: symbol
      chainID: target chain id
      config: [MaximumSwap amount, MinimumSwap amount, BigValueThreshold, SwapFeeRatePerMillion, MaximumSwapFee, MinimumSwapFee]
      */
      await routerConfig.methods.setSwapConfig().send({
        from: account
      })
      await routerConfig.methods.setSwapConfig().send({
        from: account
      })
    } catch (error) {}
  }

  /* 
  user has to switch between networks to configure all in a right way
  TODO: create some a store area where we can save data from different networks
  TODO: finally ask the user to switch to RouterConfig network to complete all settings 
  */

  return (
    <div>
      <Notice>
        <InstructionsList>
          <li>{t('youNeedToDeployOnlyOneRouterConfigContract')}</li>
          <li>{t('youNeedToDeployRouterContractForEachNetwork')}</li>
          <li>{t('youNeedToDeployCrosschainTokenForEachSourceTokenOnEachNetwork')}</li>
          <li>{t('youNeedToBeOnRouterConfigNetworkToSetSettings')}</li>
          <li>{t('finallyYouNeedToSwitchToRouterConfigNetworkAndFinishSettingUp')}</li>
        </InstructionsList>
      </Notice>

      {!stateRouterConfigAddress && (
        <>
          <ZoneWrapper>
            <DeployRouterConfig onNewConfig={onNewConfig} />
          </ZoneWrapper>
        </>
      )}

      {!routerAddress && (
        <ZoneWrapper blocked={!routerConfigAddress}>
          <DeployRouter onNewRouter={onNewRouter} />
        </ZoneWrapper>
      )}

      <ZoneWrapper blocked={!(routerConfigAddress || routerAddress)}>
        <DeployCrosschainToken routerAddress={routerAddress} />
      </ZoneWrapper>

      <ZoneWrapper blocked={!(routerConfigAddress || routerAddress)}>
        <ButtonPrimary
          margin=".2rem 0"
          fullWidth
          // disabled={pending}
          onClick={setChainConfig}
        >
          {t('setChainConfigs')}
        </ButtonPrimary>
        <ButtonPrimary
          margin=".2rem 0"
          fullWidth
          // disabled={pending}
          onClick={setTokenConfig}
        >
          {t('setTokenConfigs')}
        </ButtonPrimary>
        <ButtonPrimary
          margin=".2rem 0"
          fullWidth
          // disabled={pending}
          onClick={setSwapConfig}
        >
          {t('setSwapConfigs')}
        </ButtonPrimary>
      </ZoneWrapper>
    </div>
  )
}
