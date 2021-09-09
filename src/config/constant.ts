export const tokenListUrl = 'https://list.htswap.io/tokenList/'
export const bridgeApi = 'https://bridgeapi.anyswap.exchange'
// export const bridgeApi = 'https://l2api.anyswap.exchange'
// export const bridgeApi = 'http://localhost:8107'
// export const bridgeApi = 'http://192.168.19.68:8107'

export enum VERSION {
  V1 = 'UNDERLYING',
  V1_1 = 'UNDERLYINGV2',
  V2 = 'STABLE',
  V2_1 = 'STABLEV2',
  V2_2 = 'STABLEV3',
  V2_T1 = 'STABLE_TEST',
  V2_T2 = 'TEST',
  V2_T3 = 'TESTV2',
  V3 = 'ARB_DEV',
  V3_1 = 'ARB',
  V4 = 'BRIDGE',
  V4_OKT = 'BRIDGE_OKT',
  V4_MOVR = 'BRIDGE_MOVR',
  V5 = 'ALL',
}

export const env:any = 'pro'
// export const env:any = 'dev'

export const version = '0.1.20'
export const timeout = 1000 * 60 * 30

// export const USE_VERSION = VERSION.V1_1
// export const USE_VERSION = VERSION.V3_1
// export const USE_VERSION = VERSION.V2_2
// export const USE_VERSION = VERSION.V4
// export const USE_VERSION = VERSION.V4_OKT
export const USE_VERSION = VERSION.V4_MOVR
// export const USE_VERSION = VERSION.V2_T3
// export const USE_VERSION = VERSION.V5

function initVersion (version:any, configVersion:any) {
  const VERSION = version + '_VERSION'
  const curVersion = localStorage.getItem(VERSION)
  if (curVersion && curVersion !== configVersion) {
    sessionStorage.clear()
    localStorage.clear()
    localStorage.setItem(VERSION, configVersion)
  } else if (!curVersion) {
    localStorage.setItem(VERSION, configVersion)
  }
}
initVersion(USE_VERSION, version)

function formatHiddenCoin (list?:Array<any>) {
  const arr:any = []
  if (list && list.length > 0) {
    for (let str of list) {
      arr.push(str)
      if (str.indexOf('any') !== 0) str = 'any' + str
      arr.push(str)
    }
  }
  // console.log(arr)
  return arr
}
export const controlConfig:any = {
  [VERSION.V1]: {
    bridgeInitDataChain: '56',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '56',
    isOpenRouter: 1,
    isOpenRouterTxns: 0,
    isOpenBridge: 0
  },
  [VERSION.V1_1]: {
    bridgeInitDataChain: '56',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '56',
    isOpenRouter: 1,
    isOpenRouterTxns: env === 'dev' ? 1 : 0,
    isOpenBridge: env === 'dev' ? 1 : 0,
  },
  [VERSION.V2]: {
    bridgeInitDataChain: '56',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '1',
    isOpenRouter: 1,
    isOpenRouterTxns: 0,
    isOpenBridge: 0
  },
  [VERSION.V2_1]: {
    bridgeInitDataChain: '56',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '1',
    isOpenRouter: 1,
    isOpenRouterTxns: 0,
    isOpenBridge: 0
  },
  [VERSION.V2_2]: {
    bridgeInitDataChain: '56',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: env === 'dev' ? '56' : '1',
    isOpenRouter: 1,
    isOpenRouterTxns: env === 'dev' ? 1 : 0,
    isOpenBridge: env === 'dev' ? 1 : 0,
  },
  [VERSION.V2_T1]: {
    bridgeInitDataChain: '256',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '97',
    isOpenRouter: 1,
    isOpenRouterTxns: 0,
    isOpenBridge: 0
  },
  [VERSION.V2_T2]: {
    bridgeInitDataChain: '4',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '97',
    isOpenRouter: 1,
    isOpenRouterTxns: 0,
    isOpenBridge: 0
  },
  [VERSION.V2_T3]: {
    bridgeInitDataChain: '4',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '4',
    isOpenRouter: 1,
    isOpenRouterTxns: 0,
    isOpenBridge: 0
  },
  [VERSION.V3]: {
    bridgeInitDataChain: '56',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '1',
    isOpenRouter: 1,
    isOpenRouterTxns: 0,
    isOpenBridge: 0
  },
  [VERSION.V3_1]: {
    bridgeInitDataChain: '56',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '1',
    isOpenRouter: 1,
    isOpenRouterTxns: 0,
    isOpenBridge: 0
  },
  [VERSION.V4]: {
    bridgeInitDataChain: '',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '56',
    isOpenRouter: 0,
    isOpenRouterTxns: 0,
    isOpenBridge: 1
  },
  [VERSION.V4_OKT]: {
    bridgeInitDataChain: '',
    hiddenCoin: [],
    hiddenChain: [],
    showCoin: [],
    showChain: ['56', '66'],
    initNode: '56',
    isOpenRouter: 0,
    isOpenRouterTxns: 0,
    isOpenBridge: 1
  },
  [VERSION.V4_MOVR]: {
    bridgeInitDataChain: '',
    hiddenCoin: [],
    hiddenChain: [],
    showCoin: [],
    showChain: ['1', '56', '1285'],
    initNode: '1',
    isOpenRouter: 0,
    isOpenRouterTxns: 0,
    isOpenBridge: 1
  },
  [VERSION.V5]: {
    bridgeInitDataChain: '56',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
    showCoin: [],
    showChain: [],
    initNode: '1',
    isOpenRouter: 1,
    isOpenRouterTxns: 0,
    isOpenBridge: 1,
  },
}


export const ENV_NODE_CONFIG = USE_VERSION + '_ENV_NODE_CONFIG'

export const INIT_NODE = controlConfig[USE_VERSION].initNode

export const BASECURRENCY = 'BASECURRENCY'
