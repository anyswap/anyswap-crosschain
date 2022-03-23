import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { EVM_ADDRESS_REGEXP } from '../../constants'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useRouterConfigContract } from '../../hooks/useContract'
import { useAppState } from '../../state/application/hooks'
import { getWeb3Library } from '../../utils/getLibrary'
import { deployInfinityERC20, deployCrosschainERC20 } from '../../utils/contract'

const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  font-size: 1.2rem;
`

const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  padding: 0.4rem 0;
  margin: 0.2rem 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.text3};
  outline: none;
  font-size: inherit;
  background-color: transparent;
  color: inherit;
`

const Button = styled.button`
  cursor: pointer;
  width: 100%;
  font-size: inherit;
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem;
`

export default function DeployCrosschainToken({ routerAddress }: { routerAddress: string }) {
  const { library, account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const { routerConfigChainId, routerConfigAddress } = useAppState()
  const routerConfig = useRouterConfigContract(routerConfigAddress, routerConfigChainId || 0, true)

  const [deployNewErc20] = useState(process.env.NODE_ENV === 'development' && false)
  const [pending, setPending] = useState(false)

  const [underlying, setUnderlying] = useState('')
  const [underlyingName, setUnderlyingName] = useState('')
  const [, setUnderlyingSymbol] = useState('')

  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [decimals, setDecimals] = useState(-1)

  const [vault] = useState(account)
  const [minter, setMinter] = useState('')

  useEffect(() => setMinter(routerAddress), [routerAddress])

  const [canDeployToken, setCanDeployToken] = useState(false)

  useEffect(() => {
    setCanDeployToken(Boolean(underlying && name && symbol && decimals > -1 && vault && minter))
  }, [underlying, name, symbol, decimals, vault, minter])

  useEffect(() => {
    const fetchUnderlyingInfo = async () => {
      if (!library || !underlying) return

      setPending(true)

      try {
        const web3 = getWeb3Library(library.provider)
        const code = await web3.eth.getCode(underlying)

        if (code === '0x') return setPending(false)

        //@ts-ignore
        const contract = new web3.eth.Contract(ERC20_ABI, underlying)
        const name = await contract.methods.name().call()
        const symbol = await contract.methods.symbol().call()
        const decimals = await contract.methods.decimals().call()

        setUnderlyingName(name)
        setUnderlyingSymbol(symbol)
        setName(`Crosschain${name}`)
        setSymbol(`CC${symbol}`)
        setDecimals(decimals)

        if (routerConfig) {
          const swapConfig = await routerConfig.getSwapConfig(underlyingName, chainId)

          console.log('swapConfig: ', swapConfig)
        }
      } catch (error) {
        console.error(error)
      }

      setPending(false)
    }

    if (chainId && underlying.match(EVM_ADDRESS_REGEXP)) {
      fetchUnderlyingInfo()
    }
  }, [underlying, chainId])

  const [crosschainTokenChainId, setCrosschainTokenChainId] = useState<number | undefined>(undefined)
  const [crosschainTokenAddress, setCrosschainTokenAddress] = useState<string | undefined>(undefined)

  const setTokenConfig = async () => {
    if (!routerConfig || !underlyingName) return

    const VERSION = 6

    try {
      await routerConfig.setTokenConfig(underlyingName, crosschainTokenChainId, {
        Decimals: decimals,
        ContractAddress: crosschainTokenAddress,
        ContractVersion: VERSION
      })
    } catch (error) {
      console.error(error)
    }
  }

  const [minimumSwap, setMinimumSwap] = useState<string | undefined>(undefined)
  const [maximumSwap, setMaximumSwap] = useState<string | undefined>(undefined)
  const [minimumSwapFee, setMinimumSwapFee] = useState<string | undefined>(undefined)
  const [maximumSwapFee, setMaximumSwapFee] = useState<string | undefined>(undefined)
  const [bigValueThreshold, setBigValueThreshold] = useState<string | undefined>(undefined)
  const [swapFeeRatePerMillion, setSwapFeeRatePerMillion] = useState<string | undefined>(undefined)

  const setSwapConfig = async () => {
    if (!routerConfig || !underlyingName) return

    /* 
    template data:

    1000000
    "MaximumSwap": 1000000000000000000000000, 

    100
    "MinimumSwap": 100000000000000000000,

    100000
    "BigValueThreshold": 100000000000000000000000,

    0.001
    "SwapFeeRatePerMillion": 1000,
    
    10
    "MaximumSwapFee": 10000000000000000000,

    1.5
    "MinimumSwapFee": 1500000000000000000
    */

    // TODO: convert values to contract format

    try {
      await routerConfig.setSwapConfig(underlyingName, chainId, {
        MinimumSwap: minimumSwap,
        MaximumSwap: maximumSwap,
        MinimumSwapFee: minimumSwapFee,
        MaximumSwapFee: maximumSwapFee,
        BigValueThreshold: bigValueThreshold,
        SwapFeeRatePerMillion: swapFeeRatePerMillion
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onTokenDeployment = async () => {
    if (!chainId || !account || !vault) return

    try {
      await deployCrosschainERC20({
        chainId,
        library,
        account,
        name,
        symbol,
        decimals,
        underlying,
        vault,
        minter,
        onHash: (hash: string) => {
          console.log('hash: ', hash)
        },
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
          setCrosschainTokenAddress(address)
          setCrosschainTokenChainId(chainId)
          addTransaction(
            { hash },
            {
              summary: `Deployment: chain ${chainId}; crosschain token ${address}`
            }
          )
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const [testERC20Name, setTestERC20Name] = useState('')
  const [testERC20Symbol, setTestERC20Symbol] = useState('')

  const onInfinityERC20Deployment = async () => {
    try {
      await deployInfinityERC20({
        library,
        account,
        onHash: (hash: string) => console.log('deploy new ERC20: ', hash),
        name: testERC20Name,
        symbol: testERC20Symbol,
        decimals: 18
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {deployNewErc20 && (
        <OptionWrapper>
          {t('newERC20')} ({t('optional')})
          <Input
            defaultValue={testERC20Name}
            type="text"
            placeholder="Name"
            onChange={event => setTestERC20Name(event.target.value)}
          />
          <Input
            defaultValue={testERC20Symbol}
            type="text"
            placeholder="Symbol"
            onChange={event => setTestERC20Symbol(event.target.value)}
          />
          <Button disabled={!(testERC20Name && testERC20Symbol) || pending} onClick={onInfinityERC20Deployment}>
            {t('deployInfinityERC20')}
          </Button>
        </OptionWrapper>
      )}
      <OptionWrapper>
        <OptionLabel>
          {t('addressOfERC20Token')}
          <Input
            disabled={pending}
            defaultValue={underlying}
            type="text"
            placeholder="0x..."
            onChange={event => setUnderlying(event.target.value)}
          />
        </OptionLabel>
      </OptionWrapper>
      <Button disabled={!canDeployToken || pending} onClick={onTokenDeployment}>
        {t('deployCrossChainToken')}
      </Button>

      <OptionWrapper>
        <OptionLabel>
          {/* {t('')} */}
          ID of the crosschain token network
          <Input
            disabled={pending}
            defaultValue={crosschainTokenChainId}
            type="number"
            onChange={event => setCrosschainTokenChainId(Number(event.target.value))}
          />
        </OptionLabel>
      </OptionWrapper>
      <OptionWrapper>
        <OptionLabel>
          {/* {t('')} */}
          Crosschain token address
          <Input
            disabled={pending}
            defaultValue={crosschainTokenAddress}
            type="text"
            placeholder="0x123..."
            onChange={event => setCrosschainTokenAddress(event.target.value)}
          />
        </OptionLabel>
      </OptionWrapper>
      <Button disabled={!underlyingName || !chainId || !decimals || pending} onClick={setTokenConfig}>
        {t('setTokenConfig')}
      </Button>

      <OptionWrapper>
        <OptionWrapper>
          <OptionLabel>
            {/* {t('')} */}
            Minimum swap amount
            <Input defaultValue={minimumSwap} type="number" onChange={event => setMinimumSwap(event.target.value)} />
          </OptionLabel>
        </OptionWrapper>

        <OptionWrapper>
          <OptionLabel>
            {/* {t('')} */}
            Maximum swap amount
            <Input defaultValue={maximumSwap} type="number" onChange={event => setMaximumSwap(event.target.value)} />
          </OptionLabel>
        </OptionWrapper>

        <OptionWrapper>
          <OptionLabel>
            {/* {t('')} */}
            Minimum swap fee
            <Input
              defaultValue={minimumSwapFee}
              type="number"
              onChange={event => setMinimumSwapFee(event.target.value)}
            />
          </OptionLabel>
        </OptionWrapper>

        <OptionWrapper>
          <OptionLabel>
            {/* {t('')} */}
            Maximum swap fee
            <Input
              defaultValue={maximumSwapFee}
              type="number"
              onChange={event => setMaximumSwapFee(event.target.value)}
            />
          </OptionLabel>
        </OptionWrapper>

        <OptionWrapper>
          <OptionLabel>
            {/* {t('')} */}
            Big value threshold (what is this and how does it affect the swap?)
            <Input
              defaultValue={bigValueThreshold}
              type="number"
              onChange={event => setBigValueThreshold(event.target.value)}
            />
          </OptionLabel>
        </OptionWrapper>

        <OptionWrapper>
          <OptionLabel>
            {/* {t('')} */}
            Swap fee rate per million (what is this?) swapFeeRatePerMillion
            <Input
              defaultValue={swapFeeRatePerMillion}
              type="number"
              onChange={event => setSwapFeeRatePerMillion(event.target.value)}
            />
          </OptionLabel>
        </OptionWrapper>

        <Button disabled={pending} onClick={setSwapConfig}>
          {t('setSwapConfig')}
        </Button>
      </OptionWrapper>
    </>
  )
}
