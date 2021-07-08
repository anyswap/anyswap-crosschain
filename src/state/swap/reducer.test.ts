import { createStore, Store } from 'redux'
import { Field, selectCurrency } from './actions'
import reducer, { SwapState } from './reducer'

describe('swap reducer', () => {
  let store: Store<SwapState>

  beforeEach(() => {
    store = createStore(reducer, {
      [Field.OUTPUT]: {
        currencyId: '',
        decimals: '',
        symbol: '',
        name: ''
      },
      [Field.INPUT]: {
        currencyId: '',
        decimals: '',
        symbol: '',
        name: ''
      },
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null
    })
  })

  describe('selectToken', () => {
    it('changes token', () => {
      store.dispatch(
        selectCurrency({
          field: Field.OUTPUT,
          currencyId: '0x0000',
          decimals: '',
          symbol: '',
          name: ''
        })
      )

      expect(store.getState()).toEqual({
        [Field.OUTPUT]: { currencyId: '0x0000' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '',
        independentField: Field.INPUT,
        recipient: null
      })
    })
  })
})
