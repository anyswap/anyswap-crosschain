import Color from 'color'
import { useDarkModeManager } from '../state/user/hooks'
import { useAppState } from '../state/application/hooks'

type Colors = {
  bg2: string
  contentBg: string
  primary1: string
  primary2: string
  primary3: string
  primary4: string
  primary5: string
}

export function useThemeColors(): Colors {
  const [darkMode] = useDarkModeManager()
  const { brandColor, backgroundColorLight, backgroundColorDark, elementsColorLight, elementsColorDark } = useAppState()

  const bg2 = darkMode ? backgroundColorDark || 'rgb(21, 26, 47)' : backgroundColorLight || '#F7F8FA'
  const contentBg = darkMode ? elementsColorDark || '#21263e' : elementsColorLight || '#FFF'

  let primary1 = darkMode ? '#999999' : '#262626'
  let primary2 = darkMode ? '#858585' : '#363636'
  let primary3 = darkMode ? '#737373' : '#474747'
  let primary4 = darkMode ? '#5c5c5c' : '#575757'
  let primary5 = darkMode ? '#474747' : '#6b6b6b'

  if (brandColor) {
    let color = null
    try {
      color = new Color(brandColor)
    } catch (e) {
      try {
        color = new Color(`#${brandColor}`)
      } catch (e) {
        color = new Color(primary1)
      }
    }

    primary1 = color.hex().toString()
    primary2 = color
      .rotate(-1)
      .darken(0.1)
      .toString()
    primary3 = color
      .rotate(-2)
      .darken(0.15)
      .toString()
    primary4 = color
      .rotate(-3)
      .darken(0.2)
      .saturate(0.03)
      .toString()
    primary5 = color
      .rotate(-4)
      .darken(0.3)
      .saturate(0.04)
      .toString()
  }

  return {
    bg2,
    contentBg,
    primary1,
    primary2,
    primary3,
    primary4,
    primary5
  }
}
