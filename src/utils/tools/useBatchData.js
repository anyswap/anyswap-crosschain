// import { Interface } from '@ethersproject/abi'
import ERC20_ABI from '../../constants/abis/erc20.json'
import multicallABI from '../../constants/multicall/abi.json'
import config from '../../config'

const Web3 = require('web3')

const TIMEOUT = 'timeout'

export function getWeb3 ({rpc, provider}) {
  rpc = rpc ? rpc : ''
  if (provider) {
    // console.log(library)
    const wFn = new Web3(provider)
    // console.log(wFn)
    return wFn
  } else {
    // console.log(rpc)
    const wFn = new Web3(new Web3.providers.HttpProvider(rpc))
    return wFn
  }
}

export function getContract({abi, rpc, provider}) {
  const web3 = getWeb3({rpc, provider})
  abi = abi ? abi : ERC20_ABI
  return new web3.eth.Contract(abi)
}

function timeoutWeb3 () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(TIMEOUT)
    }, [1000 * 60])
  })
}


function getBatchWeb3Data ({rpc, calls, provider}) {
  return new Promise((resolve, reject) => {
    const web3 = getWeb3({rpc, provider})
    const batch = new web3.BatchRequest()
    // console.log(calls)
    for (const obj of calls) {
      if (obj.callData) {
        batch.add(web3.eth.call.request({data: obj.callData, to: obj.target}, 'latest'))
      } else {
        const property = obj.property ? obj.property : 'eth'
        batch.add(web3[property][obj.methods].request(...obj.input))
      }
    }
    batch.requestManager.sendBatch(batch.requests, (err, res) => {
      if (err) {
        reject(err)
      } else {
        // console.log(res)
        const arr = res.map(({result}) => (result))
        // console.log(arr)
        resolve(arr)
      }
    })
  })
}

export function getMulticallData ({chainId, rpc, calls, provider}) {
  return new Promise((resolve, reject) => {
    const contract = getContract({abi: multicallABI, rpc: rpc, provider})
    contract.options.address = config.getCurChainInfo(chainId).multicalToken
    // console.log(chainId)
    // console.log(rpc)
    // console.log(calls)
    // console.log(provider)
    const arr = []
    for (const obj of calls) {
      if (obj.target) {
        arr.push({
          target: obj.target,
          callData: obj.callData
        })
      } else {
        if (obj.methods === 'getBalance') {
          // contract.methods.getEthBalance(...obj.input)
          arr.push({
            target: config.getCurChainInfo(chainId).multicalToken,
            callData: contract.methods.getEthBalance(...obj.input).encodeABI()
          })
        }
      }
    }
    // arr.push({
    //   target: config.getCurChainInfo(chainId).multicalToken,
    //   callData: contract.methods.getEthBalance('0xC03033d8b833fF7ca08BF2A58C9BC9d711257249').encodeABI()
    // })
    contract.methods.aggregate(arr).call((err, res) => {
      // console.log(res)
      if (err) {
        // console.log(err)
        // console.log(JSON.stringify(calls))
        reject(err)
      } else {
        resolve(res.returnData)
      }
    })
  })
}

function getBatchResult ({chainId, rpc, calls, provider}) {
  return new Promise((resolve, reject) => {
    // console.log(config.getCurChainInfo(chainId).multicalToken)
    // console.log(calls)
    const useMethods = config.getCurChainInfo(chainId).multicalToken ? getMulticallData : getBatchWeb3Data
    // const useMethods = getBatchWeb3Data
    Promise.race([
      timeoutWeb3(),
      useMethods({chainId, rpc, calls, provider})
    ]).then(res => {
      if (res === TIMEOUT) {
        reject(res)
      } else {
        resolve(res)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

const useNode = {}

export async function useBatchData ({chainId, calls, provider}) {
  if (isNaN(chainId)) return undefined
  const rpcArr = config.getCurChainInfo(chainId).nodeRpcList
  const len = rpcArr.length - 1
  if (!useNode[chainId]) {
    useNode[chainId] = {
      rpc: rpcArr[0],
      index: 0
    }
  }
  let index = useNode[chainId].index
  const rpc = rpcArr[useNode[chainId].index]
  let results = ''
  try {
    results = await getBatchResult({chainId, rpc, calls, provider})
  } catch (error) {
    console.log('error')
    console.log(error.toString())
    if ( error.toString().indexOf('Error: Returned error: execution reverted: Multicall aggregate: call failed') !== -1) {
      // console.log(JSON.stringify(calls))
      // console.log(calls.length)
      results = ''
    } else if (
      error.toString().indexOf('Invalid JSON RPC response') !== -1
      || error.toString().indexOf('Error: Returned error') !== -1
      || error === TIMEOUT
    ) {
      if (index < len && !provider) {
        index ++
        useNode[chainId] = {
          rpc: rpcArr[index],
          index: index
        }
        results = await useBatchData({chainId, calls, provider})
      } else {
        useNode[chainId] = {
          rpc: rpcArr[0],
          index: 0
        }
      }
    } else {
      results = error
    }
  }
  // console.log(results)
  return results
}


/*
[
  {
    callData: '',
    target: '',
    methods: '',
    input: []
  }
]
*/

// export async function init () {
//   const arr = []
//   const calls = [
//     {
//       "type": "TOKEN",
//       "callData": "0x70a08231000000000000000000000000c03033d8b833ff7ca08bf2a58c9bc9d711257249",
//       "target": "0xe0eb31082bbf8252f7425c6dd72a8c6b3bfbe99f"
//     },
//   ]
//   const r = await useBatchData({
//     chainId: '42161',
//     calls
//   })
//   console.log(r)
//   // for (const obj of calls) {

//   //   const r = await useBatchData({
//   //     chainId: '42161',
//   //     calls: [obj]
//   //   })
//   //   console.log(r)
//   //   if (!r) {
//   //     arr.push(obj)
//   //   }
//   // }
//   console.log(arr)
// }
// init()

// export {
//   getWeb3,
//   useBatchData,
//   getContract
// }