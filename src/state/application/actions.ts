import { createAction } from '@reduxjs/toolkit'

export type PopupContent =
  | {
      txn: {
        hash: string
        success: boolean
        summary?: string
      }
    }
  | {
      listUpdate: {
        listUrl: string
        oldList: any
        newList: any
        auto: boolean
      }
    }

export enum ApplicationModal {
  NO_WALLET,
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  DELEGATE,
  VOTE,
  NETWORK,
  NAV_TOP,
  NAV_BOTTOM,
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'application/addPopup'
)
export const removePopup = createAction<{ key: string }>('application/removePopup')

export const viewTxnsDtils = createAction<{ hash: any, isOpenModal: any }>('application/viewTxnsDtils')
export const viewTxnsErrorTip = createAction<{ errorTip: any, isOpenModal: any }>('application/viewTxnsErrorTip')