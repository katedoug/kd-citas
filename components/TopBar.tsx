'use client'
import Image from 'next/image'
import { Menu, Clock } from 'lucide-react'
import { FilterTab } from './shared/FilterTab'
import { useApp } from '@/context/AppContext'
import { useClock } from '@/hooks/useClock'

const TABS = [
  { id: 'all',           label: 'Todas' },
  { id: 'por_confirmar', label: 'Por confirmar' },
  { id: 'proxima',       label: 'Próximas' },
  { id: 'completada',    label: 'Completadas' },
]

export function TopBar() {
  const { filter, setFilter, counts, setSidebarOpen } = useApp()
  const time = useClock()
  return (
    <div className="flex items-center gap-4 px-5 py-[14px] bg-kd-white border-b border-border sticky top-0 z-10">
      <button
        onClick={() => setSidebarOpen(true)}
        className="w-11 h-11 rounded-pill border border-border bg-white cursor-pointer relative flex items-center justify-center flex-shrink-0"
      >
        <Menu size={20} style={{ color: 'var(--fg1)' }} />
        <span className="absolute bottom-1 right-1 w-[9px] h-[9px] rounded-pill bg-[#1F7A4D] border-2 border-white" />
      </button>

      <Image src="/logo-kateandoug-wordmark.svg" alt="Kate&Doug" width={90} height={26} className="flex-shrink-0" />

      <div className="flex gap-1 items-center bg-kd-parchment rounded-pill p-1 overflow-auto flex-1 min-w-0 tab-row">
        {TABS.map(t => (
          <FilterTab key={t.id} label={t.label} count={counts[t.id] ?? 0}
            active={filter === t.id} onClick={() => setFilter(t.id)} />
        ))}
      </div>

      <div className="flex items-center gap-[10px] text-fg2 text-[13px] font-medium flex-shrink-0">
        <Clock size={16} />
        <span>{time}</span>
      </div>
    </div>
  )
}
