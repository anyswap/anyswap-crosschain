import { useConnectedWallet } from '@terra-money/wallet-provider'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useETHBalances } from '../state/wallet/hooks'
import { useUserSelectChainId } from '../state/user/hooks'
import useInterval from './useInterval'
import useTerraBalance, {useTerraBaseBalance} from './useTerraBalance'
import { useCurrentNasBalance, useNasTokenBalance } from '../nonevm/nas'
import { useNearBalance } from '../nonevm/near'
import { useTrxBalance } from '../nonevm/trx'
import {useXlmBalance} from '../nonevm/stellar'
import {useAdaBalance} from '../nonevm/cardano'
import {useFlowBalance} from '../nonevm/flow'
import {useSolBalance} from '../nonevm/solana'
import {useAptosBalance} from '../nonevm/apt'
import {useBtcBalance} from '../nonevm/btc'
import {useAtomBalance} from '../nonevm/atom'
import {useReefBalance} from '../nonevm/reef'


import {useCurrencyBalance1, useAllTokenBalance} from '../state/wallet/hooks'
import {useActiveReact} from './useActiveReact'

import { ChainId } from '../config/chainConfig/chainId'
import { BigAmount } from '../utils/formatBignumber'
import { tryParseAmount3 } from '../state/swap/hooks'

import config from '../config'

export function useTokensBalance (token:any, dec:any, selectChainId:any) {
  const {account} = useActiveReact()
  const connectedWallet = useConnectedWallet()
  const {getTerraBalances} = useTerraBalance()

  const { getNearTokenBalance } = useNearBalance()

  const {getNasTokenBalance} = useNasTokenBalance()
  
  const {getTrxTokenBalance} = useTrxBalance()

  const {getAllBalance} = useXlmBalance()

  const {adaBalanceList} = useAdaBalance()
  const {flowBalanceList} = useFlowBalance()
  const {getSolTokenBalance, getSolBalance} = useSolBalance()
  const {aptBalanceList} = useAptosBalance()
  const {btcBalanceList} = useBtcBalance()
  const {atomBalanceList} = useAtomBalance()
  const {getReefTokenBalance} = useReefBalance()

  const savedBalance = useRef<any>()

  const evmBalance = useCurrencyBalance1(account, token, dec, selectChainId)

  const {setTokenBalance} = useAllTokenBalance()

  const fetchBalance = useCallback(() => {
    // console.log([ChainId.TRX, ChainId.TRX_TEST].includes(selectChainId))
    if (token) {
      if ([ChainId.TERRA].includes(selectChainId) && connectedWallet?.walletAddress) {
        getTerraBalances({
          terraWhiteList: [{
            token: token
          }],
          account: connectedWallet?.walletAddress
        }).then(res => {
          const bl = res[token] && (dec || dec === 0) ? BigAmount.format(dec, res[token]) : undefined
          savedBalance.current = bl
        })
      } else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChainId)) {
        getNearTokenBalance({token}).then(res => {
          const bl = res && (dec || dec === 0) ? BigAmount.format(dec, res) : undefined
          savedBalance.current = bl
        })
      } else if ([ChainId.NAS].includes(selectChainId)) {
        getNasTokenBalance({
          account: '',
          token
        }).then((res:any) => {
          const bl = res && (dec || dec === 0) ? BigAmount.format(dec, res) : undefined
          savedBalance.current = bl
        }).catch(() => {
          savedBalance.current = ''
        })
      } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(selectChainId)) {
        getTrxTokenBalance({token}).then((res:any) => {
          // console.log(token)
          // console.log(res)
          const bl:any = '0x' + res?.constant_result?.[0]
          savedBalance.current = bl && (dec || dec === 0) ? BigAmount.format(dec, bl) : undefined
        })
      } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(selectChainId)) {
        // console.log(selectChainId)
        getAllBalance(selectChainId).then((res:any) => {
          // console.log(res)
          if (res?.balances) {
            if (res?.[token]?.balance) {
              // const dec = 7
              const blvalue = tryParseAmount3(res?.[token]?.balance, dec)
              const bl = res ? BigAmount.format(dec, blvalue) : undefined
              savedBalance.current = bl
            }
          }
        })
      } else if ([ChainId.ADA, ChainId.ADA_TEST].includes(selectChainId)) {
        if (adaBalanceList?.[token]) {
          const bl = BigAmount.format(dec, adaBalanceList?.[token])
          savedBalance.current = bl
        }
      } else if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(selectChainId)) {
        if (flowBalanceList?.[token]) {
          const bl = BigAmount.format(dec, flowBalanceList?.[token])
          savedBalance.current = bl
        }
      } else if ([ChainId.SOL, ChainId.SOL_TEST].includes(selectChainId)) {
        // console.log(token)
        if (token === 'native') {
          getSolBalance({chainId: selectChainId, account: account}).then((res:any) => {
            // console.log(res)
            if (res?.result?.value) {
              const bl = BigAmount.format(dec, res?.result?.value)
              savedBalance.current = bl
            }
          })
        } else {
          getSolTokenBalance({chainId: selectChainId, account: account, token}).then((res:any) => {
            // console.log(res)
            if (res?.result?.value?.amount) {
              const bl = BigAmount.format(dec, res?.result?.value?.amount)
              savedBalance.current = bl
            }
          })
        }
      } else if ([ChainId.APT, ChainId.APT_TEST].includes(selectChainId)) {
        // console.log(account)
        if (aptBalanceList?.[token]) {
          const bl = BigAmount.format(dec, aptBalanceList?.[token]?.balance)
          savedBalance.current = bl
        } else if (dec) {
          const bl = BigAmount.format(dec, '0')
          savedBalance.current = bl
        }
      } else if ([ChainId.BTC, ChainId.BTC_TEST].includes(selectChainId) && config?.chainInfo?.[selectChainId]?.chainType !== 'NOWALLET') {
        // console.log(account)
        if (btcBalanceList?.NATIVE) {
          const bl = BigAmount.format(dec, btcBalanceList?.NATIVE)
          savedBalance.current = bl
        } else if (dec) {
          const bl = BigAmount.format(dec, '0')
          savedBalance.current = bl
        }
      } else if ([ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST, ChainId.ATOM_DCORE, ChainId.ATOM_DCORE_TEST].includes(selectChainId)) {
        // console.log(account)
        if (atomBalanceList?.[token]) {
          const bl = BigAmount.format(dec, atomBalanceList?.[token]?.balance)
          savedBalance.current = bl
        } else if (dec) {
          const bl = BigAmount.format(dec, '0')
          savedBalance.current = bl
        }
      } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(selectChainId)) {
        getReefTokenBalance({chainId: selectChainId, account, token}).then((res:any) => {
          const bl = BigAmount.format(dec, res)
          // console.log(res, '11111111111111')
          setTokenBalance(selectChainId,token,account,res,dec)
          savedBalance.current = bl
        })
      } else {
        // console.log('evmBalance', evmBalance ? evmBalance.toExact() : '')
        savedBalance.current = evmBalance
      }
    } else {
      savedBalance.current = ''
      // setBalance('')
    }
  }, [token, connectedWallet, selectChainId, adaBalanceList, flowBalanceList, evmBalance, account, aptBalanceList, btcBalanceList, atomBalanceList, getReefTokenBalance])

  useInterval(fetchBalance, 1000 * 10, false)

  useEffect(() => {
    
    savedBalance.current = ''
    fetchBalance()
  }, [fetchBalance, token, account])

  return useMemo(() => {
    // console.log(savedBalance)
    return savedBalance.current
  }, [savedBalance.current, selectChainId, token, account])
}


