import {
  MsgSend,
  Coins,
  // MsgExecuteContract,
  StdFee,
  LCDClient,
  // Coin,
  // CreateTxOptions,
} from '@terra-money/terra.js'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import _ from 'lodash'


export enum AssetNativeDenomEnum {
  ukrw = 'ukrw',
  uusd = 'uusd',
  uluna = 'uluna',
  usdr = 'usdr',
  umnt = 'umnt',
}

const terraExt = {
  chainID: "columbus-5",
  fcd: "https://fcd.terra.dev",
  lcd: "https://lcd.terra.dev",
  localterra: false,
  mantle: "https://mantle.terra.dev",
  name: "mainnet",
  walletconnectID: 1
}

export function useTerraSend () {

  const getTerraFeeList = async (
    address:any,
    toAddress:any,
    Unit:any,
    inputAmount:any
  ): Promise<
    {
      denom: AssetNativeDenomEnum
      fee?: StdFee
    }[]
  > => {
    if (terraExt) {
      let gas = 200000
      const gasPricesFromServer:any = await axios.get(terraExt.fcd + '/v1/txs/gas_prices', {
        baseURL: terraExt.fcd,
      })
      // console.log(gasPricesFromServer)
      try {
        const feeDenoms = [AssetNativeDenomEnum.uusd]
        
        const msgs = new MsgSend(
          address,
          toAddress,
          { [Unit]: 	inputAmount?.raw?.toString() }
        )
        const lcd = new LCDClient({
          chainID: terraExt.chainID,
          URL: terraExt.lcd,
          gasPrices: gasPricesFromServer?.data,
        })
        
        // fee + tax
        const unsignedTx = await lcd.tx.create(address, {
          msgs: [msgs],
          feeDenoms,
        })
        gas = unsignedTx.fee.gas
      } catch {
        // gas is just default value
        console.log('error')
      }

      return _.map(AssetNativeDenomEnum, (denom) => {
        const amount = new BigNumber(gasPricesFromServer?.data[denom])
          .multipliedBy(gas)
          .dp(0, BigNumber.ROUND_UP)
          .toString(10)
        const gasFee = new Coins({ [denom]: amount })
        const fee = new StdFee(gas, gasFee)
        return {
          denom,
          fee,
        }
      })
    }
    return []
  }
  return {
    getTerraFeeList
  }
}