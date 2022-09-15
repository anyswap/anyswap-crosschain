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

import {
  useFlowBalance
  // getFLOWTxnsStatus
} from './index'

// const transactionScript = `
//   transaction() {
//     let vaultRef: &{FungibleToken.Provider}
//     let vaultStoragePath:StoragePath
//     prepare(acct: AuthAccount) {
//         self.vaultStoragePath= /storage/exampleTokenVault
//         self.vaultRef = acct.borrow<&{FungibleToken.Provider}>(from:self.vaultStoragePath)
//                                 ?? panic("Could not borrow a reference to the owner's vault")
//     }

//     execute {
//         log("vaultStoragePath:".concat(self.vaultStoragePath.toString()))
//         let temporaryVault <- self.vaultRef.withdraw(amount: 10.0)
//         Router.swapOut(token:AnyExampleToken.Vault.getType().identifier,to:"0xf8d6e0586b0a20c7",toChainId:97,value:<-temporaryVault)
//     }
//   }
// `

// const AccountAssetsQuery = `
// query AccountAssetsQuery($address: ID!) {\n  account(id: $address) {\n    tokenBalances(first: 20) {\n      edges {\n        node {\n          amount {\n            ...BalanceTableFragment\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BalanceTableFragment on TokenAmount {\n  token {\n    id\n    ticker\n    price\n    ...FullTickerFragment\n    __typename\n  }\n  value\n  __typename\n}\n\nfragment FullTickerFragment on Token {\n  name\n  contract {\n    id\n    __typename\n  }\n  __typename\n}\n
// `



export default function Updater(): null {
  const {chainId, account} = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()

  const {getFlowTokenBalance} = useFlowBalance()

  const getBalance = useCallback(async() => {
    // getAdaBalance()
    // console.log(account)
    if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(chainId) && account) {
      // getFLOWTxnsStatus('a133c54d778fbb59bd4fb06ba4e41d8aa0d0e97c54dda283ac77c9d281cae150', chainId)
      // getFLOWTxnsStatus('90f105a707a2f8cf6114347d6ad7769a616e98f8b37d302004b2f039f2cb5413', chainId)
      // fcl.account(account).then((res:any) => {
      const useAccount = '0x79126cfa5c96017c'
      // const useAccount = account
      getFlowTokenBalance(useAccount)
      // try {
        
      //   // const blockResponse = await fcl.send([
      //   //   fcl.getLatestBlock(),
      //   // ])
    
      //   // const block = await fcl.decode(blockResponse)
      //   const tx = await fcl.send([
      //     fcl.transaction(transactionScript),
      //     fcl.proposer(fcl.currentUser().authorization),
      //     fcl.payer(fcl.currentUser().authorization),
      //     // fcl.ref(block.id),
      //   ])
  
      //   // console.log(fcl.currentUser().authorization)
      //   console.log(tx)
      // } catch (error) {
      //   console.log(error)
        
      // }

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
          // console.log(res?.contracts?.ExampleToken)
          // const test = `
          //   import FungibleToken from 0x9a0766d93b6608b7
          //   transaction() {
          //       let vaultPublicPath:PublicPath 
          //       let receiverRef:Capability<&{FungibleToken.Balance}>
          //       prepare() {
          //           self.vaultPublicPath=/public/exampleTokenBalance

          //           let recipient=getAccount(0x79126cfa5c96017c)
          //           self.receiverRef = recipient.getCapability<&{FungibleToken.Balance}>(self.vaultPublicPath)
          //       }

          //       execute {
          //           let tokenBalance=self.receiverRef.borrow()??panic("get receiver for capability fails")
          //       }
          //   }
          //   `
          // fcl.query({
          //   // cadence: `${res?.contracts?.ExampleToken}`,
          //   // cadence: `${res?.contracts?.Kso}`,
          //   cadence: test,
          //   // args: (arg:any, t:any) => {
          //   //   console.log(arg)
          //   //   console.log(t)
          //   //   return [arg(useAccount, t.Address)]
          //   // }
          //   proposer: fcl.currentUser,
          //   payer: fcl.currentUser,
          //   limit: 50
          // }).then((res:any) => {
          //   console.log(res)
          // }).catch((err:any) => {
          //   console.log(err)
          // })
          // fcl.query({
          //   cadence: `
          //       import FungibleToken from FlowToken // will be replaced with 0xf233dcee88fe0abe because of the configuration
        
          //       pub fun main():UFix64 {
          //         // Get the accounts' public account objects
          //         let recipient = getAccount(0x79126cfa5c96017c)
          //         let receiverRef = recipient.getCapability<&{FungibleToken.Balance}>(/public/exampleTokenBalance)
          //         let tokenBalance=receiverRef.borrow()??panic("get receiver for capability fails")
          //         return tokenBalance.balance
          //     }
          //     `,
          // }).then((res:any) => {
          //   console.log(res)
          // }).catch((err:any) => {
          //   console.log(err)
          // })

          // const transactionId = await fcl.mutate({
          //   cadence: `
          //     import FungibleToken from FungibleToken
          //     import FlowToken from FlowToken
          //     transaction( ) {

          //       // The Vault resource that holds the tokens that are being transferred
          //       let sentVault: @FungibleToken.Vault
            
          //       prepare(signer: AuthAccount) {
            
          //           // Get a reference to the signer's stored vault
          //           let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
          //         ?? panic("Could not borrow reference to the owner's Vault!")
            
          //           // Withdraw tokens from the signer's stored vault
          //           self.sentVault <- vaultRef.withdraw(amount: 1.0)
          //       }
            
          //       execute {
            
          //           // Get a reference to the recipient's Receiver
          //           let receiverRef =  getAccount(0x7e303c43f3a868fd)
          //               .getCapability(/public/flowTokenReceiver)
          //               .borrow<&{FungibleToken.Receiver}>()
          //         ?? panic("Could not borrow receiver reference to the recipient's Vault")
            
          //           // Deposit the withdrawn tokens in the recipient's receiver
          //           receiverRef.deposit(from: <-self.sentVault)
          //       }
          //   }
          //   `,
          //   proposer: fcl.currentUser,
          //   payer: fcl.currentUser,
          //   limit: 50
          // })
          
          // const transaction = await fcl.tx(transactionId).onceSealed()
          // console.log(transaction)
          // const profile = await fcl.query({
          //   cadence: `
          //     import Profile from 0xProfile
      
          //     pub fun main(address: Address): Profile.ReadOnly? {
          //       return Profile.read(address)
          //     }
          //   `,
          //   args: (arg:any, t:any) => [arg(account, t.Address)]
          // })
          // console.log(profile)
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