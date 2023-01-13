import { useActiveWeb3React } from './index'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { useUserSelectChainId } from '../state/user/hooks'
import { useMemo } from 'react'

// import { useCurrentAddress } from '../nonevm/nas'
import {useNearAddress} from '../nonevm/near'
import {connectXlmWallet} from '../nonevm/stellar'
import {useTrxAddress} from '../nonevm/trx'
import {useAdaAddress} from '../nonevm/cardano'
import {useFlowAddress} from '../nonevm/flow'
import {useSolAddress} from '../nonevm/solana'
import {useNonevmAddress} from '../nonevm/hooks'


import { ChainId } from '../config/chainConfig/chainId'
// import config from '../config'

export function useActiveReact () {
  const { account, chainId } = useActiveWeb3React()
  const connectedWallet = useConnectedWallet()
  const {selectNetworkInfo} = useUserSelectChainId()
  // const nebAddress = useCurrentAddress()
  const nearAddress = useNearAddress()
  const {trxAddress} = useTrxAddress()
  const {xlmAddress} = connectXlmWallet()
  const {adaAddress} = useAdaAddress()
  const {flowAddress} = useFlowAddress()
  const {solAddress} = useSolAddress()
  const {nonevmAccount} = useNonevmAddress(selectNetworkInfo?.chainId && selectNetworkInfo?.label ? selectNetworkInfo?.chainId : chainId)
  // console.log(nonevmAccount)
  // const useChain = useMemo(() => {
  //   if (chainId) {
  //     return chainId
  //   } else if (config.getCurChainInfo(chainId).chainID) {
  //     return config.getCurChainInfo(chainId).chainID
  //   }
  //   return undefined
  // }, [chainId])
  return useMemo(() => {
    let useAccount = account
    // const useChainId:any = selectNetworkInfo?.chainId && selectNetworkInfo?.label ? selectNetworkInfo?.chainId : (chainId ? chainId : config.getCurChainInfo(chainId).chainID)
    const useChainId:any = selectNetworkInfo?.chainId && selectNetworkInfo?.label ? selectNetworkInfo?.chainId : chainId
    // console.log(config)
    // console.log(useChainId)
    if (selectNetworkInfo?.label === ChainId.TERRA) {
      useAccount = connectedWallet?.walletAddress
    } else if (selectNetworkInfo?.label === ChainId.BTC) {
      useAccount = ''
    }
    // else if (selectNetworkInfo?.label === ChainId.NAS) {
    //   useAccount = nebAddress
    // }
    else if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(useChainId)) {
      useAccount = nearAddress
    } else if ([ChainId.XLM, ChainId.XLM_TEST].includes(useChainId)) {
      useAccount = xlmAddress
    } else if ([ChainId.TRX, ChainId.TRX_TEST].includes(useChainId)) {
      useAccount = trxAddress
    } else if ([ChainId.ADA, ChainId.ADA_TEST].includes(useChainId)) {
      // console.log(adaAddress)
      useAccount = adaAddress
    } else if ([ChainId.FLOW, ChainId.FLOW_TEST].includes(useChainId)) {
      // console.log(adaAddress)
      useAccount = flowAddress
    } else if ([ChainId.SOL, ChainId.SOL_TEST].includes(useChainId)) {
      // console.log(adaAddress)
      useAccount = solAddress
    } else if (!isNaN(useChainId)) {
      useAccount = account
    } else {
      useAccount = nonevmAccount
    }
    return {
      account: useAccount,
      chainId: useChainId,
      evmAccount: account,
      evmChainId: useChainId === chainId ? chainId : '',
    }
  }, [account, connectedWallet, selectNetworkInfo, chainId, nearAddress, xlmAddress, trxAddress, adaAddress, flowAddress, solAddress, nonevmAccount])
}