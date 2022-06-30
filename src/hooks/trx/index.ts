import { useCallback } from "react"

const tronweb = window.tronWeb

export function toHexAddress (address:string) {
  const str = tronweb.address.toHex(address).toLowerCase()
  return '0x' + str.substr(2)
}

export function fromHexAddress (address:string) {
  return '41' + address.substr(2)
}

export function isTRXAddress (address:string) {
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
  }
  return tronweb.isAddress(address)
}

export function formatTRXAddress (address:string) {
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
    address = tronweb.address.fromHex(address)
  }
  return address
}

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
    const TRXAccount = tronweb.defaultAddress.base58
    const curTRXAccount = toHexAddress(TRXAccount)
    if (curTRXAccount === account.toLowerCase()) {
      let tx:any = ''
      try {
        if (symbol === 'TRX') {
          tx = await tronweb.transactionBuilder.sendTrx(toAddress, amount, TRXAccount)
          // console.log(tx)
        } else {
          const parameter1 = [{type:'address',value: toAddress},{type:'uint256',value: amount}]
          tx = await tronweb.transactionBuilder.triggerSmartContract(tokenID, "transfer(address,uint256)", {}, parameter1, TRXAccount)
          tx = tx.transaction
        }
        const signedTx = await tronweb.trx.sign(tx)
        const broastTx = await tronweb.trx.sendRawTransaction(signedTx)
        return {
          msg: 'Success',
          info: broastTx
        }
      } catch (error) {
        console.log(error)
        return {
          msg: 'Error',
          error: error?.toString()
        }
      }
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
  const TRXAccount = tronweb?.defaultAddress?.base58
  const getTrxBalance = useCallback(({account}) => {
    return new Promise((resolve) => {
      const useAccount = account ? account : TRXAccount
      tronweb.trx.getBalance(useAccount).then((res:any) => {
        console.log(res)
        resolve(res)
      })
    })
  }, [TRXAccount]) 

  const getTrxTokenBalance = useCallback(({account, token}) => {
    return new Promise((resolve) => {
      const useAccount = account ? account : TRXAccount
      const parameter1 = [{type:'address',value: useAccount}]
      const tokenID = token
      tronweb.transactionBuilder.triggerSmartContract(tokenID, "balanceOf(address)", {}, parameter1, useAccount).then((res:any) => {
        console.log(res)
        resolve(res)
      })
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
      tronweb.trx.getTransaction(txid).then((res:any) => {
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

