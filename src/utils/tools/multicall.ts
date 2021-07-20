import * as multicall from '@makerdao/multicall'
// import { MULTICALL_ABI } from '../../constants/multicall'
// import {getContract} from './web3Utils'

// const crontract = getContract(MULTICALL_ABI)

// console.log(crontract)

// import * as multicall from '@makerdao/multicall'
import config from '../../config'

export function useMulticall (chainId:any, call:any) {
  return new Promise(resolve => {
    const multicallConfig = {
      rpcUrl: config.getCurChainInfo(chainId).nodeRpc,
      multicallAddress: config.getCurChainInfo(chainId).multicalToken
    }
    multicall.aggregate([...call], multicallConfig).then((res:any) => {
      // console.log(res)
      resolve({
        msg: 'Success',
        info: res.results.original
      })
    }).catch((err:any) => {
      // console.log(err)
      resolve({
        msg: 'Error',
        info: err
      })
    })
  })
}

export function getData (chainId:any) {
  const token = config.getCurConfigInfo().bridgeConfigToken
  const callArr = [
    {
      target: token,
      call: ['getAllMultichainTokens(string)(address[])', 'anyUSDC'],
      returns: [['QQQ']]
    }
  ]
  useMulticall(chainId, callArr).then(res => {
    console.log(res)
  })
}

