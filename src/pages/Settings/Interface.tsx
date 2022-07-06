import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import validUrl from 'valid-url'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import {
  // useAddPopup,
  useAppState
} from '../../state/application/hooks'
import { ButtonPrimary } from '../../components/Button'
import Accordion from '../../components/Accordion'
import ColorSelector from '../../components/ColorSelector'
import InputPanel from '../../components/InputPanel'
import Toggle from '../../components/Toggle'
import ListFactory from '../../components/ListFactory'
import { OptionWrapper } from './index'
import { updateStorageData } from '../../utils/storage'

import styled from 'styled-components'
import { CleanButton, ButtonEdit } from '../../components/Button'
import { RiCloseFill } from 'react-icons/ri'

const TokenIconsHolder = styled.ul`
  margin: 0;
  padding: 0.4rem;
`

const TokenIconRow = styled.li`
  padding: 0.2rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TokenSymbol = styled.div`
  margin: 0;
  padding: 0.4rem;
  width: 20%;
  overflow: hidden;
`

const TokenIcon = styled.a`
  margin: 0;
  padding: 0.4rem;
  width: 60%;
  overflow: hidden;
`

const TokenIconDelete = styled(CleanButton)`
  width: auto;
  padding: 0.3rem;
`

const TokenIconEdit = styled(ButtonEdit)`
  width: auto;
  padding: 0.3rem;
