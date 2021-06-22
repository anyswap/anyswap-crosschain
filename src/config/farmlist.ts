import {MATIC_MAIN_CHAINID} from './chainConfig/matic'

interface FarmConfig {
  [key: string]: any
}
const config: FarmConfig = {
  'MATIC': {
    chainId: MATIC_MAIN_CHAINID,
    farmToken: '0xB0A3dA261BAD3Df3f3cc3a4A337e7e81f6407c49',
    lpToken: '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6',
    blockNumber: 41143
  }
}
export default config