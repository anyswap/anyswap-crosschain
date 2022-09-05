import { useEffect } from "react";
import { ChainId } from "../../config/chainConfig/chainId";

import {useActiveReact} from '../useActiveReact'

export default function Updater(): null {
  const {chainId} = useActiveReact()

  useEffect(() => {
    const { cardano } = window

    if ([ChainId.ADA, ChainId.ADA_TEST].includes(chainId) && cardano) {

      console.log(cardano.nami.enable())
      const handleChainChanged = (chainID:any) => {
        console.log(chainID)
        // activate(injected, undefined, true).catch(error => {
        //   console.error('Failed to activate after chain changed', error)
        // })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          // activate(injected, undefined, true).catch(error => {
          //   console.error('Failed to activate after accounts changed', error)
          // })
        }
      }

      cardano.on('chainChanged', handleChainChanged)
      cardano.on('accountsChanged', handleAccountsChanged)

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