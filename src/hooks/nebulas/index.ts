import { useEffect, useMemo, useState, useCallback } from 'react'
import nebulas from 'nebulas'

export const isExtWalletInstall = () => {
  return 'NasExtWallet' in window
}

export const useCurrentAddress = () => {
  const [address, setAddress] = useState<string>('')

  const getUserAddress = useCallback(() => {
    if (isExtWalletInstall() && !address) {
      NasExtWallet.getUserAddress((addr: string) => {
        setAddress(addr)
        console.log('user nas address: ' + address + Date.now())
      })
    }
  }, [address])

  getUserAddress()

  //   useEffect(() => {
  //     getUserAddress()
  //   }, [])

  return useMemo(() => {
    return address
  }, [address])
}

export const useCurrentNasBalance = () => {
  const [balance, setBalance] = useState<string>()
  const address = useCurrentAddress()
  const neb = new nebulas.Neb()
  neb.setRequest(new nebulas.HttpRequest('https://mainnet.nebulas.io'))

  const getNasBalance = useCallback(async () => {
    if (nebulas.Account.isValidAddress(address)) {
      const state = await neb.api.getAccountState(address)
      setBalance(state.balance)
      //   console.log('getNasBalance', address, state)
      return state.balance
    }
  }, [address])

  useEffect(() => {
    getNasBalance()
  }, [address])

  return {
    getNasBalance,
    balance
  }
}
