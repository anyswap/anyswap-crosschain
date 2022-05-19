// import {
//   connect,
//   // Contract,
//   keyStores,
//   WalletConnection
// } from 'near-api-js'
import { useCallback, useState } from 'react'
import {getConfig} from './config'


const nearConfig:any = getConfig(process.env.NODE_ENV || 'development')
const contractId = nearConfig.contractName
// const w:any = window
// // 初始化合同并设置全局变量
// export async function initContract() {
//   // 初始化与near测试网的连接
//   const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

//   // 正在初始化基于钱包的帐户。它可以与near testnet钱包配合使用
//   // is hosted at https://wallet.testnet.near.org
//   w.walletConnection = new WalletConnection(near, null)

//   // 获取帐户ID。如果仍然未经授权，则它只是空字符串
//   w.accountId = w.walletConnection.getAccountId()

//   // 按合同名称和配置初始化合同API
//   // w.contract = await new Contract(w.walletConnection.account(), nearConfig.contractName, {
//   //   // 视图方法是只读的。它们不会修改状态，但通常会返回一些值。
//   //   viewMethods: ['getGreeting'],
//   //   // 更改方法可以修改状态。但调用时不会收到返回值。
//   //   changeMethods: ['setGreeting'],
//   // })
// }
// initContract()
export function useLogout() {
  const logout = useCallback(() => {
    if (window?.near) {
      window.near.disconnect()
    }
  }, [])
  return {
    logout
  }
}

export function useNearAddress () {
  return window?.near?.accountId
}

export function useLogin() {
  const [access, setAccess] = useState<any>({})
  const login = useCallback(async() => {
    if (window?.near) {
      try {
        const res = await window.near.requestSignIn({ contractId, methodNames: [] })
        if (!res.error) {
          if (res && res.accessKey) {
            setAccess(res.accessKey)
          } else {
            console.log('res: ', res)
          }
        }
      } catch (error) {
        console.log('error: ', error)
      }
    } else {
      alert('Please install Sender Wallet.')
    }
  }, [])

  return {
    login,
    access
  }
}
