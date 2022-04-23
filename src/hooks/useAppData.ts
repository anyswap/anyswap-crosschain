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
    disableSourceCopyright: false
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
      disableSourceCopyright
    } = crossChainSettings

    if (apiAddress) parsed.apiAddress = apiAddress
    if (routerConfigChainId) parsed.routerConfigChainId = routerConfigChainId
    if (routerConfigAddress) parsed.routerConfigAddress = routerConfigAddress
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

      let parsed
      let data

      try {
        data = await storage.methods.getData(getCurrentDomain()).call()
        parsed = parseInfo(data.info || '{}')
      } catch (error) {
        errorLog(error)
        setError(error)
      }

      if (parsed?.apiAddress) {
        try {
          const response: any = await getUrlData(`${parsed?.apiAddress}/config`)

          if (response?.msg !== 'Success') {
            parsed.apiAddress = ''
          }
        } catch (error) {
          parsed.apiAddress = ''
          errorLog(error)
          setError(error)
        }
      }

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
