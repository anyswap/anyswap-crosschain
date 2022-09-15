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
// import { ChainId } from "../../config/chainConfig/chainId";
import config from "../../config";
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

export function useFlowBalance () {
  const flowBalanceList:any = useSelector<AppState, AppState['flow']>(state => state.flow.flowBalanceList)
  // console.log(flowBalanceList)
  return {
    flowBalanceList
    // getAdaTokenBalance
  }
}

export function getFLOWTxnsStatus (txid:string, chainId:any) {
  const data:any = {
    msg: 'Error',
    info: ''
  }
  return new Promise(resolve => {
    const url = `${config.chainInfo[chainId].nodeRpc}/transaction_results/${txid}`
    fetch(url).then(res => res.json()).then(json => {
      console.log(json)
      if (json) {
        if (json.execution === 'Failure') {
          data.msg = 'Failure'
          data.error = 'Txns is failure!'
        } else if (json.execution === 'Success') {
          data.msg = 'Success'
          data.info = json
        } else {
          data.msg = 'Null'
          data.error = 'Query is empty!'
        }
      } else {
        data.msg = 'Null'
        data.error = 'Query is empty!'
      }
      resolve(data)
    }).catch(err => {
      data.error = 'Query is empty!'
      console.log(err)
      resolve(data)
    })
  })
}

