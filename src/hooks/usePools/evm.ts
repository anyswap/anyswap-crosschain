import { useCallback, useMemo } from 'react'
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
      // console.log(chainId)
      // console.log(list)
      // console.log(calls)
      if (calls.length > 0 && chainId) {
        useBatchData({chainId, calls, provider}).then((res:any) => {
          // console.log(res)
          const resultList: any = {}
          if (res) {
            try {
              for (let i = 0, len = calls.length; i < len; i++) {
                const item = calls[i]
                if (res[i]) {
                  const bl = res[i] === '0x' ? '' : ERC20_INTERFACE?.decodeFunctionResult(item.fragment, res[i])?.toString()
                  if (!resultList[item.key]) resultList[item.key] = {}
                  resultList[item.key][item.label] = bl
                }
              }
            } catch (error) {
              // console.log(chainId)
              // console.log(account)
              // console.log(list)
              // console.log(calls)
              console.log(error)
            }
          }
          resolve(resultList)
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
      if (chainId) {
        const provider = curChainId?.toString() === chainId.toString() && library?.provider ? library?.provider : ''
        getEvmPoolsDatas(chainId, tokenList, account, provider).then(res => {
          resolve(res)
        })
      }
    })
  }, [account, curChainId, chainId, tokenList, getEvmPoolsDatas])
  return {getEvmPoolsData}
}

export function useEvmPool (
  chainId:any,
  account:any,
  anytoken:any,
  underlying: any,
) {
  // console.log(chainId)
  // console.log(anytoken)
  // console.log(underlying)

  const tokenList = useMemo(() => {
    if (anytoken && underlying) {
      return [{anytoken, underlying}]
    }
    return []
  }, [anytoken, underlying])

  const {getEvmPoolsData} = useEvmPools({
    account,
    tokenList: tokenList,
    chainId
  })
  return {getEvmPoolsData}
}