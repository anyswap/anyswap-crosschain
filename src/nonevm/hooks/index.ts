import { useCallback } from 'react'
import {
  useDispatch,
  // useSelector
} from 'react-redux'
import {
  // AppState,
  AppDispatch
} from '../../state'
import {approveList} from './actions'

export function useApproveState () {
  // const allowanceList:any = useSelector<AppState, AppState['nonevm']>(state => state.nonevm.approveList)
  const dispatch = useDispatch<AppDispatch>()
  const setApprovalState = useCallback(({chainId, account, token, spender, allowance}) => {
    if (chainId && account && token && spender) {
      dispatch(approveList({
        chainId, account, token, spender, allowance
      }))
    }
  }, [])

  return {
    setApprovalState
  }
}