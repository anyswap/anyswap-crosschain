import { useCallback } from 'react'
import { useBatchData } from '../../utils/tools/useBatchData'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useActiveWeb3React } from '../index'
import { isAddress } from '../../utils/isAddress'


export function useEvmPoolDatas () {
  const getEvmPoolsDatas = useCallback((chainId:any, list:any, account?:any, provider?:any) => {
    return new Promise(resolve => {
      const calls:any = []
      for (const item of list) {
        calls.push({
          callData: ERC20_INTERFACE.encodeFunctionData('balanceOf', [item.anytoken]),
          target: item.underlying,
          label: 'balanceOf',
          fragment: 'balanceOf',
          key: item.anytoken
        })
        calls.push({
          callData: ERC20_INTERFACE.encodeFunctionData('totalSupply', []),
          target: item.anytoken,
          label: 'totalSupply',
          fragment: 'totalSupply',
          key: item.anytoken
        })
        if (isAddress(account)) {
          calls.push({
            callData: ERC20_INTERFACE.encodeFunctionData('balanceOf', [account]),
            target: item.anytoken,
            label: 'balance',
            fragment: 'balanceOf',
            key: item.anytoken
          })
        }
      }
      if (calls.length > 0 && chainId) {
        // console.log(provider)
        useBatchData({chainId, calls, provider}).then((res:any) => {
          // console.log(res)
          const list: any = {}
          if (res) {
            try {
              for (let i = 0, len = calls.length; i < len; i++) {
                const item = calls[i]
                if (res[i]) {
                  const bl = ERC20_INTERFACE?.decodeFunctionResult(item.fragment, res[i])?.toString()
                  if (!list[item.key]) list[item.key] = {}
                  list[item.key][item.label] = bl
                }
              }
            } catch (error) {
              console.log(error)
            }
          }
          resolve(list)
        })
      } else {
        resolve({})
      }
    })

  }, [])
  return {
    getEvmPoolsDatas
  }
}

export function useEvmPools ({
  account,
  tokenList,
  chainId
}:any) {
  const { library, chainId: curChainId } = useActiveWeb3React()
  const {getEvmPoolsDatas} = useEvmPoolDatas()
  const getEvmPoolsData = useCallback(() => {
    return new Promise(resolve => {
      const provider = curChainId?.toString() === chainId.toString() && library?.provider ? library?.provider : ''
      getEvmPoolsDatas(chainId, tokenList, account, provider).then(res => {
        resolve(res)
      })
    })
  }, [account, curChainId, chainId])
  return {getEvmPoolsData}
}

export function useEvmPool (
  chainId:any,
  account:any,
  anytoken:any,
  underlying: any,
) {
  const {getEvmPoolsData} = useEvmPools({
    account,
    tokenList: anytoken && underlying ? [{anytoken, underlying}] : [],
    chainId
  })
  return {getEvmPoolsData}
}