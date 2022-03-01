import Web3 from 'web3'
import STORAGE from '../constants/abis/app/Storage.json'
import { chainInfo } from '../config/chainConfig'

export const callStorage = async (params: {
  provider: any
  account: string
  storageChainId: number
  method: string
  args: any[]
  onHash?: (hash: string) => void
}) => {
  const { provider, storageChainId, method, args, onHash, account } = params
  const { storage: storageAddress } = chainInfo[storageChainId]

  const web3 = new Web3(provider)
  //@ts-ignore
  const storage = new web3.eth.Contract(STORAGE.abi, storageAddress)

  if (method && storage) {
    return new Promise((resolve, reject) => {
      storage.methods[method](...args)
        .send({ from: account })
        .on('transactionHash', (hash: string) => {
          if (typeof onHash === 'function') onHash(hash)
        })
        .then(resolve)
        .catch(reject)
    })
  }

  return false
}
