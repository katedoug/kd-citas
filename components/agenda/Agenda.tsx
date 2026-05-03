'use client'
import { TODAY, fmtDateShort, relDayLabel, dayKey, sameDay } from '@/lib/data'
import { ApptCard } from './ApptCard'
import { EmptyState } from './EmptyState'
import type { Appointment } from '@/lib/types'

interface Props {
  appts: Appointment[]
  filter: string
  onOpen: (a: Appointment) => void
  totalCount: number
}

function DayHeader({ date, count }: { date: Date; count: number }) {
  const isToday = sameDay(date, TODAY)
  return (
    <div className="flex items-baseline justify-between px-1 pb-3 gap-3">
      <div className="flex items-baseline gap-3 min-w-0">
        <h2 className="m-0 font-display font-bold text-[24px] tracking-[-0.01em] leading-tight text-fg1">
          {relDayLabel(date)}
        </h2>
        {!isToday && <span className="text-[13px] text-fg2">{fmtDateShort(date)}</span>}
      </div>
      <span className="text-[13px] text-fg2 font-medium">{count} {count === 1 ? 'cita' : 'citas'}</span>
    </div>
  )
}

export function Agenda({ appts, filter, onOpen, totalCount }: Props) {
  const sorted = [...appts].sort((a, b) => a.start.getTime() - b.start.getTime())

  const groups: Record<string, { date: Date; items: Appointment[] }> = {}
  sorted.forEach(a => {
    const k = dayKey(a.start)
    if (!groups[k]) groups[k] = { date: a.start, items: [] }
    groups[k].items.push(a)
  })

  if (sorted.length === 0) {
    return <div className="flex-1 flex flex-col"><EmptyState filter={filter} totalCount={totalCount} /></div>
  }

  const nextId = sorted.find(a => a.status === 'proxima' && sameDay(a.start, TODAY))?.id

  return (
    <div className="px-5 pt-5 pb-20 flex flex-col gap-7">
      {Object.values(groups).map(g => (
        <section key={dayKey(g.date)}>
          <DayHeader date={g.date} count={g.items.length} />
          <div className="appt-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {g.items.map(a => (
              <ApptCard key={a.id} appt={a} onOpen={onOpen} isNext={a.id === nextId && !a.isNew} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
