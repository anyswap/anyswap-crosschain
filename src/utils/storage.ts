import Web3 from 'web3'
import STORAGE from '../constants/abis/storage.json'
import { chainInfo } from '../config/chainConfig'

export const callStorage = async (params: {
  account: string
  storageChainId: number
  method: string
  args: any[]
  onHash?: (hash: string) => void
}) => {
  const { storageChainId, method, args, onHash, account } = params
  const { storage: storageAddress, nodeRpc } = chainInfo[storageChainId]

  console.group('%c callStorage', 'color: brown; font-size: 14px')
  console.log('storageAddress: ', storageAddress)
  console.log('nodeRpc: ', nodeRpc)

  const web3 = new Web3(nodeRpc)
  //@ts-ignore
  const storage = new web3.eth.Contract(STORAGE.abi, storageAddress)

  console.log('storage: ', storage)
  console.groupEnd()

  if (method && storage) {
    return new Promise(async (resolve, reject) => {
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
