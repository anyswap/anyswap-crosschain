import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { EVM_ADDRESS_REGEXP, ZERO_ADDRESS } from '../../constants'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useMainConfigContract } from '../../hooks/useContract'
import { useAppState } from '../../state/application/hooks'
import { deployCrosschainERC20 } from '../../utils/contract'
import { ButtonPrimary } from '../../components/Button'

export default function DeployCrosschainToken({
  routerAddress,
  underlying,
  onDeploymentCallback
}: {
  routerAddress: string
  underlying: { [k: string]: any }
  onDeploymentCallback: (contractAddress: string, chainId: number, hash: string) => void
}) {
  const { library, account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const { appSettings: { mainConfigAddress, mainConfigChainId, crosschainTokens } } = useAppState()

  const routerConfig = useMainConfigContract(mainConfigAddress, mainConfigChainId || 0)

  const [pending, setPending] = useState(false)

  const [vault, setVault] = useState('')
  const [minter, setMinter] = useState('')

  useEffect(() => setVault(routerAddress), [routerAddress]) // https://github.com/noxonsu/CrossChain-Router/blob/main/README.md?plain=1#L44
  useEffect(() => setMinter(routerAddress), [routerAddress]) // https://github.com/noxonsu/CrossChain-Router/blob/main/README.md?plain=1#L45

  const [crosschainTokenAddress, setCrosschainTokenAddress] = useState<string | undefined>(undefined)
  const [canDeployCrosschainToken, setCanDeployCrosschainToken] = useState(false)

  useEffect(() => {
    setCanDeployCrosschainToken(
      Boolean(
        underlying.address && underlying.name && underlying.symbol && underlying.decimals > -1 && vault && minter
      ) && !crosschainTokenAddress
    )
  }, [underlying.address, underlying.name, underlying.symbol, underlying.decimals, vault, minter])

  useEffect(() => {
    const fetchUnderlyingInfo = async () => {
      if (!underlying.symbol || !underlying.networkId || !routerConfig) return

      try {
        const tokenConfig = await routerConfig.methods
          .getTokenConfig(underlying.symbol.toUpperCase(), underlying.networkId)
          .call()

        if (tokenConfig.ContractAddress && tokenConfig.ContractAddress !== ZERO_ADDRESS) {
          setCrosschainTokenAddress(tokenConfig.ContractAddress)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (chainId && underlying?.address?.match(EVM_ADDRESS_REGEXP)) {
      fetchUnderlyingInfo()
    }
  }, [chainId, underlying.address, underlying.networkId])

  const hasCrosschainTokenOnChain = () => {
    const contractsOnChain = Object.keys(crosschainTokens).filter((contractKey) => {
      const contractInfo = crosschainTokens[contractKey]
      return (contractInfo.underlying.networkId == underlying.networkId && contractInfo.underlying.address == underlying.address)
    })
    return !(contractsOnChain.length === 0)
  }

  const onTokenDeployment = async () => {
    console.log('>>> onTokenDeployment', chainId, account, vault, hasCrosschainTokenOnChain())
    if (!chainId || !account || !vault) return

    const breakDeployment = !(hasCrosschainTokenOnChain() ? confirm(`You are already has deployed contract on this network. Deploy new?`) : true)
    console.log('>>> breakDeployment', breakDeployment)
    if (breakDeployment) return

    setPending(true)

    try {
      await deployCrosschainERC20({
        chainId,
        library,
        account,
        underlying: underlying.address,
        name: `Crosschain${underlying.name}`,
        symbol: `CC${underlying.symbol}`,
        decimals: underlying.decimals,
        vault,
        minter,
        onDeployment: ({
          address,
          chainId,
          hash,
          name
        }: {
          address: string
          chainId: number
          hash: string
          name: string
        }) => {
          addTransaction(
            { hash },
            {
              summary: `Deployment: chain ${chainId}; CROSSCHAIN TOKEN ${name} ${address}`
            }
          )
          onDeploymentCallback(address, chainId, hash)
        }
      })
    } catch (error) {
      console.error(error)
    }

    setPending(false)
  }

  return (
    <>
      <ButtonPrimary disabled={!canDeployCrosschainToken || pending} onClick={onTokenDeployment}>
        {t('deployCrossChainToken')}
      </ButtonPrimary>
    </>
  )
}
