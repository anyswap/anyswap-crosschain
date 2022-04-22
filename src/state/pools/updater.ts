import { useCallback } from 'react'
import useInterval from '../../hooks/useInterval'
// import { useDispatch } from 'react-redux'
import { useDispatch } from 'react-redux'
// import axios from 'axios'
// import config from '../../config'
// import { useAppState } from '../../state/application/hooks'
import {poolLiquidity} from './actions'


export default function Updater(): null {
  const dispatch = useDispatch()
  console.log('>>> call state/pools/update')
  // const { apiAddress } = useAppState()
  const getPools = useCallback(() => {
    /*
    axios.get(`${apiAddress}/data/router/pools`).then(res => {
      const {status, data } = res
      if (status === 200) {
        const testData = {
          "1": {
            "0xdac17f958d2ee523a2206206994597c13d831ec7": {
              "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
              "name": "TetherUSD",
              "symbol": "USDT",
              "decimals": 6,
              "anyToken": "0x22648c12acd87912ea1710357b1302c6a4154ebc",
              "liquidity": "9009221334195"
            }
          },
          "56": {
            "0x55d398326f99059ff775485246999027b3197955": {
              "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
              "name": "TetherUSD",
              "symbol": "USDT",
              "decimals": 18,
              "anyToken": "0xedf0c420bc3b92b961c6ec411cc810ca81f5f21a",
              "liquidity": "5756135762036213167560"
            }
          },
          "66": {
            "0x382bb369d343125bfb2117af9c149795c6c65c50": {
              "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
              "name": "USDT",
              "symbol": "USDT",
              "decimals": 18,
              "anyToken": "0x0dcb0cb0120d355cde1ce56040be57add0185baa",
              "liquidity": "8358674931031277832025"
            }
          },
          "128": {
            "0xa71edc38d189767582c38a3145b5873052c3e47a": {
              "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
              "name": "Heco-Peg USDT Token",
              "symbol": "USDT",
              "decimals": 18,
              "anyToken": "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a",
              "liquidity": "2210305595209176178171"
            }
          },
          "137": {
            "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": {
              "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
              "name": "(PoS)TetherUSD",
              "symbol": "USDT",
              "decimals": 6,
              "anyToken": "0xe3eeda11f06a656fcaee19de663e84c7e61d3cac",
              "liquidity": "24406406214"
            }
          },
          "250": {
            "0x049d68029688eabf473097a2fc38ef61633a3c7a": {
              "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
              "name": "FrappedUSDT",
              "symbol": "fUSDT",
              "decimals": 6,
              "anyToken": "0x2823d10da533d9ee873fed7b16f4a962b2b7f181",
              "liquidity": "28719720236637"
            }
          }
        }
        dispatch(poolLiquidity({poolLiquidity: testData}))
      }
    })
    */
    /*
    const testData = {
      "1": {
        "0xdac17f958d2ee523a2206206994597c13d831ec7": {
          "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
          "name": "TetherUSD",
          "symbol": "USDT",
          "decimals": 6,
          "anyToken": "0x22648c12acd87912ea1710357b1302c6a4154ebc",
          "liquidity": "9009221334195"
        }
      },
      "56": {
        "0x55d398326f99059ff775485246999027b3197955": {
          "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
          "name": "TetherUSD",
          "symbol": "USDT",
          "decimals": 18,
          "anyToken": "0xedf0c420bc3b92b961c6ec411cc810ca81f5f21a",
          "liquidity": "5756135762036213167560"
        }
      },
      "97": {
        "0x6e9c98a8a481BF038Ba7e1d669a0086547dd144E": {
          "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
          "name": "TetherUSD",
          "symbol": "USDT",
          "decimals": 8,
          "anyToken": "0xc0c3394781c23faa538a506b3c96fb59c050bed8",
          "liquidity": "5756135762036213167560"
        }
      },
      "66": {
        "0x382bb369d343125bfb2117af9c149795c6c65c50": {
          "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
          "name": "USDT",
          "symbol": "USDT",
          "decimals": 18,
          "anyToken": "0x0dcb0cb0120d355cde1ce56040be57add0185baa",
          "liquidity": "8358674931031277832025"
        }
      },
      "128": {
        "0xa71edc38d189767582c38a3145b5873052c3e47a": {
          "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
          "name": "Heco-Peg USDT Token",
          "symbol": "USDT",
          "decimals": 18,
          "anyToken": "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a",
          "liquidity": "2210305595209176178171"
        }
      },
      "137": {
        "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": {
          "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
          "name": "(PoS)TetherUSD",
          "symbol": "USDT",
          "decimals": 6,
          "anyToken": "0xe3eeda11f06a656fcaee19de663e84c7e61d3cac",
          "liquidity": "24406406214"
        }
      },
      "250": {
        "0x049d68029688eabf473097a2fc38ef61633a3c7a": {
          "logoUrl": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
          "name": "FrappedUSDT",
          "symbol": "fUSDT",
          "decimals": 6,
          "anyToken": "0x2823d10da533d9ee873fed7b16f4a962b2b7f181",
          "liquidity": "28719720236637"
        }
      }
    }
*/
    dispatch(poolLiquidity({poolLiquidity: {}/*testData*/}))
  }, [dispatch])

  useInterval(getPools, 1000 * 30)
  return null
}
