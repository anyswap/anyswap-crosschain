import arbitrum, {ARBITRUM_MAIN_CHAINID} from './arbitrum'
import avax from './avax'
import bsc, {BNB_MAIN_CHAINID, BNB_TEST_CHAINID} from './bsc'
import eth, {ETH_MAIN_CHAINID, ETH_TEST_CHAINID} from './eth'
import fsn from './fsn'
import ftm, {FTM_MAIN_CHAINID} from './ftm'
import ht, {HT_MAIN_CHAINID, HT_TEST_CHAINID} from './ht'
import matic, {MATIC_MAIN_CHAINID} from './matic'
import xdai from './xdai'

import {VERSION, USE_VERSION} from '../constant'

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
  ...xdai
}

const useChain = {
  [VERSION.V1]: [
    ETH_MAIN_CHAINID,
    ETH_TEST_CHAINID,
    HT_MAIN_CHAINID,
    HT_TEST_CHAINID,
    BNB_MAIN_CHAINID,
    BNB_TEST_CHAINID,
  ],
  [VERSION.V1_T1]: [
    ETH_TEST_CHAINID,
    HT_TEST_CHAINID,
    BNB_TEST_CHAINID,
  ],
  [VERSION.V2]: [
    ETH_MAIN_CHAINID,
    BNB_MAIN_CHAINID,
    FTM_MAIN_CHAINID,
    MATIC_MAIN_CHAINID
  ],
  [VERSION.V3]: [
    ETH_MAIN_CHAINID,
    ARBITRUM_MAIN_CHAINID
  ]
}

export const spportChainArr = useChain[USE_VERSION]