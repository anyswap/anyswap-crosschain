
import RouterConfig from '../../constants/abis/bridge/RouterConfig.json'
import RouterAction from '../../constants/abis/bridge/RouterAction.json'
import {ZERO_ADDRESS} from '../../constants'

import { getContract, web3Fn } from '../tools/web3Utils'
import {setLocalConfig, getLocalConfig, formatWeb3Str, fromWei} from '../tools/tools'
import getTokenInfo from '../tools/getTokenInfoV2'
import config from '../../config'

// import {formatWeb3Str} from '../tools/tools'

const routerConfigContract = getContract(RouterConfig)
const routerActionContract = getContract(RouterAction)

const timeout = 1000 * 60 * 30

interface ObjType {
  [key: string]: any
}

// 获取可支持跨链的ID
const BRIDGEALLCHAIN = 'BRIDGEALLCHAIN'
export function getAllChainIDs (chainId:any) {
  return new Promise(resolve => {
    if (!chainId) resolve(false)
    else {
      const lData = getLocalConfig(BRIDGEALLCHAIN, BRIDGEALLCHAIN, chainId, BRIDGEALLCHAIN, timeout)
      if (lData) {
        resolve(lData.list)
      } else {
        web3Fn.setProvider(config.getCurChainInfo(config.getCurBridgeConfigInfo(chainId).bridgeInitDataChain).nodeRpc)
        routerConfigContract.options.address = config.getCurBridgeConfigInfo(chainId).bridgeConfigToken
      
        routerConfigContract.methods.getAllChainIDs().call((err:any, res:any) => {
          if (err) {
            console.log(err)
            resolve([])
          } else {
            setLocalConfig(BRIDGEALLCHAIN, BRIDGEALLCHAIN, chainId, BRIDGEALLCHAIN, {list: res})
            resolve(res)
          }
        })
      }
    }
  })
}

// 获取原生underlying地址
const SRCUNDERLYING = 'SRCUNDERLYING'
export function isUnderlying (token:any, chainId:any) {
  return new Promise(resolve => {
    // console.log(token)
    const lData = getLocalConfig(SRCUNDERLYING, token, chainId, SRCUNDERLYING, 1000 * 60 * 60 * 24 * 1000, 1)
    if (lData) {
      resolve(lData.data)
    } else {
      web3Fn.setProvider(config.getCurChainInfo(chainId).nodeRpc)
      routerActionContract.options.address = token
      routerActionContract.methods.underlying().call(async(err:any, res:any) => {
        if (err) {
          // console.log(err)
          setLocalConfig(SRCUNDERLYING, token, chainId, SRCUNDERLYING, {data: false}, 1)
          resolve(false)
        } else {
          if (res && res === ZERO_ADDRESS) {
            resolve(false)
          } else {
            const tokenInfo = await getTokenInfo(res, chainId)
            const data = {
              address: res,
              name: tokenInfo.name,
              symbol: tokenInfo.symbol,
              decimals: tokenInfo.decimals,
            }
            setLocalConfig(SRCUNDERLYING, token, chainId, SRCUNDERLYING, {data: data}, 1)
            resolve(data)
          }
        }
      })
    }
  })
}

