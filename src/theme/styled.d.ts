import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  textNav: Color
  textColor: Color
  textColorBold: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  contentBg: Color
  navIconBg: Color
  navBg: Color
  navBg2: Color
  bgColorLinear: Color
  tabBg: Color
  tabActiveBg: Color
  tabColor: Color
  tabActiveColor: Color
  tabBdColor: Color
  tipBg: Color
  tipBorder: Color
  tipColor: Color

  lightPuroleBg: Color
  viewMoreBtn: Color

  selectedBg: Color
  selectedHoverBg: Color

  selectedBorder: Color
  selectedHoverBorder: Color

  selectedBgNo: Color
  selectedHoverBgNo: Color

  selectedBorderNo: Color
  selectedHoverBorderNo: Color

  inputBorder: Color

  selectTextColor: Color

  arrowBg: Color

  swapBg: Color

  chaliceGray: Color
  royalBlue: Color
  placeholderGray: Color
  activeGray: Color

  modalBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // other
  red1: Color
  red2: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  blue1: Color

  moreBtn: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // shadows
    shadow1: string
    shadow2: string
    contentShadow: string
    tableShadow: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
    flexC: FlattenSimpleInterpolation
    flexSC: FlattenSimpleInterpolation
    flexEC: FlattenSimpleInterpolation
    flexBC: FlattenSimpleInterpolation
  }
}
