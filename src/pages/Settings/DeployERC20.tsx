import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../../hooks'
import { getWeb3Library } from '../../utils/getLibrary'
import { deployInfinityERC20, addToken } from '../../utils/contract'
import { OptionWrapper } from './index'

const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
`

export default function DeployERC20() {
  const { library, account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const [underlying, setUnderlying] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [decimals, setDecimals] = useState(-1)
  // TODO: add mpc address somewhere
  const [vault] = useState('') // mpc  address
  // TODO: get router address somewhere
  const [minter] = useState('')

  const [canDeployToken, setCanDeployToken] = useState(false)

  useEffect(() => {
    setCanDeployToken(
      Boolean(underlying && name && symbol && Number.isInteger(decimals) && decimals > -1 && vault && minter)
    )
  }, [underlying, name, symbol, decimals, vault, minter])

  useEffect(() => {
    const fetchUnderlyingInfo = async () => {
      if (!library || !underlying) return

      try {
        const web3 = getWeb3Library(library.provider)
        //@ts-ignore
        const contract = new web3.eth.Contract(ERC20_ABI, underlying)
        const name = await contract.methods.name().call()
        const symbol = await contract.methods.symbol().call()
        const decimals = await contract.methods.decimals().call()

        setName(`Any${name}`)
        setSymbol(`ANY${symbol}`)
        setDecimals(decimals)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUnderlyingInfo()
  }, [underlying, chainId])

  const onTokenDeployment = async () => {
    if (!chainId || !account) return

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
        onHash: (hash: string) => console.log('deploy Infinity ERC20: ', hash),
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
          {t('infinityERC20')}
          <input
            defaultValue={testERC20Name}
            type="text"
            placeholder="Name"
            onChange={event => setTestERC20Name(event.target.value)}
          />
          <input
            defaultValue={testERC20Symbol}
            type="text"
            placeholder="Symbol"
            onChange={event => setTestERC20Symbol(event.target.value)}
          />
          <button disabled={!(testERC20Name && testERC20Symbol)} onClick={onInfinityERC20Deployment}>
            {t('deployInfinityERC20')}
          </button>
        </OptionWrapper>
      )}

      <OptionWrapper>
        <OptionLabel>
          {t('addressOfERC20Token')}
          <input
            defaultValue={underlying}
            type="text"
            placeholder="0x..."
            onChange={event => setUnderlying(event.target.value)}
          />
        </OptionLabel>
      </OptionWrapper>

      <button disabled={!canDeployToken} onClick={onTokenDeployment}>
        {t('deployCrossChainToken')}
      </button>
    </>
  )
}
