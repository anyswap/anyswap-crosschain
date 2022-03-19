import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
// import { useDispatch } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../index'
import config from '../../config'
import { useWeb3 } from '../../utils/tools/web3UtilsV2'

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const stateMt = useSelector<AppState, AppState['multicall']>(state => state.multicall)
  const destChainId = stateMt.useChainId
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
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible])

  const debouncedState = useDebounce(state, 10)

  useEffect(() => {
    if (
      !debouncedState.chainId ||
      !debouncedState.blockNumber ||
      !windowVisible ||
      !config.getCurChainInfo(destChainId)
    ) {
      console.log('>>>> App updater >>> skip')
      return
    }

    if (destChainId && false) {
      console.log('>> App updated >>> destChainId', destChainId)
      
      useWeb3(destChainId, 'eth', 'getBlockNumber', []).then((res: any) => {
        dispatch(updateBlockNumber({ chainId: destChainId, blockNumber: res }))
      })
    }

console.log('debouncedState.chainId', debouncedState.chainId, 'destChainId', destChainId)
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}
