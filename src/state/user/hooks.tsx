
import { useCallback, useMemo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
// import { useDispatch, useSelector } from 'react-redux'
import { useActiveReact } from '../../hooks/useActiveReact'

import { useActiveWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'
import {
  addSerializedToken,
  removeSerializedToken,
  SerializedToken,
  updateUserDarkMode,
  updateUserDeadline,
  // updatePairAddress,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  toggleURLWarning,
  selectNetworkId,
  updateUserBetaMessage,
  starChain,
  starToken,
  addTokenToWallet,
  removeTokenToWallet,
  changeStarTab,
  updateInterfaceMode,
  updateInterfaceBalanceValid
} from './actions'

// import config from '../../config'
// import {ChainId} from '../../config/chainConfig/chainId'

function serializeToken(token: any): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name
  }
}

function deserializeToken(serializedToken: SerializedToken): any {
  return {
    chainId: serializedToken.chainId,
    address: serializedToken.address,
    decimals: serializedToken.decimals,
    symbol: serializedToken.symbol,
    name: serializedToken.name
  }
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useSelector<
    AppState,
    { userDarkMode: boolean | null; matchesDarkMode: boolean }
  >(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode
    }),
    shallowEqual
  )

  // return false
  return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const darkMode = useIsDarkMode()

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }))
  }, [darkMode, dispatch])

  return [darkMode, toggleSetDarkMode]
}

export function useIsExpertMode(): boolean {
  return useSelector<AppState, AppState['user']['userExpertMode']>(state => state.user.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
  }, [expertMode, dispatch])

  return [expertMode, toggleSetExpertMode]
}

export function useInterfaceModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userInterfaceMode = useSelector<AppState, AppState['user']['userInterfaceMode']>(state => state.user.userInterfaceMode)

  const toggleSetInterfaceMode = useCallback(() => {
    dispatch(updateInterfaceMode({ userInterfaceMode: !userInterfaceMode }))
  }, [userInterfaceMode, dispatch])

  return [userInterfaceMode, toggleSetInterfaceMode]
}

export function useInterfaceBalanceValidManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userInterfaceBalanceValid = useSelector<AppState, AppState['user']['userInterfaceBalanceValid']>(state => state.user.userInterfaceBalanceValid)

  const toggleSetInterfaceBalanceValid = useCallback(() => {
    dispatch(updateInterfaceBalanceValid({ userInterfaceBalanceValid: !userInterfaceBalanceValid }))
  }, [userInterfaceBalanceValid, dispatch])

  return [userInterfaceBalanceValid, toggleSetInterfaceBalanceValid]
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>(state => {
    return state.user.userSlippageTolerance
  })

  const setUserSlippageTolerance = useCallback(
    (userSlippageTolerance: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance }))
    },
    [dispatch]
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useBetaMessageManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const showBetaMessage = useSelector<AppState, AppState['user']['showBetaMessage']>(state => {
    return state.user.showBetaMessage
  })

  const dismissBetaMessage = useCallback(
    () => {
      dispatch(updateUserBetaMessage({ showBetaMessage: false }))
    },
    [dispatch]
  )

  return [showBetaMessage, dismissBetaMessage]
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>(state => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: any) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (token: any) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch]
  )
}

export function useUserAddedTokens(): any[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['tokens']>(({ user: { tokens } }) => tokens)

  return useMemo(() => {
    if (!chainId) return []
    return Object.values(serializedTokensMap[chainId] ?? {}).map(deserializeToken)
  }, [serializedTokensMap, chainId])
}

export function useURLWarningVisible(): boolean {
  return useSelector((state: AppState) => state.user.URLWarningVisible)
}

export function useURLWarningToggle(): () => void {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(toggleURLWarning()), [dispatch])
}


export function useUserSelectChainId(): {selectNetworkInfo?:any, setUserSelectNetwork?: (selectChainInfo: any) => void} {
  const dispatch = useDispatch<AppDispatch>()
  const selectNetworkInfo:any = useSelector<AppState, AppState['user']['selectNetworkId']>(state => {
    return state.user.selectNetworkId
  })

  const setUserSelectNetwork = useCallback(
    (selectNetworkInfo: any) => {
      dispatch(selectNetworkId(selectNetworkInfo))
    },
    [dispatch]
  )

  return {
    selectNetworkInfo, setUserSelectNetwork
  }
}


export function useStarChain(): any {
  const { account } = useActiveReact()
  const starChainResult = useSelector((state: AppState) => state.user.starChain)
  const dispatch = useDispatch<AppDispatch>()
  const onChangeStarChain = useCallback(
    (chainId: any) => {
      dispatch(starChain({ account, chainId }))
    },
    [dispatch]
  )
    // console.log(starChainResult)
  return {
    // starChainList: account && starChainResult?.[account] ? starChainResult[account] : (starChainResult?.['all'] ? starChainResult['all'] : {}),
    starChainList: account && starChainResult?.[account] ? starChainResult[account] : {},
    onChangeStarChain
  }
}

export function useStarToken(): any {
  const { chainId } = useActiveReact()
  const starTokenResult = useSelector((state: AppState) => state.user.starToken)
  const dispatch = useDispatch<AppDispatch>()
  const onChangeStarToken = useCallback(
    (token: any) => {
      dispatch(starToken({ chainId, token }))
    },
    [dispatch]
  )
    // console.log(starChainResult)
  return {
    starTokenList: chainId && starTokenResult?.[chainId] ? starTokenResult[chainId] : (starTokenResult?.['all'] ? starTokenResult['all'] : {}),
    onChangeStarToken
  }
}

export function useChangeTokenOnWallet(): any {
  // const { chainId } = useActiveReact()
  const addTokenToWalletResult = useSelector((state: AppState) => state.user.addTokenToWallet)
  const dispatch = useDispatch<AppDispatch>()
  const onAddToken = useCallback(
    (chainId:any, tokenInfo: any) => {
      dispatch(addTokenToWallet({ chainId, tokenInfo }))
    },
    [dispatch]
  )
  const onRemoveToken = useCallback(
    () => {
      dispatch(removeTokenToWallet({}))
    },
    [dispatch]
  )
    // console.log(starChainResult)
  return {
    tokeninfo: addTokenToWalletResult,
    onAddToken,
    onRemoveToken
  }
}

export function useChangeStarTab(type:any): any {
  // const { chainId } = useActiveReact()
  const changeStarTabResult = useSelector((state: AppState) => state.user.changeStarTab)
  const dispatch = useDispatch<AppDispatch>()
  const onChangeStarTab = useCallback(
    (index: any) => {
      dispatch(changeStarTab({ type, index }))
    },
    [dispatch]
  )
  return {
    starTabIndex: changeStarTabResult?.[type] || changeStarTabResult?.[type] === 0 ? changeStarTabResult?.[type] : 1,
    onChangeStarTab
  }
}