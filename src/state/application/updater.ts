import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ZERO_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useMainConfigContract } from '../../hooks/useContract'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber, updateRouterData } from './actions'
import { useAppState } from './hooks'

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const windowVisible = useIsWindowVisible()
  const { appSettings: { mainConfigAddress, mainConfigChainId } } = useAppState()
  const routerConfig = useMainConfigContract(mainConfigAddress, mainConfigChainId || 0)

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

  useEffect(() => {
    const fetch = async () => {
      if (!routerConfig || !chainId) return

      const { RouterContract } = await routerConfig.methods.getChainConfig(chainId).call()

      dispatch(updateRouterData({ chainId, routerAddress: RouterContract === ZERO_ADDRESS ? '' : RouterContract }))
    }

    if (routerConfig && chainId) {
      fetch()
    } else {
      dispatch(updateRouterData({ chainId: chainId || 0, routerAddress: '' }))
    }
  }, [chainId, mainConfigAddress, mainConfigChainId, routerConfig])

  return null
}
