import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { EVM_ADDRESS_REGEXP, ZERO_ADDRESS } from '../../constants'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useRouterConfigContract } from '../../hooks/useContract'
import { useAppState } from '../../state/application/hooks'
import { getWeb3Library } from '../../utils/getLibrary'
import {
  // deployInfinityERC20,
  deployCrosschainERC20
} from '../../utils/contract'
import { Button } from './Contracts'

export default function DeployCrosschainToken({
  routerAddress,
  underlying
}: {
  routerAddress: string
  underlying: {
    address: string
    name: string
    symbol: string
    decimals: number
  }
}) {
  const { library, account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const { routerConfigChainId, routerConfigAddress } = useAppState()

  const routerConfig = useRouterConfigContract(routerConfigAddress, routerConfigChainId || 0)

  const [pending, setPending] = useState(false)

  const [vault, setVault] = useState(account)
  const [minter, setMinter] = useState('')

  useEffect(() => setVault(account), [account])
  useEffect(() => setMinter(routerAddress), [routerAddress])

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
      if (!library || !underlying.address || !routerConfig) return

      try {
        const web3 = getWeb3Library(library.provider)
        const code = await web3.eth.getCode(underlying.address)

        if (code === '0x') return setPending(false)

        //@ts-ignore
        const contract = new web3.eth.Contract(ERC20_ABI, underlying.address)
        const name = await contract.methods.name().call()

        const tokenConfig = await routerConfig.methods.getTokenConfig(name, chainId).call()

        if (tokenConfig.ContractAddress && tokenConfig.ContractAddress !== ZERO_ADDRESS) {
          setCrosschainTokenAddress(tokenConfig.ContractAddress)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (chainId && underlying.address.match(EVM_ADDRESS_REGEXP)) {
      fetchUnderlyingInfo()
    }
  }, [underlying.address, chainId])

  const onTokenDeployment = async () => {
    if (!chainId || !account || !vault) return

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
        }
      })
    } catch (error) {
      console.error(error)
    }

    setPending(false)
  }

  // const [testERC20Name, setTestERC20Name] = useState('')
  // const [testERC20Symbol, setTestERC20Symbol] = useState('')

  // const onInfinityERC20Deployment = async () => {
  //   setPending(true)

  //   try {
  //     await deployInfinityERC20({
  //       library,
  //       account,
  //       onHash: (hash: string) => console.log('deploy new ERC20: ', hash),
  //       name: testERC20Name,
  //       symbol: testERC20Symbol,
  //       decimals: 18
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }

  //   setPending(false)
  // }

  return (
    <>
      {/* <p>
        {t('newERC20')}
        <input type="text" placeholder="Token name" onChange={event => setTestERC20Name(event.target.value)} />
        <input type="text" placeholder="Token symbol" onChange={event => setTestERC20Symbol(event.target.value)} />
        <button onClick={onInfinityERC20Deployment}>Deploy ERC20</button>
      </p> */}

      <Button disabled={!canDeployCrosschainToken || pending} onClick={onTokenDeployment}>
        {t('deployCrossChainToken')}
      </Button>
    </>
  )
}
