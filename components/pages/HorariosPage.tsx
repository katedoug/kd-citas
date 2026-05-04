'use client'
import { useState, useEffect, useRef } from 'react'
import { CirclePlay, Pause, Clock } from 'lucide-react'
import { PageChrome } from './PageChrome'
import type { ScheduleRow } from '@/lib/types'

const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']

const SCHEDULE_DEV: ScheduleRow[] = [
  { day: 'Lunes',     open: '09:00', close: '20:00', closed: false },
  { day: 'Martes',    open: '09:00', close: '20:00', closed: false },
  { day: 'Miércoles', open: '09:00', close: '20:00', closed: false },
  { day: 'Jueves',    open: '09:00', close: '20:00', closed: false },
  { day: 'Viernes',   open: '09:00', close: '20:00', closed: false },
  { day: 'Sábado',    open: '10:00', close: '15:00', closed: false },
  { day: 'Domingo',   open: '10:00', close: '14:00', closed: true  },
]


function TimeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [h, m] = value.split(':').map(Number)

  const hours = Array.from({ length: 17 }, (_, i) => i + 6)
  const minutes = [0, 15, 30, 45]
  const fmt = (n: number) => String(n).padStart(2, '0')

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectHour = (newH: number) => onChange(`${fmt(newH)}:${fmt(m)}`)
  const selectMinute = (newM: number) => { onChange(`${fmt(h)}:${fmt(newM)}`); setOpen(false) }

  const colItem = (label: string, selected: boolean, onClick: () => void) => (
    <button key={label} onClick={onClick} className="block w-full py-[9px] px-[22px] border-none cursor-pointer text-center font-mono text-[15px] transition-colors"
      style={{ background: selected ? 'var(--kd-persian-blue)' : 'transparent', color: selected ? '#fff' : 'var(--fg1)', fontWeight: selected ? 700 : 400, borderRadius: selected ? 8 : 0 }}>
      {label}
    </button>
  )

  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-[7px] px-[14px] py-2 rounded-[10px] cursor-pointer font-mono text-[14px] font-semibold transition-all"
        style={{ border: `1.5px solid ${open ? 'var(--kd-persian-blue)' : 'var(--border)'}`, background: open ? 'var(--kd-lavender)' : 'var(--bg-elevated, #fff)', color: open ? 'var(--kd-persian-blue)' : 'var(--fg1)' }}>
        <Clock size={14} />{fmt(h)}:{fmt(m)}
      </button>
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-[50] flex overflow-hidden rounded-[14px] border border-border shadow-md animate-fade-in"
          style={{ background: 'var(--kd-white)' }}>
          <div className="max-h-[220px] overflow-y-auto py-[6px] px-1">
            {hours.map(hr => colItem(fmt(hr), hr === h, () => selectHour(hr)))}
          </div>
          <div className="flex items-center px-[2px] text-fg3 font-bold text-[18px] select-none">:</div>
          <div className="py-[6px] px-1">
            {minutes.map(mn => colItem(fmt(mn), mn === m, () => selectMinute(mn)))}
          </div>
        </div>
      )}
    </div>
  )
}

export function HorariosPage() {
  const [schedule, setSchedule] = useState(SCHEDULE_DEV)
  const [pause, setPause] = useState(false)
  const update = (i: number, patch: Partial<ScheduleRow>) =>
    setSchedule(s => s.map((r, idx) => idx === i ? { ...r, ...patch } : r))

  return (
    <PageChrome title="Horario" subtitle="Cuándo aceptas citas en la clínica">
      {/* Pause toggle */}
      <div className="rounded-[16px] p-[18px] mb-[22px] flex items-center gap-[14px] border transition-colors"
        style={{ background: pause ? '#FFF3E0' : 'var(--bg-elevated, #fff)', borderColor: pause ? '#F0C892' : 'var(--border)' }}>
        <div className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0"
          style={{ background: pause ? '#B5651D' : 'var(--kd-lavender)', color: pause ? '#fff' : 'var(--kd-persian-blue)' }}>
          {pause ? <Pause size={22} /> : <CirclePlay size={22} />}
        </div>
        <div className="flex-1">
          <div className="font-display font-bold text-[18px] tracking-[-0.01em]">
            {pause ? 'Citas pausadas' : 'Aceptando citas'}
          </div>
          <div className="text-[13px] text-fg2 mt-[2px]">
            {pause ? 'Los miembros no pueden agendar nuevas citas.' : 'Las citas que ya están confirmadas siguen vigentes.'}
          </div>
        </div>
        <button onClick={() => setPause(p => !p)} className="px-[18px] py-[10px] rounded-pill border-none text-white cursor-pointer font-sans text-[13px] font-semibold"
          style={{ background: pause ? '#1F7A4D' : 'var(--kd-onyx)' }}>
          {pause ? 'Reanudar' : 'Pausar'}
        </button>
      </div>

      <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-fg-accent mb-3">Horario semanal</div>
      <div className="bg-bg-elevated border border-border rounded-[16px] overflow-hidden">
        {schedule.map((row, i) => (
          <div key={row.day} className="grid items-center px-[18px] py-[14px] gap-[14px]"
            style={{ gridTemplateColumns: '110px 1fr auto', borderBottom: i < schedule.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div className="text-[14px] font-semibold">{row.day}</div>
            <div className="flex gap-[10px] items-center">
              {row.closed ? (
                <span className="text-[13px] text-fg2">Cerrado</span>
              ) : (
                <>
                  <TimeSelector value={row.open} onChange={v => update(i, { open: v })} />
                  <span className="text-fg2">—</span>
                  <TimeSelector value={row.close} onChange={v => update(i, { close: v })} />
                </>
              )}
            </div>
            <button onClick={() => update(i, { closed: !row.closed })}
              className="px-3 py-[6px] rounded-pill border cursor-pointer text-[12px] font-semibold font-sans"
              style={{ border: '1px solid var(--border)', background: row.closed ? 'var(--kd-onyx)' : 'transparent', color: row.closed ? '#fff' : 'var(--fg2)' }}>
              {row.closed ? 'Cerrado' : 'Abierto'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-[22px] flex justify-end gap-[10px]">
        <button onClick={() => setSchedule(SCHEDULE_DEV)}
          className="px-[22px] py-3 rounded-pill border border-border bg-transparent cursor-pointer font-sans text-[14px] font-semibold text-fg1">
          Restablecer
        </button>
        <button className="px-[22px] py-3 rounded-pill border-none text-white cursor-pointer font-sans text-[14px] font-semibold"
          style={{ background: 'var(--kd-persian-blue)' }}>
          Guardar cambios
        </button>
      </div>
    </PageChrome>
  )
}
