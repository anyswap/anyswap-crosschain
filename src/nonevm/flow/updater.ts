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
  flowBalanceList
} from './actions'
import useInterval from "../../hooks/useInterval";

// import {
//   useFlowBalance,
//   // useSendFlowTxns
//   // getFLOWTxnsStatus
// } from './index'

export default function Updater(): null {
  const {chainId, account} = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()

  // const {getFlowTokenBalance} = useFlowBalance()

  // const {transferFn} = useSendFlowTxns()

  const getBalance = useCallback(async() => {
    // console.log(account)
    if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(chainId) && account) {
      // getFLOWTxnsStatus('a133c54d778fbb59bd4fb06ba4e41d8aa0d0e97c54dda283ac77c9d281cae150', chainId)
      // getFLOWTxnsStatus('90f105a707a2f8cf6114347d6ad7769a616e98f8b37d302004b2f039f2cb5413', chainId)
      // fcl.account(account).then((res:any) => {
      // const useAccount = '0x79126cfa5c96017c'
      const useAccount = account
      // getFlowTokenBalance(useAccount)
      // const tsResult = await transferFn('0x79126cfa5c96017c', 1.0)
      // console.log(tsResult)

      // fcl.query({
      //   cadence: `
      //     import AnyExampleToken from 0x2627a6b6570638c4
          
      //     pub fun main():String? {
      //       return AnyExampleToken.underlying()
      //     }
      //   `,
      // }).then((res:any) => {
      //   console.log(res)
      // }).catch((err:any) => {
      //   console.log(err)
      // })


      fcl.account(useAccount).then(async(res:any) => {
        console.log(res)
        if (res) {
          const blList:any = {}
          const result = res
          blList['NATIVE'] = result.balance
          if (result.contracts && result.contracts.length > 0) {
            for (const obj of result.contracts) {
              const key = obj.policyId + '.' + obj.assetName
              blList[key] = obj.amount
            }
          }
          dispatch(flowBalanceList({list: blList}))
        }
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
      let FungibleToken = '0x9a0766d93b6608b7'
      let FlowToken = '0x7e60df042a9c0868'
      if (chainId === ChainId.FLOW) {
        flowNetwork = 'https://rest-mainnet.onflow.org'
        BloctoWallet = 'https://fcl-discovery.onflow.org/authn'
        FungibleToken = '0xf233dcee88fe0abe'
        FlowToken = '0x1654653399040a61'
      }
      fcl.config()
      .put("challenge.scope", "email")
      .put("accessNode.api", flowNetwork) // connect to Flow testnet
      .put("challenge.handshake", BloctoWallet) // use Blocto testnet wallet
      // .put("flow.network", "testnet")
      // .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
      .put("app.detail.title", "Multichain - Cross Chain")
      .put("app.detail.icon", "https://assets.coingecko.com/coins/images/22087/large/1_Wyot-SDGZuxbjdkaOeT2-A.png")
      // .put("0xFlowToken", "0x7e60df042a9c0868")
      .put("0xFungibleToken", FungibleToken)
      .put("0xFlowToken", FlowToken)

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