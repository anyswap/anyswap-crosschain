import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../../hooks'
import { getWeb3Library } from '../../utils/getLibrary'
import { deployInfinityERC20, addToken } from '../../utils/contract'
// import config from '../../config'

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

export default function DeployERC20() {
  const { library, account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const [pending, setPending] = useState(false)
  const [underlying, setUnderlying] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [decimals, setDecimals] = useState(-1)
  const [vault] = useState(account)

  // TODO: get router address somewhere
  /* 
  build ONCHAIN_CONFIG contract
  fetch getChainConfig and take router address
  */
  const [minter] = useState('')

  const [canDeployToken, setCanDeployToken] = useState(false)

  useEffect(() => {
    setCanDeployToken(
      Boolean(
        underlying && name && symbol && Number.isInteger(decimals) && decimals > -1
        // && vault && minter
      )
    )
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

        setName(`CROSS${name}`)
        setSymbol(`CC${symbol}`)
        setDecimals(decimals)
      } catch (error) {
        console.error(error)
      }

      setPending(false)
    }

    if (chainId && underlying.match(/^0x[A-Fa-f0-9]{40}$/)) {
      fetchUnderlyingInfo()
    }
  }, [underlying, chainId])

  const onTokenDeployment = async () => {
    if (!chainId || !account || !vault) return

    try {
      await addToken({
        chainId,
        toChainId: -1,
        mpc: '',
        mpcPubKey: '',
        library,
        account,
        name,
        symbol,
        decimals,
        underlying,
        vault,
        minter,
        routerConfig: '',
        onHash: (hash: string) => {
          console.log('hash: ', hash)
        }
      })
    } catch (error) {
      console.error(error)
      // addPopup({
      //   error: {
      //     message: error.message,
      //     code: error.code
      //   }
      // })
      // setAttemptingTxn(false)
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
      {true && (
        <OptionWrapper>
          {t('newERC20')}
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
    </>
  )
}
