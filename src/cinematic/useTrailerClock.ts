// =======================================================
// CINEMATIC TRAILER CLOCK HOOK
// Timeline management with RAF
// =======================================================

import { useEffect, useRef, useState, useCallback } from "react"

export interface TrailerClock {
  time: number
  playing: boolean
  setPlaying: (playing: boolean) => void
  restart: () => void
  completed: boolean
}

export function useTrailerClock(duration = 32, autoplay = true): TrailerClock {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(autoplay)
  const [completed, setCompleted] = useState(false)
  const last = useRef<number | null>(null)

  useEffect(() => {
    let raf: number

    const loop = (now: number) => {
      if (!playing) {
        last.current = now
        raf = requestAnimationFrame(loop)
        return
      }

      if (last.current == null) last.current = now
      const delta = (now - last.current) / 1000
      last.current = now

      setTime((prev) => {
        const next = prev + delta
        if (next >= duration) {
          setPlaying(false)
          setCompleted(true)
          return duration
        }
        return next
      })

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing, duration])

  const restart = useCallback(() => {
    setTime(0)
    setCompleted(false)
    setPlaying(true)
    last.current = null
  }, [])

  return { time, playing, setPlaying, restart, completed }
}
