
import { useCallback, useEffect } from 'react'
import { ChainId } from '../../config/chainConfig/chainId'
import { useActiveReact } from '../../hooks/useActiveReact'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import useInterval from '../../hooks/useInterval'
import {
  useLoginAtom,
  useAtomBalance
} from './index'
import {
  atomBalanceList
} from './actions'

export default function Updater(): null {
  const { chainId, account } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  const {loginAtom} = useLoginAtom()
  const {getAtomSeiBalance} = useAtomBalance()

  const getBalance = useCallback(() => {
    getAtomSeiBalance({chainId, account}).then((res:any) => {
      const list:any = {}
      console.log(res)
      if (res && res.balances) {
        for (const obj of res.balances) {
          // console.log(obj)
          if (obj?.denom === 'usei') {
            list['NATIVE'] = {
              balance: obj?.amount
            }
          }
        }
      }
      console.log(list)
      dispatch(atomBalanceList({list}))
    })
  }, [account, chainId, dispatch])

  useEffect(() => {
    getBalance()
  }, [account, chainId, dispatch])

  useInterval(getBalance, 1000 * 5)

  const getAtomAddress = useCallback(() => {
    console.log(chainId)
    if ([ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST].includes(chainId)) {
      loginAtom(chainId)
    }
  }, [chainId])

  useEffect(() => {
    getAtomAddress()
  }, [chainId])

  return null
}
