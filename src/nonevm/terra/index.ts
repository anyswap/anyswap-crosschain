import {useState, useEffect, useCallback} from 'react'
import {
  MsgSend,
  Coins,
  // MsgExecuteContract,
  Fee,
  LCDClient,
  Coin,
  // CreateTxOptions,
} from '@terra-money/terra.js'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import currency from './currency'
import { useActiveReact } from '../../hooks/useActiveReact'
import { ChainId } from '../../config/chainConfig/chainId'


export enum AssetNativeDenomEnum {
  ukrw = 'ukrw',
  uusd = 'uusd',
  uluna = 'uluna',
  usdr = 'usdr',
  umnt = 'umnt',
}

export const terraExt = {
  chainID: "columbus-5",
  fcd: "https://fcd.terra.dev",
  lcd: "https://lcd.terra.dev",
  localterra: false,
  mantle: "https://mantle.terra.dev",
  name: "mainnet",
  walletconnectID: 1,
  queryTx: 'https://fcd.terra.dev/txs/'
}


// export const terraExt = {
//   chainID: "bombay-12",
//   fcd: "https://bombay-fcd.terra.dev",
//   lcd: "https://bombay-lcd.terra.dev",
//   localterra: false,
//   mantle: "https://bombay-mantle.terra.dev",
//   name: "testnet",
//   walletconnectID: 0,
//   queryTx: 'https://bombay-fcd.terra.dev/v1/tx/'
// }

const isNativeTerra = (str: string): boolean =>
  str.startsWith('u') &&
  currency.currencies.includes(str.slice(1).toUpperCase())

export function useTerraSend () {
  const {chainId} = useActiveReact()
  const [gasPricesFromServer, setGasPricesFromServer] = useState<any>()

  const getGasPricesFromServer = useCallback(
    async (fcd?:any): Promise<void> => {
      if (fcd && chainId === ChainId.TERRA) {
        const { data } = await axios.get(terraExt.fcd + '/v1/txs/gas_prices', {
          baseURL: fcd,
        })
        // console.log(data)
        setGasPricesFromServer(data)
      }
    }, [chainId])

  useEffect(() => {
    getGasPricesFromServer(terraExt.fcd)
    return (): void => {
      getGasPricesFromServer()
    }
  }, [terraExt.fcd, chainId])

  const getTerraSendTax = async (props: {
    denom: AssetNativeDenomEnum
    amount: string
    feeDenom: string
  }): Promise<Coin | undefined> => {
    const { denom, amount, feeDenom: _feeDenom } = props
    if (terraExt && denom && amount) {
      const lcd = new LCDClient({
        chainID: terraExt.chainID,
        URL: terraExt.lcd,
        gasPrices: { [_feeDenom]: gasPricesFromServer[_feeDenom] },
      })
      // tax
      // console.log(denom)
      // console.log(isNativeTerra(denom))
      return isNativeTerra(denom)
        ? lcd.utils.calculateTax(new Coin(denom, amount))
        : new Coin(_feeDenom, 0)
    }
    return undefined
  }

  const getTerraFeeList = async (
    address:any,
    toAddress:any,
    Unit:any,
    inputAmount:any
  ): Promise<
    {
      denom: AssetNativeDenomEnum
      fee?: Fee
      tax?: any
    }[]
  > => {
    if (terraExt && inputAmount && address && toAddress && Unit) {
      let gas = 200000
      const tax = await getTerraSendTax({denom: Unit, amount: inputAmount, feeDenom: Unit})
      // const tax = await getTerraSendTax({denom: Unit, amount: inputAmount, feeDenom: AssetNativeDenomEnum.uusd})
      try {
        const feeDenoms = [AssetNativeDenomEnum.uluna]

        const msgs = new MsgSend(
          address,
          toAddress,
          { [Unit]: 	inputAmount }
        )
        // console.log(msgs)
        const lcd = new LCDClient({
          chainID: terraExt.chainID,
          URL: terraExt.lcd,
          gasPrices: gasPricesFromServer,
        })
        // fee + tax
        // console.log(address)
        // console.log(msgs)
        // console.log(feeDenoms)
        // debugger
        const unsignedTx:any = await lcd.tx.create(address, {
          msgs: [msgs],
          feeDenoms,
        })
        gas = unsignedTx?.fee.gas
        console.log(unsignedTx)
        // debugger
      } catch (err) {
        // gas is just default value
        console.log('error')
        console.log(err)
      }

      return _.map(AssetNativeDenomEnum, (denom) => {
        const amount = new BigNumber(gasPricesFromServer[denom])
          .multipliedBy(gas)
          .dp(0, BigNumber.ROUND_UP)
          .toString(10)
        const gasFee = new Coins({ [denom]: amount })
        const fee = new Fee(gas, gasFee)
        return {
          denom,
          fee,
          tax
        }
      })
    }
    return []
  }
  return {
    getTerraFeeList
  }
}

export function updateTerraHash (hash:any): Promise<any> {
  const data:any = {
    msg: 'Error',
    info: ''
  }
  return new Promise(resolve => {
    const url = `${terraExt.queryTx}${hash}`
    fetch(url).then(res => res.json()).then(json => {
      console.log(json)
      if (json) {
        if (json.error || json.code) {
          data.msg = 'Failure'
          data.error = 'Txns is failure!'
        } else {
          data.msg = 'Success'
          data.info = json
        }
      } else {
        data.msg = 'Null'
        data.error = 'Query is empty!'
      }
      resolve(data)
    })
  })
}

// updateTerraHash('0D27A684885992D3F13BFB52B9DCF1D612C130001E5CD659A4E79A2BBC428A07').then(res => {
//   console.log(res)
// })