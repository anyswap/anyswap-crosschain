
import RouterConfig from '../../constants/abis/bridge/RouterConfig.json'
import RouterAction from '../../constants/abis/bridge/RouterAction.json'
import {ZERO_ADDRESS} from '../../constants'

import { getContract, web3Fn } from '../tools/web3Utils'
import {setLocalConfig, getLocalConfig, formatWeb3Str, fromWei} from '../tools/tools'
import getTokenInfo from '../tools/getTokenInfo'
import config from '../../config'

// import {formatWeb3Str} from '../tools/tools'

const routerConfigContract = getContract(RouterConfig)
const routerActionContract = getContract(RouterAction)
const chainID = config.bridgeInitDataChain

const timeout = 1000 * 60 * 30

interface ObjType {
  [key: string]: any
}



// 获取单条链配置
const BRIDGEALLCHAINCONFIG = 'BRIDGEALLCHAINCONFIG'
export function getChainConfig () {
  return new Promise(resolve => {
    const lData = getLocalConfig(BRIDGEALLCHAINCONFIG, BRIDGEALLCHAINCONFIG, config.chainID, BRIDGEALLCHAINCONFIG, timeout)
    if (lData) {
      resolve(lData.list)
    } else {
      web3Fn.setProvider(config.chainInfo[chainID].nodeRpc)
      routerConfigContract.options.address = config.bridgeConfigToken
      routerConfigContract.methods.getChainConfig(config.chainID).call((err:any, res:any) => {
        if (err) {
          resolve(false)
        } else {
          const results = res
          if (results) {
            const obj = JSON.parse(web3Fn.utils.hexToUtf8(results))
            setLocalConfig(BRIDGEALLCHAINCONFIG, BRIDGEALLCHAINCONFIG, config.chainID, BRIDGEALLCHAINCONFIG, {list: obj})
            resolve(obj)
          } else {
            resolve(false)
          }
        }
      })
    }
  })
}
// 获取所有链配置
export function getAllChainConfig (list:Array<[]>) {
  return new Promise(resolve => {
    const lData = getLocalConfig(BRIDGEALLCHAINCONFIG, BRIDGEALLCHAINCONFIG, config.chainID, BRIDGEALLCHAINCONFIG, timeout)
    if (lData) {
      resolve(lData.list)
    } else {
      web3Fn.setProvider(config.chainInfo[chainID].nodeRpc)
      const batch = new web3Fn.BatchRequest()
      // for (const chainid of list) {
      const len = list.length
      for (let i = 0; i < len; i++) {
        const chainid = list[i]
        const data = routerConfigContract.methods.getChainConfig(chainid).encodeABI()
        batch.add(web3Fn.eth.call.request({data: data, to: config.bridgeConfigToken}, 'latest', (err:any, res:any) => {
          if (err) {
            console.log(err)
            resolve('')
          } else {
            const results = res.substr(130)
            if (results) {
              setLocalConfig(BRIDGEALLCHAINCONFIG, BRIDGEALLCHAINCONFIG, chainid, BRIDGEALLCHAINCONFIG, {list: JSON.parse(web3Fn.utils.hexToUtf8('0x' + results))})
            }
            const lData1 = getLocalConfig(BRIDGEALLCHAINCONFIG, BRIDGEALLCHAINCONFIG, config.chainID, BRIDGEALLCHAINCONFIG, timeout)
            if (lData1) {
              resolve(lData1)
            } else if (i === (len - 1)) {
              resolve('')
            }
          }
        }))
      }

      batch.execute()
    }
  })
}

// 校验合约是否可以跨链
export function isTokenIDExist (token:any) {
  return new Promise(resolve => {
    web3Fn.setProvider(config.nodeRpc)
    routerConfigContract.options.address = config.bridgeConfigToken
    routerConfigContract.methods.isTokenIDExist(token).call((err:any, res:any) => {
      if (err) {
        console.log(err)
        resolve(false)
      } else {
        resolve(res)
      }
    })
  })
}

