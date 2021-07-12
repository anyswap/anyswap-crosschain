import { useEffect, useState } from 'react'

// modified from https://usehooks.com/useDebounce/
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // 延迟后更新被取消的值
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 如果值更改，则取消超时(延迟更改或卸载时也是如此)
    // 这就是我们如何防止当值在延迟时间内发生变化时，debdoff值的更新。超时被清除并重新启动。
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
