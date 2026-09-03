import { useEffect, useState } from 'react'

const TICK_MS = 10

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0) // milliseconds
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      // callback form, because the next value depends on the previous one
      setElapsed((prev) => prev + TICK_MS)
    }, TICK_MS)

    // React runs this before the next effect and on unmount.
    // Without it the old interval keeps firing forever.
    return () => clearInterval(id)
  }, [isRunning])

  const handleStart = () => setIsRunning(true)
  const handleStop = () => setIsRunning(false)

  const handleReset = () => {
    setIsRunning(false)
    setElapsed(0)
  }

  return { elapsed, isRunning, handleStart, handleStop, handleReset }
}
