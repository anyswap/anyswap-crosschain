import arbitrum from './arbitrum'
import avax from './avax'
import bsc, {BNB_MAIN_CHAINID, BNB_TEST_CHAINID} from './bsc'
import eth, {ETH_MAIN_CHAINID, ETH_TEST_CHAINID} from './eth'
import fsn, {FSN_MAIN_CHAINID} from './fsn'
import ftm, {FTM_MAIN_CHAINID} from './ftm'
import ht, {HT_TEST_CHAINID} from './ht'
import matic from './matic'
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

export const chainList:ConFig = {
  main: [chainInfo[FSN_MAIN_CHAINID], chainInfo[BNB_MAIN_CHAINID], chainInfo[FTM_MAIN_CHAINID], chainInfo[ETH_MAIN_CHAINID]],
  test: [chainInfo[ETH_TEST_CHAINID], chainInfo[BNB_TEST_CHAINID], chainInfo[HT_TEST_CHAINID]]
}