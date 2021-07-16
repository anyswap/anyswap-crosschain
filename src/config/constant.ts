export const tokenListUrl = 'https://list.htswap.io/tokenList/'
export const bridgeApi = 'https://bridgeapi.anyswap.exchange'
// export const bridgeApi = 'http://localhost:8107'
// export const bridgeApi = 'http://192.168.19.68:8107'

export enum VERSION {
  V1 = 'UNDERLYING',
  V2 = 'STABLE',
  V2_1 = 'STABLEV2',
  V2_2 = 'STABLEV3',
  V2_T1 = 'STABLE_TEST',
  V3 = 'ARB_DEV',
}

export const USE_VERSION = VERSION.V2_2

export const ENV_NODE_CONFIG = USE_VERSION + '_ENV_NODE_CONFIG'

// export const INIT_NODE = '56'
export const INIT_NODE = ((type) => {
  if (type === VERSION.V1) return '56'
  if (type === VERSION.V2) return '1'
  if (type === VERSION.V2_1) return '1'
  if (type === VERSION.V2_T1) return '97'
  if (type === VERSION.V3) return '1'
  return '1'
})(USE_VERSION)
// console.log(INIT_NODE)

export const timeout = 1000 * 60 * 30

export const env = 'pro'

export const version = '0.1.5'