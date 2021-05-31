import arbitrum from './arbitrum'
import avax from './avax'
import bsc, {BNB_MAIN_CHAINID} from './bsc'
import eth from './eth'
import fsn from './fsn'
import ftm, {FTM_MAIN_CHAINID} from './ftm'
import ht from './ht'
import matic, {MATIC_MAIN_CHAINID} from './matic'
import xdai from './xdai'
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

export const spportChainArr = [
  // ETH_MAIN_CHAINID,
  // ETH_TEST_CHAINID,
  // HT_MAIN_CHAINID,
  // HT_TEST_CHAINID,
  BNB_MAIN_CHAINID,
  // BNB_TEST_CHAINID,
  FTM_MAIN_CHAINID,
  MATIC_MAIN_CHAINID
]