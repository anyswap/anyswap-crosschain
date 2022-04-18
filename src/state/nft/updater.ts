import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import useInterval from '../../hooks/useInterval'
import { AppState } from '../index'
// import { nftlist } from './actions'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { useFetchTokenList1Callback } from '../../hooks/useFetchListCallback'

// import config from '../../config'

export default function Updater(): null {
  const { library } = useActiveWeb3React()
  const lists = useSelector<AppState, AppState['nft']['nftlist']>(state => state.nft.nftlist)

  

  const isWindowVisible = useIsWindowVisible()

  const fetchList = useFetchTokenList1Callback()

  // console.log(fetchTokenList)
  // console.log(lists)

  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return
    fetchList()
  }, [fetchList, isWindowVisible, lists])

  // 每 10 分钟获取所有列表，但仅在我们初始化库之后
  useInterval(fetchAllListsCallback, library ? 1000 * 60 * 10 : null)

  return null
}
