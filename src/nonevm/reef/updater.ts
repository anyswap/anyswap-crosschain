
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'
// import {
//   // useDispatch,
//   useSelector
// } from 'react-redux'
// import {
//   AppState,
//   // AppDispatch
// } from '../../state'
import { ChainId } from '../../config/chainConfig/chainId'
import {
  useLoginReef,
  // useReefProvider,
  useReefClient,
  // useReefSigner
} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginReef} = useLoginReef()
  // const reefClient:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefClient)

  const getClient = useReefClient()
  // const getReefSigner = useReefSigner()
  // const getReefProvider = useReefProvider()

  const getReefAddress = useCallback(() => {
    if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      loginReef(chainId, 1)
    }
  }, [chainId])

  // useEffect(() => {
  //   if (reefClient) {
  //     getReefSigner(reefClient)
  //   }
  // }, [reefClient])

  useEffect(() => {
    if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      // getReefProvider(chainId)
      getClient()
    }
  // }, [chainId, getReefProvider])
  }, [chainId])

  useEffect(() => {
    if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      getReefAddress()
      
    }
  }, [chainId])

  return null
}
