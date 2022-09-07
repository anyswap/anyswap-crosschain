
import {  useSelector } from 'react-redux'

import { AppState } from '../../state'

export function useAdaAddress () {
  const account:any = useSelector<AppState, AppState['ada']>(state => state.ada.adaAddress)
  // console.log(window?.tronWeb?.isConnected())
  return {
    // trxAddress: account ? toHexAddress(account) : ''
    adaAddress: account
  }
}