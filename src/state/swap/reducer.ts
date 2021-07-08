import { createReducer } from '@reduxjs/toolkit'
import { Field, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
    readonly decimals?: number | undefined
    readonly symbol?: string | undefined
    readonly name?: string | undefined
    readonly chainId?:any
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
    readonly decimals?: number | undefined
    readonly symbol?: string | undefined
    readonly name?: string | undefined
    readonly chainId?: any
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
    decimals: undefined,
    symbol: '',
    name: '',
    chainId: undefined,
  },
  [Field.OUTPUT]: {
    currencyId: '',
    decimals: undefined,
    symbol: '',
    name: '',
    chainId: undefined,
  },
  recipient: null
}

export default createReducer<SwapState>(initialState, builder =>
  builder
    .addCase(
      replaceSwapState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId, decimals, symbol, name, chainId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
            decimals: decimals,
            symbol: symbol,
            name: name,
            chainId: chainId,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
            decimals: decimals,
            symbol: symbol,
            name: name,
            chainId: chainId,
          },
          independentField: field,
          typedValue: typedValue,
          recipient
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field, decimals, symbol, name, chainId } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) {
        // 我们需要交换顺序的情况
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: {
            currencyId: currencyId,
            decimals: decimals,
            symbol: symbol,
            name: name,
            chainId: chainId
          },
          [otherField]: { currencyId: state[field].currencyId }
        }
      } else {
        // 正常的情况下
        return {
          ...state,
          [field]: {
            currencyId: currencyId,
            decimals: decimals,
            symbol: symbol,
            name: name,
            chainId: chainId
          }
        }
      }
    })
    .addCase(switchCurrencies, state => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: {
          currencyId: state[Field.OUTPUT].currencyId,
          decimals: state[Field.OUTPUT].decimals,
          symbol: state[Field.OUTPUT].symbol,
          name: state[Field.OUTPUT].name,
          chainId: state[Field.OUTPUT].chainId
        },
        [Field.OUTPUT]: {
          currencyId: state[Field.INPUT].currencyId,
          decimals: state[Field.INPUT].decimals,
          symbol: state[Field.INPUT].symbol,
          name: state[Field.INPUT].name,
          chainId: state[Field.INPUT].chainId
        }
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      // console.log(typedValue)
      return {
        ...state,
        independentField: field,
        typedValue
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
)
