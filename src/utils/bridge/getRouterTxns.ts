import V2Factory from '../../constants/abis/v2_factory.json'

// import { getContract, web3Fn } from '../tools/web3Utils'
import { getContract } from '../tools/web3Utils'

import config from '../../config'

const contract = getContract(V2Factory)

export function getPairs (chainId:any, tokenA: any, tokenB:any) {
  return new Promise(resolve => {
    if (
      !chainId
      || !tokenA
      || !tokenB
    ) resolve(false)
    else {
      // console.log(chainId)
      // console.log(tokenA)
      // console.log(tokenB)
      contract.options.address = config.getCurChainInfo(chainId).v2FactoryToken
      contract.methods.getPair(tokenA, tokenB).call((err:any, res:any) => {
        if (err) {
          resolve(false)
        } else {
          // console.log(res)
          resolve(res)
        }
      })
    }
  })
}