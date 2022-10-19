import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'
import useInterval from '../../hooks/useInterval'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import {aptBalanceList} from './actions'

import {
  useLoginAptos,
  // useAptAllowance,
  useAptosBalance
} from './index'

export default function Updater(): null {
  const { chainId,account } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  // const {setAptAllowance} = useAptAllowance()
  const {loginAptos} = useLoginAptos()
  const {getAptosResource} = useAptosBalance()

  const getBalance = useCallback(() => {
    getAptosResource(chainId, account).then((res:any) => {
      const list:any = {}
      if (res) {
        for (const obj of res) {
          const type = obj.type
          const token = type.replace('0x1::coin::CoinStore<', '').replace('>', '')
          if (obj?.data?.coin?.value) {
            list[token] = {
              balance: obj?.data?.coin?.value
            }
          }
        }
      }
      // console.log(list)
      dispatch(aptBalanceList({list}))
    })
  }, [account, chainId, dispatch])

  useEffect(() => {
    // setAptAllowance('0x5f31dac7618ccf2df75e0f5c458603d7a3ee2acb48d977ee41da3e562d7a90f6::USDT::Coin',chainId, account)
    getBalance()
  }, [account, chainId, dispatch])

  useInterval(getBalance, 1000 * 5)

  const getAptosAddress = useCallback(() => {
    loginAptos(chainId)
  }, [chainId])

  useEffect(() => {
    getAptosAddress()
  }, [chainId])

  return null
}