import { createReducer, nanoid } from '@reduxjs/toolkit'
import { ZERO_ADDRESS } from '../../constants'
import {
  addPopup,
  PopupContent,
  removePopup,
  updateBlockNumber,
  ApplicationModal,
  setOpenModal,
  retrieveAppData,
  setAppManagement,
  updateRouterData,
  AppData
} from './actions'

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export type ApplicationState = {
  readonly appManagement: boolean
  readonly routerAddress: { readonly [chainId: number]: string }
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
} & AppData

const initialState: ApplicationState = {
  routerConfigChainId: undefined,
  routerConfigAddress: '',
  appManagement: false,
  owner: '',
  logo: '',
  projectName: '',
  brandColor: '',
  backgroundColorLight: '',
  backgroundColorDark: '',
  elementsColorLight: '',
  elementsColorDark: '',
  socialLinks: [],
  disableSourceCopyright: false,
  routerAddress: {},
  blockNumber: {},
  popupList: [],
  openModal: null
}

export default createReducer(initialState, builder =>
  builder
    .addCase(retrieveAppData, (state, action) => {
      if (action.payload) {
        const {
          routerConfigChainId,
          routerConfigAddress,
          logo,
          projectName,
          brandColor,
          backgroundColorLight,
          backgroundColorDark,
          elementsColorLight,
          elementsColorDark,
          socialLinks,
          disableSourceCopyright
        } = action.payload

        if (routerConfigChainId) state.routerConfigChainId = routerConfigChainId
        if (routerConfigAddress && routerConfigAddress !== ZERO_ADDRESS) state.routerConfigAddress = routerConfigAddress
        if (logo) state.logo = logo
        if (projectName) state.projectName = projectName
        if (brandColor) state.brandColor = brandColor
        if (backgroundColorLight) state.backgroundColorLight = backgroundColorLight
        if (backgroundColorDark) state.backgroundColorDark = backgroundColorDark
        if (elementsColorLight) state.elementsColorLight = elementsColorLight
        if (elementsColorDark) state.elementsColorDark = elementsColorDark
        if (Array.isArray(socialLinks) && socialLinks.length) state.socialLinks = socialLinks
        if (disableSourceCopyright) state.disableSourceCopyright = disableSourceCopyright
      }
    })
    .addCase(updateRouterData, (state, action) => {
      const { chainId, routerAddress } = action.payload

      if (chainId) {
        state.routerAddress[chainId] = routerAddress
      }
    })
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload

      if (typeof state.blockNumber[chainId] !== 'number' || state.blockNumber[chainId] < blockNumber) {
        state.blockNumber[chainId] = blockNumber
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
