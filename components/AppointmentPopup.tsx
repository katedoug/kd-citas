'use client'
import * as Icons from 'lucide-react'
import { X, Printer, MessageSquare, DoorOpen, CheckCheck, Check } from 'lucide-react'
import { SERVICES, STATUS_META, fmtTime, fmtDateLong, sameDay, totalDuration, relDayLabel, TODAY } from '@/lib/data'
import { PetAvatar } from './shared/PetAvatar'
import type { Appointment } from '@/lib/types'

interface Props {
  appt: Appointment
  onClose: () => void
  onConfirm: (a: Appointment) => void
  onComplete: (a: Appointment) => void
  onCancel: (a: Appointment) => void
  onMarkArrived: (a: Appointment) => void
  onOpenConsulta: (a: Appointment) => void
}

function MetaRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[icon]
  return (
    <div>
      <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-fg2 flex items-center gap-[6px] mb-[6px]">
        {Icon && <Icon size={13} strokeWidth={2} />}{label}
      </div>
      <div className="flex gap-3 items-center flex-wrap">{children}</div>
    </div>
  )
}

const iconBtn = 'w-11 h-11 rounded-pill border border-border bg-white cursor-pointer flex items-center justify-center text-fg1'
const secBtn  = 'px-5 py-3 rounded-pill border border-border bg-white cursor-pointer font-sans text-[14px] font-semibold text-fg1'

