import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useActiveReact } from '../../hooks/useActiveReact'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppState } from '../index'

// import { useWeb3 } from '../../utils/tools/web3UtilsV2'


export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const {chainId: nonevmChainId} = useActiveReact()
  const dispatch = useDispatch()
  // const stateMt = useSelector<AppState, AppState['multicall']>(state => state.multicall)
  // const destChainId = stateMt.useChainId
  // console.log(stateMt)
  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState(state => {
        // console.log('时间', Date.now())
        // console.log(state)
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
        }
        return state
      })
    },
    [chainId, setState]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible || isNaN(nonevmChainId)) return undefined

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))
    
    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible, nonevmChainId])

  const debouncedState = useDebounce(state, 0)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])
  // useEffect(() => {
  //   console.log(destChainId)
  //   if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return

  //   if (destChainId && !isNaN(destChainId)) {
  //     useWeb3(destChainId, 'eth', 'getBlockNumber', []).then((res:any) => {
  //       dispatch(updateBlockNumber({ chainId: destChainId, blockNumber: res }))
  //     })
  //   }

  //   // console.log(debouncedState)

  //   dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  // }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}