// 获取可支持跨链的ID
const BRIDGEALLCHAIN = 'BRIDGEALLCHAIN'
export function getAllChainIDs () {
  return new Promise(resolve => {
    const lData = getLocalConfig(BRIDGEALLCHAIN, BRIDGEALLCHAIN, BRIDGEALLCHAIN, BRIDGEALLCHAIN, timeout)
    if (lData) {
      resolve(lData.list)
    } else {
      web3Fn.setProvider(config.chainInfo[chainID].nodeRpc)
      routerConfigContract.options.address = config.bridgeConfigToken
    
      routerConfigContract.methods.getAllChainIDs().call((err:any, res:any) => {
        if (err) {
          console.log(err)
          resolve([])
        } else {
          setLocalConfig(BRIDGEALLCHAIN, BRIDGEALLCHAIN, BRIDGEALLCHAIN, BRIDGEALLCHAIN, {list: res})
          resolve(res)
        }
      })
    }
  })
}

// 获取原生underlying地址
const SRCUNDERLYING = 'SRCUNDERLYING'
export function isUnderlying (token:any) {
  return new Promise(resolve => {
    // console.log(token)
    const lData = getLocalConfig(SRCUNDERLYING, token, config.chainID, SRCUNDERLYING, 1000 * 60 * 60 * 24 * 1000, 1)
    if (lData) {
      resolve(lData.data)
    } else {
      web3Fn.setProvider(config.nodeRpc)
      routerActionContract.options.address = token
      routerActionContract.methods.underlying().call(async(err:any, res:any) => {
        if (err) {
          // console.log(err)
          setLocalConfig(SRCUNDERLYING, token, config.chainID, SRCUNDERLYING, {data: false}, 1)
          resolve(false)
        } else {
          if (res && res === ZERO_ADDRESS) {
            resolve(false)
          } else {
            const tokenInfo = await getTokenInfo(res)
            const data = {
              address: res,
              name: tokenInfo.name,
              symbol: tokenInfo.symbol,
            }
            setLocalConfig(SRCUNDERLYING, token, config.chainID, SRCUNDERLYING, {data: data}, 1)
            resolve(data)
          }
        }
      })
    }
  })
}

