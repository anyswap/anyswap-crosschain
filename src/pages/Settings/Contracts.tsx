import React, { useState } from 'react'
import { deployAnyswapERC20, deployAnyswapRouter, deployRouterConfig } from '../../utils/contract'

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
  const [
    currentOption
    // setCurrentOption
  ] = useState(Option.AddToken)

  const onDeployment = async ({ contract }: { contract: Contract }) => {
    try {
      await deploy[contract]({})
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
        <button onClick={() => onDeployment({ contract: Contract.AnyswapERC20 })}>Deploy token</button>
      ) : (
        <>
          <button onClick={() => onDeployment({ contract: Contract.AnyswapRouter })}>Deploy AnyswapRouter</button>
          <button onClick={() => onDeployment({ contract: Contract.AnyswapRouterConfig })}>Deploy Config</button>
        </>
      )}
    </div>
  )
}
