import { createReducer, nanoid } from '@reduxjs/toolkit'
import {
  addPopup,
  PopupContent,
  removePopup,
  updateBlockNumber,
  ApplicationModal,
  setOpenModal,
  retrieveAppData,
  setAppManagement,
  AppData
} from './actions'

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export type ApplicationState = {
  readonly appManagement: boolean
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
} & AppData

const initialState: ApplicationState = {
  appManagement: false,
  owner: '',
  logo: '',
  projectName: '',
  brandColor: '',
  backgroundColor: '',
  elementsColor: '',
  blockNumber: {},
  popupList: [],
  openModal: null
}

export default createReducer(initialState, builder =>
  builder
    .addCase(retrieveAppData, (state, action) => {
      const data = action.payload

      if (data) {
        const { owner, logo, projectName, brandColor, backgroundColor, elementsColor } = data

        state.owner = owner
        state.logo = logo
        state.projectName = projectName
        state.brandColor = brandColor
        state.backgroundColor = backgroundColor
        state.elementsColor = elementsColor
      }
    })
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(setAppManagement, (state, action) => {
      const { status } = action.payload

      state.appManagement = status
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
)
