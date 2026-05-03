'use client'
import * as Icons from 'lucide-react'

interface Props { message: string; icon?: string }

export function Toast({ message, icon = 'check' }: Props) {
  const name = icon.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name]
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-[10px] px-[22px] py-[14px] rounded-pill text-white text-[14px] font-semibold font-sans animate-slide-up shadow-md"
      style={{ background: 'var(--kd-onyx)' }}>
      {Icon && <Icon size={18} />}
      {message}
    </div>
  )
}
