

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useActiveReact } from '../../hooks/useActiveReact'

import {getWeb3} from '../../utils/tools/multicall'

import config from '../../config'

import { AppDispatch } from '../index'

import { rpclist } from './actions'

interface RpcInfo {
  rpc: string,
  time: number | string,
  status: string,
  blocknumber: number | string,
  origin: string
}

function getRpcInfo (rpc:any) {
  const data: RpcInfo = {
    rpc: rpc,
    time: '',
    status: 'Init',
    blocknumber: '',
    origin: 'local'
  }
  const startTime = Date.now()
  // console.log(data)
  return new Promise(resolve => {
    const web3 = getWeb3(rpc)
    web3.eth.getBlockNumber().then((number:any) => {
      data.time = Date.now() - startTime
      data.status = 'Success'
      data.blocknumber = number
      // console.log(data)
      resolve(data)
    }).catch((err:any) => {
      console.error(err)
      data.status = 'Error'
      // resolve(data)
    })
  })
}

function getAllRpcInfo (chainId:any) {
  return new Promise(resolve => {
    const rpcArr = config.getCurChainInfo(chainId)?.nodeRpcList ? config.getCurChainInfo(chainId)?.nodeRpcList : []
    const arr = []
    for (const rpc of rpcArr) {
      arr.push(getRpcInfo(rpc))
    }
    Promise.race(arr).then(res => {
      // console.log(res)
      resolve(res)
    })
  })
}

export default function Updater(): null {
  const { library } = useActiveWeb3React()
  const { chainId } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (chainId && !isNaN(chainId)) {
      getAllRpcInfo(chainId).then(res => {
        // console.log(res)
        dispatch(rpclist({chainId, rpclist: res}))
      })
      if (library) {
        const startTime = Date.now()
        library.getBlockNumber().then(res => {
          // console.log(Date.now() - startTime)
          // console.log(res)
          const data: RpcInfo = {
            rpc: '',
            time: Date.now() - startTime,
            status: 'Success',
            blocknumber: res,
            origin: 'wallet'
          }
          dispatch(rpclist({chainId, rpclist: data}))
        })
      }
    }
  }, [library, chainId])
  return null
}