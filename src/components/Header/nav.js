import config from '../../config'

export const LinkList = [
  {
    path: '/v2/mergeswap',
    textKey: 'router',
    regex: /\/v2\/mergeswap/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenMerge,
  },
  {
    path: '/pool',
    textKey: 'pool',
    regex: /\/pool/,
    className: 'otherInfo',
    isOutLink: false,
    isView: 1,
    isActive: ['/add', '/remove']
  },
  {
    path: '/router',
    textKey: 'router',
    regex: /\/router/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenRouter
  },
  {
    path: '/bridge',
    textKey: 'bridge',
    regex: /\/bridge/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenBridge
  },
  {
    path: '/swap',
    textKey: 'swap',
    regex: /\/swap/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenRouterTxns
  },
  {
    path: '/nft',
    textKey: 'nftrouter',
    regex: /\/nft/,
    className: 'otherInfo',
    isOutLink: false,
    isView: config.getCurConfigInfo().isOpenNFT,
  },
  // {
  //   path: '/farm',
  //   textKey: 'farms',
  //   regex: '',
  //   className: 'otherInfo',
  //   isOutLink: false,
  //   isView: 1,
  // },
  // {
  //   path: '/dashboard',
  //   textKey: 'dashboard',
  //   regex: /\/dashboard/,
  //   className: 'otherInfo',
  //   isOutLink: false,
  //   isView: 1
  // },
  {
    path: 'https://anyswap.net',
    textKey: 'explorer',
    regex: '',
    className: 'otherInfo',
    isOutLink: true,
    isView: 1,
  },
]