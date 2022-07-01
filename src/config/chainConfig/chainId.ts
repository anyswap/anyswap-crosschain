export enum ChainId {
  ARBITRUM = '42161',
  ARBITRUM_TEST = '421611',
  ASTAR = '592',
  AURORA = '1313161554',
  AVAX = '43114',
  AVAX_TEST = '43113',
  BLOCK = 'BLOCK',
  BNB = '56',
  BNB_TEST = '97',
  BAS_TEST = '14000',
  BTC = 'BTC',
  CELO = '42220',
  CLV = '1024',
  COLX = 'COLX',
  CRAB = '44',
  CRO = '25',
  ETH = '1',
  RINKEBY = '4',
  GOERLI = '5',
  FSN = '32659',
  FSN_TEST = '46688',
  FTM = '250',
  FTM_TEST = '4002',
  FUSE = '122',
  HT = '128',
  HT_TEST = '256',
  IOTEX = '4689',
  KCC = '321',
  LTC = 'LTC',
  MATIC = '137',
  MATIC_TEST = '80001',
  METIS = '1088',
  GLMR = '1284',
  MOVR = '1285',
  NAS = 'NAS',
  BOBA = '288',
  OKT = '66',
  OMGX_TEST = '28',
  ONE = '1666600000',
  OPTIMISM = '10',
  OPTIMISM_TEST = '69',
  ROSE = '42262',
  SDN = '336',
  SYS = '57',
  TERRA = 'TERRA',
  TLOS = '40',
  VLX = '106',
  XDAI = '100',
  XRP = 'XRP',
  MIKO = '2001',
  REI = '47805',
  CFX = '1030',
  RBTC = '30',
  JEWEL = '53935',
  BTT = '199',
  EVMOS = '9001',
  RON = '2020',
  ETC = '61',
  GT = '86',
  DOGE = '2000',
  CMP = '256256',
  NEAR = 'NEAR',
  TOMO = '88',
  HOO = '70',
  TT = '108',
  KAVA = '2222',
  KLAY = '8217',
  KAI = '24',
  CUBE = '1818',
}

export const LabelToChain:any = { XRP: '1000005788240', NEAR: '1001313161555' }

export function getLabelToChain (chainId:any) {
  if (chainId && LabelToChain[chainId]) {
    return LabelToChain[chainId]
  }
  return chainId
}