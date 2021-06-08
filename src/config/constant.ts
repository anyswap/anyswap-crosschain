export const tokenListUrl = 'https://list.htswap.io/tokenList/'

export enum VERSION {
  V1 = 'UNDERLYING',
  V2 = 'STABLE',
  V3 = 'ARB_DEV',
}

export const USE_VERSION = VERSION.V2

export const ENV_NODE_CONFIG = USE_VERSION + '_ENV_NODE_CONFIG'

export const INIT_NODE = '1'