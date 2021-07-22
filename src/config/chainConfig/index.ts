import arbitrum, {ARBITRUM_MAIN_CHAINID} from './arbitrum'
import avax, {AVAX_MAIN_CHAINID} from './avax'
import bsc, {BNB_MAIN_CHAINID, BNB_TEST_CHAINID} from './bsc'
import eth, {ETH_MAIN_CHAINID, ETH_TEST_CHAINID} from './eth'
import fsn, {FSN_MAIN_CHAINID} from './fsn'
import ftm, {FTM_MAIN_CHAINID} from './ftm'
import ht, {HT_MAIN_CHAINID, HT_TEST_CHAINID} from './ht'
import matic, {MATIC_MAIN_CHAINID} from './matic'
import xdai, {XDAI_MAIN_CHAINID} from './xdai'
import kcc, {KCC_MAIN_CHAINID} from './kcc'
import ltc from './ltc'
import btc from './btc'
import block from './block'

import {VERSION, USE_VERSION, env} from '../constant'

interface ConFig {
  [key: string]: any
}
export const chainInfo:ConFig = {
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
  ...ltc,
  ...btc,
  ...block
}

const useChain = {
  [VERSION.V1]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
  ],
  [VERSION.V1_1]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
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
    MATIC_MAIN_CHAINID
  ],
  [VERSION.V2_T1]: [
    ETH_TEST_CHAINID,
    BNB_TEST_CHAINID,
    HT_TEST_CHAINID,
  ],
  [VERSION.V3]: [
    ETH_MAIN_CHAINID,
    ARBITRUM_MAIN_CHAINID
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
    KCC_MAIN_CHAINID
  ]
}

const envType:any = env
export const spportChainArr = envType === 'dev' ? useChain['ALL_MAIN'] : useChain[USE_VERSION]