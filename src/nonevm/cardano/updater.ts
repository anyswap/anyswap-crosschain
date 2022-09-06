import { useEffect } from "react";
import { ChainId } from "../../config/chainConfig/chainId";

import {useActiveReact} from '../../hooks/useActiveReact'

export default function Updater(): null {
  const {chainId} = useActiveReact()

  useEffect(() => {
    const { cardano } = window

    if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId) && cardano) {

      console.log(cardano)
      cardano.getChangeAddress().then((res:any) => {
        console.log(res)
      })
      cardano.getUnusedAddresses().then((res:any) => {
        console.log(res)
      })
      cardano.nami.enable().then((res:any) => {
        console.log(res)
      })
      // console.log(cardano.nami.enable())
      const handleChainChanged = (chainID:any) => {
        console.log(chainID)
        // activate(injected, undefined, true).catch(error => {
        //   console.error('Failed to activate after chain changed', error)
        // })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        console.log(accounts)
        if (accounts.length > 0) {
          // eat errors
          // activate(injected, undefined, true).catch(error => {
          //   console.error('Failed to activate after accounts changed', error)
          // })
        }
      }

      if (cardano.on) {
        cardano.on('chainChanged', handleChainChanged)
        cardano.on('accountsChanged', handleAccountsChanged)
      } else {
        cardano.onAccountChange(handleChainChanged)
        cardano.onNetworkChange(handleAccountsChanged)
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