export function useBaseBalances (
  uncheckedAddresses?: string | null | undefined
) {
  const {selectNetworkInfo} = useUserSelectChainId()
  const userEthBalance = useETHBalances((uncheckedAddresses && !selectNetworkInfo?.label) ? [uncheckedAddresses] : [])?.[uncheckedAddresses ?? '']
  // const userEthBalance = useETHBalances((uncheckedAddresses) ? [uncheckedAddresses] : [])?.[uncheckedAddresses ?? '']
  const {getTerraBaseBalances} = useTerraBaseBalance()
  const { getNasBalance } = useCurrentNasBalance()
  const { getNearBalance } = useNearBalance()
  const {getTrxBalance} = useTrxBalance()
  const {getAllBalance} = useXlmBalance()
  const {adaBalanceList} = useAdaBalance()
  const {flowBalanceList} = useFlowBalance()
  const {getSolBalance} = useSolBalance()
  const {aptBalanceList} = useAptosBalance()
  const {btcBalanceList} = useBtcBalance()
  const {atomBalanceList} = useAtomBalance()
  const {getReefBalance} = useReefBalance()
  

  const selectChainId = selectNetworkInfo?.label

  const {setTokenBalance} = useAllTokenBalance()
  
  const [balance, setBalance] = useState<any>()
  const fetchBalancesCallback = useCallback(() => {
    if (selectChainId === ChainId.TERRA) {
      getTerraBaseBalances().then(res => {
        const bl = res?.uluna ? BigAmount.format(6, res?.uluna) : undefined
        setBalance(bl)
      })
    } else if (selectChainId === ChainId.NAS) {
      getNasBalance().then(res => {
        // console.log(res)
        const bl = res ? BigAmount.format(18, res) : undefined
        setBalance(bl)
      })
    } else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChainId)) {
      getNearBalance().then(res => {
        const bl = res?.total ? BigAmount.format(24, res?.total) : undefined
        setBalance(bl)
      })
    } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(selectChainId)) {
      getTrxBalance({}).then((res:any) => {
        // console.log(res)
        const bl = res || res === 0 ? BigAmount.format(6, res) : undefined
        setBalance(bl)
      })
    } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(selectChainId)) {
      // console.log(selectChainId)
      getAllBalance(selectChainId, uncheckedAddresses).then((res:any) => {
        // console.log(res)
        if (res?.['native']?.balance) {
          const dec = 7
          const blvalue = tryParseAmount3(res?.['native']?.balance, dec)
          const bl = res ? BigAmount.format(dec, blvalue) : undefined
          setBalance(bl)
        }
      })
    } else if ([ChainId.ADA, ChainId.ADA_TEST].includes(selectChainId)) {

      if (adaBalanceList?.['NATIVE']) {
        const bl = BigAmount.format(6, adaBalanceList?.['NATIVE'])
        setBalance(bl)
      }
    } else if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(selectChainId)) {
      if (flowBalanceList?.['NATIVE']) {
        const bl = BigAmount.format(8, flowBalanceList?.['NATIVE'])
        setBalance(bl)
      }
    } else if ([ChainId.SOL, ChainId.SOL_TEST].includes(selectChainId)) {
      getSolBalance({chainId: selectChainId, account: uncheckedAddresses}).then((res:any) => {
        if (res?.result?.value) {
          const bl = BigAmount.format(9, res?.result?.value)
          setBalance(bl)
        } else {
          setBalance('')
        }
        // console.log(res)
      })
    } else if ([ChainId.APT, ChainId.APT_TEST].includes(selectChainId)) {
      const nativetoken = '0x1::aptos_coin::AptosCoin'
      // console.log(aptBalanceList)
      if (aptBalanceList?.[nativetoken]) {
        const bl = BigAmount.format(8, aptBalanceList?.[nativetoken]?.balance)
        setBalance(bl)
      } else {
        const bl = BigAmount.format(8, '0')
        setBalance(bl)
      }
    } else if ([ChainId.BTC, ChainId.BTC_TEST].includes(selectChainId) && config?.chainInfo?.[selectChainId]?.chainType !== 'NOWALLET') {
      // console.log(btcBalanceList)
      if (btcBalanceList?.NATIVE) {
        const bl = BigAmount.format(8, btcBalanceList?.NATIVE)
        setBalance(bl)
      } else {
        const bl = BigAmount.format(8, '0')
        setBalance(bl)
      }
    } else if ([ChainId.ATOM_SEI, ChainId.ATOM_SEI_TEST, ChainId.ATOM_DCORE, ChainId.ATOM_DCORE_TEST].includes(selectChainId)) {
      // console.log(btcBalanceList)
      if (atomBalanceList?.NATIVE?.balance) {
        const bl = BigAmount.format(6, atomBalanceList?.NATIVE?.balance)
        setBalance(bl)
      } else {
        const bl = BigAmount.format(6, '0')
        setBalance(bl)
      }
    } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(selectChainId)) {
      // console.log(selectChainId)
      getReefBalance({account: uncheckedAddresses,chainId: selectChainId}).then((res:any) => {
        // console.log(res)
        const dec = 18
        if (res && res.toString() !== '0') {
          // const blvalue = tryParseAmount3(res, dec)
          const bl = res ? BigAmount.format(dec, res) : undefined
          // console.log(bl?.toExact())
          setTokenBalance(selectChainId,'NATIVE',uncheckedAddresses,res,dec)
          setBalance(bl)
        } else {
          const bl = BigAmount.format(dec, '0')
          setBalance(bl)
        }
      })
    }
  }, [uncheckedAddresses, selectChainId, getAllBalance, adaBalanceList, flowBalanceList,aptBalanceList, btcBalanceList, atomBalanceList, getReefBalance])

  useEffect(() => {
    fetchBalancesCallback()
  }, [fetchBalancesCallback])

  useInterval(fetchBalancesCallback, 1000 * 10)

  return useMemo(() => {
    // console.log(userEthBalance)
    if (!selectChainId) {
      return userEthBalance
    } else if (balance) {
      return balance
    }
    return undefined
  }, [balance, userEthBalance])
}