import { useCallback, useEffect } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const windowVisible = useIsWindowVisible()

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      if (chainId) {
        dispatch(updateBlockNumber({ chainId, blockNumber }))
      }
    },
    [chainId]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    library.on('block', blockNumberCallback)

    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [chainId, library, blockNumberCallback, windowVisible])

  return null
}
