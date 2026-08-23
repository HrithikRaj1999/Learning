import { useCallback, useState } from 'react'

/**
 * Rating state with a hover preview layered over the committed value.
 * `shown` is what the UI paints; `value` is what you would submit.
 */
export function useRating({ initial = 0, max = 5 } = {}) {
  const [value, setValue] = useState(initial)
  const [preview, setPreview] = useState(null)

  const clamp = useCallback(
    (next) => Math.min(Math.max(next, 0), max),
    [max],
  )

  return {
    max,
    value,
    shown: preview ?? value,
    isPreviewing: preview !== null,
    rate: useCallback((next) => setValue(clamp(next)), [clamp]),
    preview: useCallback((next) => setPreview(clamp(next)), [clamp]),
    clearPreview: useCallback(() => setPreview(null), []),
    reset: useCallback(() => setValue(0), []),
  }
}
