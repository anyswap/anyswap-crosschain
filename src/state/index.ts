import { configureStore } from '@reduxjs/toolkit'
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

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'application']
const middlewares: any[] = []

// if (process.env.NODE_ENV === 'development') {
//   const { createLogger } = require('redux-logger')

//   middlewares.push(
//     createLogger({
//       collapsed: true,
//       diff: true
//     })
//   )
// }

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
    pools
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      thunk: false,
      immutableCheck: false,
      serializableCheck: false
    }),
    save({ states: PERSISTED_KEYS }),
    ...middlewares
  ],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
