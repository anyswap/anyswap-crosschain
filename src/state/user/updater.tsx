import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveReact } from '../../hooks/useActiveReact'
import { AppDispatch } from '../index'
import { updateMatchesDarkMode, removeTokenToWallet } from './actions'
import { useChangeTokenOnWallet } from './hooks'
import { addToken } from '../../config/tools/methods'

export default function Updater(): null {
  const dispatch = useDispatch<AppDispatch>()
  const {chainId} = useActiveReact()
  const {tokeninfo} = useChangeTokenOnWallet()
  // keep dark mode in sync with the system
  useEffect(() => {
    const darkHandler = (match: MediaQueryListEvent) => {
      dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))
    }

    const match = window?.matchMedia('(prefers-color-scheme: dark)')
    dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))

    if (match?.addListener) {
      match?.addListener(darkHandler)
    } else if (match?.addEventListener) {
      match?.addEventListener('change', darkHandler)
    }

    // console.log(tokeninfo)
    // console.log(chainId)
    if (tokeninfo && chainId && tokeninfo.chainId.toString() === chainId.toString()) {
      addToken(tokeninfo.address, tokeninfo.symbol, tokeninfo.decimals, tokeninfo?.logoUrl).then(() => {
        dispatch(removeTokenToWallet({}))
      })
    }

    return () => {
      if (match?.removeListener) {
        match?.removeListener(darkHandler)
      } else if (match?.removeEventListener) {
        match?.removeEventListener('change', darkHandler)
      }
    }
  }, [dispatch, chainId, tokeninfo])

  return null
}
