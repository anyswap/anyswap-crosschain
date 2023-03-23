import { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import {
  // nftlist,
  nftlistinfo
} from './actions'

import JSBI from 'jsbi'
// import axios from 'axios'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract } from '../../hooks/useContract'
// import { useNFTContract, useNFT721Contract } from './useContract'
import ERC721_INTERFACE from '../../constants/abis/bridge/erc721'
import ERC1155_INTERFACE from '../../constants/abis/bridge/erc1155'
import {getNftlist, isSupportIndexedDB} from '../../utils/indexedDB'
import {getAllNftImage} from '../../utils/getNFTimage'
import useInterval from '../../hooks/useInterval'

export enum ERC_TYPE {
  erc1155 = 'erc1155',
  erc721 = 'erc721'
}

export function useNftListState(chainId?:any): any {
  const lists:any = useSelector<AppState, AppState['nft']>(state => state.nft.nftlist)
  // console.log(lists)
  const updateNftlistTime:any = useSelector<AppState, AppState['nft']>(state => state.nft.updateNftlistTime)
  // console.log(updateTokenlistTime)
  const [tokenlist, setTokenlist] = useState<any>({})
  const getCurTokenlist = useCallback(() => {
    // console.log(chainId)
    if (isSupportIndexedDB) {
      getNftlist(chainId).then((res:any) => {
        // console.log(res)
        if (res?.tokenList) {
          setTokenlist(res.tokenList)
        } else {
          let current = lists[chainId]?.tokenList
          if (!current) current = {}
          setTokenlist(current)
        }
      })
    } else {
      let current = lists[chainId]?.tokenList
      if (!current) current = {}
      setTokenlist(current)
    }
  }, [chainId, updateNftlistTime])

  useEffect(() => {
    getCurTokenlist()
  }, [getCurTokenlist, chainId, updateNftlistTime])

  return tokenlist
}

export function useNftState(): any {
  const { chainId, account } = useActiveWeb3React()
  const list:any = useSelector<AppState, AppState['nft']>(state => state.nft.nftlist)
  if (!chainId || !account || !list[chainId] || !list[chainId][account]) return {}

  return list[chainId][account]
}
export function useNftInfo(): any {
  const { chainId } = useActiveWeb3React()
  const list:any = useSelector<AppState, AppState['nft']>(state => state.nft.nftlistinfo)
  if (!chainId || !list[chainId] || !list[chainId] || !list[chainId].tokenList) return {}

  return list[chainId].tokenList
}

export function useNFT721GetAllTokenidListCallback(
  tokenList: any
) {
  const { chainId, account } = useActiveWeb3React()
  // const { chainId, library } = useActiveWeb3React()
  // const account = '0xcFA97Fb420fF5A0F8F5b5400a0fC5a94F3eaEc87'
  const multicallContract = useMulticallContract()
  const dispatch = useDispatch<AppDispatch>()

  const tokenidInfo:any = useNftState()
  const nftInfo = useNftInfo()
  // console.log(nftInfo)
  // const [tokenidList, setTokenidList] = useState<any>()
  const [tokenidArr, setTokenidArr] = useState<any>()
  const [imageList, setImageList] = useState<any>()

  // const fragmentTURI:any = ERC721_INTERFACE?.getFunction('tokenURI')
  const fragmentTURI:any = useMemo(() => ERC721_INTERFACE?.getFunction('tokenURI'), [ERC721_INTERFACE])
  const callsTURI = useMemo(
    () => {
      const arr:any = []
      if (tokenidArr && ERC721_INTERFACE && tokenidArr.length > 0) {
        for (let i = 0; i < tokenidArr.length; i++) {
          if (Boolean(nftInfo?.[tokenidArr[i].token]?.[tokenidArr[i].tokenid]?.image)) continue
          arr.push({
            address: tokenidArr[i].token,
            callData: ERC721_INTERFACE?.encodeFunctionData(fragmentTURI, [tokenidArr[i].tokenid]),
            tokenid: tokenidArr[i].tokenid
          })
        }
      }
      return arr
    },
    [ERC721_INTERFACE, tokenidArr]
  )
  useEffect(() => {
    if (imageList) {
      const arr:any = []
      const arr1:any = []
      for (const obj of imageList) {
        if (Boolean(nftInfo?.[obj.token]?.[obj.tokenid]?.image)) continue
        if (
          obj.uri
        ) {
          arr.push(obj.uri)
          arr1.push(obj)
        }
      }
      // console.log(arr)
      if (arr.length > 0) {
        getAllNftImage(arr).then((res:any) => {
          // console.log(res)
          const list:any = {}
          for (let i = 0; i < arr1.length; i++) {
            const tokenid = arr1[i].tokenid
            const token = arr1[i].token
            if (!list[token]) list[token] = {}
            list[token][tokenid] = {
              ...(nftInfo[token] && nftInfo[token][tokenid] ? nftInfo[token][tokenid] : {}),
              ...res[i]
            }
          }
          dispatch(nftlistinfo({ chainId, tokenList: list }))
        })
      }
    }
  }, [imageList, chainId])

  useEffect(() => {
    if (multicallContract && callsTURI.length > 0) {
      multicallContract.aggregate(callsTURI.map((obj:any) => [obj.address, obj.callData])).then((res:any) => {
        const arr = []
        const list:any = {}
        for (let i = 0; i < callsTURI.length; i++) {
          const obj = res.returnData[i]
          const tokenid = callsTURI[i].tokenid
          const token = callsTURI[i].address
          const uri = ERC721_INTERFACE?.decodeFunctionResult(fragmentTURI, obj)[0]
          arr.push({uri: uri, tokenid: tokenid, token: token})
          if (!list[token]) list[token] = {}
          list[token][tokenid] = {
            ...(tokenidInfo[token] && tokenidInfo[token][tokenid] ? tokenidInfo[token][tokenid] : {}),
            uri: uri
          }
        }
        setImageList(arr)
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }, [multicallContract, callsTURI])

  // useEffect(() => {
  const getTokenIdByIndex = useCallback((tokenidList) => {
    if (multicallContract) {
      const calls:any = []
      const fragment = ERC721_INTERFACE.getFunction('tokenOfOwnerByIndex')
      for (const token in tokenidList) {
        const index = tokenidList[token]?.balance ? Number(tokenidList[token].balance) : 0
        if (index > 0) {
          for (let i = 0; i < index; i++) {
            // console.log(i)
            calls.push([token, ERC721_INTERFACE?.encodeFunctionData(fragment, [account, i])])
          }
        }
      }
      multicallContract.aggregate(calls).then((res:any) => {
        const list:any = {}
        const arr:any = []
        for (let i =0, len = res.returnData.length; i < len; i++) {
          const obj = res.returnData[i]
          const tokenid = ERC721_INTERFACE?.decodeFunctionResult(fragment, obj)[0].toString()
          const token = calls[i][0]
          if (!list[token]) list[token] = {}
          list[token][tokenid] = {
            ...(tokenidInfo[token] && tokenidInfo[token][tokenid] ? tokenidInfo[token][tokenid] : {})
          }
          arr.push({
            token: token,
            tokenid: tokenid
          })
        }
        // console.log(list)
        setTokenidArr(arr)
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }, [multicallContract, chainId, account])

  const getTokenidList = useCallback(() => {
    if (multicallContract && account) {
      const cList:any = []
      const callBLData = ERC721_INTERFACE.encodeFunctionData(ERC721_INTERFACE.getFunction('balanceOf'), [account])
      for (const tokenKey in tokenList) {
        const obj = tokenList[tokenKey]
        if (obj.nfttype === ERC_TYPE.erc1155) continue
        cList.push([obj.address, callBLData])
      }
      multicallContract.aggregate(cList).then((res:any) => {
        const list:any = {}
        for (let i = 0, len = res.returnData.length; i < len; i++) {
          list[cList[i][0]] = {balance: res.returnData[i] === '0x' ? '' : JSBI.BigInt(res.returnData[i]).toString()}
        }
        console.log(list)
        getTokenIdByIndex(list)
      })
    }
  }, [multicallContract, account, chainId, tokenList])

  // useEffect(() => {
  //   if (!library || !chainId) return undefined

  //   library.on('block', getTokenidList)
  //   return () => {
  //     library.removeListener('block', getTokenidList)
  //   }
  // }, [account, chainId, library, getTokenidList, tokenList])

  useEffect(() => {
    getTokenidList()
  }, [account, chainId])

  useInterval(getTokenidList, 1000 * 10)

  // return tokenidInfo
  return useMemo(() => {
    const list:any = {}
    if (tokenidArr) {
      for (const obj of tokenidArr) {
        list[obj.token] = {
          ...(list[obj.token] ? list[obj.token] : {}),
          [obj.tokenid]: {
            ...(tokenidInfo[obj.token] && tokenidInfo[obj.token][obj.tokenid] ? tokenidInfo[obj.token][obj.tokenid] : {})
          }
        }
      }
    }
    return list
  }, [tokenidArr, tokenidInfo, account])
}

export function useNFT1155GetAllTokenidListCallback(
  tokenlist: any
) {
  const { chainId, account, library } = useActiveWeb3React()
  // const contract = useNFT1155Contract(selectCurrency)
  const multicallContract = useMulticallContract()
  const [tokenidInfo1155, setTokenidInfo1155] = useState<any>()
  // const dispatch = useDispatch<AppDispatch>()

  const callBLData: any = useMemo( () => {
    const arr:any = []
    if (ERC1155_INTERFACE && account && tokenlist) {
      for (const tokenKey in tokenlist) {
        const obj = tokenlist[tokenKey]
        const token = obj.address
        if (obj.nfttype === ERC_TYPE.erc1155) {
          const list = obj.tokenidList
          for (const tokenid in list) {
            // console.log(tokenid)
            arr.push({
              address: token,
              tokenid,
              callData: ERC721_INTERFACE?.encodeFunctionData(ERC1155_INTERFACE.getFunction('balanceOf'), [account, tokenid])
            })
          }
        }
      }
    }
    return arr
  }, [ERC1155_INTERFACE, account, tokenlist])

  const getTokenidList = useCallback(() => {
    if (multicallContract && callBLData && callBLData.length > 0) {
      multicallContract.aggregate(callBLData.map((obj:any) => [obj.address, obj.callData])).then((res:any) => {
        // console.log(res)
        // for (const obj of res.returnData) {
        const len = res.returnData.length
        const list:any = {}
        for (let i = 0; i < len; i++) {
          const obj = callBLData[i]
          if (!list[obj.address]) list[obj.address] = {}
          list[obj.address][obj.tokenid] = {
            ...tokenlist[obj.address].tokenidList[obj.tokenid],
            balance: JSBI.BigInt(res.returnData[i]).toString()
          }
        }
        // console.log(list)
        setTokenidInfo1155(list)
      }).catch((err:any) => {
        console.log(err)
        setTokenidInfo1155({})
      })
    }
  }, [multicallContract, callBLData])

  useEffect(() => {
    if (!library || !chainId) return undefined
    console.log(tokenlist)
    // getTokenidList()
    library
      .getBlockNumber()
      .then(getTokenidList)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))
    
    library.on('block', getTokenidList)
    return () => {
      library.removeListener('block', getTokenidList)
    }
  }, [library, getTokenidList])

  return tokenidInfo1155
}
