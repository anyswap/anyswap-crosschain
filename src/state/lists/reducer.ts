import { createReducer } from '@reduxjs/toolkit'
import { DEFAULT_LIST_OF_LISTS, DEFAULT_TOKEN_LIST_URL } from '../../constants/lists'
// import { updateVersion } from '../global/actions'
import { mergeTokenList, userSelectCurrency,updateTokenlistTime } from './actions'

// import config from '../../config'

export interface ListsState {
  // readonly byUrl: {
  //   readonly [url: string]: {
  //     readonly current: TokenList | null
  //     readonly pendingUpdate: TokenList | null
  //     readonly loadingRequestId: string | null
  //     readonly error: string | null
  //   }
  // }
  // this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
  readonly lastInitializedDefaultListOfLists?: string[]
  readonly selectedListUrl: string | undefined
  readonly mergeTokenList: any
  readonly updateTokenlistTime: any
  readonly userSelectCurrency: {
    readonly [chainId: string]: {
      readonly token: string | null
      readonly toChainId: string | null
      readonly tokenKey: string | null
    }
  }
}

// type ListState = ListsState['byUrl'][string]

// const NEW_LIST_STATE: ListState = {
//   error: null,
//   current: null,
//   loadingRequestId: null,
//   pendingUpdate: null
// }

// type Mutable<T> = { -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P] }

