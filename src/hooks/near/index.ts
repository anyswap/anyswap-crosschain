import {
  connect,
  // Contract,
  keyStores,
  WalletConnection
} from 'near-api-js'
import {getConfig} from './config'

const nearConfig:any = getConfig(process.env.NODE_ENV || 'development')
const w:any = window
// 初始化合同并设置全局变量
export async function initContract() {
  // 初始化与near测试网的连接
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // 正在初始化基于钱包的帐户。它可以与near testnet钱包配合使用
  // is hosted at https://wallet.testnet.near.org
  w.walletConnection = new WalletConnection(near, null)

  // 获取帐户ID。如果仍然未经授权，则它只是空字符串
  w.accountId = w.walletConnection.getAccountId()

  // 按合同名称和配置初始化合同API
  // w.contract = await new Contract(w.walletConnection.account(), nearConfig.contractName, {
  //   // 视图方法是只读的。它们不会修改状态，但通常会返回一些值。
  //   viewMethods: ['getGreeting'],
  //   // 更改方法可以修改状态。但调用时不会收到返回值。
  //   changeMethods: ['setGreeting'],
  // })
}
initContract()
export function logout() {
  w.walletConnection.signOut()
  // reload page
  w.location.replace(w.location.origin + w.location.pathname)
}

export function login() {
  // 允许当前应用调用服务器上的指定合同
  // 用户代表。
  // 这通过为用户的帐户创建新的访问密钥并存储
  // localStorage中的私钥。
  w.walletConnection.requestSignIn(nearConfig.contractName)
}