`

export default function Interface() {
  const { t } = useTranslation()
  const { account, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
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
    disableSourceCopyright: stateDisableSourceCopyright,
    tokenIcons: stateTokenIcons
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

  const [tokenIconsList, setTokenIconsList] = useState(stateTokenIcons)

  const currentStrSettings = JSON.stringify({
    projectName: stateProjectName,
    logoUrl: stateLogo,
    brandColor: stateBrandColor,
    backgroundColorLight: stateBackgroundColorLight,
    backgroundColorDark: stateBackgroundColorDark,
    elementsColorLight: stateElementsColorLight,
    elementsColorDark: stateElementsColorDark,
    socialLinks: stateSocialLinks,
    tokenIcons: stateTokenIcons,
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
      await updateStorageData({
        library,
        owner: account,
        data: {
          projectName,
          logoUrl,
          brandColor,
          backgroundColorLight,
          backgroundColorDark,
          elementsColorLight,
          elementsColorDark,
          socialLinks,
          tokenIcons: tokenIconsList,
          disableSourceCopyright
        },
        onHash: (hash: string) => {
          addTransaction(
            { hash },
            {
              summary: `Interface settings are saved`
            }
          )
        }
      })
    } catch (error) {
      console.group('%c storage data', 'color: red;')
      console.error(error)
      console.groupEnd()
      // addPopup({
      //   error: {
      //     message: error.message,
      //     code: error.code
      //   }
      // })
    }
  }


  const [tokenAddEditIconSymbol, setTokenAddEditIconSymbol] = useState(``)
  const [tokenEditSymbolKey, setTokenEditSymbolKey] = useState(``)
  const [tokenAddEditIconLink, setTokenAddEditIconLink] = useState(``)
  const [isEditTokenIcon, setIsEditTokenIcon] = useState(false)
  const [isValidTokenIconLink, setIsValidTokenIconLink] = useState(Boolean(validUrl.isUri(tokenAddEditIconLink)))

  
  useEffect(() => {
    if (tokenAddEditIconLink) {
      setIsValidTokenIconLink(Boolean(validUrl.isUri(tokenAddEditIconLink)))
    } else {
      setIsValidTokenIconLink(false)
    }
  }, [tokenAddEditIconLink])

  const doCancelEditIcon = () => {
    setIsEditTokenIcon(false)
    setTokenAddEditIconSymbol(``)
    setTokenAddEditIconLink(``)
  }

  const tokenIconRemove = (removeTokenKey: string) => {
    if (confirm(t('removeTokenIconConfirm'))) {
      const newTokenIconsList = {}
      Object.keys(tokenIconsList).forEach((tokenKey) => {
        // @ts-ignore
        if (tokenKey !== removeTokenKey) newTokenIconsList[tokenKey] = tokenIconsList[tokenKey]
      })
      setTokenIconsList(newTokenIconsList)
      setSettingsChanged(true)
    }
  }

  const doAddEditIcon = () => {
    if (isEditTokenIcon) {
      const newTokenIconsList = {}
      Object.keys(tokenIconsList).forEach((tokenKey) => {
        // @ts-ignore
        if (tokenKey !== tokenEditSymbolKey) newTokenIconsList[tokenKey] = tokenIconsList[tokenKey]
      })
      setTokenIconsList({
        ...newTokenIconsList,
        [tokenAddEditIconSymbol.toUpperCase()]: tokenAddEditIconLink,
      })
    } else {
      setTokenIconsList({
        ...tokenIconsList,
        [tokenAddEditIconSymbol.toUpperCase()]: tokenAddEditIconLink,
      })
    }
    setTokenAddEditIconSymbol(``)
    setTokenAddEditIconLink(``)
    setIsEditTokenIcon(false)
    setSettingsChanged(true)
  }

  const tokenIconEdit = (tokenKey: string) => {
    setTokenEditSymbolKey(tokenKey)
    setTokenAddEditIconSymbol(tokenKey)
    setTokenAddEditIconLink(tokenIconsList[tokenKey])
    setIsEditTokenIcon(true)
  }

  const formAddEditTokenIcon = (
    <OptionWrapper key={`addTokenForm`}>
      <div>
        <h4>{t((isEditTokenIcon) ? 'tokenIconsEdit' : 'tokenIconsAdd')}</h4>
        <InputPanel
          label={`${t('tokenIconsAddSymbol')}`}
          value={tokenAddEditIconSymbol}
          onChange={setTokenAddEditIconSymbol}
          error={Boolean(tokenAddEditIconSymbol == ``)}
        />
        <InputPanel
          label={`${t('tokenIconsAddIconUrl')}`}
          value={tokenAddEditIconLink}
          error={Boolean(tokenAddEditIconLink == ``) || !isValidTokenIconLink}
          onChange={setTokenAddEditIconLink}
        />
      </div>
      {isEditTokenIcon ? (
        <>
          <ButtonPrimary onClick={doAddEditIcon} disabled={!(tokenAddEditIconSymbol !== `` && isValidTokenIconLink)} fullWidth>
            {t('tokenIconsEditDo')}
          </ButtonPrimary>
          <ButtonPrimary onClick={doCancelEditIcon} fullWidth>
            {t('tokenIconsEditCancel')}
          </ButtonPrimary>
        </>
      ) : (
        <ButtonPrimary onClick={doAddEditIcon} disabled={!(tokenAddEditIconSymbol !== `` && isValidTokenIconLink)} fullWidth>
          {t('tokenIconsAddDo')}
        </ButtonPrimary>
      )}
    </OptionWrapper>
  )

  return (
    <>
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

      <Accordion title={t('colors')} margin="0 0 1rem">
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
      </Accordion>

      <Accordion title={t('tokenIcons')} margin="0 0 1rem">
        {/* @ts-ignore */}
        {!isEditTokenIcon && formAddEditTokenIcon}
        <OptionWrapper>
          <TokenIconsHolder>
            {Object.keys(tokenIconsList).map((tokenKey) => {
              // @ts-ignore
              const tokenIconHref = tokenIconsList[tokenKey]
              if (isEditTokenIcon && tokenEditSymbolKey == tokenKey) return formAddEditTokenIcon
              return (
                <TokenIconRow key={tokenKey}>
                  <TokenSymbol title={tokenKey}>{tokenKey}</TokenSymbol>
                  <TokenIcon href={tokenIconHref} target="_blank">{tokenIconHref}</TokenIcon>
                  <TokenIconDelete type="button" onClick={() => { tokenIconRemove(tokenKey) }}>
                    <RiCloseFill />
                  </TokenIconDelete>
                  <TokenIconEdit onClick={() => { tokenIconEdit(tokenKey) }} />
                </TokenIconRow>
              )
            })}
          </TokenIconsHolder>
        </OptionWrapper>
      </Accordion>

      <ButtonPrimary onClick={saveSettings} disabled={!settingsChanged || !isValidLogo} fullWidth>
        {t('saveSettings')}
      </ButtonPrimary>
    </>
  )
}
