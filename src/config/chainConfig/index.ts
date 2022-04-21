import arbitrum, {ARBITRUM_MAIN_CHAINID, ARBITRUM_TEST_CHAINID} from './arbitrum'
import avax, {AVAX_MAIN_CHAINID} from './avax'
import bsc, {BNB_MAIN_CHAINID, BNB_TEST_CHAINID} from './bsc'
import eth, {ETH_MAIN_CHAINID, ETH_TEST_CHAINID, ETH_TEST1_CHAINID} from './eth'
import fsn, {FSN_MAIN_CHAINID} from './fsn'
import ftm, {FTM_MAIN_CHAINID} from './ftm'
import ht, {HT_MAIN_CHAINID, HT_TEST_CHAINID} from './ht'
import matic, {MATIC_MAIN_CHAINID} from './matic'
import xdai, {XDAI_MAIN_CHAINID} from './xdai'
import kcc, {KCC_MAIN_CHAINID} from './kcc'
import okt, {OKT_MAIN_CHAINID} from './okt'
import one, {ONE_MAIN_CHAINID} from './one'
import omgx, {OMGX_TEST_CHAINID} from './omgx'
import optimism, {OPTIMISM_TEST_CHAINID, OPTIMISM_MAIN_CHAINID} from './optimism'
import movr, {MOVR_MAIN_CHAINID} from './movr'
import iotex, {IOTEX_MAIN_CHAINID} from './iotex'
import sdn, {SDN_MAIN_CHAINID} from './sdn'
import ltc, {LTC_MAIN_CHAINID} from './ltc'
import btc, {BTC_MAIN_CHAINID} from './btc'
import block, {BLOCK_MAIN_CHAINID} from './block'
import colx, {COLX_MAIN_CHAINID} from './colx'
import celo, {CELO_MAIN_CHAINID} from './celo'
import cro, {CRO_MAIN_CHAINID} from './cro'
import oeth, {OETH_MAIN_CHAINID} from './oeth'
import tlos, {TLOS_MAIN_CHAINID} from './tlos'
import terra, {TERRA_MAIN_CHAINID} from './terra'
import fuse, {FUSE_MAIN_CHAINID} from './fuse'
import aurora, {AURORA_MAIN_CHAINID} from './aurora'
import sys, {SYS_MAIN_CHAINID} from './sys'
import metis, {METIS_MAIN_CHAINID} from './metis'
import glmr, {GLMR_MAIN_CHAINID} from './moonbeam'
import astar, {ASTAR_MAIN_CHAINID} from './astar'
import rose, {ROSE_MAIN_CHAINID} from './rose'
import vlx, {VLX_MAIN_CHAINID} from './vlx'
import clv, {CLV_MAIN_CHAINID} from'./clv'
import crab, {CRAB_MAIN_CHAINID} from './crab'
import nas, {NAS_MAIN_CHAINID} from './nas'
import xrp, {XRP_MAIN_CHAINID} from './xrp'
import milkada, {MIKO_MAIN_CHAINID} from './milkada'
import rei, {REI_MAIN_CHAINID} from './rei'
import cfx, {CFX_MAIN_CHAINID} from './cfx'
import rbtc, {RBTC_MAIN_CHAINID} from './rbtc'
import jewel, {JEWEL_MAIN_CHAINID} from './jewel'
import btt, {BTT_MAIN_CHAINID} from './btt'

import {VERSION, USE_VERSION, env} from '../constant'

interface ConFig {
  [key: string]: any
}
export const chainInfo:ConFig = {
  ...btt,
  ...jewel,
  ...arbitrum,
  ...avax,
  ...bsc,
  ...eth,
  ...fsn,
  ...ftm,
  ...ht,
  ...matic,
  ...xdai,
  ...kcc,
  ...okt,
  ...one,
  ...ltc,
  ...btc,
  ...block,
  ...omgx,
  ...optimism,
  ...colx,
  ...movr,
  ...iotex,
  ...sdn,
  ...celo,
  ...cro,
  ...oeth,
  ...tlos,
  ...terra,
  ...fuse,
  ...aurora,
  ...sys,
  ...metis,
  ...glmr,
  ...astar,
  ...rose,
  ...vlx,
  ...clv,
  ...crab,
  ...nas,
  ...xrp,
  ...milkada,
  ...rei,
  ...cfx,
  ...rbtc,
}
const allChainList = [
  ETH_MAIN_CHAINID,
  AVAX_MAIN_CHAINID,
  ARBITRUM_MAIN_CHAINID,
  BNB_MAIN_CHAINID,
  FTM_MAIN_CHAINID,
  MATIC_MAIN_CHAINID,
  GLMR_MAIN_CHAINID,
  MOVR_MAIN_CHAINID,
  ONE_MAIN_CHAINID,
  OPTIMISM_MAIN_CHAINID,
  AURORA_MAIN_CHAINID,
  OETH_MAIN_CHAINID,
  CRO_MAIN_CHAINID,
  OKT_MAIN_CHAINID,
  HT_MAIN_CHAINID,
  XDAI_MAIN_CHAINID,
  CELO_MAIN_CHAINID,
  KCC_MAIN_CHAINID,
  FSN_MAIN_CHAINID,
  METIS_MAIN_CHAINID,
  TLOS_MAIN_CHAINID,
  ROSE_MAIN_CHAINID,
  SYS_MAIN_CHAINID,
  IOTEX_MAIN_CHAINID,
  SDN_MAIN_CHAINID,
  FUSE_MAIN_CHAINID,
  ASTAR_MAIN_CHAINID,
  VLX_MAIN_CHAINID,
  CLV_MAIN_CHAINID,
  CRAB_MAIN_CHAINID,
  MIKO_MAIN_CHAINID,
  REI_MAIN_CHAINID,
  CFX_MAIN_CHAINID,
  RBTC_MAIN_CHAINID,
  JEWEL_MAIN_CHAINID,
  BTT_MAIN_CHAINID,
  ETH_TEST1_CHAINID,
  // BNB_TEST_CHAINID,
  ETH_TEST_CHAINID,
]

