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

import { useActiveReact } from '../../hooks/useActiveReact'

import {
  adaAddress,
  adaBalanceList
} from './actions'
import useInterval from "../../hooks/useInterval";

// import { CML, cmlToCore } from "@cardano-sdk/core";
// import {
//   useAdaBalance
// } from './index'

export default function Updater(): null {
  const { chainId, account } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()


  const setAdaAddress = useCallback((address: any) => {
    dispatch(adaAddress({ address }))
  }, [dispatch])


  const eternlRef = useRef<any>()

  window.onload = () => {
    eternlRef.current = window?.cardano?.eternl
  };

  const bigIntToString = (obj: any): any => {
    return Object.keys(obj).reduce((acc:any, key:any) => {
      acc[key] = obj[key].toString();
      return acc;
    }, {});
  }
  
  const getFetchBalance = async () => {
    if (window.lucid && window?.lucid?.wallet) {
      let blList: any = {}
      try {
        const utxos = await window.lucid.wallet.getUtxos()
        console.log(utxos)
        let total = BigInt(0);
        utxos.map((e: any) => {
          setAdaAddress(e.address)
          total += e.assets.lovelace;
          for (const tokenAddress in e.assets) {
            const _tokenAddress = tokenAddress.slice(0,56) + '.' + tokenAddress.slice(56, tokenAddress.length);
            if(tokenAddress !== "lovelace") {
              if(blList[_tokenAddress]) {
                blList[_tokenAddress] = blList[_tokenAddress] + e.assets[tokenAddress]
              } else {
                blList[_tokenAddress] = e.assets[tokenAddress] // BigInt(10000000).toString();
              }
            }
          }
        });
        blList['NATIVE'] = total.toString();
        blList = bigIntToString(blList);
        dispatch(adaBalanceList({ list: blList }))
      } catch (error) {
        
      } 
      
    }

  }

  
  const getBalance = useCallback(() => {
    // if (!account) return;
    const adaWallet = window?.cardano && window?.cardano?.eternl

    if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId) && adaWallet) {
      getFetchBalance()

    }
  }, [chainId, eternlRef.current, account])

  useEffect(() => {
    getBalance()
  }, [chainId, eternlRef.current, account])

  useInterval(getBalance, 1000 * 10)

  useEffect(() => {
    const adaWallet = window?.cardano && window?.cardano?.eternl

    if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId) && adaWallet) {
      getBalance()

      const handleChainChanged = (chainID: any) => {
        console.log(chainID)
      }

      const handleAccountsChanged = () => {
        getBalance()
      }

      if (adaWallet?.on) {
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
  }, [chainId, eternlRef.current])

  return null
}