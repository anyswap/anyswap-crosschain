import { useEffect, useState } from 'react'
import { AppData } from '../state/application/actions'
import { getUrlData } from '../utils/tools/axios'
import { useStorageContract } from './useContract'
import config from '../config'
import { ZERO_ADDRESS } from '../constants'
import { getCurrentDomain } from '../utils/url'

const parseInfo = (info: string) => {
  const parsed: AppData = {
    apiAddress: '',
    routerConfigChainId: undefined,
    routerConfigAddress: '',
    serverAdminAddress: '',
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
    appSettings: {
      apiAddress: '',
      serverAdminAddress: '',
      mainConfigChainId: undefined,
      mainConfigAddress: '',
      routerConfigs: {},
      erc20Tokens: {},
      crosschainTokens: {},
      tokenGroups: []
    }
  }
  const result = JSON.parse(info)

  if (Object.keys(result) && result.crossChainSettings) {
    const { crossChainSettings } = result

    const {
      apiAddress,
      routerConfigChainId,
      routerConfigAddress,
      serverAdminAddress,
      logoUrl,
      projectName,
      brandColor,
      backgroundColorLight,
      backgroundColorDark,
      elementsColorLight,
      elementsColorDark,
      socialLinks,
      disableSourceCopyright,
      appSettings,
    } = crossChainSettings

    parsed.appSettings.mainConfigAddress = appSettings?.mainConfigAddress || routerConfigAddress || ''
    parsed.appSettings.mainConfigChainId = appSettings?.mainConfigChainId || routerConfigChainId

    parsed.appSettings.apiAddress = appSettings?.apiAddress || apiAddress || ''
    if (apiAddress) parsed.apiAddress = apiAddress // TODO: remove it in future and use only "appSettings.apiAddress"

    if (serverAdminAddress) parsed.serverAdminAddress = serverAdminAddress
    if (logoUrl) parsed.logo = logoUrl
    if (projectName) parsed.projectName = projectName
    if (brandColor) parsed.brandColor = brandColor
    if (backgroundColorLight) parsed.backgroundColorLight = backgroundColorLight
    if (backgroundColorDark) parsed.backgroundColorDark = backgroundColorDark
    if (elementsColorLight) parsed.elementsColorLight = elementsColorLight
    if (elementsColorDark) parsed.elementsColorDark = elementsColorDark
    if (Array.isArray(socialLinks) && socialLinks.length) parsed.socialLinks = socialLinks
    if (disableSourceCopyright) parsed.disableSourceCopyright = disableSourceCopyright
  }

  return parsed
}

const errorLog = (error: any) => {
  console.group('%c app data', 'color: red;')
  console.error(error)
  console.groupEnd()
}

export default function useAppData(): {
  data: AppData | null
  isLoading: boolean
  error: Error | null
} {
  const [data, setData] = useState<AppData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const storage = useStorageContract(config.STORAGE_CHAIN_ID)

  useEffect(() => {
    const fetchData = async () => {
      if (!storage) return

      setError(null)
      setIsLoading(true)

      let parsed: any
      let data

      try {
        data = await storage.methods.getData(getCurrentDomain()).call()
        parsed = parseInfo(data.info || '{}')
      } catch (error) {
        errorLog(error)
        setError(error)
      }


      if (parsed?.appSettings?.apiAddress) {
        try {
          const response: any = await getUrlData(`${parsed.appSettings.apiAddress}/config`)

          if (response?.msg !== 'Success') {
            parsed.apiAddress = ''
          }
        } catch (error) {
          parsed.apiAddress = ''
          errorLog(error)
          setError(error)
        }
      }


      try {
        const appSettingsJson: string | null = localStorage.getItem('appSettings')
        if (appSettingsJson !== null) {
          const localStorageAppSetting = JSON.parse(appSettingsJson)

          const routerConfigs = {
            ...(Object.keys(localStorageAppSetting?.routerConfigs)?.length && localStorageAppSetting?.routerConfigs),
            ...(Object.keys(parsed?.appSettings?.routerConfigs)?.length && parsed?.appSettings?.routerConfigs)
          }
          const erc20Tokens = {
            ...(Object.keys(localStorageAppSetting?.erc20Tokens)?.length && localStorageAppSetting?.erc20Tokens),
            ...(Object.keys(parsed?.appSettings?.erc20Tokens)?.length && parsed?.appSettings?.erc20Tokens)
          }
          const crosschainTokens = {
            ...(Object.keys(localStorageAppSetting?.crosschainTokens)?.length && localStorageAppSetting?.crosschainTokens),
            ...(Object.keys(parsed?.appSettings?.crosschainTokens)?.length && parsed?.appSettings?.crosschainTokens)
          }
          const tokenGroups = [
            ...(Object.keys(localStorageAppSetting?.tokenGroups)?.length && localStorageAppSetting?.tokenGroups),
            ...(Object.keys(parsed?.appSettings?.tokenGroups)?.length && parsed?.appSettings?.tokenGroups)
          ]

          parsed.appSettings = {
            ...parsed.appSettings,
            routerConfigs,
            erc20Tokens,
            crosschainTokens,
            tokenGroups
          }
        }

      } catch (e) {}


      if (parsed) {
        const { owner } = data

        setData({
          ...parsed,
          owner: owner === ZERO_ADDRESS ? '' : owner
        })
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}
