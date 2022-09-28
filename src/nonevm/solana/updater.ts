
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
} from './index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  
  const {loginSol} = useLoginSol()

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
    loginSol()

    if ([ChainId.SOL, ChainId.SOL_TEST].includes(chainId)) {
      window?.solana?.on('accountChanged', (pub:any) => {
        console.log(pub.toBase58())
        if (pub) {
          dispatch(solAddress({address: pub.toBase58()}))
        }
      })
    }
  }, [chainId])

  return null
}
