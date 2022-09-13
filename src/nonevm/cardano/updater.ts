import { useCallback, useEffect, useRef } from "react";
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
  adaAddress,
  adaBalanceList
} from './actions'
import useInterval from "../../hooks/useInterval";

// import {
//   useAdaBalance
// } from './index'

export default function Updater(): null {
  const {chainId, account} = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()

  // const {getAdaBalance} = useAdaBalance()

  const setAdaAddress = useCallback((address:any) => {
    console.log(address)
    dispatch(adaAddress({address}))
  }, [dispatch])


  const typhonRef = useRef<any>()

  window.onload = () => {
    typhonRef.current = window.cardano.typhon
  };

  const getBalance = useCallback(() => {
    const adaWallet = typhonRef.current

    // getAdaBalance()
    if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId) && adaWallet) {
      adaWallet.getBalance().then((res:any) => {
        console.log(res)
        const blList:any = {}
        if (res.status) {
          const result = res.data
          blList['NATIVE'] = result.ada
          if (result.tokens && result.tokens.length > 0) {
            for (const obj of result.tokens) {
              const key = obj.policyId + '.' + obj.assetName
              blList[key] = obj.amount
            }
          }
          dispatch(adaBalanceList({list: blList}))
        }
      })
    }
  }, [chainId, typhonRef.current, account])

  useEffect(() => {
    getBalance()
  }, [chainId, typhonRef.current, account])

  useInterval(getBalance, 1000 * 10)

  useEffect(() => {
    const adaWallet = typhonRef.current
    console.log(adaWallet)
    if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId) && adaWallet) {

      adaWallet.enable().then((res:any) => {
        // console.log(res)
        if (res) {
          adaWallet.getNetworkId().then((res:any) => {
            // console.log(res)
            if (
              (res.data === 0 && ChainId.ADA_TEST === chainId)
              || (res.data === 1 && ChainId.ADA === chainId)
            ) {
              adaWallet.getAddress().then((res:any) => {
                // console.log(res)
                if (res) {
                  setAdaAddress(res.data)
                }
              })
            } else {
              alert('Network Error.')
            }
          })
        }
      })
      
      const handleChainChanged = (chainID:any) => {
        console.log(chainID)
      }

      const handleAccountsChanged = (accounts: string[]) => {
        console.log(accounts)
        adaWallet.getNetworkId().then((res:any) => {
          // console.log(res)
          if (
            (res.data === 0 && ChainId.ADA_TEST === chainId)
            || (res.data === 1 && ChainId.ADA === chainId)
          ) {
            adaWallet.getAddress().then((res:any) => {
              // console.log(res)
              if (res) {
                setAdaAddress(res.data)
              }
            })
          } else {
            alert('Network Error.')
          }
        })
      }

      if (adaWallet?.on) {
        console.log(1.1)
        adaWallet?.on('networkChanged', handleChainChanged)
        adaWallet?.on('accountChanged', handleAccountsChanged)
      }

      return () => {
        if (adaWallet.removeListener) {
          adaWallet.removeListener('chainChanged', handleChainChanged)
          adaWallet.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [chainId, typhonRef.current])

  return null
}