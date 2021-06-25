import { MATIC_MAIN_CHAINID } from './chainConfig/matic'
import { FTM_MAIN_CHAINID } from './chainConfig/ftm'

interface FarmConfig {
  [key: string]: any
}
const config: FarmConfig = {
  'MATIC': {
    chainId: MATIC_MAIN_CHAINID,
    farmToken: '0xB0A3dA261BAD3Df3f3cc3a4A337e7e81f6407c49',
    lpToken: '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6',
    blockNumber: 41143
  },
  'FTM': {
    chainId: FTM_MAIN_CHAINID,
    farmToken: '0xdccd7b567da13a11cde232522be708b2d1a14498',
    lpToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
    blockNumber: 86393
  },
}
export default config