import {useEvmPools, useEvmPool} from './evm'
import { useUserSelectChainId } from '../../state/user/hooks'
import { useCallback, useEffect, useState } from 'react'
import useInterval from '../useInterval'
export function usePools ({
  account,
  tokenList,
  chainId
}:any) {
  const {selectNetworkInfo} = useUserSelectChainId()
const [poolData, setPoolData] = useState<any>()
  const {getEvmPoolsData} = useEvmPools({
    account,
    tokenList,
    chainId
  })

  const fetchPoolCallback = useCallback(() => {
    let fetchCallback:any
    if (!selectNetworkInfo?.label) {
      fetchCallback = getEvmPoolsData
    }
    if (fetchCallback) {
      fetchCallback().then((res:any) => {
        setPoolData(res)
      })
    }
  }, [selectNetworkInfo, getEvmPoolsData])

  useEffect(() => {
    fetchPoolCallback()
  }, [selectNetworkInfo, getEvmPoolsData])
  useInterval(fetchPoolCallback, 1000 * 10)
  return {poolData}
}

export function usePool (
  chainId:any,
  account:any,
  anytoken:any,
  underlying: any,
) {
  const {selectNetworkInfo} = useUserSelectChainId()
const [poolData, setPoolData] = useState<any>()
  const {getEvmPoolsData} = useEvmPool(chainId, account, anytoken, underlying)

  const fetchPoolCallback = useCallback(() => {
    let fetchCallback:any
    if (!selectNetworkInfo?.label) {
      fetchCallback = getEvmPoolsData
    }
    if (fetchCallback) {
      fetchCallback().then((res:any) => {
        setPoolData(res)
      })
    }
  }, [selectNetworkInfo, getEvmPoolsData])

  useEffect(() => {
    fetchPoolCallback()
  }, [selectNetworkInfo, fetchPoolCallback])
  useInterval(fetchPoolCallback, 1000 * 10)
  return {poolData}
}