export function AppointmentPopup({ appt, onClose, onConfirm, onCancel, onMarkArrived, onOpenConsulta }: Props) {
  const dur = totalDuration(appt)
  const end = new Date(appt.start.getTime() + dur * 60000)
  const isNew = appt.isNew || appt.status === 'por_confirmar'
  const headerBg = isNew ? '#1F7A4D' : 'var(--kd-prussian-blue)'

  return (
    <div className="fixed inset-0 z-[60] flex justify-center items-center p-6 animate-fade-in"
      style={{ background: 'rgba(3,0,39,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-[min(820px,100%)] max-h-[92vh] bg-kd-white rounded-[24px] flex flex-col animate-sheet-in overflow-hidden shadow-lg"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-[14px] px-[22px] py-[18px] text-white" style={{ background: headerBg }}>
          <button onClick={onClose} className="w-10 h-10 rounded-pill border-none flex items-center justify-center cursor-pointer" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff' }}>
            <X size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-75">
              {isNew ? 'Nueva · Por confirmar' : STATUS_META[appt.status]?.label} · {appt.code}
            </div>
            <div className="font-display font-bold text-[26px] tracking-[-0.01em] mt-[2px]">
              {appt.pet.name} · {appt.owner.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-75">
              {sameDay(appt.start, TODAY) ? 'Hoy' : relDayLabel(appt.start)}
            </div>
            <div className="font-display font-bold text-[26px] tracking-[-0.01em] mt-[2px]">{fmtTime(appt.start)}</div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto detail-body" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 1, background: 'var(--border)' }}>
          {/* Left */}
          <div className="bg-kd-white p-[22px]">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-fg-accent mb-[14px]">Servicios solicitados</div>
            <div className="flex flex-col gap-[10px]">
              {appt.services.map(sid => {
                const s = SERVICES[sid]
                if (!s) return null
                const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon]
                return (
                  <div key={sid} className="flex items-center gap-[14px] p-[14px] rounded-md border border-border" style={{ background: 'var(--kd-parchment-200)' }}>
                    <div className="w-11 h-11 rounded-[12px] bg-kd-lavender text-kd-persian flex items-center justify-center flex-shrink-0">
                      {Icon && <Icon size={22} strokeWidth={1.85} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-semibold">{s.label}</div>
                      {appt.specifics?.[sid] && <div className="text-[13px] text-fg2 mt-[2px]">{appt.specifics[sid]}</div>}
                    </div>
                    <div className="font-mono text-[13px] text-fg2">{s.mins} min</div>
                  </div>
                )
              })}
            </div>
            {appt.note && (
              <>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-fg-accent mt-6 mb-3">Nota del miembro</div>
                <div className="bg-[#FFF8E5] border border-[#F0E0A8] rounded-md p-[14px] flex gap-3 items-start">
                  <Icons.MessageSquareQuote size={20} strokeWidth={1.85} style={{ color: '#7A5A1F', flexShrink: 0, marginTop: 2 }} />
                  <div className="text-[14px] leading-[1.5]">&ldquo;{appt.note}&rdquo;</div>
                </div>
              </>
            )}
          </div>

          {/* Right */}
          <div className="bg-kd-white p-[22px] flex flex-col gap-[14px]">
            <MetaRow icon="PawPrint" label="Mascota">
              <PetAvatar pet={appt.pet} size={36} />
              <div>
                <div className="text-[14px] font-semibold">{appt.pet.name}</div>
                <div className="text-[12px] text-fg2">{appt.pet.species} · {appt.pet.breed}</div>
                <div className="text-[12px] text-fg2">{appt.pet.sex === 'H' ? 'Hembra' : 'Macho'} · {appt.pet.age} · {appt.pet.weight}</div>
              </div>
            </MetaRow>
            <MetaRow icon="User" label="Miembro">
              <div className="text-[14px] font-semibold">{appt.owner.name}</div>
            </MetaRow>
            <MetaRow icon="ShieldCheck" label="Plan">
              <span className="inline-flex items-center gap-[6px] bg-kd-lavender text-kd-persian px-[10px] py-[4px] rounded-pill text-[12px] font-semibold">
                {appt.plan} · Incluido
              </span>
            </MetaRow>
            <MetaRow icon="Clock" label="Horario">
              <div>
                <div className="text-[14px] font-semibold">{fmtTime(appt.start)} – {fmtTime(end)}</div>
                <div className="text-[12px] text-fg2">{dur} min · {fmtDateLong(appt.start)}</div>
              </div>
            </MetaRow>
            {appt.arrivedAt && (
              <MetaRow icon="CheckCircle" label="Llegó">
                <div className="text-[14px] font-semibold">{fmtTime(appt.arrivedAt)}</div>
              </MetaRow>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-[18px] py-[18px] flex gap-[10px] items-center flex-wrap" style={{ background: 'var(--kd-parchment-200)', borderTop: '1px solid var(--border)' }}>
          <button className={iconBtn}><Printer size={18} /></button>
          <button className={iconBtn}><MessageSquare size={18} /></button>
          <button className={secBtn}
            disabled={appt.status === 'cancelada' || appt.status === 'completada'}
            style={{ opacity: appt.status === 'cancelada' || appt.status === 'completada' ? 0.4 : 1 }}
            onClick={() => onCancel(appt)}>
            Reportar problema
          </button>
          <div className="flex-1" />
          {isNew && (
            <button onClick={() => onConfirm(appt)} className="inline-flex items-center gap-2 px-6 py-[14px] rounded-pill border-none text-white text-[15px] font-semibold cursor-pointer shadow-md font-sans"
              style={{ background: '#1F7A4D' }}>
              <Check size={18} />Confirmar cita
            </button>
          )}
          {appt.status === 'proxima' && !appt.arrivedAt && (
            <button onClick={() => onMarkArrived(appt)} className="inline-flex items-center gap-2 px-6 py-[14px] rounded-pill border-none text-white text-[15px] font-semibold cursor-pointer shadow-md font-sans"
              style={{ background: 'var(--kd-persian-blue)' }}>
              <DoorOpen size={18} />Marcar como llegó
            </button>
          )}
          {appt.status === 'proxima' && appt.arrivedAt && (
            <button onClick={() => onOpenConsulta(appt)} className="inline-flex items-center gap-2 px-6 py-[14px] rounded-pill border-none text-white text-[15px] font-semibold cursor-pointer shadow-md font-sans"
              style={{ background: '#1F7A4D' }}>
              <CheckCheck size={18} />Marcar completada
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
