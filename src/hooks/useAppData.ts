import { useEffect, useState } from 'react'
import { AppData } from '../state/application/actions'

export default function useAppData(): {
  data: AppData | null
  isLoading: boolean
  error: Error | null
} {
  const [data, setData] = useState<AppData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setError(null)
      setIsLoading(true)

      try {
        setData({
          logo: '',
          copyrightName: 'Your name'
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