const initialState: ListsState = {
  lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
  // byUrl: {
  //   ...DEFAULT_LIST_OF_LISTS.reduce<Mutable<ListsState['byUrl']>>((memo, listUrl) => {
  //     memo[listUrl] = NEW_LIST_STATE
  //     return memo
  //   }, {})
  // },
  selectedListUrl: DEFAULT_TOKEN_LIST_URL,
  mergeTokenList: {},
  updateTokenlistTime: '',
  userSelectCurrency: {},
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateTokenlistTime, (state, { payload: {  } }) => {
      state.updateTokenlistTime = Date.now()
    })
    .addCase(mergeTokenList, (state, { payload: { chainId, tokenList, version } }) => {
      // console.log(state)
      if (state && state.mergeTokenList) {
        // console.log(111)
        // state.mergeTokenList[chainId] = {tokenList, timestamp: Date.now()}
        state.mergeTokenList = {
          // ...(state.mergeTokenList ? state.mergeTokenList : {}),
          [chainId]: {tokenList, timestamp: Date.now(), version}
        }
        // console.log(state.mergeTokenList)
      } else {
        // console.log(222)
        state.mergeTokenList = {
          [chainId]: {tokenList, timestamp: Date.now(), version}
        }
      }
    })
    .addCase(userSelectCurrency, (state, { payload: { chainId, token, toChainId, tokenKey } }) => {
      // console.log(state)
      if (chainId) {
        if (!state.userSelectCurrency) state.userSelectCurrency = {}
        if (!state.userSelectCurrency[chainId]) state.userSelectCurrency[chainId] = {
          token: '',
          toChainId: '',
          tokenKey: '',
        }
        // console.log(state.userSelectCurrency[chainId])
        // console.log(token)
        // console.log(toChainId)
        if (token) {
          state.userSelectCurrency[chainId].token = token
        }
        if (toChainId) {
          state.userSelectCurrency[chainId].toChainId = toChainId
        }
        if (tokenKey) {
          state.userSelectCurrency[chainId].tokenKey = tokenKey
        }
      }
    })
    // .addCase(fetchTokenList.pending, (state, { payload: { requestId, url } }) => {
    //   state.byUrl[url] = {
    //     current: null,
    //     pendingUpdate: null,
    //     ...state.byUrl[url],
    //     loadingRequestId: requestId,
    //     error: null
    //   }
    // })
    // .addCase(fetchTokenList.fulfilled, (state, { payload: { requestId, tokenList, url } }) => {
    // .addCase(fetchTokenList.fulfilled, (state, { payload: { tokenList, url } }) => {
    //   if (tokenList && tokenList.tokens && tokenList.tokens.length > 0) {
    //     // tokenList.tokens.unshift(...config.tokenList.tokens)
    //     const tlArr:Array<string> = []
    //     for (const obj of tokenList.tokens) {
    //       if (!tlArr.includes(obj.address)) {
    //         tlArr.push(obj.address)
    //       }
    //     }
    //     for (const obj of config.tokenList.tokens) {
    //       if (!tlArr.includes(obj.address)) {
    //         tokenList.tokens.unshift(obj)
    //       }
    //     }
    //   } else {
    //     tokenList = config.tokenList
    //   }
    //   // console.log(tokenList)
    //   state.byUrl[url] = {
    //     ...state.byUrl[url],
    //     loadingRequestId: null,
    //     error: null,
    //     current: tokenList,
    //     pendingUpdate: null
    //   }
    // })
    // .addCase(fetchTokenList.rejected, (state, { payload: { url, requestId, errorMessage } }) => {
    // .addCase(fetchTokenList.rejected, (state, { payload: { url } }) => {
    //   state.byUrl[url] = {
    //     ...state.byUrl[url],
    //     loadingRequestId: null,
    //     error: null,
    //     current: config.tokenList,
    //     pendingUpdate: null
    //   }
    // })
    // .addCase(selectList, (state, { payload: url }) => {
    //   state.selectedListUrl = url
    //   // automatically adds list
    //   if (!state.byUrl[url]) {
    //     state.byUrl[url] = NEW_LIST_STATE
    //   }
    // })
    // .addCase(addList, (state, { payload: url }) => {
    //   if (!state.byUrl[url]) {
    //     state.byUrl[url] = NEW_LIST_STATE
    //   }
    // })
    // .addCase(removeList, (state, { payload: url }) => {
    //   if (state.byUrl[url]) {
    //     delete state.byUrl[url]
    //   }
    //   if (state.selectedListUrl === url) {
    //     state.selectedListUrl = url === DEFAULT_TOKEN_LIST_URL ? Object.keys(state.byUrl)[0] : DEFAULT_TOKEN_LIST_URL
    //   }
    // })
    // .addCase(acceptListUpdate, (state, { payload: url }) => {
    //   if (!state.byUrl[url]?.pendingUpdate) {
    //     throw new Error('accept list update called without pending update')
    //   }
    //   state.byUrl[url] = {
    //     ...state.byUrl[url],
    //     pendingUpdate: null,
    //     current: state.byUrl[url].pendingUpdate
    //   }
    // })
    // .addCase(updateVersion, state => {
    //   // 从localStorage加载的状态，但从未初始化新列表
    //   if (!state.lastInitializedDefaultListOfLists) {
    //     state.byUrl = initialState.byUrl
    //     state.selectedListUrl = DEFAULT_TOKEN_LIST_URL
    //   } else if (state.lastInitializedDefaultListOfLists) {
    //     const lastInitializedSet = state.lastInitializedDefaultListOfLists.reduce<Set<string>>(
    //       (s, l) => s.add(l),
    //       new Set()
    //     )
    //     const newListOfListsSet = DEFAULT_LIST_OF_LISTS.reduce<Set<string>>((s, l) => s.add(l), new Set())

    //     DEFAULT_LIST_OF_LISTS.forEach(listUrl => {
    //       if (!lastInitializedSet.has(listUrl)) {
    //         state.byUrl[listUrl] = NEW_LIST_STATE
    //       }
    //     })

    //     state.lastInitializedDefaultListOfLists.forEach(listUrl => {
    //       if (!newListOfListsSet.has(listUrl)) {
    //         delete state.byUrl[listUrl]
    //       }
    //     })
    //   }

    //   state.lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS

    //   if (!state.selectedListUrl) {
    //     state.selectedListUrl = DEFAULT_TOKEN_LIST_URL
    //     if (!state.byUrl[DEFAULT_TOKEN_LIST_URL]) {
    //       state.byUrl[DEFAULT_TOKEN_LIST_URL] = NEW_LIST_STATE
    //     }
    //   }
    // })
)
