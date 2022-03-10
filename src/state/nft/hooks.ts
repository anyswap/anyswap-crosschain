import { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { nftlist } from './actions'

import { JSBI } from 'anyswap-sdk'
import axios from 'axios'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract } from '../../hooks/useContract'
// import { useNFTContract, useNFT721Contract } from './useContract'
import ERC721_INTERFACE from '../../constants/abis/bridge/erc721'
import ERC1155_INTERFACE from '../../constants/abis/bridge/erc1155'

export enum ERC_TYPE {
  erc1155 = 'erc1155',
  erc721 = 'erc721'
}

export function useNftState(): any {
  const { chainId, account } = useActiveWeb3React()
  const list:any = useSelector<AppState, AppState['nft']>(state => state.nft.nftlist)
  if (!chainId || !account || !list[chainId] || !list[chainId][account]) return {}

  return list[chainId][account]
}

export function useNFT721GetAllTokenidListCallback(
  tokenList: any
) {
  const { chainId, account, library } = useActiveWeb3React()
  // const { chainId, library } = useActiveWeb3React()
  // const account = '0xcFA97Fb420fF5A0F8F5b5400a0fC5a94F3eaEc87'
  const multicallContract = useMulticallContract()
  const dispatch = useDispatch<AppDispatch>()

  const tokenidInfo:any = useNftState()
  // console.log(tokenidList)
  const [tokenidList, setTokenidList] = useState<any>()
  const [tokenidArr, setTokenidArr] = useState<any>()
  const [imageList, setImageList] = useState<any>()
  // const [imageInfoList, setImageInfoList] = useState<any>()

  const methodTURIName = 'tokenURI'
  const fragmentTURI:any = useMemo(() => ERC721_INTERFACE?.getFunction(methodTURIName), [ERC721_INTERFACE, methodTURIName])

  const noTokenidImg = useMemo(() => {
    const arr:any = []
    if (tokenidArr && tokenidArr.length > 0) {
      for (let i = 0; i < tokenidArr.length; i++) {
        const obj = tokenidArr[i]
        if (Boolean(tokenidInfo[obj.token] && tokenidInfo[obj.token][obj.tokenid]?.image)) continue
        arr.push(obj)
      }
      // console.log(arr)
      return arr
    }
    return arr
  }, [chainId, tokenidArr])

  const callsTURI = useMemo(
    () => {
      const arr:any = []
      if (noTokenidImg && ERC721_INTERFACE && fragmentTURI && noTokenidImg.length > 0) {
        for (let i = 0; i < noTokenidImg.length; i++) {
          arr.push({
            address: noTokenidImg[i].token,
            callData: ERC721_INTERFACE?.encodeFunctionData(fragmentTURI, [noTokenidImg[i].tokenid])
          })
        }
      }
      return arr
    },
    [ERC721_INTERFACE, noTokenidImg, fragmentTURI]
  )
  useEffect(() => {
    if (imageList) {
      const arr:any = []
      const arr1:any = []
      for (const obj of imageList) {
        if (Boolean(tokenidInfo[obj.token] && tokenidInfo[obj.token][obj.tokenid]?.image)) continue
        if (
          obj.uri
          // && (
          //   obj.uri.indexOf('data:application/json;base64') === 0
          // )
        ) {
          arr.push(axios.get(obj.uri))
          arr1.push(obj)
        }
      }
      // console.log(arr)
      if (arr.length > 0) {
        axios.all(arr).then((res:any) => {
          // console.log(res)
          const list:any = {}
          for (let i = 0; i < arr1.length; i++) {
            const tokenid = arr1[i].tokenid
            const token = arr1[i].token
            if (!list[token]) list[token] = {}
            list[token][tokenid] = {
              ...(tokenidInfo[token] && tokenidInfo[token][tokenid] ? tokenidInfo[token][tokenid] : {}),
              ...res[i].data,
              uri: arr1[i].uri
            }
          }
          dispatch(nftlist({ chainId, account, nftlist: list }))
          // console.log(list)
        })
      }
    }
  }, [imageList, account, chainId, tokenidInfo])

  useEffect(() => {
    if (multicallContract && callsTURI.length > 0) {
      multicallContract.aggregate(callsTURI.map((obj:any) => [obj.address, obj.callData])).then((res:any) => {
        const arr = []
        const list:any = {}
        for (let i = 0; i < noTokenidImg.length; i++) {
          const obj = res.returnData[i]
          const tokenid = noTokenidImg[i].tokenid
          const token = noTokenidImg[i].token
          const uri = ERC721_INTERFACE?.decodeFunctionResult(fragmentTURI, obj)[0]
          arr.push({uri: uri, tokenid: tokenid, token: token})
          if (!list[token]) list[token] = {}
          list[token][tokenid] = {
            ...(tokenidInfo[token] && tokenidInfo[token][tokenid] ? tokenidInfo[token][tokenid] : {}),
            uri: uri
          }
        }
        setImageList(arr)
        dispatch(nftlist({ chainId, account, nftlist: list }))
        // getUriData(arr)
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }, [multicallContract, callsTURI, noTokenidImg, account, chainId])

  const methodName = 'tokenOfOwnerByIndex'
  const fragment = useMemo(() => ERC721_INTERFACE.getFunction(methodName), [ERC721_INTERFACE, methodName])
  const calls = useMemo(
    () => {
      const arr:any = []
      if (tokenidList && ERC721_INTERFACE && fragment) {
        // console.log(tokenidList)
        for (const token in tokenidList) {
          const index = tokenidList[token]?.balance ? Number(tokenidList[token].balance) : 0
          if (index > 0) {
            for (let i = 0; i < index; i++) {
              // console.log(i)
              arr.push({
                address: token,
                callData: ERC721_INTERFACE?.encodeFunctionData(fragment, [account, i])
              })
            }
          }
        }
      }
      return arr
    },
    [tokenidList, fragment, ERC721_INTERFACE]
  )

  useEffect(() => {
    if (multicallContract && calls.length > 0) {
      // console.log(calls)
      multicallContract.aggregate(calls.map((obj:any) => [obj.address, obj.callData])).then((res:any) => {
        const list:any = {}
        const arr:any = []
        for (let i =0, len = res.returnData.length; i < len; i++) {
          const obj = res.returnData[i]
          const tokenid = ERC721_INTERFACE?.decodeFunctionResult(fragment, obj)[0].toString()
          const token = calls[i].address
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
        dispatch(nftlist({ chainId, account, nftlist: list }))
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }, [multicallContract, calls, account, chainId])

  const callBLData: string | undefined = useMemo( () => {
    if (ERC721_INTERFACE && account) {
      return ERC721_INTERFACE.encodeFunctionData(ERC721_INTERFACE.getFunction('balanceOf'), [account])
    }
    return
  }, [ERC721_INTERFACE, account])

  const getTokenidList = useCallback(() => {
    if (callBLData && multicallContract) {
      const cList:any = []
      for (const ad in tokenList) {
        if (tokenList[ad].nfttype === ERC_TYPE.erc1155) continue
        cList.push({
          address: ad
        })
      }
      multicallContract.aggregate(cList.map((obj:any) => [obj.address, callBLData])).then((res:any) => {
        const list:any = {}
        for (let i = 0, len = res.returnData.length; i < len; i++) {
          list[cList[i].address] = {balance: JSBI.BigInt(res.returnData[i]).toString()}
        }
        setTokenidList(list)
      })
    }
  }, [multicallContract, callBLData, account, chainId, tokenList])

  useEffect(() => {
    if (!library || !chainId) return undefined

    library
      .getBlockNumber()
      .then(getTokenidList)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))
    
    library.on('block', getTokenidList)
    return () => {
      library.removeListener('block', getTokenidList)
    }
  }, [account, chainId, library, getTokenidList, tokenList])

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
  }, [tokenidArr, tokenidInfo])
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
      for (const token in tokenlist) {
        if (tokenlist[token].nfttype === ERC_TYPE.erc1155) {
          const list = tokenlist[token].tokenidList
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
