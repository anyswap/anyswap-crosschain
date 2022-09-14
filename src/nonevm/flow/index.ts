import { useCallback } from "react";
import * as fcl from "@onflow/fcl"
import {
  // useDispatch,
  useSelector
} from 'react-redux'
// import { useTranslation } from 'react-i18next'
import {
  AppState,
  // AppDispatch
} from '../../state'
// import {
//   flowAddress
// } from './actions'

export function useLoginFlow () {
  const loginFlow = useCallback(() => {
    fcl.authenticate()
  }, [])

  const logoutFlow = useCallback(() => {
    fcl.unauthenticate()
  }, [])
  return {
    loginFlow,
    logoutFlow
  }
}

export function useFlowAddress () {
  const account:any = useSelector<AppState, AppState['flow']>(state => state.flow.flowAddress)
  return {
    flowAddress: account
  }
}