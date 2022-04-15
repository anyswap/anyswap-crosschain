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

  const [gasPricesFromServer, setGasPricesFromServer] = useState<any>()

  const getGasPricesFromServer = useCallback(
    async (fcd?:any): Promise<void> => {
      if (fcd) {
        const { data } = await axios.get(terraExt.fcd + '/v1/txs/gas_prices', {
          baseURL: fcd,
        })
        // console.log(data)
        setGasPricesFromServer(data)
      }
    }, [])

  useEffect(() => {
    getGasPricesFromServer(terraExt.fcd)
    return (): void => {
      getGasPricesFromServer()
    }
  }, [terraExt.fcd])

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
        const unsignedTx:any = await lcd.tx.create(address, {
          msgs: [msgs],
          feeDenoms,
        })
        gas = unsignedTx?.fee.gas
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
  return new Promise(resolve => {
    const url = `${terraExt.queryTx}${hash}`
    axios.get(url).then(res => {
      const {status, data} = res
      if (status === 200) {
        resolve(data)
      } else {
        resolve('')
      }
    }).catch((err) => {
      console.log(err)
      resolve('')
    })
  })
}