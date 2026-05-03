'use client'
import * as Icons from 'lucide-react'
import { MessageSquare, ChevronRight } from 'lucide-react'
import { SERVICES, fmtTime, totalDuration } from '@/lib/data'
import { StatusPill } from '../shared/StatusPill'
import type { Appointment } from '@/lib/types'

interface Props {
  appt: Appointment
  onOpen: (a: Appointment) => void
  isNext?: boolean
}

export function ApptCard({ appt, onOpen, isNext = false }: Props) {
  const dur = totalDuration(appt)
  const isNew = appt.isNew

  return (
    <button onClick={() => onOpen(appt)} className="appt-card w-full text-left cursor-pointer rounded-[16px] flex flex-col gap-[10px] font-sans transition-transform"
      style={{
        background: isNew ? '#1F7A4D' : 'var(--kd-white)',
        color: isNew ? '#fff' : 'var(--fg1)',
        border: isNew ? 'none' : '1px solid var(--border)',
        padding: 16,
        boxShadow: isNew ? '0 8px 24px rgba(31,122,77,0.25)' : 'var(--shadow-xs)',
      }}
    >
      {/* Time + duration */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: isNew ? 'rgba(255,255,255,0.85)' : 'var(--fg2)' }}>
            {isNew ? 'Nueva' : isNext ? 'Siguiente' : appt.code}
          </div>
          <div className="font-display font-bold text-[22px] leading-tight tracking-[-0.01em] mt-1">
            {fmtTime(appt.start)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: isNew ? 'rgba(255,255,255,0.85)' : 'var(--fg2)' }}>
            Duración
          </div>
          <div className="font-display font-bold text-[22px] leading-tight tracking-[-0.01em] mt-1">
            {dur}<span className="text-[14px] font-medium opacity-70">m</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: isNew ? 'rgba(255,255,255,0.2)' : 'var(--border)' }} />

      {/* Pet */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-[26px] leading-[1.05] tracking-[-0.015em] overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ color: isNew ? '#fff' : 'var(--fg1)' }}>
            {appt.pet.name}
          </div>
          <div className="text-[13px] mt-1 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ color: isNew ? 'rgba(255,255,255,0.85)' : 'var(--fg2)' }}>
            {appt.pet.species} · {appt.pet.breed}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="flex flex-wrap gap-[6px]">
        {appt.services.map(sid => {
          const s = SERVICES[sid]
          if (!s) return null
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon]
          return (
            <span key={sid} className="inline-flex items-center gap-[5px] px-[10px] py-[5px] rounded-pill text-[12px] font-semibold leading-none"
              style={{
                background: isNew ? 'rgba(255,255,255,0.18)' : 'var(--kd-lavender)',
                color: isNew ? '#fff' : 'var(--kd-persian-blue)',
              }}>
              {Icon && <Icon size={13} strokeWidth={2} />}
              {s.label}
            </span>
          )
        })}
      </div>

      {/* Note */}
      {appt.note && (
        <div className="rounded-[10px] px-3 py-2 flex gap-2 items-start"
          style={{ background: isNew ? 'rgba(255,255,255,0.12)' : 'var(--kd-parchment)' }}>
          <MessageSquare size={13} className="mt-[2px] flex-shrink-0"
            style={{ color: isNew ? 'rgba(255,255,255,0.9)' : 'var(--fg2)' }} strokeWidth={2} />
          <span className="text-[12px] leading-[1.4]"
            style={{ color: isNew ? 'rgba(255,255,255,0.95)' : 'var(--fg2)' }}>
            {appt.note}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-[2px]">
        <div className="text-[12px]" style={{ color: isNew ? 'rgba(255,255,255,0.85)' : 'var(--fg2)' }}>
          con <strong style={{ color: isNew ? '#fff' : 'var(--fg1)', fontWeight: 600 }}>{appt.owner.name}</strong>
        </div>
        {isNew ? (
          <div className="inline-flex items-center gap-[6px] text-[13px] font-semibold">
            Tocar para confirmar <ChevronRight size={14} />
          </div>
        ) : (
          <StatusPill status={appt.status} />
        )}
      </div>
    </button>
  )
}
