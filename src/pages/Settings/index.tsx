import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import validUrl from 'valid-url'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
// import { useTransactionAdder } from '../../state/transactions/hooks'
import {
  // useAddPopup,
  useAppState
} from '../../state/application/hooks'
import AppBody from '../AppBody'
import { MyBalanceBox } from '../Dashboard/styleds'
import { ButtonPrimary } from '../../components/Button'
import ColorSelector from '../../components/ColorSelector'
import InputPanel from '../../components/InputPanel'
import Toggle from '../../components/Toggle'
import ListFactory from '../../components/ListFactory'
import { callStorage } from '../../utils/storage'
import { STORAGE_METHODS } from '../../constants'
import config from '../../config'

const SettingsWrapper = styled(MyBalanceBox)`
  max-width: 35rem;
  margin: 0 auto;
`

const OptionWrapper = styled.div<{ margin?: number; flex?: boolean }>`
  margin: ${({ margin }) => margin || 0.2}rem 0;
  padding: 0.3rem 0;

  ${({ flex }) => (flex ? 'display: flex; align-items: center; justify-content: space-between' : '')}
`

const Button = styled(ButtonPrimary)`
  max-width: none;
  font-size: 0.8em;
  margin-top: 0.3rem;
`

export default function Settings() {
  const { t } = useTranslation()
  const { account, library } = useActiveWeb3React()
  // const addTransaction = useTransactionAdder()
  // const addPopup = useAddPopup()

  const {
    projectName: stateProjectName,
    logo: stateLogo,
    brandColor: stateBrandColor,
    backgroundColorLight: stateBackgroundColorLight,
    backgroundColorDark: stateBackgroundColorDark,
    elementsColorLight: stateElementsColorLight,
    elementsColorDark: stateElementsColorDark,
    socialLinks: stateSocialLinks,
    disableSourceCopyright: stateDisableSourceCopyright
  } = useAppState()

  const [projectName, setProjectName] = useState(stateProjectName)
  const [logoUrl, setLogoUrl] = useState(stateLogo)
  const [isValidLogo, setIsValidLogo] = useState(Boolean(validUrl.isUri(stateLogo)))

  useEffect(() => {
    if (logoUrl) {
      setIsValidLogo(Boolean(validUrl.isUri(logoUrl)))
    } else {
      setIsValidLogo(true)
    }
  }, [logoUrl])

  const [brandColor, setBrandColor] = useState(stateBrandColor)
  const [backgroundColorLight, setBackgroundColorLight] = useState(stateBackgroundColorLight)
  const [backgroundColorDark, setBackgroundColorDark] = useState(stateBackgroundColorDark)
  const [elementsColorLight, setElementsColorLight] = useState(stateElementsColorLight)
  const [elementsColorDark, setElementsColorDark] = useState(stateElementsColorDark)

  enum ColorType {
    BRAND,
    BACKGROUND_LIGHT,
    BACKGROUND_DARK,
    ELEMENTS_COLOR_LIGHT,
    ELEMENTS_COLOR_DARK
  }

  const updateColor = (value: string, type: ColorType) => {
    switch (type) {
      case ColorType.BRAND:
        setBrandColor(value)
        break
      case ColorType.BACKGROUND_LIGHT:
        setBackgroundColorLight(value)
        break
      case ColorType.BACKGROUND_DARK:
        setBackgroundColorDark(value)
        break
      case ColorType.ELEMENTS_COLOR_LIGHT:
        setElementsColorLight(value)
        break
      case ColorType.ELEMENTS_COLOR_DARK:
        setElementsColorDark(value)
    }
  }

  const [socialLinks, setSocialLinks] = useState<string[]>(stateSocialLinks)
  const [disableSourceCopyright, setDisableSourceCopyright] = useState<boolean>(stateDisableSourceCopyright)

  const currentStrSettings = JSON.stringify({
    projectName: stateProjectName,
    logoUrl: stateLogo,
    brandColor: stateBrandColor,
    backgroundColorLight: stateBackgroundColorLight,
    backgroundColorDark: stateBackgroundColorDark,
    elementsColorLight: stateElementsColorLight,
    elementsColorDark: stateElementsColorDark,
    socialLinks: stateSocialLinks,
    disableSourceCopyright: stateDisableSourceCopyright
  })

  const [settingsChanged, setSettingsChanged] = useState(false)

  useEffect(() => {
    const newStrSettings = JSON.stringify({
      projectName,
      logoUrl,
      brandColor,
      backgroundColorLight,
      backgroundColorDark,
      elementsColorLight,
      elementsColorDark,
      socialLinks,
      disableSourceCopyright
    })

    setSettingsChanged(newStrSettings !== currentStrSettings)
  }, [
    currentStrSettings,
    projectName,
    logoUrl,
    brandColor,
    backgroundColorLight,
    backgroundColorDark,
    elementsColorLight,
    elementsColorDark,
    socialLinks,
    disableSourceCopyright
  ])

  const saveSettings = async () => {
    if (!account || !library?.provider) return

    try {
      const domain = window.location.hostname || document.location.host
      const settings = JSON.stringify({
        projectName,
        logoUrl,
        brandColor,
        backgroundColorLight,
        backgroundColorDark,
        elementsColorLight,
        elementsColorDark,
        socialLinks,
        disableSourceCopyright
      })

      await callStorage({
        provider: library?.provider,
        account,
        storageChainId: config.STORAGE_CHAIN_ID,
        method: STORAGE_METHODS.setData,
        args: [
          domain,
          {
            owner: account,
            info: settings
          }
        ],
        onHash: (hash: string) => {
          console.group('%c Log', 'color: orange; font-size: 14px')
          console.log('hash: ', hash)
          console.groupEnd()
          // addTransaction(
          //   { hash },
          //   {
          //     summary: `Settings saved`
          //   }
          // )
        }
      })
    } catch (error) {
      console.group('%c Log', 'color: orange; font-size: 14px')
      console.log('error: ', error)
      console.groupEnd()
      // addPopup({
      //   error: {
      //     message: error.message,
      //     code: error.code
      //   }
      // })
    }
  }

  return (
    <AppBody>
      <SettingsWrapper>
        <OptionWrapper>
          <InputPanel label={`${t('projectName')}`} value={projectName} onChange={setProjectName} />
        </OptionWrapper>

        <OptionWrapper>
          <InputPanel
            label={`${t('logoUrl')}`}
            value={logoUrl}
            onChange={setLogoUrl}
            error={Boolean(logoUrl) && !isValidLogo}
          />
        </OptionWrapper>

        <OptionWrapper>
          <ListFactory
            title={t('socialLinks')}
            placeholder="https://"
            items={socialLinks}
            setItems={setSocialLinks}
            isValidItem={(address: string) => Boolean(validUrl.isUri(address))}
          />
        </OptionWrapper>

        <OptionWrapper flex>
          {t('disableSourceCopyright')}
          <Toggle isActive={disableSourceCopyright} toggle={() => setDisableSourceCopyright(prevState => !prevState)} />
        </OptionWrapper>

        <OptionWrapper margin={0.5}>
          <ColorSelector
            name={t('primaryColor')}
            defaultColor={stateBrandColor}
            onColor={color => updateColor(color, ColorType.BRAND)}
          />
        </OptionWrapper>

        <OptionWrapper margin={0.5}>
          <h4>{t('backgroundColor')}</h4>
          <ColorSelector
            name={t('light')}
            defaultColor={backgroundColorLight}
            onColor={color => updateColor(color, ColorType.BACKGROUND_LIGHT)}
          />
          <ColorSelector
            name={t('dark')}
            defaultColor={backgroundColorDark}
            onColor={color => updateColor(color, ColorType.BACKGROUND_DARK)}
          />
        </OptionWrapper>

        <OptionWrapper margin={0.5}>
          <h4>{t('elementsColor')}</h4>
          <ColorSelector
            name={t('light')}
            defaultColor={elementsColorLight}
            onColor={color => updateColor(color, ColorType.ELEMENTS_COLOR_LIGHT)}
          />
          <ColorSelector
            name={t('dark')}
            defaultColor={elementsColorDark}
            onColor={color => updateColor(color, ColorType.ELEMENTS_COLOR_DARK)}
          />
        </OptionWrapper>

        <Button onClick={saveSettings} disabled={!settingsChanged || !isValidLogo}>
          {t('saveSettings')}
        </Button>
      </SettingsWrapper>
    </AppBody>
  )
}
