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
        batch.add(web3.eth[obj.methods].request(...obj.input))
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
    const arr = []
    for (const obj of calls) {
      arr.push({
        target: obj.target,
        callData: obj.callData
      })
    }
    contract.methods.aggregate(arr).call((err, res) => {
      if (err) {
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
    if (
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
        results = await useBatchWeb3(chainId, calls)
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
  // console.log(useNode)
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
// useBatchWeb3('56', [
//   {
//     data: '',
//     to: '',
//     property: 'eth',
//     methods: 'getTransactionReceipt',
//     inputFormatter: ['0x17405c1d0284d7a44b42a255b66ec35c6e1fe47f1e9bbd7f6ce31fe126b85792']
//   },
//   {
//     data: '',
//     to: '',
//     property: 'eth',
//     methods: 'getTransaction',
//     inputFormatter: ['0x17405c1d0284d7a44b42a255b66ec35c6e1fe47f1e9bbd7f6ce31fe126b85792']
//   }
// ]).then(res => {
//   console.log('res1')
//   console.log(res)
// })

// export {
//   getWeb3,
//   useBatchData,
//   getContract
// }