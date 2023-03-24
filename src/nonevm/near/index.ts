import {
  connect,
  // Contract,
  keyStores,
  providers
} from 'near-api-js'
import type { AccountView, CodeResult } from "near-api-js/lib/providers/provider";
import type { Transaction } from "@near-wallet-selector/core";
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
// import {getConfig} from './config'
import { tryParseAmount3 } from '../../state/swap/hooks'
import { BigAmount } from '../../utils/formatBignumber'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { recordsTxns } from '../../utils/bridge/register'
import { useTxnsDtilOpen, useTxnsErrorTipOpen } from '../../state/application/hooks'
import useInterval from '../../hooks/useInterval'
import { isAddress } from '../../utils/isAddress'
import { ChainId } from '../../config/chainConfig/chainId'
// import { VALID_BALANCE } from '../../config/constant'
import {
  // useDarkModeManager,
  // useExpertModeManager,
  // useInterfaceModeManager,
  useInterfaceBalanceValidManager
  // useUserTransactionTTL,
  // useUserSlippageTolerance
} from '../../state/user/hooks'
import config from '../../config'
// export enum WrapType {
//   NOT_APPLICABLE,
//   WRAP,
//   UNWRAP,
//   NOCONNECT
// }


// import { setupWalletSelector } from "@near-wallet-selector/core";
// import { setupModal } from "@near-wallet-selector/modal-ui";
// import { setupSender } from "@near-wallet-selector/sender";
import { useWalletSelector } from "./WalletSelectorContext";
// import type { Transaction } from "@near-wallet-selector/core";
// import { BigNumber } from '@ethersproject/bignumber'

const NOT_APPLICABLE = {}

// const nearConfig:any = getConfig(process.env.NODE_ENV || 'development')
// const contractId = 'bridge-1.crossdemo.testnet'

export async function initConnect(chainId: any, token: any) {
  let account
  try {
    let connectConfig: any = {}
    if (chainId === ChainId.NEAR_TEST) {
      connectConfig = {
        networkId: "testnet",
        keyStore: new keyStores.InMemoryKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      }
    } else if (chainId === ChainId.NEAR) {
      connectConfig = {
        networkId: 'mainnet',
        keyStore: new keyStores.InMemoryKeyStore(),
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      }
    }
    const near = await connect(connectConfig);
    // console.log(near)
    account = await near.account(token);
  } catch (error) {
    console.log('initConnect')
    console.log(error)
  }
  return account;
}

export function useNearAddress() {
  let accountId = ""
  if (window?.selector) {
    if (window.selector.store.getState().accounts.length > 0) {
      accountId = window.selector.store.getState().accounts[0].accountId;
    }
  }
  return accountId;
}

export function useLogin() {

  // const login = useCallback(async() => {
  //   if (window?.near) {
  //     try {
  //       const res = await window.near.requestSignIn({ contractId, methodNames: [] })
  //       if (!res.error) {
  //         if (res && res.accessKey) {
  //           setAccess(res.accessKey)
  //         } else {
  //           console.log('res: ', res)
  //         }
  //       }
  //     } catch (error) {
  //       console.log('error: ', error)
  //     }
  //   } else {
  //     if (confirm('Please install Sender Wallet.') === true) {
  //       window.open('https://chrome.google.com/webstore/detail/sender-wallet/epapihdplajcdnnkdeiahlgigofloibg')
  //     }
  //   }
  // }, [])


  // 更换到selector登录
  const { modal } = useWalletSelector();

  const login = useCallback(async () => {
    if (window?.selector) {
      try {

        modal.show()
        // if (!res.error) {
        //   if (res && res.accessKey) {
        //     setAccess(res.accessKey)
        //   } else {
        //     console.log('res: ', res)
        //   }
        // }
      } catch (error) {
        console.log('error: ', error)
      }
    } else {

    }
  }, []);

  const logoutNear = useCallback(async() => {
    if (window?.selector) {
      const wallet = await window.selector.wallet();
      wallet.signOut().catch((err) => {
        console.log("Failed to sign out");
        console.error(err);
      });
    }
    return {}
  }, [])

  return {
    login,
    logoutNear
  }
}

