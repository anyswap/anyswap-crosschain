import { createReducer, nanoid } from '@reduxjs/toolkit'
import { addPopup, PopupContent, removePopup, updateBlockNumber, ApplicationModal, setOpenModal, viewTxnsDtils, viewTxnsErrorTip } from './actions'

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
  readonly viewTxnsDtils: any
  readonly viewTxnsErrorTip: any
}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: [],
  openModal: null,
  viewTxnsDtils: {
    hash: '',
    isOpenModal: ''
  },
  viewTxnsErrorTip: {
    errorTip: '',
    isOpenModal: ''
  }
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload
    })
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 60 * 1000 * 2 } }) => {
      state.popupList = (key ? state.popupList.filter(popup => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs
        }
      ])
    })
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach(p => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
    .addCase(viewTxnsDtils, (state, { payload: { hash, isOpenModal } }) => {
      state.viewTxnsDtils = {
        hash,
        isOpenModal
      }
    })
    .addCase(viewTxnsErrorTip, (state, { payload: { errorTip, isOpenModal } }) => {
      state.viewTxnsErrorTip = {
        errorTip,
        isOpenModal
      }
    })
)
