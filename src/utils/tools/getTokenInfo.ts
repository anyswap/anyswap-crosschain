import {getContract, web3Fn} from './web3Utils'
import {getLocalConfig, setLocalConfig, formatWeb3Str} from './tools'
import config from '../../config'

const TOKENINFO = 'TOKENINFO'
const UNKNOWN = 'UNKNOWN'
const contract = getContract()

function getTokenNetworkInfo (token:any, chainId:any) {
  return new Promise(resolve => {
    const data = {
      name: UNKNOWN,
      symbol: UNKNOWN
    }
    web3Fn.setProvider(config.getCurChainInfo(chainId).nodeRpc)
    const batch = new web3Fn.BatchRequest()
    contract.options.address = token

    const nData = contract.methods.name().encodeABI()
    batch.add(web3Fn.eth.call.request({data: nData, to: token}, 'latest', (err:any, res:any) => {
      if (err) {
        data.name = UNKNOWN
      } else {
        data.name = web3Fn.utils.hexToUtf8(formatWeb3Str(res)[2])
      }
    }))

    const sData = contract.methods.symbol().encodeABI()
    batch.add(web3Fn.eth.call.request({data: sData, to: token}, 'latest', (err:any, res:any) => {
      if (err) {
        data.symbol = UNKNOWN
      } else {
        data.symbol = web3Fn.utils.hexToUtf8(formatWeb3Str(res)[2])
      }
      setLocalConfig(TOKENINFO, token, chainId, TOKENINFO, {data: data}, 1)
      resolve(data)
    }))

    batch.execute()
  })
}

export default function getTokenInfo (token:any, chainId:any) {
  const lData = getLocalConfig(TOKENINFO, token, chainId, TOKENINFO, 1000 * 60 * 60 * 24 * 1000, 1)
  // console.log(lData)
  if (lData && lData.data.name !== UNKNOWN && lData.data.symbol !== UNKNOWN) {
    return lData.data
  }
  return getTokenNetworkInfo(token, chainId)
}