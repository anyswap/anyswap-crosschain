import { useCallback, useEffect, useMemo, useRef } from 'react'
import { ChainId } from '../../config/chainConfig/chainId'
import {useTrxAllowance} from '../trx'

export function useNonevmAllowances (
  selectCurrency:any,
  spender:any,
  chainId:any,
  account:any,
) {
  const {getTrxAllowance, setTrxAllowance} = useTrxAllowance(selectCurrency, spender, chainId, account)
  const allowanceList = useRef<any>()
  const setNonevmAllowance = useCallback(({token, spender}) => {
    if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
      return setTrxAllowance({token, spender})
    }
    return
  }, [])

  const token = useMemo(() => {
    return selectCurrency?.address
  }, [selectCurrency])

  const getNonevmAllowance = useCallback(() => {
    if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
      getTrxAllowance().then(res => {
        // console.log(res)
        // setAllowance(res)
        allowanceList.current = res
      })
    } else {
      allowanceList.current = ''
    }
  }, [token, spender, chainId, account])

  useEffect(() => {
    getNonevmAllowance()
  }, [token, spender, chainId, account])

  return {
    allowance: allowanceList.current,
    setNonevmAllowance
  }
}