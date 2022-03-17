import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useRouterConfigContract } from '../../hooks/useContract'
import { useAppState } from '../../state/application/hooks'
import DeployAnyERC20 from './DeployERC20'
import DeployRouter from './DeployRouter'
import DeployRouterConfig from './DeployRouterConfig'
import { ButtonPrimary } from '../../components/Button'

const ZoneWrapper = styled.div`
  margin: 0.3rem 0;
  padding: 0.3rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.text3};
`

export default function Contracts() {
  const { chainId, account } = useActiveWeb3React()
  const { t } = useTranslation()

  const { routerConfigChainId, routerConfigAddress: stateRouterConfigAddress } = useAppState()

  // TODO: fetch routerAddress for this network somewhere
  const [routerAddress, setRouterAddress] = useState('')
  const [routerConfigAddress, setRouterConfigAddress] = useState(stateRouterConfigAddress)

  useEffect(() => {
    console.group('%c addresses was updated', 'color: green')
    console.log('routerAddress: ', routerAddress)
    console.log('routerConfigAddress: ', routerConfigAddress)
    console.groupEnd()
  }, [routerAddress, routerConfigAddress])

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

  const startTokenAddition = async () => {
    if (!routerConfig) return

    try {
      await routerConfig.methods.setTokenConfig().send({
        from: account
      })
      await routerConfig.methods.setTokenConfig().send({
        from: account
      })

      await routerConfig.methods.setSwapConfig().send({
        from: account
      })
      await routerConfig.methods.setSwapConfig().send({
        from: account
      })
    } catch (error) {}
  }

  return (
    <div>
      {/* TODO: do not show Router compoinent if we have deployed Router for the current network */}
      <ZoneWrapper>
        <DeployRouter onNewRouter={onNewRouter} />
      </ZoneWrapper>

      <ZoneWrapper>
        <DeployAnyERC20 routerAddress={routerAddress} />
      </ZoneWrapper>

      {/* TODO: notice about ability to deploy to any network only once */}
      {!stateRouterConfigAddress && (
        <ZoneWrapper>
          <DeployRouterConfig onNewConfig={onNewConfig} />
        </ZoneWrapper>
      )}

      {/* 

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

      */}

      {/* 

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
      
      */}

      <ButtonPrimary
        // disabled={!canStartAddition || pending}
        onClick={startTokenAddition}
      >
        {t('setupConfigs')}
      </ButtonPrimary>
    </div>
  )
}
