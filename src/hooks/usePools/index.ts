import {useEvmPools, useEvmPool, useEvmPoolDatas} from './evm'
// import { useUserSelectChainId } from '../../state/user/hooks'
import { useCallback, useEffect, useState } from 'react'
import useInterval from '../useInterval'
import { ChainId } from '../../config/chainConfig/chainId'
import {useNearPoolDatas} from '../../nonevm/near'
import {useTrxPoolDatas} from '../../nonevm/trx'
import {useAptPoolDatas} from '../../nonevm/apt'
import {useReefPoolDatas} from '../../nonevm/reef'

const POOL_CHAIN = [ChainId.NEAR, ChainId.NEAR_TEST, ChainId.TRX, ChainId.TRX_TEST,ChainId.APT, ChainId.APT_TEST, ChainId.REEF, ChainId.REEF_TEST]

export function usePoolDatas () {
  const {getNearPoolDatas} = useNearPoolDatas()
  const {getEvmPoolsDatas} = useEvmPoolDatas()
  const {getTrxPoolDatas} = useTrxPoolDatas()
  const {getAptPoolDatas} = useAptPoolDatas()
  const {getReefPoolDatas} = useReefPoolDatas()

  const getPoolsData = useCallback((chainId, list, account) => {
    return new Promise(resolve => {
      // console.log(chainId)
      // console.log(list)
      if (POOL_CHAIN.includes(chainId)) {
        const arr:any = []
        for (const item of list) {
          arr.push({
            token: item.underlying,
            account: account,
            anytoken: item.token,
            dec: item.dec
          })
        }
        let resultFn:any
        if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {
          // console.log(1)
          resultFn = getNearPoolDatas
        } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
          // console.log(2)
          resultFn = getTrxPoolDatas
        } else if ([ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
          // console.log(2)
          resultFn = getAptPoolDatas
        } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
          // console.log(2)
          resultFn = getReefPoolDatas
        }
        resultFn(arr, chainId).then((res:any) => {
          // console.log(res)
          // console.log(arr)
          resolve(res)
        })
      } else if (!isNaN(chainId)) {
        getEvmPoolsDatas(chainId, list, account).then(res => {
          resolve(res)
        })
      } else {
        resolve('')
      }
    })
  }, [getNearPoolDatas, getEvmPoolsDatas, getTrxPoolDatas, getAptPoolDatas, getReefPoolDatas])

  return {
    getPoolsData
  }
}

export function usePools ({
  account,
  tokenList,
  chainId
}:any) {
  // const {selectNetworkInfo} = useUserSelectChainId()
  const [poolData, setPoolData] = useState<any>()
  const {getEvmPoolsData} = useEvmPools({
    account,
    tokenList,
    chainId
  })
  const {getNearPoolDatas} = useNearPoolDatas()
  const {getTrxPoolDatas} = useTrxPoolDatas()
  const {getAptPoolDatas} = useAptPoolDatas()
  const {getReefPoolDatas} = useReefPoolDatas()

  const fetchPoolCallback = useCallback(() => {
    // let fetchCallback:any
    if (!isNaN(chainId)) {
      // fetchCallback = getEvmPoolsData
      getEvmPoolsData().then((res:any) => {
        // console.log(res)
        setPoolData(res)
      })
    } else if (POOL_CHAIN.includes(chainId)) {
      const arr = []
      for (const item of tokenList) {
        arr.push({
          token: item.underlying,
          account: account,
          anytoken: item.anytoken
        })
      }
      // console.log(arr)
      // getNearPoolDatas(arr, chainId).then(res => {
      //   // console.log(res)
      //   setPoolData(res)
      // })
      let resultFn:any
      if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {
        // console.log(1)
        resultFn = getNearPoolDatas
      } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
        // console.log(2)
        resultFn = getTrxPoolDatas
      } else if ([ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
        // console.log(2)
        resultFn = getAptPoolDatas
      } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
        // console.log(2)
        resultFn = getReefPoolDatas
      }
      resultFn(arr, chainId).then((res:any) => {
        // console.log(res)
        // console.log(arr)
        // resolve(res)
        setPoolData(res)
      })
    }
  }, [chainId, getEvmPoolsData, getNearPoolDatas, getTrxPoolDatas, getAptPoolDatas, getReefPoolDatas])

  useEffect(() => {
    if (chainId) {
      fetchPoolCallback()
    }
  }, [chainId, getEvmPoolsData, getNearPoolDatas])

  useInterval(fetchPoolCallback, 1000 * 10)

  return {poolData}
}

export function usePool (
  chainId:any,
  account:any,
  anytoken:any,
  underlying: any,
) {
  // const {selectNetworkInfo} = useUserSelectChainId()
  const [poolData, setPoolData] = useState<any>()
  const {getEvmPoolsData} = useEvmPool(chainId, account, anytoken, underlying)
  const {getTrxPoolDatas} = useTrxPoolDatas()
  const {getAptPoolDatas} = useAptPoolDatas()
  const {getReefPoolDatas} = useReefPoolDatas()

  const fetchPoolCallback = useCallback(() => {
    if (!isNaN(chainId)) {
      getEvmPoolsData().then((res:any) => {
        // console.log(res)
        setPoolData(res)
      })
    } else {
      let resultFn:any
      if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
        // console.log(2)
        resultFn = getTrxPoolDatas
      } else if ([ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
        // console.log(2)
        resultFn = getAptPoolDatas
      } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
        // console.log(2)
        resultFn = getReefPoolDatas
      }
      if (resultFn) {
        resultFn([{
          token: underlying,
          account: account,
          anytoken: anytoken
        }], chainId).then((res:any) => {
          // console.log(res)
          // console.log(arr)
          // resolve(res)
          setPoolData(res)
        })
      }
    }
  }, [chainId, account, anytoken, underlying, getEvmPoolsData, getReefPoolDatas])

  useEffect(() => {
    fetchPoolCallback()
  }, [chainId, account, anytoken])

  useInterval(fetchPoolCallback, 1000 * 10)

  return {poolData}
}