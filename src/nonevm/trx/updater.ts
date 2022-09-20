
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveReact } from '../../hooks/useActiveReact'
import useInterval from '../../hooks/useInterval'

import { AppDispatch } from '../../state'

import {trxAddress} from './actions'

// import config from '../../config'
import { ChainId } from '../../config/chainConfig/chainId'
let onlyone = 0
export default function Updater(): null {
  const { chainId } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  
  const getTrxAddress = useCallback(() => {
    if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId) && window.tronWeb) {
      if (window?.tronWeb?.address) {
        if (ChainId.TRX_TEST === chainId) {
          if (window?.tronWeb?.fullNode?.host.indexOf('shasta') === -1 && !onlyone && window?.tronWeb?.fullNode?.ready) {
            onlyone = 1
            // alert('Please switch to Shasta Network.')
            dispatch(trxAddress({address: ''}))
          } else {
            dispatch(trxAddress({address: window.tronWeb.defaultAddress.base58}))
          }
        } else {
          if (window?.tronWeb?.fullNode?.host.indexOf('api.trongrid.io') === -1 && !onlyone && window?.tronWeb?.fullNode?.ready) {
            onlyone = 1
            // alert('Please switch to Main Network.')
            dispatch(trxAddress({address: ''}))
          } else {
            dispatch(trxAddress({address: window.tronWeb.defaultAddress.base58}))
          }
        }
      } else {
        dispatch(trxAddress({address: ''}))
      }
    }
  }, [window?.tronWeb, chainId])

  useInterval(getTrxAddress, 1000 * 3)


  return null
}
