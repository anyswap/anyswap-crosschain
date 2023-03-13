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

  // const {getAdaBalance} = useAdaBalance()

  const setAdaAddress = useCallback((address: any) => {
    console.log(address)
    dispatch(adaAddress({ address }))
  }, [dispatch])


  const eternlRef = useRef<any>()

  window.onload = () => {
    eternlRef.current = window.cardano.eternl
  };

  const getFetchBalance = async () => {
    if (window.lucid) {
      const blList: any = {}
      const utxos = await window.lucid.wallet.getUtxos()
      console.log(utxos)
      let total = BigInt(0);
      utxos.map((e: any) => {
        total += e.assets.lovelace;
        for (const tokenAddress in e.assets) {
          const _tokenAddress = tokenAddress.slice(0,56) + '.' + tokenAddress.slice(56, tokenAddress.length);
          if(tokenAddress !== "lovelace") {
            blList[_tokenAddress] = e.assets[tokenAddress].toString() // BigInt(10000000).toString();
          }
        }
      });
      blList['NATIVE'] = total.toString();
      dispatch(adaBalanceList({ list: blList }))
    }

  }

  const getBalance = useCallback(() => {
    if (!account) return;
    const adaWallet = window?.cardano?.eternl

    // getAdaBalance()
    if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId) && adaWallet) {
      getFetchBalance()
      // adaWallet.enable().then((eternl:any) => {
      //   eternl.getBalance().then((res:any) => {
      //     console.log(res);
      /**
       * Convert CIP-30 responses to human readable values
       */
      // example CIP-30 api.getBalance(); response
      // const balance:any = cmlToCore.value(CML.Value.from_bytes(Buffer.from(res, "hex")));
      // console.log(balance);
      // const blList:any = {}
      // if (res.status) {
      //   const result = res.data
      //   blList['NATIVE'] = result.ada
      //   if (result.tokens && result.tokens.length > 0) {
      //     for (const obj of result.tokens) {
      //       const key = obj.policyId + '.' + obj.assetName
      //       blList[key] = obj.amount
      //     }
      //   }
      //   dispatch(adaBalanceList({list: blList}))
      // }
      // })
      // });

    }
  }, [chainId, eternlRef.current, account])

  useEffect(() => {
    getBalance()
  }, [chainId, eternlRef.current, account])

  useInterval(getBalance, 1000 * 10)

  useEffect(() => {
    const adaWallet = window?.cardano?.eternl

    if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId) && adaWallet) {
      adaWallet.enable().then((eternl: any) => {
        if (eternl) {
          eternl.getNetworkId().then((res: any) => {
            if (
              (res === 0 && ChainId.ADA_TEST === chainId)
              || (res === 1 && ChainId.ADA === chainId)
            ) {
              eternl.getChangeAddress().then((res: any) => {
                if (res && res.length > 0) {
                  setAdaAddress(res)
                }
              })
            } else {
              alert('Network Error.')
            }
          })
        }
      }).catch((err: any) => { console.log(err) })

      const handleChainChanged = (chainID: any) => {
        console.log(chainID)
      }

      const handleAccountsChanged = (accounts: string[]) => {
        adaWallet.getNetworkId().then((res: any) => {
          // console.log(res)
          if (
            (res === 0 && ChainId.ADA_TEST === chainId)
            || (res === 1 && ChainId.ADA === chainId)
          ) {
            adaWallet.getChangeAddress().then((res: any) => {
              // console.log(res)
              if (res && res.length > 0) {
                setAdaAddress(res)
              }
            })
          } else {
            alert('Network Error.')
          }
        })
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