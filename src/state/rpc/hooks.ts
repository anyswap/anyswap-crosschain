// import { useCallback, useEffect, useState, useMemo } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, AppState } from '../index'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
// import { rpclist } from './actions'

import { useActiveReact } from '../../hooks/useActiveReact'

export function useRpcState(): any {
  const { chainId } = useActiveReact()
  const list:any = useSelector<AppState, AppState['rpc']>(state => state.rpc.rpclist)
  if (!chainId || !list[chainId]) return {}

  return list[chainId]
}
