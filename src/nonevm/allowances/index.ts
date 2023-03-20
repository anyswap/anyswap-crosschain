import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { ChainId } from '../../config/chainConfig/chainId'
import { MaxUint256 } from '@ethersproject/constants'
import {useTrxAllowance} from '../trx'
import {useAptosBalance, useAptAllowance} from '../apt'
import {useReefAllowance} from '../reef'

import useInterval from '../../hooks/useInterval'
import {useTxnsErrorTipOpen} from '../../state/application/hooks'
import {
  // useDispatch,
  useSelector
} from 'react-redux'
import {
  AppState,
  // AppDispatch
} from '../../state'

import {
  useApproveState
} from '../hooks'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

interface ApproveResult {
  hash: string
}

export function useNonevmAllowances (
  isApprove: boolean,
  selectCurrency:any,
  spender: any,
  chainId:any,
  account:any,
  inputValue:any,
  anyToken:any,
) {
  const addTransaction = useTransactionAdder()
  const {setApprovalState} = useApproveState()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()

  const token = useMemo(() => {
    return selectCurrency?.address
  }, [selectCurrency])

  const {getTrxAllowance, setTrxAllowance} = useTrxAllowance(token, spender, chainId, account)
  const {getReefAllowance, setReefAllowance} = useReefAllowance(token, spender, chainId, account)
  const {setAptAllowance} = useAptAllowance()

  const {aptBalanceList} = useAptosBalance()
  // const allowanceList = useRef<any>()
  const allowanceList:any = useSelector<AppState, AppState['nonevm']>(state => state.nonevm.approveList)

  const [loading, setLoading] = useState<boolean>(false)

  const allowanceResult = useMemo(() => {
    // console.log(allowanceList)
    if (allowanceList?.[chainId]?.[account]?.[token]?.[spender]?.allowance) {
      return allowanceList?.[chainId]?.[account]?.[token]?.[spender]?.allowance
    } else {
      return 0
    }
  }, [token, spender, chainId, account, allowanceList])

  const setNonevmAllowance = useCallback(async() => {
    let approveResult:ApproveResult | undefined | null
    try {
      if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
        approveResult = await setTrxAllowance()
      } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
        approveResult = await setReefAllowance()
      } else if ([ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
        let useToken
        if (!aptBalanceList?.[token]) {
          useToken = token
        } else if (!aptBalanceList?.[anyToken?.address]) {
          useToken = anyToken?.address
        }
        approveResult = await setAptAllowance(useToken, chainId, account, anyToken?.address)
      }
      if (approveResult) {
        setLoading(true)
        addTransaction(approveResult, {
          summary: selectCurrency?.symbol + ' approved, you can continue the cross chain transaction',
          approval: { tokenAddress: token.address, spender: spender }
        })
      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      onChangeViewErrorTip(error, true)
    }
    return
  }, [token, spender, chainId, account, aptBalanceList, setTrxAllowance, setReefAllowance])

  const getNonevmAllowance = useCallback(() => {
    // console.log(allowanceList)
    // console.log(allowanceResult)
    // console.log(token)
    // console.log(spender)
    if (isApprove && inputValue && Number(inputValue) > Number(allowanceResult)) {
      if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
        getTrxAllowance().then(res => {
          // console.log(res)
          setApprovalState({chainId, account, token, spender, allowance: res})
        })
      } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
        getReefAllowance().then(res => {
          // console.log(res)
          setApprovalState({chainId, account, token, spender, allowance: res})
        })
      } else if ([ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
        // console.log(token)
        // console.log(aptBalanceList)
        if (aptBalanceList?.[token] && aptBalanceList?.[anyToken?.address]) {
          setApprovalState({chainId, account, token, spender, allowance: MaxUint256.toString()})
        } else {
          setApprovalState({chainId, account, token, spender, allowance: 0})
        }
      } else {
        // allowanceList.current = ''
      }
    }
  }, [token, spender, chainId, account, allowanceResult, inputValue, isApprove, aptBalanceList, getTrxAllowance, getReefAllowance])

  useEffect(() => {
    getNonevmAllowance()
  }, [token, spender, chainId, account, inputValue, isApprove])
  
  useEffect(() => {
    setLoading(false)
  }, [token, spender, chainId, account])

  useInterval(getNonevmAllowance, 1000 * 3)

  return {
    allowance: allowanceResult,
    loading,
    setNonevmAllowance
  }
}