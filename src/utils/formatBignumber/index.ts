import invariant from 'tiny-invariant'
import _Big from 'big.js'
import toFormat from 'toformat'
import JSBI from 'jsbi'
import {
  Fraction,
  BigintIsh,
  Rounding,
  parseBigintIsh
} from './fraction'


export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}
export const ZERO = JSBI.BigInt(0)

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
export function validateSolidityTypeInstance(value: JSBI, solidityType: SolidityType): void {
  invariant(JSBI.greaterThanOrEqual(value, ZERO), `${value} is not a ${solidityType}.`)
  invariant(JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]), `${value} is not a ${solidityType}.`)
}

const Big = toFormat(_Big)

const TEN = JSBI.BigInt(10)

export class BigAmount extends Fraction {
  public readonly decimals: number
  public readonly amount: BigintIsh

  public static format(decimals: number, amount:BigintIsh): BigAmount {
    return new BigAmount(decimals, amount)
  }
  
  // amount _must_ be raw, i.e. in the native representation
  protected constructor(decimals: number, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256)

    super(parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(decimals)))
    this.decimals = decimals
    this.amount = amount
  }


  public get raw(): JSBI {
    return this.numerator
  }
  public getAmount(): BigintIsh {
    return this.amount
  }

  public toSignificant(
    significantDigits = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }
}
