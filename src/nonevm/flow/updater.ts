import { useCallback, useEffect } from "react";
import * as fcl from "@onflow/fcl"
import { 
  useDispatch,
  // useSelector
} from 'react-redux'
import { 
  // AppState,
  AppDispatch
} from '../../state'
import { ChainId } from "../../config/chainConfig/chainId";

import {useActiveReact} from '../../hooks/useActiveReact'

import {
  flowAddress,
  // adaBalanceList
} from './actions'
import useInterval from "../../hooks/useInterval";

// import {
//   useAdaBalance
// } from './index'

export default function Updater(): null {
  const {chainId, account} = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()

  const getBalance = useCallback(() => {
    // getAdaBalance()
    console.log(account)
    if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(chainId) && account) {
      fcl.account(account).then((res:any) => {
        console.log(res)
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }, [chainId, account])

  useEffect(() => {
    getBalance()
  }, [chainId, account])

  useInterval(getBalance, 1000 * 10)

  useEffect(() => {
    if (chainId && [ChainId.FLOW, ChainId.FLOW_TEST].includes(chainId)) {
      // let flowNetwork = 'https://access-testnet.onflow.org'
      // let BloctoWallet = 'https://flow-wallet-testnet.blocto.app/authn'
      let flowNetwork = 'https://rest-testnet.onflow.org'
      let BloctoWallet = 'https://fcl-discovery.onflow.org/testnet/authn'
      if (chainId === ChainId.FLOW) {
        flowNetwork = 'https://rest-mainnet.onflow.org'
        BloctoWallet = 'https://fcl-discovery.onflow.org/authn'
      }
      fcl.config()
      .put("challenge.scope", "email")
      .put("accessNode.api", flowNetwork) // connect to Flow testnet
      .put("challenge.handshake", BloctoWallet) // use Blocto testnet wallet

      console.log(fcl)

      fcl
        .currentUser()
        .subscribe((user:any) => {
          console.log(user)
          if (user?.addr) {
            dispatch(flowAddress({address: user?.addr}))
          } else {
            dispatch(flowAddress({address: ''}))
          }
        })
    }
  }, [chainId])

  return null
}