// 获取合约配置
const BRIDGETOKENCONFIG = 'BRIDGETOKENCONFIG'
function getAllTokenConfig (list:Array<[]>) {
  return new Promise(resolve => {
    // let callbackData:any = ''
    web3Fn.setProvider(config.chainInfo[chainID].nodeRpc)
    const batch = new web3Fn.BatchRequest()

    const tokenList:ObjType = {}
    const tokenidList:ObjType = {}
    // for (const chainid of list) {
    const len = list.length
    for (let i = 0; i < len; i++) {
      const tokenid:any = list[i]
      // console.log(tokenid)
      const gamtData = routerConfigContract.methods.getAllMultichainTokens(tokenid).encodeABI()
      batch.add(web3Fn.eth.call.request({data: gamtData, to: config.bridgeConfigToken}, 'latest', (err:any, res:any) => {
        if (err) {
          console.log(err)
        } else {
          const results = formatWeb3Str(res)
          const resultLen = web3Fn.utils.hexToNumber(results[1])
          for (let j = 0; j < resultLen; j++) {
            const chainID = web3Fn.utils.hexToNumber(results[2 * j + 2])
            if (!tokenidList[tokenid]) tokenidList[tokenid] = {}
            tokenidList[tokenid][chainID] = results[2 * j + 3].replace('0x000000000000000000000000', '0x')
          }
        }
      }))

      const gtcData = routerConfigContract.methods.getTokenConfig(tokenid, config.chainID).encodeABI()
      batch.add(web3Fn.eth.call.request({data: gtcData, to: config.bridgeConfigToken}, 'latest', (err:any, res:any) => {
        // console.log(res)
        if (err) {
          console.log(err)
          resolve('')
        } else {
          const results = formatWeb3Str(res)
          const decimals = web3Fn.utils.hexToNumber(results[0])
          const cbtoken = results[1].replace('0x000000000000000000000000', '0x')
          if (!tokenList[cbtoken]) tokenList[cbtoken] = {}
          const data = {
            decimals: decimals,
            ContractVersion: web3Fn.utils.hexToNumberString(results[2]),
            MaximumSwap: fromWei(web3Fn.utils.hexToNumberString(results[3]), decimals),
            MinimumSwap: fromWei(web3Fn.utils.hexToNumberString(results[4]), decimals),
            BigValueThreshold: fromWei(web3Fn.utils.hexToNumberString(results[5]), decimals),
            SwapFeeRatePerMillion: web3Fn.utils.hexToNumber(results[6]) / 100000,
            MaximumSwapFee: fromWei(web3Fn.utils.hexToNumberString(results[7]), decimals),
            MinimumSwapFee: fromWei(web3Fn.utils.hexToNumberString(results[8]), decimals),
            tokenid: tokenid,
          }
          tokenList[cbtoken] = data
        }
        if (i === (len - 1) && tokenidList[tokenid]) {
          resolve({
            tokenList,
            tokenidList
          })
        }
      }))
    }
    batch.execute()
  })
}
function getAllTokenIDs () {
  return new Promise(resolve => {
    web3Fn.setProvider(config.chainInfo[chainID].nodeRpc)
    routerConfigContract.options.address = config.bridgeConfigToken
  
    routerConfigContract.methods.getAllTokenIDs().call((err:any, res:any) => {
      if (err) {
        console.log(err)
        resolve('')
      } else {
        getAllTokenConfig(res).then(async(result:any) => {
          for (const tokenstr in result.tokenList) {
            const curTokenObj = result.tokenList[tokenstr]
            const curTokenIdObj = result.tokenidList[curTokenObj.tokenid]
            
            const destChain = {...curTokenIdObj}
            delete destChain[config.chainID]
            const tokenInfo = await getTokenInfo(tokenstr)
            const underlyingInfo = await isUnderlying(tokenstr)
            if (curTokenObj && curTokenIdObj) {
              const obj = {
                ...curTokenObj,
                name: tokenInfo.name,
                symbol: tokenInfo.symbol,
                destChain: destChain,
                underlying: underlyingInfo
              }
              setLocalConfig(BRIDGETOKENCONFIG, tokenstr, config.chainID, BRIDGETOKENCONFIG, {list: obj})
            }
          }
          resolve('')
        })
      }
    })
  })
}

export function getTokenConfig (token:any) {
  return new Promise(resolve => {
    const lData = getLocalConfig(BRIDGETOKENCONFIG, token, config.chainID, BRIDGETOKENCONFIG, timeout)
    // console.log(lData)
    // console.log(token)
    if (lData && lData.list && lData.list.name && lData.list.decimals && lData.list.symbol && lData.list.symbol != 'UNKNOWN') {
      resolve(lData.list)
    } else {
      getAllTokenIDs().then(() => {
        const lData1 = getLocalConfig(BRIDGETOKENCONFIG, token, config.chainID, BRIDGETOKENCONFIG, timeout)
        // console.log(lData1)
        if (lData1 && lData1.list && lData1.list.name && lData1.list.decimals && lData1.list.symbol) {
          resolve(lData1.list)
        } else {
          resolve('')
        }
      })
    }
  })
}

export function getAllToken () {
  return new Promise(resolve => {
    const lData = getLocalConfig(BRIDGETOKENCONFIG, 'all', config.chainID, BRIDGETOKENCONFIG, timeout)
    // console.log(lData)
    if (lData) {
      resolve(lData)
    } else {
      getAllTokenIDs().then(() => {
        // console.log(res)
        const lData1 = getLocalConfig(BRIDGETOKENCONFIG, 'all', config.chainID, BRIDGETOKENCONFIG)
        if (lData1) {
          resolve(lData1.list)
        } else {
          resolve('')
        }
      })
    }
  })
}

export function getBaseInfo () {
  web3Fn.setProvider(config.chainInfo[chainID].nodeRpc)
  routerConfigContract.options.address = config.bridgeConfigToken

  routerConfigContract.methods.getAllTokenIDs().call((err:any, res:any) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res)
    }
  })
}