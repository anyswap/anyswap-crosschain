import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract, useRpcMulticallContract } from '../../hooks/useContract'
import useDebounce from '../../hooks/useDebounce'
import chunkArray from '../../utils/chunkArray'
import { CancelledError, retry, RetryableError } from '../../utils/retry'
import { useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import {
  Call,
  // addUseChainId,
  errorFetchingMulticallResults,
  fetchingMulticallResults,
  parseCallKey,
  updateMulticallResults
} from './actions'

// 块调用，这样我们就不会超过气体限制
const CALL_CHUNK_SIZE = 500

/**
 * 获取一组调用，强制执行最小块数约束
 * @param multicallContract multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param minBlockNumber minimum block number of the result set
 */
export async function fetchChunk(
  multicallContract: Contract,
  chunk: Call[],
  minBlockNumber: number
): Promise<{ results: string[]; blockNumber: number }> {
  console.debug('Fetching chunk', multicallContract, chunk, minBlockNumber)
  let resultsBlockNumber, returnData
  // console.log('chunk')
  // console.log(chunk)
  try {
    ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(chunk.map(obj => [obj.address, obj.callData]))
    // console.log('multicallContract1')
  } catch (error) {
    console.debug('Failed to fetch chunk inside retry', error)
    throw error
  }
  if (resultsBlockNumber.toNumber() < minBlockNumber) {
    // console.log(`Fetched results for old block number: ${resultsBlockNumber.toString()} vs. ${minBlockNumber}`)
    // console.debug(`Fetched results for old block number: ${resultsBlockNumber.toString()} vs. ${minBlockNumber}`)
    throw new RetryableError('Fetched for old block number')
  }
  // console.log({ results: returnData, blockNumber: resultsBlockNumber.toNumber() })
  return { results: returnData, blockNumber: resultsBlockNumber.toNumber() }
}

/**
 * 获取一组调用，强制执行最小块数约束
 * @param multicallContract multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param minBlockNumber minimum block number of the result set
 */
 async function fetchChunk1(
  multicallContract: any,
  chunk: Call[],
  minBlockNumber: number
): Promise<{ results: string[]; blockNumber: number }> {
  console.debug('Fetching chunk', multicallContract, chunk, minBlockNumber)
  let resultsBlockNumber, returnData
  // console.log(multicallContract)
  try {
    // multicallContract.methods.aggregate(chunk.map(obj => [obj.address, obj.callData])).call((err:any, res:any) => {
    //   console.log(err)
    //   console.log(res)
    // })
    // console.log(await multicallContract.methods.aggregate(chunk.map(obj => [obj.address, obj.callData])).call())
    const callData = await multicallContract.methods.aggregate(chunk.map(obj => [obj.address, obj.callData])).call()
    resultsBlockNumber = callData.blockNumber ? Number(callData.blockNumber) : 0
    returnData = callData.returnData
    // ;[resultsBlockNumber, returnData] = await multicallContract.methods.aggregate(chunk.map(obj => [obj.address, obj.callData])).call()
  } catch (error) {
    console.debug('Failed to fetch chunk inside retry', error)
    throw error
  }
  if (resultsBlockNumber < minBlockNumber) {
    console.debug(`Fetched results for old block number: ${resultsBlockNumber.toString()} vs. ${minBlockNumber}`)
    throw new RetryableError('Fetched for old block number')
  }
  // console.log({ results: returnData, blockNumber: resultsBlockNumber })
  return { results: returnData, blockNumber: resultsBlockNumber }
}

/**
 * 从当前的所有侦听器状态，返回映射到每次读取的最小块数。这是每个键必须被获取的频率。
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
export function activeListeningKeys(
  allListeners: AppState['multicall']['callListeners'],
  chainId?: number
): { [callKey: string]: number } {
  if (!allListeners || !chainId) return {}
  const listeners = allListeners[chainId]
  if (!listeners) return {}
  // console.log(listeners)
  return Object.keys(listeners).reduce<{ [callKey: string]: number }>((memo, callKey) => {
    const keyListeners = listeners[callKey]

    memo[callKey] = Object.keys(keyListeners)
      .filter(key => {
        const blocksPerFetch = parseInt(key)
        if (blocksPerFetch <= 0) return false
        return keyListeners[blocksPerFetch] > 0
      })
      .reduce((previousMin, current) => {
        return Math.min(previousMin, parseInt(current))
      }, Infinity)
    return memo
  }, {})
}

/**
 * 返回需要重新获取的键
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param latestBlockNumber the latest block number
 */
export function outdatedListeningKeys(
  callResults: AppState['multicall']['callResults'],
  listeningKeys: { [callKey: string]: number },
  chainId: number | undefined,
  latestBlockNumber: number | undefined
): string[] {
  if (!chainId || !latestBlockNumber) return []
  const results = callResults[chainId]
  // no results at all, load everything
  if (!results) return Object.keys(listeningKeys)

  return Object.keys(listeningKeys).filter(callKey => {
    const blocksPerFetch = listeningKeys[callKey]

    const data = callResults[chainId][callKey]
    // no data, must fetch
    if (!data) return true

    const minDataBlockNumber = latestBlockNumber - (blocksPerFetch - 1)

    // already fetching it for a recent enough block, don't refetch it
    if (data.fetchingBlockNumber && data.fetchingBlockNumber >= minDataBlockNumber) return false

    // if data is older than minDataBlockNumber, fetch it
    return !data.blockNumber || data.blockNumber < minDataBlockNumber
  })
}

export default function Updater({type}: {type?:number}): null {
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector<AppState, AppState['multicall']>(state => state.multicall)
  // wait for listeners to settle before triggering updates
  const debouncedListeners = useDebounce(state.callListeners, 100)
  const { chainId } = useActiveWeb3React()
  // const useChainId = state.useChainId ? state.useChainId : chainId
  const useChainId = type ? state.useChainId : chainId
  const latestBlockNumber = useBlockNumber(useChainId)
  const multicallContract = useMulticallContract()
  const multicallContract1 = useRpcMulticallContract(useChainId)

  // console.log(type)
  // console.log(useChainId)
  // console.log(latestBlockNumber)
  // console.log(chainId)
  // console.log(state)
  const cancellations = useRef<{ blockNumber: number; cancellations: (() => void)[] }>()
  // console.log(multicallContract1)
  // console.log(multicallContract)
  const listeningKeys: { [callKey: string]: number } = useMemo(() => {
    return activeListeningKeys(debouncedListeners, useChainId)
  }, [debouncedListeners, useChainId])

  const unserializedOutdatedCallKeys = useMemo(() => {
    return outdatedListeningKeys(state.callResults, listeningKeys, useChainId, latestBlockNumber)
  }, [useChainId, state.callResults, listeningKeys, latestBlockNumber])

  const serializedOutdatedCallKeys = useMemo(() => JSON.stringify(unserializedOutdatedCallKeys.sort()), [
    unserializedOutdatedCallKeys
  ])

  const updateResults = useCallback(() => {
    // console.log('latestBlockNumber', latestBlockNumber)
    // console.log('useChainId', useChainId)
    // console.log('multicallContract', multicallContract)
    if (!latestBlockNumber || !useChainId || !multicallContract) return
    
    // console.log(useChainId, 1)
    const outdatedCallKeys: string[] = JSON.parse(serializedOutdatedCallKeys)
    // console.log(outdatedCallKeys)
    if (outdatedCallKeys.length === 0) return
    const calls = outdatedCallKeys.map(key => parseCallKey(key))
    // console.log(useChainId, 2)
    const chunkedCalls = chunkArray(calls, CALL_CHUNK_SIZE)

    if (cancellations.current?.blockNumber !== latestBlockNumber) {
      cancellations.current?.cancellations?.forEach(c => c())
    }
    // console.log(calls)
    dispatch(
      fetchingMulticallResults({
        calls,
        chainId: useChainId,
        fetchingBlockNumber: latestBlockNumber
      })
    )
    // console.log(useChainId, 3)
    cancellations.current = {
      blockNumber: latestBlockNumber,
      cancellations: chunkedCalls.map((chunk, index) => {
        // console.log(chunkedCalls)
        // console.log(chunk)
        // if (index > 10) return () => {console.log()}
        const { cancel, promise } = retry(() => chainId && useChainId && Number(useChainId) !== Number(chainId) ? fetchChunk1(multicallContract1, chunk, latestBlockNumber) : fetchChunk(multicallContract, chunk, latestBlockNumber), {
          n: Infinity,
          minWait: 2500,
          maxWait: 3500
        })
        
        promise
          .then(({ results: returnData, blockNumber: fetchBlockNumber }) => {
            cancellations.current = { cancellations: [], blockNumber: latestBlockNumber }
            // console.log(returnData)
            // accumulates the length of all previous indices
            const firstCallKeyIndex = chunkedCalls.slice(0, index).reduce<number>((memo, curr) => memo + curr.length, 0)
            const lastCallKeyIndex = firstCallKeyIndex + returnData.length
            // dispatch(addUseChainId({ chainId: chainId }))
            dispatch(
              updateMulticallResults({
                chainId: useChainId,
                results: outdatedCallKeys
                  .slice(firstCallKeyIndex, lastCallKeyIndex)
                  .reduce<{ [callKey: string]: string | null }>((memo, callKey, i) => {
                    memo[callKey] = returnData[i] ?? null
                    return memo
                  }, {}),
                blockNumber: fetchBlockNumber
              })
            )
          })
          .catch((error: any) => {
            if (error instanceof CancelledError) {
              console.debug('Cancelled fetch for blockNumber', latestBlockNumber)
              return
            }
            console.error('Failed to fetch multicall chunk', chunk, useChainId, error)
            dispatch(
              errorFetchingMulticallResults({
                calls: chunk,
                chainId: useChainId,
                fetchingBlockNumber: latestBlockNumber
              })
            )
          })
        return cancel
      })
    }
  }, [useChainId, multicallContract, dispatch, serializedOutdatedCallKeys, latestBlockNumber])
  // console.log(listeningKeys)
  // console.log(serializedOutdatedCallKeys)
  // useEffect(() => {
  //   updateResults()
  // }, [])
  useEffect(() => {
    updateResults()
  }, [useChainId, multicallContract, dispatch, serializedOutdatedCallKeys, latestBlockNumber])

  return null
}
