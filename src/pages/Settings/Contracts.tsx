import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../../hooks'
import { getWeb3Library } from '../../utils/getLibrary'
import { addToken } from '../../utils/contract'
import { OptionWrapper } from './index'

const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
`

export default function Contracts() {
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

  return (
    <div>
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

      {/* <OptionWrapper>
            <OptionLabel>
              Name
              <input
                defaultValue={name}
                type="text"
                placeholder="0x..."
                onChange={event => setName(event.target.value)}
              />
            </OptionLabel>
          </OptionWrapper>

          <OptionWrapper>
            <OptionLabel>
              Symbol
              <input
                defaultValue={symbol}
                type="text"
                placeholder="0x..."
                onChange={event => setSymbol(event.target.value)}
              />
            </OptionLabel>
          </OptionWrapper> */}

      <button disabled={!canDeployToken} onClick={onTokenDeployment}>
        {t('deployCrossChainToken')}
      </button>
    </div>
  )
}
