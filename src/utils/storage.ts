import Web3 from 'web3'
import STORAGE from '../constants/abis/app/Storage.json'
import { chainInfo } from '../config/chainConfig'
import config from '../config'
import { getCurrentDomain } from '../utils/url'
import { STORAGE_METHODS, STORAGE_APP_KEY } from '../constants'

type Data = { [k: string]: any }

const updateData = (oldData: Data, newData: Data) => {
  return {
    ...oldData,
    [STORAGE_APP_KEY]: {
      ...oldData[STORAGE_APP_KEY],
      ...newData
    }
  }
}

export async function callStorage(params: {
  provider: any
  owner: string
  method: string
  args: any[]
  onHash?: (hash: string) => void
}) {
  const { provider, method, args, onHash, owner } = params
  const { storage: storageAddress } = chainInfo[config.STORAGE_CHAIN_ID]

  const web3 = new Web3(provider)
  //@ts-ignore
  const storage = new web3.eth.Contract(STORAGE.abi, storageAddress)

  if (method && storage) {
    return new Promise((resolve, reject) => {
      storage.methods[method](...args)
        .send({ from: owner })
        .on('transactionHash', (hash: string) => {
          if (typeof onHash === 'function') onHash(hash)
        })
        .then(resolve)
        .catch(reject)
    })
  }

  return false
}

export async function updateStorageData(params: {
  provider: any
  owner: string
  onHash?: (hash: string) => void
  onReceipt?: (receipt: object, success: boolean) => void
  data: Data
}) {
  const { provider, onHash, onReceipt, data, owner } = params
  const { storage: storageAddress } = chainInfo[config.STORAGE_CHAIN_ID]

  const web3 = new Web3(provider)
  //@ts-ignore
  const storage = new web3.eth.Contract(STORAGE.abi, storageAddress)

  if (storage) {
    try {
      const domain = getCurrentDomain()
      const currentData = await storage.methods[STORAGE_METHODS.getData](domain).call()
      const { info: strInfo } = currentData
      const info = JSON.parse(strInfo || '{}')

      if (!info[STORAGE_APP_KEY]) info[STORAGE_APP_KEY] = {}

      const newData = updateData(info, data)

      return new Promise((resolve, reject) => {
        storage.methods[STORAGE_METHODS.setKeyData](domain, {
          owner,
          info: JSON.stringify(newData)
        })
          .send({ from: owner })
          .on('transactionHash', (hash: string) => {
            if (typeof onHash === 'function') onHash(hash)
          })
          .on('receipt', (receipt: { [k: string]: any }) => {
            if (typeof onReceipt === 'function') onReceipt(receipt, receipt?.status)
          })
          .then(resolve)
          .catch(reject)
      })
    } catch (error) {
      console.error(error)
      return false
    }
  }

  return false
}
