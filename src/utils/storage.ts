import { Web3Provider } from '@ethersproject/providers'
import STORAGE from '../constants/abis/app/Storage.json'
import { chainInfo } from '../config/chainConfig'
import config from '../config'
import { getCurrentDomain } from '../utils/url'
import { getContractInstance } from './contract'
import { STORAGE_METHODS, STORAGE_APP_KEY } from '../constants'

const storageAddress = (): string => {
  const { storage } = chainInfo[config.STORAGE_CHAIN_ID]

  return storage || ''
}

export const getStorage = (library: Web3Provider, address: string) => {
  return getContractInstance(library, address, STORAGE.abi)
}

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

export async function updateStorageData(params: {
  library: any
  owner: string
  onHash?: (hash: string) => void
  onReceipt?: (receipt: object, success: boolean) => void
  data: Data
}) {
  const { library, onHash, onReceipt, data, owner } = params
  const storage = getStorage(library, storageAddress())

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

export const resetAppData = async ({ library, owner }: { library: any; owner: string }) => {
  try {
    const storage = getStorage(library, storageAddress())
    const domain = getCurrentDomain()

    const { info } = await storage.methods[STORAGE_METHODS.getData](domain).call()

    const parsedData = JSON.parse(info)
    const newData = { ...parsedData, [STORAGE_APP_KEY]: {} }

    await storage.methods[STORAGE_METHODS.setKeyData](domain, {
      owner,
      info: JSON.stringify(newData)
    }).send({
      from: owner
    })
  } catch (error) {
    console.error('Reset app data')
    console.error(error)
  }
}
