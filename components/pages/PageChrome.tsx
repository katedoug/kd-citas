'use client'
import { Menu, Clock } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useClock } from '@/hooks/useClock'

interface Props {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function PageChrome({ title, subtitle, action, children }: Props) {
  const { setSidebarOpen } = useApp()
  const time = useClock()
  return (
    <>
      <div className="flex items-center gap-4 px-5 py-[14px] sticky top-0 z-10 border-b border-border"
        style={{ background: 'var(--bg-elevated, var(--kd-white))' }}>
        <button onClick={() => setSidebarOpen(true)}
          className="w-11 h-11 rounded-pill border border-border cursor-pointer flex items-center justify-center text-fg1"
          style={{ background: 'var(--bg-elevated, #fff)' }}>
          <Menu size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-display text-[22px] font-bold tracking-[-0.01em] leading-tight text-fg1">{title}</div>
          {subtitle && <div className="text-[13px] text-fg2 mt-[2px]">{subtitle}</div>}
        </div>
        {action}
        <div className="flex items-center gap-[10px] text-fg2 text-[13px] font-medium flex-shrink-0">
          <Clock size={16} /><span>{time}</span>
        </div>
      </div>
      <div className="scroll-area">
        <div className="px-5 pt-6 pb-20 max-w-[960px] mx-auto">{children}</div>
      </div>
    </>
  )
}