export function useNearBalance() {
  const { selector  } = useWalletSelector();
  const { network } = selector.options;
  // console.log(selector)
  // console.log(network)
  const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
  const getNearBalance = useCallback(async () => {
    // let bl:any = ''
    // try {
    //   bl = await window.nightly.near?.account().getAccountBalance()
    // } catch (error) {

    // }
    // console.log(bl)
    // return bl
    const accountId = useNearAddress()
    try {
      const { amount } = await provider.query<AccountView>({
        "request_type": "view_account",
        finality: "final",
        "account_id": accountId,
      });
      // const bn = BigNumber.from(amount);
      return { total: amount, available: amount }
    } catch (error) {

    }
    return {}
  }, [])

  const getNearTokenBalance = useCallback(async ({ token }) => {
    let bl: any = BigInt(0);
    const accountId = useNearAddress()
    // const useAccount = account ? account : window.near?.accountId
    // try {

    //   bl = await window.near?.account().viewFunction(
    //     token,
    //     'ft_balance_of',
    //     { "account_id": useAccount },
    //   )
    // } catch (error) {

    // }
    // console.log(bl)
    // return bl
    if (token && token !== 'mpc.testnet') {
      try {
        bl = await provider.query<CodeResult>({
          "request_type": "call_function",
          "account_id": token,
          "method_name": "ft_balance_of",
          "args_base64": Buffer.from(JSON.stringify({
            "account_id": accountId
          })).toString('base64'),
          finality: "optimistic",
        });
        bl = JSON.parse(Buffer.from(bl.result).toString())
      } catch (error) {
        console.log(error)
      }
    }


    return bl
  }, [])

  const getNearStorageBalance = useCallback(async ({ token, account, chainId }) => {
    let bl: any
    const useAccount = account ? account : window?.near?.accountId
    const accountFn = await initConnect(chainId, token);
    // console.log(accountFn)
    try {
      if (accountFn && useAccount && isAddress(useAccount, chainId)) {
        bl = await accountFn.viewFunction(
          token,
          'storage_balance_of',
          { "account_id": useAccount },
        )
      }
    } catch (error) {
      console.log(error)
    }
    return bl
  }, [])

  const getNearStorageBalanceBounds = useCallback(async ({ token, chainId }) => {
    let bl: any
    const accountFn = await initConnect(chainId, token);
    try {
      if (accountFn && isAddress(token, chainId)) {
        bl = await accountFn.viewFunction(
          token,
          'storage_balance_bounds',
        )
      }
    } catch (error) {
      console.log(error)
    }
    return bl
  }, [])

  return {
    getNearBalance,
    getNearTokenBalance,
    getNearStorageBalance,
    getNearStorageBalanceBounds
  }
}

