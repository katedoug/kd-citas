'use client'
import * as Icons from 'lucide-react'
import { SERVICES } from '@/lib/data'

interface Props { id: string; size?: 'sm' | 'md' }

export function ServiceChip({ id, size = 'md' }: Props) {
  const s = SERVICES[id]
  if (!s) return null
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon]
  const pad = size === 'sm' ? 'px-[10px] py-[4px]' : 'px-[12px] py-[6px]'
  const fs  = size === 'sm' ? 'text-[12px]' : 'text-[13px]'
  const ic  = size === 'sm' ? 13 : 15
  return (
    <span className={`inline-flex items-center gap-[6px] rounded-pill ${pad} ${fs} font-semibold leading-none bg-kd-lavender text-kd-persian`}>
      {Icon && <Icon size={ic} strokeWidth={1.9} />}
      {s.label}
    </span>
  )
}
