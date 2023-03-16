import { namehash } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { isAddress } from '../utils'
import isZero from '../utils/isZero'
import { useENSRegistrarContract, useENSResolverContract } from './useContract'
import useDebounce from './useDebounce'

/**
 * 对地址执行反向查找以查找其名称。
 * 注意，这与查找ENS名称以查找地址不同。
 */
export default function useENSName(address?: string): { ENSName: string | null; loading: boolean } {
  const debouncedAddress = useDebounce(address, 200)
  const ensNodeArgument = useMemo(() => {
    if (!debouncedAddress || !isAddress(debouncedAddress)) return [undefined]
    try {
      return debouncedAddress ? [namehash(`${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`)] : [undefined]
    } catch (error) {
      return [undefined]
    }
  }, [debouncedAddress])
  const registrarContract = useENSRegistrarContract(false)
  // console.log('ensNodeArgument', ensNodeArgument)
  const resolverAddress = useSingleCallResult(registrarContract, 'resolver', ensNodeArgument)
  const resolverAddressResult = resolverAddress.result?.[0]
  // console.log('resolverAddressResult',resolverAddressResult)
  const resolverContract = useENSResolverContract(
    resolverAddressResult && !isZero(resolverAddressResult) ? resolverAddressResult : undefined,
    false
  )
  const name = useSingleCallResult(resolverContract, 'name', ensNodeArgument)
    // console.log('name',name)
  const changed = debouncedAddress !== address
  return {
    ENSName: changed ? null : name.result?.[0] ?? null,
    loading: changed || resolverAddress.loading || name.loading
  }
}
