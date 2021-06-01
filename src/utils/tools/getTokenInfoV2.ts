import {getContract, web3Fn} from './web3Utils'
import {getLocalConfig, setLocalConfig, formatWeb3Str} from './tools'
import config from '../../config'
import {ethers} from 'ethers'

const TOKENINFO = 'TOKENINFO'
const UNKNOWN = 'UNKNOWN'
const contract = getContract()

function getTokenNetworkInfo (token:any, chainId:any, delay?:any) {
  return new Promise(resolve => {
    const data = {
      name: UNKNOWN,
      symbol: UNKNOWN,
      decimals: UNKNOWN,
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

    const dData = contract.methods.decimals().encodeABI()
    batch.add(web3Fn.eth.call.request({data: dData, to: token}, 'latest', (err:any, res:any) => {
      if (err) {
        data.decimals = UNKNOWN
        console.log(err)
      } else {
        const hexValue = ethers.utils.hexValue(res)
        data.decimals = web3Fn.utils.hexToNumber(hexValue)
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
      if (delay) {
        setTimeout(() => {
          resolve(data)
        }, 3000)
      } else {
        resolve(data)
      }
    }))

    batch.execute()
  })
}

export default async function getTokenInfo (token:any, chainId:any, delay?:any):Promise<any> {
  const lData = getLocalConfig(TOKENINFO, token, chainId, TOKENINFO, 1000 * 60 * 60 * 24 * 1000, 1)
  // console.log(lData)
  if (lData
    && lData.data.name !== UNKNOWN
    && lData.data.symbol !== UNKNOWN
    && lData.data.decimals !== UNKNOWN
  ) {
    return lData.data
  }
  const data:any = await getTokenNetworkInfo(token, chainId, delay)
  if (data
    && data.name !== UNKNOWN
    && data.symbol !== UNKNOWN
    && data.decimals !== UNKNOWN
  ) {
    return data
  }
  return getTokenInfo(token, chainId, 1)
}