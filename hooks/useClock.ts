import { useState, useEffect } from 'react'

function fmt(d: Date): string {
  const h = d.getHours(), m = d.getMinutes()
  const ampm = h < 12 ? 'am' : 'pm'
  const h12 = ((h + 11) % 12) + 1
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function useClock(): string {
  const [time, setTime] = useState(() => fmt(new Date()))

  useEffect(() => {
    const tick = () => setTime(fmt(new Date()))
    const now = new Date()
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      tick()
      interval = setInterval(tick, 60_000)
    }, msUntilNextMinute)

    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [])

  return time
}
