import Web3 from 'web3'
import STORAGE from '../constants/abis/app/Storage.json'
import { chainInfo } from '../config/chainConfig'
import config from '../config'
import { getCurrentDomain } from '../utils/url'
import { STORAGE_METHODS } from '../constants'

const merge = ({
  oldData,
  newData,
  onElement
}: {
  oldData: any
  newData: any
  onElement: (k: string, oldKeyData: any, newKeyData: any) => any
}) => {
  return [...new Set([...Object.keys(oldData), ...Object.keys(newData)])].reduce(
    (acc, key) => ({ ...acc, [key]: onElement(key, oldData[key], newData[key]) }),
    {}
  )
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
  data: { [k: string]: any }
}) {
  const { provider, onHash, data, owner } = params
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

      if (!info.crossChainSettings) info.crossChainSettings = {}

      const result = {
        ...info,
        crossChainSettings: merge({
          oldData: info.crossChainSettings,
          newData: data,
          onElement: (key, oldKeyData, newKeyData) => newKeyData || oldKeyData
        })
      }

      return new Promise((resolve, reject) => {
        storage.methods[STORAGE_METHODS.setKeyData](
          ...[
            domain,
            {
              owner,
              info: JSON.stringify(result)
            }
          ]
        )
          .send({ from: owner })
          .on('transactionHash', (hash: string) => {
            if (typeof onHash === 'function') onHash(hash)
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
