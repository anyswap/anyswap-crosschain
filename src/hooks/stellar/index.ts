import {
  isConnected,
  getPublicKey,
  // signTransaction,
} from "@stellar/freighter-api"
import { useCallback, useEffect, useState } from "react"
import {getWeb3} from '../../utils/tools/web3UtilsV2'

export function formatXlmMemo (address:any, chainId:any) {
  if (!address || !chainId) return ''
  const web3 = getWeb3()
  const totalLength = 32

  const addressToBytes = web3.utils.hexToBytes(address)
  // const addressToBytes = Buffer.from(address)
  const addressLength = addressToBytes.length

  const chainIdToHex = web3.utils.numberToHex(chainId)
  // console.log(chainIdToHex)
  const chainIdToBytes = web3.utils.hexToBytes(chainIdToHex)
  // const chainIdToBytes = Buffer.from(chainId + '')
  const chainIdLength = chainIdToBytes.length

  const differLength = totalLength - 1 - addressLength - chainIdLength

  const zeroArr = []
  for (let i = 0; i < differLength; i++) {
    zeroArr.push(0)
  }
  const resultArr = [addressLength, ...addressToBytes, ...zeroArr, ...chainIdToBytes]
  // console.log(resultArr)
  // console.log(Buffer.from(resultArr).toString('hex'))
  return Buffer.from(resultArr).toString('hex')
}


export function connectXlmWallet () {
  const [address, setAddress] = useState<any>()
  const loginXlm = useCallback(() => {
    if (isConnected()) {
      getPublicKey().then(res => {
        // console.log(res)
        setAddress(res)
      })
    } else {
      setAddress('')
    }
  }, [isConnected])
  useEffect(() => {
    loginXlm()
  }, [])
  return {
    loginXlm,
    xlmAddress: address
  }
}
