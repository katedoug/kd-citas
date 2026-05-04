'use client'
import { useState } from 'react'
import { Search, ChevronRight, CalendarCheck, CheckCircle, XCircle, Timer, History } from 'lucide-react'
import { PageChrome } from './PageChrome'
import { HistoryDetailPopup } from '../HistoryDetailPopup'
import { useApp } from '@/context/AppContext'
import type { HistoryEntry } from '@/lib/types'

function EmptyHistorial() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-20 h-20 rounded-pill bg-kd-lavender flex items-center justify-center text-kd-persian">
        <History size={36} strokeWidth={1.5} />
      </div>
      <div className="font-display font-bold text-[22px] tracking-[-0.01em]">Sin historial aún</div>
      <div className="text-[14px] text-fg2 max-w-[320px] leading-[1.5]">
        Las citas completadas y canceladas aparecerán aquí.
      </div>
    </div>
  )
}

export function HistorialPage() {
  const { completedHistory } = useApp()
  const [q, setQ] = useState('')
  const [openEntry, setOpenEntry] = useState<HistoryEntry | null>(null)

  const total     = completedHistory.length
  const completed = completedHistory.filter(h => h.tag === 'completada').length
  const cancelled = completedHistory.filter(h => h.tag === 'cancelada').length

  const filtered = completedHistory.filter(h =>
    !q || (h.pet + h.owner + h.service).toLowerCase().includes(q.toLowerCase())
  )

  const stats = [
    { label: 'Total registradas', value: String(total),     Icon: CalendarCheck, color: 'var(--kd-persian-blue)' },
    { label: 'Completadas',       value: String(completed), Icon: CheckCircle,   color: '#1F7A4D' },
    { label: 'Canceladas',        value: String(cancelled), Icon: XCircle,       color: '#B3261E' },
    { label: 'Tiempo promedio',   value: total > 0 ? '—' : '—', Icon: Timer,     color: 'var(--kd-persian-blue)' },
  ]

  return (
    <PageChrome title="Historial" subtitle="Citas pasadas de la clínica">
      {openEntry && <HistoryDetailPopup entry={openEntry} onClose={() => setOpenEntry(null)} />}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-[22px]">
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-bg-elevated border border-border rounded-[16px] p-4">
            <div className="w-9 h-9 rounded-[10px] bg-kd-lavender flex items-center justify-center" style={{ color }}>
              <Icon size={18} strokeWidth={1.85} />
            </div>
            <div className="font-display text-[28px] font-bold mt-[10px] tracking-[-0.01em]">{value}</div>
            <div className="text-[12px] text-fg2">{label}</div>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <EmptyHistorial />
      ) : (
        <>
          {/* Search */}
          <div className="flex items-center gap-[10px] bg-bg-elevated border border-border rounded-pill px-4 py-[10px] mb-[18px]">
            <Search size={16} className="text-fg2" />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Busca por mascota, dueño o servicio"
              className="flex-1 border-none outline-none bg-transparent font-sans text-[14px] text-fg1" />
          </div>

          {/* List */}
          <div className="flex flex-col gap-2">
            {filtered.map((h, i) => {
              const isCancel = h.tag === 'cancelada'
              return (
                <div key={i} onClick={() => setOpenEntry(h)}
                  className="bg-bg-elevated border border-border rounded-[14px] p-4 flex flex-col gap-[6px] cursor-pointer transition-shadow"
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-bold text-[16px] tracking-[-0.01em] leading-snug">
                        {h.pet} <span className="text-fg2 text-[13px] font-medium">· {h.breed}</span>
                      </div>
                      <div className="text-[13px] text-fg2 mt-[2px] leading-snug">{h.service} · con {h.owner}</div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[11px] font-bold tracking-[0.06em] uppercase px-[10px] py-[5px] rounded-pill whitespace-nowrap"
                        style={{ background: isCancel ? '#FCE9E7' : '#E5F4EC', color: isCancel ? '#B3261E' : '#1F7A4D' }}>
                        {isCancel ? 'Cancelada' : 'Completada'}
                      </span>
                      <ChevronRight size={16} className="text-fg3 flex-shrink-0" />
                    </div>
                  </div>
                  <div className="text-[12px] text-fg2 font-medium">{h.date}</div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="py-10 text-center text-fg2">Sin resultados para &ldquo;{q}&rdquo;</div>
            )}
          </div>
        </>
      )}
    </PageChrome>
  )
}