// 获取合约配置
const BRIDGETOKENCONFIG = 'BRIDGETOKENCONFIG'
function getAllTokenConfig (list:Array<[]>, chainId:any) {
  return new Promise(resolve => {
    // let callbackData:any = ''
    web3Fn.setProvider(config.getCurChainInfo(config.getCurBridgeConfigInfo(chainId).bridgeInitDataChain).nodeRpc)
    const batch = new web3Fn.BatchRequest()

    const tokenList:ObjType = {}
    const tokenidList:ObjType = {}
    // for (const chainid of list) {
    const len = list.length
    for (let i = 0; i < len; i++) {
      const tokenid:any = list[i]
      // console.log(tokenid)
      const gamtData = routerConfigContract.methods.getAllMultichainTokens(tokenid).encodeABI()
      batch.add(web3Fn.eth.call.request({data: gamtData, to: config.getCurBridgeConfigInfo(chainId).bridgeConfigToken}, 'latest', (err:any, res:any) => {
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

      const gtcData = routerConfigContract.methods.getTokenConfig(tokenid, chainId).encodeABI()
      batch.add(web3Fn.eth.call.request({data: gtcData, to: config.getCurBridgeConfigInfo(chainId).bridgeConfigToken}, 'latest', (err:any, res:any) => {
        // console.log(res)
        if (err) {
          console.log(err)
          resolve('')
        } else {
          const results = formatWeb3Str(res)
          // console.log(results)
          const decimals = web3Fn.utils.hexToNumber(results[0])
          // console.log(decimals)
          const cbtoken = results[1].replace('0x000000000000000000000000', '0x')
          if (cbtoken !=ZERO_ADDRESS) {
            if (!tokenList[cbtoken]) tokenList[cbtoken] = {}
            const data = {
              decimals: decimals,
              ContractVersion: web3Fn.utils.hexToNumberString(results[2]),
              MaximumSwap: fromWei(web3Fn.utils.hexToNumberString(results[3]), decimals),
              MinimumSwap: fromWei(web3Fn.utils.hexToNumberString(results[4]), decimals),
              BigValueThreshold: fromWei(web3Fn.utils.hexToNumberString(results[5]), decimals),
              SwapFeeRatePerMillion: web3Fn.utils.hexToNumber(results[6]) / 10000,
              MaximumSwapFee: fromWei(web3Fn.utils.hexToNumberString(results[7]), decimals),
              MinimumSwapFee: fromWei(web3Fn.utils.hexToNumberString(results[8]), decimals),
              tokenid: tokenid,
            }
            tokenList[cbtoken] = data
          }
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
function getAllTokenIDs (chainId:any) {
  return new Promise(resolve => {
    web3Fn.setProvider(config.getCurChainInfo(config.getCurBridgeConfigInfo(chainId).bridgeInitDataChain).nodeRpc)
    routerConfigContract.options.address = config.getCurBridgeConfigInfo(chainId).bridgeConfigToken
  
    routerConfigContract.methods.getAllTokenIDs().call((err:any, res:any) => {
      if (err) {
        console.log(err)
        resolve('')
      } else {
        getAllTokenConfig(res, chainId).then(async(result:any) => {
          for (const tokenstr in result.tokenList) {
            const curTokenObj = result.tokenList[tokenstr]
            const curTokenIdObj = result.tokenidList[curTokenObj.tokenid]
            
            const destChain:any = {}
            let tokenInfo:any = ''
            for (const chainID in curTokenIdObj) {
              const ti = await getTokenInfo(curTokenIdObj[chainID], chainID)
              const ud = await isUnderlying(curTokenIdObj[chainID], chainID)
              destChain[chainID] = {
                ...ti,
                token: curTokenIdObj[chainID],
                underlying: ud
              }
              if (Number(chainID) === Number(chainId)) {
                tokenInfo = ti
              } 
            }
            // delete destChain[chainId]
            if (!tokenInfo) {
              tokenInfo = await getTokenInfo(tokenstr, chainId)
            }
            // const tokenInfo = await getTokenInfo(tokenstr, chainId)
            // console.log(tokenInfo)
            const underlyingInfo = await isUnderlying(tokenstr, chainId)
            if (curTokenObj && curTokenIdObj) {
              const obj = {
                ...curTokenObj,
                name: tokenInfo.name,
                symbol: tokenInfo.symbol,
                decimals: tokenInfo.decimals,
                destChain: destChain,
                underlying: underlyingInfo
              }
              setLocalConfig(BRIDGETOKENCONFIG, tokenstr, chainId, BRIDGETOKENCONFIG, {list: obj})
            }
          }
          resolve('')
        })
      }
    })
  })
}

export function getTokenConfig (token:any, chainId:any) {
  return new Promise(resolve => {
    if (!chainId) resolve(false)
    else {
      const lData = getLocalConfig(BRIDGETOKENCONFIG, token, chainId, BRIDGETOKENCONFIG, timeout)
      // console.log(lData)
      // console.log(token)
      if (
        lData
        && lData.list
        && lData.list.name
        && lData.list.decimals
        && lData.list.symbol
        && lData.list.name != 'UNKNOWN'
        && lData.list.decimals != 'UNKNOWN'
        && lData.list.symbol != 'UNKNOWN'
      ) {
        resolve(lData.list)
      } else {
        getAllTokenIDs(chainId).then(() => {
          const lData1 = getLocalConfig(BRIDGETOKENCONFIG, token, chainId, BRIDGETOKENCONFIG, timeout)
          // console.log(lData1)
          if (lData1 && lData1.list && lData1.list.name && lData1.list.decimals && lData1.list.symbol) {
            resolve(lData1.list)
          } else {
            resolve('')
          }
        })
      }
    }
  })
}

export function getAllToken (chainId:any) {
  return new Promise(resolve => {
    if (!chainId) resolve(false)
    else {
      const lData = getLocalConfig(BRIDGETOKENCONFIG, 'all', chainId, BRIDGETOKENCONFIG, timeout)
      // console.log(lData)
      if (lData) {
        resolve(lData)
      } else {
        getAllTokenIDs(chainId).then(() => {
          // console.log(res)
          const lData1 = getLocalConfig(BRIDGETOKENCONFIG, 'all', chainId, BRIDGETOKENCONFIG)
          if (lData1) {
            resolve(lData1.list)
          } else {
            resolve('')
          }
        })
      }
    }
  })
}
