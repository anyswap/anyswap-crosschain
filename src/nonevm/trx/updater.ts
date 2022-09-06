
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
        if (ChainId.TRX_TEST === chainId) {
          if (window?.tronWeb?.fullNode?.host.indexOf('shasta') === -1 && !onlyone) {
            onlyone = 1
            alert('Please switch to Shasta Network.')
          } else {
            dispatch(trxAddress({address: window.tronWeb.defaultAddress.base58}))
          }
        } else {
          if (window?.tronWeb?.fullNode?.host.indexOf('api.trongrid.io') === -1 && !onlyone) {
            onlyone = 1
            alert('Please switch to Main Network.')
          } else {
            dispatch(trxAddress({address: window.tronWeb.defaultAddress.base58}))
          }
        }
        // const HttpProvider = window?.tronWeb?.providers.HttpProvider
        // // window?.tronWeb?.setFullNode(new HttpProvider("https://api.shasta.trongrid.io"))
        // window?.tronWeb?.setFullNode(new HttpProvider("https://api.trongrid.io"))
        // dispatch(trxAddress({address: window.tronWeb.defaultAddress.base58}))
      } else {
        dispatch(trxAddress({address: ''}))
      }
    }
  }, [window?.tronWeb, chainId])

  useInterval(getTrxAddress, 1000 * 3)


  return null
}
