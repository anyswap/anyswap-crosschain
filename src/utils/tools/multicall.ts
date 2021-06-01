import * as multicall from '@makerdao/multicall'
// import { MULTICALL_ABI } from '../../constants/multicall'
// import {getContract} from './web3Utils'

// const crontract = getContract(MULTICALL_ABI)

// console.log(crontract)

// import * as multicall from '@makerdao/multicall'
import config from '../../config'


export function getData (chainId:any) {
  const multicallConfig = {
    rpcUrl: config.getCurChainInfo(chainId).nodeRpc,
    multicallAddress: config.getCurChainInfo(chainId).multicalToken
  }
  const token = config.getCurBridgeConfigInfo(chainId).bridgeConfigToken
  // const callArr = [{
  //   target: token,
  //   call: ['getAllTokenIDs()(string[])'],
  //   returns: [['QQQ']]
  // }]
  const callArr = [
    {
      target: token,
      // components: [{ type: 'uint256' }, { type: 'address' }, { type: 'uint256' }],
      call: ['getAllMultichainTokens(string)(uint256[])', 'anyUSDC'],
      returns: [['QQQ']]
    }
  ]
  // const callArr = [{
  //   target: token,
  //   call: ['getTokenConfig(string)(address[])', 'anyUSDC'],
  //   returns: [['QQQ']]
  // }]
  multicall.aggregate([...callArr], multicallConfig).then((res:any) => {
    
    console.log(res)
  }).catch((err:any) => {
    console.log(err)
  })
}