const useChain:any = {
  [VERSION.V1]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
  ],
  [VERSION.V1_1]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
    MATIC_MAIN_CHAINID,
    AVAX_MAIN_CHAINID,
    HT_MAIN_CHAINID,
    OKT_MAIN_CHAINID,
  ],
  [VERSION.V2]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
    FTM_MAIN_CHAINID,
    MATIC_MAIN_CHAINID
  ],
  [VERSION.V2_1]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
    FTM_MAIN_CHAINID,
    MATIC_MAIN_CHAINID
  ],
  [VERSION.V2_2]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
    FTM_MAIN_CHAINID,
    MATIC_MAIN_CHAINID,
    OKT_MAIN_CHAINID,
    AVAX_MAIN_CHAINID,
    ARBITRUM_MAIN_CHAINID,
    MOVR_MAIN_CHAINID,
  ],
  [VERSION.V2_T1]: [
    ETH_TEST_CHAINID,
    BNB_TEST_CHAINID,
    HT_TEST_CHAINID,
  ],
  [VERSION.V2_T2]: [
    ETH_TEST_CHAINID,
    ARBITRUM_TEST_CHAINID,
    OMGX_TEST_CHAINID,
    OPTIMISM_TEST_CHAINID
  ],
  [VERSION.V2_T3]: [
    ETH_TEST_CHAINID,
    ARBITRUM_TEST_CHAINID,
    OMGX_TEST_CHAINID,
    OPTIMISM_TEST_CHAINID
  ],
  [VERSION.V3]: [
    ETH_MAIN_CHAINID,
    ARBITRUM_MAIN_CHAINID
  ],
  [VERSION.V3_1]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
    ARBITRUM_MAIN_CHAINID
  ],
  [VERSION.V4]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
    FSN_MAIN_CHAINID,
    FTM_MAIN_CHAINID,
    MATIC_MAIN_CHAINID,
    HT_MAIN_CHAINID,
    AVAX_MAIN_CHAINID,
    XDAI_MAIN_CHAINID,
    KCC_MAIN_CHAINID,
    OKT_MAIN_CHAINID,
    ONE_MAIN_CHAINID
  ],
  [VERSION.V4_OKT]: [
    BNB_MAIN_CHAINID,
    OKT_MAIN_CHAINID
  ],
  [VERSION.V4_MOVR]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
    MOVR_MAIN_CHAINID
  ],
  [VERSION.V5]: [...allChainList],
  [VERSION.V6]: [
    FTM_MAIN_CHAINID,
    ETH_TEST_CHAINID
  ],
  [VERSION.V6_1]: [
    ETH_MAIN_CHAINID,
    FTM_MAIN_CHAINID,
    MATIC_MAIN_CHAINID,
    AVAX_MAIN_CHAINID,
  ],
  [VERSION.V7]: [
    ...allChainList,
    BTC_MAIN_CHAINID,
    TERRA_MAIN_CHAINID,
    LTC_MAIN_CHAINID,
    BLOCK_MAIN_CHAINID,
    COLX_MAIN_CHAINID,
    NAS_MAIN_CHAINID,
    XRP_MAIN_CHAINID,
  ],
  ALL_MAIN: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
    FSN_MAIN_CHAINID,
    FTM_MAIN_CHAINID,
    MATIC_MAIN_CHAINID,
    HT_MAIN_CHAINID,
    AVAX_MAIN_CHAINID,
    XDAI_MAIN_CHAINID,
    ARBITRUM_MAIN_CHAINID,
    KCC_MAIN_CHAINID,
    OKT_MAIN_CHAINID,
    ONE_MAIN_CHAINID,
    MOVR_MAIN_CHAINID,
    TERRA_MAIN_CHAINID,
    AURORA_MAIN_CHAINID,
    ASTAR_MAIN_CHAINID,
    NAS_MAIN_CHAINID
  ]
}

const envType:any = env
export const spportChainArr = envType === 'dev' ? useChain['ALL_MAIN'] : useChain[USE_VERSION]