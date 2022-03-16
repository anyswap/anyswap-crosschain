import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import nft from './nft/reducer'
import multicall from './multicall/reducer'
import pools from './pools/reducer'
import wallet from './wallet/reducer'
import rpc from './rpc/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'rpc']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    burn,
    nft,
    multicall,
    lists,
    pools,
    wallet,
    rpc
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
