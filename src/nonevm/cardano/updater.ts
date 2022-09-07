import { useCallback, useEffect } from "react";
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
  adaAddress
} from './actions'

export default function Updater(): null {
  const {chainId} = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()

  const setAdaAddress = useCallback((address:any) => {
    console.log(address)
    dispatch(adaAddress({address}))
  }, [dispatch])

  useEffect(() => {
    const { cardano } = window

    if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId) && cardano) {

      console.log(cardano)
      // console.log(Buffer.from('001c5a34aca42e95587698068ffb83e6d95313c7ac74b4c35016b6cbdcdc93f8e856f05e630b245bd85e55180b4dd19def9dbf8fcf6ddaf5dc', 'hex'))
      cardano.getBalance().then((res:any) => {
        console.log(res)
      })
      // cardano.getUsedAddresses().then((res:any) => {
      //   console.log(res)
      // })
      cardano.getCollateral().then((res:any) => {
        console.log(res)
      })
      cardano.getUtxos().then((res:any) => {
        console.log(res)
      })
      cardano.nami.enable().then((res:any) => {
        res.getChangeAddress().then((res:any) => {
          if (res) {
            setAdaAddress(res)
          }
        })
      })
      
      const handleChainChanged = (chainID:any) => {
        console.log(chainID)
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAdaAddress(accounts[0])
        }
        cardano.getCollateral().then((res:any) => {
          console.log(res)
        })
        cardano.getUtxos().then((res:any) => {
          console.log(res)
        })
      }

      if (cardano?.experimental?.on) {
        console.log(1)
        cardano?.experimental?.on('chainChanged', handleChainChanged)
        cardano?.experimental?.on('accountsChanged', handleAccountsChanged)
      } else {
        console.log(2)
        cardano.onNetworkChange(handleChainChanged)
        cardano.onAccountChange(handleAccountsChanged)
      }

      return () => {
        if (cardano.removeListener) {
          cardano.removeListener('chainChanged', handleChainChanged)
          cardano.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [chainId])

  return null
}