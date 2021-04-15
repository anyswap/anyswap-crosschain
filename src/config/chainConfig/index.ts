import arbitrum from './arbitrum'
import avax from './avax'
import bsc from './bsc'
import eth from './eth'
import fsn from './fsn'
import ftm from './ftm'
import ht from './ht'
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
