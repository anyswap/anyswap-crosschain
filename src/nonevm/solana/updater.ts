
import { useEffect } from 'react'
import { ChainId } from '../../config/chainConfig/chainId'
import { useActiveReact } from '../../hooks/useActiveReact'
// import useInterval from '../../hooks/useInterval'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import {solAddress} from './actions'

import {
  useLoginSol,
  // useSolBalance
  // getSolanaInfo
  // getSolTxnsStatus
  // useSolCreateAccount
} from './index'

export default function Updater(): null {
  const { chainId, account } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  
  const {loginSol} = useLoginSol()
  // const {
  //   getSolAccountInfo,
  //   // getAccount
  // } = useSolCreateAccount()
  // const {getSolBalance, getSolTokenBalance, getSolTokenInfo} = useSolBalance()

  // const getBalance = useCallback(() => {
  //   const params = {chainId, account}
  //   // const params = {chainId: 'SOL', account: 'D2Wa6JtXeyqFMdoacpKMo86Pbr4YpfdVCtAhem8HjqfF'}
  //   // const params = {chainId, account: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'}
  //   // const params = {chainId, account: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'}
  //   // const params = {chainId, account: 'B9htQ5ZFRTDGaND6bgS9ne5n1kQFBK6u9TZa178Ywao9'}
  //   console.log(params)
  //   Promise.all([
  //     getSolBalance(params),
  //     // getSolTokenBalance(params),
  //     getSolTokenInfo(params),
  //   ]).then((res) => {
  //     console.log(res)
  //   })
  // }, [getSolBalance, getSolTokenBalance, getSolTokenInfo, chainId, account])

  // useEffect(() => {
  //   getBalance()
  // }, [getSolBalance, getSolTokenBalance, chainId, account])

  // useInterval(getBalance, 1000 * 10)

  useEffect(() => {
    // getSolanaInfo('SOL_TEST', 'requestAirdrop', ['H7SFqpjjSsWxVsBuVbWspHq1yjymQmR9t6xmi1u34yfH']).then((res:any) => console.log(res))
    if ([ChainId.SOL, ChainId.SOL_TEST].includes(chainId)) {
      loginSol(1)
      // Promise.all([
      //   getSolAccountInfo({account, chainId}),
      //   getSolAccountInfo({account: 'DCLzsK2u5CNaeEgFv2f4SYsH85gR86C4N753wfD6V5Yy', chainId}),
      // ]).then((res:any) => {
      //   console.log(res)
      // })
      // getAccount('8fBfAE4gVbv253UgwkwBT5TaV5SaZ7JJWgmQoqbEEei5', 'GkzTnqZSasjZ5geL4cbvPErNVB9xWby4zYN7hpW5k5iX').then((res:any) => console.log(res.toBase58()))
      // setTimeout(() => {

      //   createAccount()
      // }, 1000 * 3)
      window?.solana?.on('accountChanged', (pub:any) => {
        console.log(pub.toBase58())
        if (pub) {
          dispatch(solAddress({address: pub.toBase58()}))
        }
      })
    }
  }, [chainId, account])

  return null
}
