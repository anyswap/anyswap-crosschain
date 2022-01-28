import { useCallback } from 'react'
import useInterval from '../../hooks/useInterval'
// import { useDispatch } from 'react-redux'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import config from '../../config'
import {poolLiquidity} from './actions'


export default function Updater(): null {
  const dispatch = useDispatch()
  const getPools = useCallback(() => {
    axios.get(`${config.bridgeApi}/data/router/pools`).then(res => {
      const {status, data} = res
      if (status === 200) {
        dispatch(poolLiquidity({poolLiquidity: data}))
      }
    })
  }, [dispatch])

  useInterval(getPools, 1000 * 30)
  return null
}
