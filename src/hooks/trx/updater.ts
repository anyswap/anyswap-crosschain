
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveReact } from '../useActiveReact'
import useInterval from '../../hooks/useInterval'

import { AppDispatch } from '../../state'

import {trxAddress} from './actions'

// import config from '../../config'
import { ChainId } from '../../config/chainConfig/chainId'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()

  // const [account, setAccount] = useState<any>()
  const getTrxAddress = useCallback(() => {
    // console.log(chainId)
    // console.log(window.tronWeb)
    // console.log(window.tronWeb.defaultAddress.base58)
    // if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId) && window.tronWeb && window.tronWeb.defaultAddress.base58) {
    if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId) && window.tronWeb) {
      // console.log(window.tronWeb.defaultAddress.base58)
      // console.log(window?.tronWeb?.address)
      // setAccount(window.tronWeb.defaultAddress.base58)
      if (window?.tronWeb?.address) {
        // window?.tronWeb?.isConnected().then((res:any) => {
        //   console.log(res)
        // })
        dispatch(trxAddress({address: window.tronWeb.defaultAddress.base58}))
      } else {
        dispatch(trxAddress({address: ''}))
      }
    }
  }, [window?.tronWeb, chainId])

  useInterval(getTrxAddress, 1000 * 3)


  return null
}
