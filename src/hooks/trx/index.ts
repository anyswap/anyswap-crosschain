import { useCallback } from "react"
import { useDispatch, useSelector } from 'react-redux'
// import useInterval from "../useInterval"
import { AppState, AppDispatch } from '../../state'
import { trxAddress } from './actions'
// const tronweb = window.tronWeb

export function toHexAddress (address:string) {
  const str = window?.tronWeb?.address?.toHex(address).toLowerCase()
  return '0x' + str.substr(2)
}

export function fromHexAddress (address:string) {
  return '41' + address.substr(2)
}

export function isTRXAddress (address:string) {
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
  }
  return window?.tronWeb?.isAddress(address)
}

export function formatTRXAddress (address:string) {
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
    address = window?.tronWeb?.address.fromHex(address)
  }
  return address
}

export function useTrxAddress () {
  const account:any = useSelector<AppState, AppState['trx']>(state => state.trx.trxAddress)
  // console.log(window?.tronWeb?.isConnected())
  return {
    trxAddress: account ? toHexAddress(account) : ''
  }
}

export function useLoginTrx () {
  const dispatch = useDispatch<AppDispatch>()
  const loginTrx = useCallback(() => {
    if (window.tronWeb) {
      if (window?.tronWeb?.address && window.tronWeb.defaultAddress.base58) {
        dispatch(trxAddress({address: window.tronWeb.defaultAddress.base58}))
      } else {
        history.go(0)
      }
    }
  }, [])
  return {
    loginTrx
  }
}

// export function useContract () {
//   let contract = await window?.tronWeb?.contract().at(trc20ContractAddress)
// }

export async function sendTRXTxns ({
  account,
  toAddress,
  amount,
  symbol,
  tokenID
}: {
  account: string,
  toAddress: string,
  amount: string,
  symbol: string,
  tokenID: string
}) {
  // console.log(tronweb)
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    const TRXAccount = window?.tronWeb?.defaultAddress.base58
    const curTRXAccount = toHexAddress(TRXAccount)
    if (curTRXAccount === account.toLowerCase()) {
      let tx:any = ''
      /* eslint-disable */
      try {
        if (symbol === 'TRX') {
          tx = await window?.tronWeb?.transactionBuilder.sendTrx(toAddress, amount, TRXAccount)
          // console.log(tx)
        } else {
          const parameter1 = [{type:'address',value: toAddress},{type:'uint256',value: amount}]
          tx = await window?.tronWeb?.transactionBuilder.triggerSmartContract(tokenID, "transfer(address,uint256)", {}, parameter1, TRXAccount)
          tx = tx.transaction
        }
        const signedTx = await window?.tronWeb?.trx.sign(tx)
        const broastTx = await window?.tronWeb?.trx.sendRawTransaction(signedTx)
        return {
          msg: 'Success',
          info: broastTx
        }
      } catch (error) {
        console.log(error)
        return {
          msg: 'Error',
          // error: error?.toString()
          error: error
        }
      }
      /* eslint-enable */
    } else {
      return {
        msg: 'Error',
        error: 'Account verification failed!'
      }
    }
  } else {
    return {
      msg: 'Error',
      error: 'Not Supported!'
    }
  }
}

export function useTrxBalance () {
  const TRXAccount = window?.tronWeb?.defaultAddress?.base58
  const getTrxBalance = useCallback(({account}) => {
    return new Promise((resolve) => {
      const useAccount = account ? account : TRXAccount
      if (window.tronWeb && window.tronWeb.defaultAddress.base58 && useAccount) {
        window?.tronWeb?.trx.getBalance(useAccount).then((res:any) => {
          console.log(res)
          resolve(res)
        })
      } else {
        resolve('')
      }
    })
  }, [TRXAccount]) 

  const getTrxTokenBalance = useCallback(({account, token}) => {
    return new Promise((resolve) => {
      const useAccount = account ? account : TRXAccount
      const parameter1 = [{type:'address',value: useAccount}]
      const tokenID = token
      if (window.tronWeb && window.tronWeb.defaultAddress.base58 && useAccount && tokenID) {
        window?.tronWeb?.transactionBuilder.triggerSmartContract(tokenID, "balanceOf(address)", {}, parameter1, useAccount).then((res:any) => {
          console.log(res)
          resolve(res)
        })
      } else {
        resolve('')
      }
    })
  }, [TRXAccount])

  return {
    getTrxBalance,
    getTrxTokenBalance
  }
}

// export function getTRXBalance (account:any, token:any) {
//   if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
//     const curAccount = fromHexAddress(account)
//     const TRXAccount = tronweb.defaultAddress.base58

//     if (token === 'TRX') {
//       tronweb.trx.getBalance(curAccount).then((res:any) => {
//         console.log(res)
//       })
//     } else {
//       const parameter1 = [{type:'address',value: curAccount}]
//       const tokenID = token
//       tronweb.transactionBuilder.triggerSmartContract(tokenID, "balanceOf(address)", {}, parameter1, TRXAccount).then((res:any) => {
//         console.log(res)
//         // const bl = res.constant_result[0]
//         // setLocalOutBalance(TRX_MAIN_CHAINID, account, token, {balance: '0x' + bl.toString()})
//       })
//     }
//   }
// }

export function getTRXTxnsStatus (txid:string) {
  return new Promise(resolve => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      window?.tronWeb?.trx.getTransaction(txid).then((res:any) => {
        console.log(res)
        if (res.ret) {
          resolve({
            status: true
          })
        } else {
          resolve({
            status: false
          })
        }
      })
    } else {
      resolve({
        status: false
      })
    }
  })
}

export function useTrxCrossChain (

): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  return {
    balance: '',
    execute: async () => {
      // let contract = await window?.tronWeb?.contract()
    }
  }
}

