import {useEvmPools, useEvmPool} from './evm'
// import { useUserSelectChainId } from '../../state/user/hooks'
import { useCallback, useEffect, useState } from 'react'
import useInterval from '../useInterval'
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

  const fetchPoolCallback = useCallback(() => {
    let fetchCallback:any
    if (!isNaN(chainId)) {
      fetchCallback = getEvmPoolsData
    }
    if (fetchCallback) {
      fetchCallback().then((res:any) => {
        setPoolData(res)
      })
    }
  }, [chainId, getEvmPoolsData])

  useEffect(() => {
    fetchPoolCallback()
  }, [chainId, getEvmPoolsData])
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

  const fetchPoolCallback = useCallback(() => {
    let fetchCallback:any
    if (!isNaN(chainId)) {
      fetchCallback = getEvmPoolsData
    }
    if (fetchCallback) {
      fetchCallback().then((res:any) => {
        setPoolData(res)
      })
    }
  }, [chainId, account, anytoken, getEvmPoolsData])

  useEffect(() => {
    fetchPoolCallback()
  // }, [chainId, fetchPoolCallback])
  }, [chainId, account, anytoken])

  useInterval(fetchPoolCallback, 1000 * 10)
  return {poolData}
}