export function useNearPoolDatas() {
  const getNearPoolDatas = useCallback(async (calls, chainId) => {
    return new Promise(resolve => {
      const arr = []
      const labelArr: any = []
      // console.log(chainId)
      if (window?.selector && window?.near?.account && [ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {

        for (const item of calls) {
          if (item.token === 'near' || item.anytoken === 'near') continue
          if (item.token) {
            arr.push(window?.near?.account().viewFunction(
              item.token,
              'ft_balance_of',
              { "account_id": item.anytoken },
            ))
            labelArr.push({
              key: item.anytoken,
              label: 'balanceOf'
            })
            arr.push(window?.near?.account().viewFunction(
              item.token,
              'ft_total_supply',
              {},
            ))
            labelArr.push({
              key: item.anytoken,
              label: 'totalSupply'
            })
          }

          if (isAddress(item.account, chainId)) {

            arr.push(window?.near?.account().viewFunction(
              item.anytoken,
              'ft_balance_of',
              { "account_id": item.account },
            ))
            labelArr.push({
              key: item.anytoken,
              label: 'balance'
            })
          }
        }
      }
      // console.log(calls)
      Promise.all(arr).then(res => {
        // console.log(res)
        const list: any = {}
        for (let i = 0, len = arr.length; i < len; i++) {
          const k = labelArr[i].key
          const l = labelArr[i].label
          if (!list[k]) list[k] = {}
          list[k][l] = res[i]
        }
        // console.log(list)
        resolve(list)
      })
    })
  }, [])

  return {
    getNearPoolDatas,
  }
}


export function useSendNear() {
  const { selector, accountId } = useWalletSelector();

  const sendTransaction = useCallback(
    async (actions: any) => {
      const wallet = await selector.wallet();
      const transactions: Array<Transaction> = [];
      transactions.push({
        signerId: accountId || "",
        receiverId: actions.receiverId,
        actions: [
          {
            type: "FunctionCall",
            params: actions.actions[0]
          },
        ]
      });
      return wallet
        .signAndSendTransactions({ transactions })

    },
    [selector, accountId]
  );

  const sendNear = useCallback(async (routerContractId, amount, bindaddr, selectchain, tokenType, anyContractId) => {
    return new Promise((resolve, reject) => {
      // console.log('sendNear')
      const actions: any = {
        receiverId: tokenType === 'ANYTOKEN' ? anyContractId : routerContractId,
        actions: [],
      }
      if (tokenType === 'ANYTOKEN') {
        actions.actions.push({
          methodName: 'swap_out',
          args: {
            "receiver_id": `${bindaddr}`,
            "to_chain_id": `${selectchain}`,
            "amount": `${amount}`,
          },
          gas: '300000000000000',
          deposit: '0'
        })
      } else {
        actions.actions.push({
          methodName: 'swap_out',
          args: {
            "receiver_id": `${bindaddr}`,
            "to_chain_id": `${selectchain}`,
          },
          gas: '300000000000000',
          deposit: amount
        })
      }

      let tx: any = {}
      // window.near.signAndSendTransaction(actions)
      sendTransaction(actions)
        // window.nightly.near.signAllTransactions(actions)
        .then((res: any) => {
          console.log(res)
          if (res && res.length > 0) {
            tx = res[0].transaction;
            resolve(tx)
          } else {
            reject("sendTransaction ERROR")
          }

          // if (res?.response && !res?.response.error && res?.response.length > 0) {
          //   tx = res?.response[0]?.transaction
          //   resolve(tx)
          // } else {
          //   reject(res?.response?.error)
          // }
        }).catch((error: any) => {
          reject(error)
        })
    })
  }, [])

  const sendNearToken = useCallback(async (contractId, anyContractId, routerContractId, amount, bindaddr, selectchain) => {
    return new Promise((resolve, reject) => {
      console.log('sendNearToken')
      const actions = {
        receiverId: contractId,
        actions: [
          {
            methodName: 'ft_transfer',
            args: {
              'receiver_id': routerContractId,
              amount: amount,  // wNear decimals is 24
              memo: `${bindaddr} ${selectchain}`
            },
            gas: '300000000000000',
            deposit: '1'
          }
        ]
      }
      console.log(actions)
      let tx: any = {}
      sendTransaction(actions)
        // window.nightly.near.signAllTransactions(actions)
        .then((res: any) => {
          console.log(res)
          if (res && res.length > 0) {
            tx = res[0].transaction;
            resolve(tx)
          } else {
            reject("sendTransaction ERROR")
          }

          // if (res?.response && !res?.response.error && res?.response.length > 0) {
          //   tx = res?.response[0]?.transaction
          //   resolve(tx)
          // } else {
          //   reject(res?.response?.error)
          // }
        }).catch((error: any) => {
          reject(error)
        })
    })
  }, [])

  const depositStorageNear = useCallback((contractid, accountId, nearStorageBalanceBounds) => {
    return new Promise((resolve, reject) => {
      console.log('sendNearToken')
      const actions = {
        receiverId: contractid,
        actions: [
          {
            methodName: 'storage_deposit',
            args: {
              "account_id": accountId,
              // "registration_only": true, 
            },
            gas: '300000000000000',
            // deposit: 1e24
            deposit: nearStorageBalanceBounds ? nearStorageBalanceBounds : '1250000000000000000000'
            // deposit: amount
          }
        ],
        // amount: amount
      }
      console.log(actions)
      let tx: any = {}
      sendTransaction(actions)
        // window.nightly.near.signAllTransactions(actions)
        .then((res: any) => {
          console.log(res)
          if (res && res.length > 0) {
            tx = res[0].transaction;
            resolve(tx)
          } else {
            reject("sendTransaction ERROR")
          }

          // if (res?.response && !res?.response.error && res?.response.length > 0) {
          //   tx = res?.response[0]?.transaction
          //   resolve(tx)
          // } else {
          //   reject(res?.response?.error)
          // }
        }).catch((error: any) => {
          reject(error)
        })
    })
  }, [])

  const depositNearToken = useCallback(async (contractId, anyContractId, routerContractId, amount, bindaddr, selectchain) => {
    return new Promise((resolve, reject) => {
      console.log('sendNearToken')
      const actions = {
        receiverId: contractId,
        actions: [
          {
            methodName: 'ft_transfer_call',
            args: {
              'receiver_id': routerContractId,
              amount: amount,  // wNear decimals is 24
              msg: `any_swap_out ${anyContractId} ${bindaddr} ${selectchain}`
            },
            gas: '300000000000000',
            deposit: '1'
          }
        ]
      }
      console.log(actions)
      let tx: any = {}
      sendTransaction(actions)
        // window.nightly.near.signAllTransactions(actions)
        .then((res: any) => {
          console.log(res)
          if (res && res.length > 0) {
            tx = res[0].transaction;
            resolve(tx)
          } else {
            reject("sendTransaction ERROR")
          }

          // if (res?.response && !res?.response.error && res?.response.length > 0) {
          //   tx = res?.response[0]?.transaction
          //   resolve(tx)
          // } else {
          //   reject(res?.response?.error)
          // }
        }).catch((error: any) => {
          reject(error)
        })
    })
  }, [])

  const withdrawNearToken = useCallback(async (contractId, anyContractId, routerContractId, amount, bindaddr, selectchain) => {
    return new Promise((resolve, reject) => {
      console.log('sendNearToken')
      const actions = {
        receiverId: contractId,
        actions: [
          {
            methodName: 'ft_transfer_call',
            args: {
              'receiver_id': routerContractId,
              amount: amount,  // wNear decimals is 24
              msg: `any_swap_out ${anyContractId} ${bindaddr} ${selectchain}`
            },
            gas: '300000000000000',
            deposit: '1'
          }
        ]
      }
      console.log(actions)
      let tx: any = {}
      sendTransaction(actions)
        // window.nightly.near.signAllTransactions(actions)
        .then((res: any) => {
          console.log(res)
          if (res && res.length > 0) {
            tx = res[0].transaction;
            resolve(tx)
          } else {
            reject("sendTransaction ERROR")
          }

          // if (res?.response && !res?.response.error && res?.response.length > 0) {
          //   tx = res?.response[0]?.transaction
          //   resolve(tx)
          // } else {
          //   reject(res?.response?.error)
          // }
        }).catch((error: any) => {
          reject(error)
        })
    })
  }, [])


  return {
    sendNear,
    sendNearToken,
    depositStorageNear,
    depositNearToken,
    withdrawNearToken,
  }
}

// contractId, anyContractId, routerContractId, amount, bindaddr, selectchain
export function useNearSendTxns(
  routerToken: any,
  inputCurrency: any,
  anyContractId: any,
  contractId: any,
  typedValue: any,
  receiverId: any,
  chainId: any,
  selectChain: any,
  destConfig: any,
  useToChainId: any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { sendNear, sendNearToken } = useSendNear()
  const { t } = useTranslation()
  const address = useNearAddress()
  const addTransaction = useTransactionAdder()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const { onChangeViewDtil } = useTxnsDtilOpen()
  const { onChangeViewErrorTip } = useTxnsErrorTipOpen()
  const [balance, setBalance] = useState<any>()
  const inputAmount = useMemo(() => tryParseAmount3(typedValue, inputCurrency?.decimals), [typedValue, inputCurrency])
  const underlyingToken = contractId ? contractId : anyContractId
  const {
    getNearBalance,
    getNearTokenBalance
  } = useNearBalance()

  const getBalance = useCallback(() => {
    if ([ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) {
      if (inputCurrency?.tokenType === 'NATIVE' || inputCurrency?.address === 'near') {
        getNearBalance().then(res => {
          if (res?.available) {
            // setBalance(BigAmount.format(inputCurrency?.decimals,res?.available))
            setBalance(BigAmount.format(inputCurrency?.decimals, res?.total))
          } else {
            setBalance('')
          }
        })
      } else {
        getNearTokenBalance({ token: contractId }).then((res: any) => {
          // console.log(contractId)
          // console.log(res)
          if (res) {
            // setBalance(BigAmount.format(inputCurrency?.decimals,res?.available))
            setBalance(BigAmount.format(inputCurrency?.decimals, res))
          } else {
            setBalance('')
          }
        })
      }
    }
  }, [inputCurrency, contractId, chainId])

  useEffect(() => {
    getBalance()
  }, [inputCurrency, contractId])

  useInterval(getBalance, 1000 * 10)

  let sufficientBalance = false
  try {
    // sufficientBalance = true
    sufficientBalance = inputCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }

  return useMemo(() => {
    // console.log(inputAmount)
    // console.log(receiverId)
    // console.log(selectChain)
    // console.log(routerToken)
    // console.log(underlyingToken)
    // console.log(chainId)
    if (!useToChainId || !routerToken || !underlyingToken || !chainId) return NOT_APPLICABLE
    // console.log(balance)
    return {
      // wrapType: WrapType.WRAP,
      balance,
      execute: receiverId && (sufficientBalance || !userInterfaceBalanceValid) && inputAmount ? async () => {
        try {
          const txReceipt: any = ["NATIVE", "ANYTOKEN"].includes(inputCurrency?.tokenType) || inputCurrency?.address === 'near' ? await sendNear(routerToken, inputAmount, receiverId, useToChainId, inputCurrency?.tokenType, anyContractId) : await sendNearToken(contractId, anyContractId, routerToken, inputAmount, receiverId, useToChainId)
          console.log(txReceipt)
          if (txReceipt?.hash) {
            const data: any = {
              hash: txReceipt.hash,
              chainId: chainId,
              selectChain: selectChain,
              account: address,
              value: inputAmount,
              formatvalue: typedValue,
              to: receiverId,
              symbol: inputCurrency?.symbol,
              version: destConfig.type,
              pairid: inputCurrency?.symbol,
              routerToken: routerToken
            }
            addTransaction(txReceipt, {
              summary: `Cross bridge ${typedValue} ${inputCurrency?.symbol}`,
              value: typedValue,
              toChainId: selectChain,
              toAddress: receiverId.indexOf('0x') === 0 ? receiverId?.toLowerCase() : receiverId,
              symbol: inputCurrency?.symbol,
              version: 'swapin',
              routerToken: routerToken,
              token: inputCurrency?.address,
              logoUrl: inputCurrency?.logoUrl,
              isLiquidity: destConfig?.isLiquidity,
              fromInfo: {
                symbol: inputCurrency?.symbol,
                name: inputCurrency?.name,
                decimals: inputCurrency?.decimals,
                address: inputCurrency?.address,
              },
              toInfo: {
                symbol: destConfig?.symbol,
                name: destConfig?.name,
                decimals: destConfig?.decimals,
                address: destConfig?.address,
              },
            })
            recordsTxns(data)
            onChangeViewDtil(txReceipt?.hash, true)
          }
        } catch (error) {
          console.log('Could not swapout', error)
          onChangeViewErrorTip('Txns failure.', true)
        }
      } : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', { symbol: inputCurrency?.symbol })
    }
  }, [inputAmount, receiverId, selectChain, routerToken, anyContractId, contractId, chainId, inputCurrency, balance, underlyingToken, destConfig, useToChainId, userInterfaceBalanceValid])
}

/**
 * any token 充值与提现underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
//  export function useNearSwapPoolUnderlyingCallback(
//   inputCurrency: any,
//   inputToken: string | undefined,
//   // anyContractId:any,
//   contractId:any,
//   typedValue: string | undefined,
//   swapType: string | undefined,
//   // selectCurrency: any,
//   chainId: any
// // ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
//   // const { chainId } = useActiveReact()
//   // const bridgeContract = useSwapUnderlyingContract(isAddress(inputToken, evmChainId))
//   const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
//   const { t } = useTranslation()
//   const {depositNearToken, withdrawNearToken} = useSendNear()

//   const [balance, setBalance] = useState<any>()
//   // const useAccount:any = isAddress(account, evmChainId)
//   // const ethbalance = useETHBalances(useAccount ? [useAccount] : [])?.[account ?? '']
//   // const anybalance = useCurrencyBalance(useAccount ?? undefined, inputCurrency)
//   // const balance = selectCurrency?.tokenType === "NATIVE" ? ethbalance : anybalance
//   // const underlyingToken = contractId ? contractId : anyContractId
//   const {
//     getNearBalance,
//     getNearTokenBalance
//   } = useNearBalance()

//   const getBalance = useCallback(() => {
//     if (inputCurrency?.tokenType === 'NATIVE') {
//       getNearBalance().then(res => {
//         if (res?.available) {
//           // setBalance(BigAmount.format(inputCurrency?.decimals,res?.available))
//           setBalance(BigAmount.format(inputCurrency?.decimals,res?.total))
//         } else {
//           setBalance('')
//         }
//       })
//     } else {
//       getNearTokenBalance({token: contractId}).then(res => {
//         // console.log(contractId)
//         // console.log(res)
//         if (res) {
//           // setBalance(BigAmount.format(inputCurrency?.decimals,res?.available))
//           setBalance(BigAmount.format(inputCurrency?.decimals,res))
//         } else {
//           setBalance('')
//         }
//       })
//     }
//   }, [inputCurrency, contractId])

//   useEffect(() => {
//     getBalance()
//   }, [inputCurrency, contractId])

//   useInterval(getBalance, 1000 * 10)
//   // console.log(balance?.raw.toString())
//   // console.log(inputCurrency)
//   // 我们总是可以解析输入货币的金额，因为包装是1:1
//   const inputAmount = useMemo(() => tryParseAmount3(typedValue, inputCurrency?.decimals), [typedValue, inputCurrency])
//   const addTransaction = useTransactionAdder()
//   return useMemo(() => {
//     // console.log(inputCurrency)
//     if (!chainId || !inputCurrency || !swapType || [ChainId.NEAR, ChainId.NEAR_TEST].includes(chainId)) return NOT_APPLICABLE
//     // console.log(inputAmount?.raw.toString())

//     const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
//     // console.log(sufficientBalance)
//     return {
//       execute:
//       (sufficientBalance || !VALID_BALANCE) && inputAmount
//           ? async () => {
//               try {
//                 // console.log(inputAmount.raw.toString(16))
//                 const txReceipt:any = swapType === 'deposit' ? await depositNearToken : await withdrawNearToken
//                 addTransaction(txReceipt, { summary: `${swapType === 'deposit' ? 'Deposit' : 'Withdraw'} ${inputAmount.toSignificant(6)} ${inputCurrency?.symbol}` })
//               } catch (error) {
//                 console.log('Could not swapout', error)
//                 onChangeViewErrorTip(error, true)
//               }
//             }
//           : undefined,
//       inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
//     }
//   }, [chainId, inputCurrency, inputAmount, balance, addTransaction, t, swapType, inputToken])
// }

export function updateNearHash(hash: any, chainId: any) {
  const data: any = {
    msg: 'Error',
    info: ''
  }
  return new Promise(resolve => {
    // const url = 'https://rpc.testnet.near.org'
    const url = config.chainInfo[chainId].nodeRpc
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "EXPERIMENTAL_tx_status",
        "params": [hash, "bowen"]
      })
    }).then(res => res.json()).then(json => {
      console.log(json)
      const result = json?.result?.transaction_outcome?.outcome
      if (result) {
        if (
          result?.status?.SuccessReceiptId
          || result?.status?.SuccessValue
        ) {
          data.msg = 'Success'
          data.info = json
        } else if (result?.status?.Failure) {
          data.msg = 'Failure'
          data.error = 'Txns is failure!'
        } else {
          data.msg = 'Null'
          data.error = 'Query is empty!'
        }
      } else {
        data.msg = 'Null'
        data.error = 'Query is empty!'
      }
      resolve(data)
    }).catch(err => {
      console.log(err.toString())
      data.error = 'Query is empty!'
      resolve(data)
    })
  })
}
// updateNearHash('4KVYoGtn2FFceXdtrttGPkqWnKAGJZ9yVArFMF2z7RxH', 'NEAR_TEST').then(res => {
//   console.log(res)
// })