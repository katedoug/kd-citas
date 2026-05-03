'use client'
import { STATUS_META } from '@/lib/data'
import type { AppointmentStatus } from '@/lib/types'

interface Props { status: AppointmentStatus; dot?: boolean }

export function StatusPill({ status, dot = true }: Props) {
  const m = STATUS_META[status]
  return (
    <span
      style={{ background: m.bg, color: m.color }}
      className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-pill text-[12px] font-semibold leading-none"
    >
      {dot && <span style={{ background: m.dot }} className="w-[6px] h-[6px] rounded-pill" />}
      {m.label}
    </span>
  )
}
