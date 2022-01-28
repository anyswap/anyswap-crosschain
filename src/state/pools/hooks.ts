// import { useCallback, useEffect, useState, useMemo } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, AppState } from '../index'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
// import { poolLiquidity } from './actions'

// import { JSBI } from 'anyswap-sdk'
// import axios from 'axios'

export function usePoolsState(): any {
  const poolLiquidity:any = useSelector<AppState, AppState['pools']>(state => state.pools.poolLiquidity)
  // console.log(poolLiquidity)
  if (!poolLiquidity) return {}

  return poolLiquidity
}


