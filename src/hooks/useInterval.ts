import { useEffect, useRef } from 'react'

export default function useInterval(callback: () => void, delay: null | number, leading = true) {
  const savedCallback = useRef<() => void>()

  // 记住最新的回调。
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // 设置间隔。
  useEffect(() => {
    function tick() {
      const current = savedCallback.current
      current && current()
    }

    if (delay !== null) {
      if (leading) tick()
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    return undefined
  }, [delay, leading])
}
