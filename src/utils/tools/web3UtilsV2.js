import ERC20_ABI from '../../constants/abis/erc20.json'
import config from '../../config'

const Web3 = require('web3')

function getWeb3 (rpc) {
  rpc = rpc ? rpc : ''
  const wFn = new Web3(new Web3.providers.HttpProvider(rpc))
  return wFn
}

function getContract(ABI) {
  const web3 = getWeb3()
  ABI = ABI ? ABI : ERC20_ABI
  return new web3.eth.Contract(ABI)
}


function timeoutWeb3 () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('timeout')
    }, [1000 * 30])
  })
}


function getBatchWeb3Data (rpc, list) {
  return new Promise((resolve, reject) => {
    const web3 = getWeb3(rpc)
    const batch = new web3.BatchRequest()
    // console.log(list)
    for (const obj of list) {
      if (obj.data) {
        batch.add(web3.eth.call.request({data: obj.data, to: obj.to}, 'latest'))
      } else {
        batch.add(web3Fn[obj.property][obj.methods].request(...obj.inputFormatter))
      }
    }
    batch.requestManager.sendBatch(batch.requests, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
function getBatchWeb3Result (rpc, list) {
  return new Promise((resolve, reject) => {
    Promise.race([
      timeoutWeb3(),
      getBatchWeb3Data(rpc, list)
    ]).then(res => {
      if (res === 'timeout') {
        reject(res)
      } else {
        resolve(res)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

function getWeb3Data (rpc, property, name, params) {
  return new Promise((resolve, reject) => {
    const web3 = getWeb3(rpc)
    web3[property][name](...params).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
function getWeb3Result (rpc, property, name, params) {
  return new Promise((resolve, reject) => {
    Promise.race([
      timeoutWeb3(),
      getWeb3Data(rpc, property, name, params)
    ]).then(res => {
      if (res === 'timeout') {
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

async function useBatchWeb3 (chainId, list) {
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
    results = await getBatchWeb3Result(rpc, list)
  } catch (error) {
    console.log('error')
    console.log(error.toString())
    if (
      error.toString().indexOf('Invalid JSON RPC response') !== -1
      || error.toString().indexOf('Error: Returned error') !== -1
    ) {
      if (index < len) {
        index ++
        useNode[chainId] = {
          rpc: rpcArr[index],
          index: index
        }
        results = await useBatchWeb3(chainId, list)
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

async function useWeb3 (chainId, property, name, params) {
  params = params ? params : []
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
    results = await getWeb3Result(rpc, property, name, params)
  } catch (error) {
    console.log('error')
    console.log(error.toString())
    if (
      error.toString().indexOf('Invalid JSON RPC response') !== -1
      || error.toString().indexOf('Error: Returned error') !== -1
    ) {
      if (index < len) {
        index ++
        useNode[chainId] = {
          rpc: rpcArr[index],
          index: index
        }
        results = await useWeb3(chainId, property, name, params)
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

export {
  getWeb3,
  useWeb3,
  useBatchWeb3,
  getContract
}