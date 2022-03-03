import React, { useState, useEffect } from 'react'
import { ERC20_ABI } from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../../hooks'
import { getWeb3Library } from '../../utils/getLibrary'
import { deployAnyswapERC20, deployAnyswapRouter, deployRouterConfig } from '../../utils/contract'
import { OptionWrapper } from './index'

enum Option {
  AddToken,
  AddBlockchain
}

enum Contract {
  AnyswapERC20,
  AnyswapRouter,
  AnyswapRouterConfig
}

const deploy = {
  [Contract.AnyswapERC20]: deployAnyswapERC20,
  [Contract.AnyswapRouter]: deployAnyswapRouter,
  [Contract.AnyswapRouterConfig]: deployRouterConfig
}

export default function Contracts() {
  /* 
  display options:
  1. add a token (choose source and target networks)
  2. add a blockchain

  for 1 - deploy AnyswapERC20 for source/target networks
  TODO: call methods: ...

  for 2 - deploy AnyswapRouter (and RouterConfig?)
  ? also deploy AnyswapERC20 for each token from the source network ?
  TODO: call methods: ...
  
  */
  const { library, account, chainId } = useActiveWeb3React()

  const [
    currentOption
    // setCurrentOption
  ] = useState(Option.AddToken)

  const [underlying, setUnderlying] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [decimals, setDecimals] = useState('')
  // TODO: add mpc address somewhere
  const [vault] = useState('') // mpc  address
  // TODO: get router address somewhere
  const [minter] = useState('')

  useEffect(() => {
    const fetchUnderlyingInfo = async () => {
      if (!library || !underlying) return

      try {
        const web3 = getWeb3Library(library.provider)
        //@ts-ignore
        const contract = new web3.eth.Contract(ERC20_ABI, underlying)
        const decimals = await contract.methods.decimals().call()

        setDecimals(decimals)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUnderlyingInfo()
  }, [underlying, chainId])

  const onDeployment = async ({ contract, params }: { contract: Contract; params: { [k: string]: any } }) => {
    try {
      await deploy[contract]({
        ...params,
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
      <h4>Option: {currentOption}</h4>

      {currentOption === Option.AddToken ? (
        <>
          <OptionWrapper>
            <label>
              Address of the your ERC20 token
              <input
                defaultValue={underlying}
                type="text"
                placeholder="0x..."
                onChange={event => setUnderlying(event.target.value)}
              />
            </label>
          </OptionWrapper>

          <OptionWrapper>
            <label>
              Name
              <input
                defaultValue={name}
                type="text"
                placeholder="0x..."
                onChange={event => setName(event.target.value)}
              />
            </label>
          </OptionWrapper>

          <OptionWrapper>
            <label>
              Symbol
              <input
                defaultValue={symbol}
                type="text"
                placeholder="0x..."
                onChange={event => setSymbol(event.target.value)}
              />
            </label>
          </OptionWrapper>

          {/* <OptionWrapper>
            <label>
              Decimals
              <input
                defaultValue={decimals}
                type="text"
                placeholder="0x..."
                onChange={event => setDecimals(event.target.value)}
              />
            </label>
          </OptionWrapper> */}

          <button
            onClick={() =>
              onDeployment({
                contract: Contract.AnyswapERC20,
                params: {
                  library,
                  account,
                  name,
                  symbol,
                  decimals,
                  underlying,
                  vault,
                  minter
                }
              })
            }
          >
            Deploy token
          </button>
        </>
      ) : (
        <>
          <button onClick={() => onDeployment({ contract: Contract.AnyswapRouter, params: {} })}>
            Deploy AnyswapRouter
          </button>
          <button onClick={() => onDeployment({ contract: Contract.AnyswapRouterConfig, params: {} })}>
            Deploy Config
          </button>
        </>
      )}
    </div>
  )
}
