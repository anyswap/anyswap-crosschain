import { useEffect, useState } from 'react'
import { AppData } from '../state/application/actions'
import { useStorageContract } from './useContract'

const parseInfo = (info: string) => {
  const parsed = {
    logo: '',
    copyrightName: ''
  }
  const result = JSON.parse(info)

  if (Object.keys(result)) {
    const { logo, copyrightName } = result

    if (logo) parsed.logo = logo
    if (copyrightName) parsed.copyrightName = copyrightName
  }

  return parsed
}

export default function useAppData(): {
  data: AppData | null
  isLoading: boolean
  error: Error | null
} {
  const [data, setData] = useState<AppData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const storage = useStorageContract(4)

  useEffect(() => {
    const fetchData = async () => {
      if (!storage) return

      setError(null)
      setIsLoading(true)

      try {
        const domain = window.location.hostname || document.location.host
        const { info } = await storage.methods.getData(domain).call()

        setData({
          ...parseInfo(info || '{}')
          // owner
        })
      } catch (error) {
        console.group('%c App data', 'color: red;')
        console.error(error)
        console.groupEnd()
        setError(error)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}
