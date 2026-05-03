'use client'
import { X } from 'lucide-react'
import { SERVICES, fmtTime, relDayLabel } from '@/lib/data'
import type { Appointment } from '@/lib/types'

interface Props {
  appt: Appointment
  onView: () => void
  onDismiss: () => void
  onReject: () => void
}

export function NewAppointmentAlert({ appt, onView, onDismiss, onReject }: Props) {
  const serviceLabel = appt.services.map(sid => SERVICES[sid]?.label).filter(Boolean).join(' · ')

  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center text-white text-center px-8 py-6 animate-new-appt"
      style={{ background: '#1F7A4D' }}>
      <button onClick={onDismiss}
        className="absolute top-6 right-6 w-[52px] h-[52px] rounded-pill border-none flex items-center justify-center cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
        <X size={22} />
      </button>

      <div className="font-display font-extrabold leading-none tracking-[-0.03em] text-balance"
        style={{ fontSize: 'clamp(64px,14vw,128px)' }}>
        {appt.pet.name}
      </div>

      <div className="font-display font-bold tracking-[-0.01em] opacity-92 mt-4"
        style={{ fontSize: 'clamp(22px,4vw,36px)' }}>
        {serviceLabel}
      </div>

      <div className="font-medium opacity-75 mt-3 flex items-center justify-center gap-[10px] flex-wrap"
        style={{ fontSize: 'clamp(15px,1.8vw,20px)' }}>
        <span>{appt.owner.name}</span>
        <span className="opacity-50">·</span>
        <span>{relDayLabel(appt.start)}</span>
        <span className="opacity-50">·</span>
        <span>{fmtTime(appt.start)}</span>
      </div>

      <div className="mt-10 flex gap-3 flex-wrap justify-center">
        <button onClick={onReject}
          className="px-10 py-4 rounded-pill font-sans text-[16px] font-bold cursor-pointer text-white"
          style={{ border: '2px solid rgba(255,255,255,0.4)', background: 'transparent' }}>
          Rechazar
        </button>
        <button onClick={onView}
          className="px-10 py-4 rounded-pill border-none font-sans text-[16px] font-bold cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
          style={{ background: '#fff', color: '#1F7A4D' }}>
          Ver y confirmar
        </button>
      </div>
    </div>
  )
}
