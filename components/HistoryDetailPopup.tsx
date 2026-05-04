'use client'
import { useState } from 'react'
import { X, Pill, ChevronDown, ChevronRight, Clock } from 'lucide-react'
import type { HistoryEntry } from '@/lib/types'
import { useApp } from '@/context/AppContext'

interface Props { entry: HistoryEntry; onClose: () => void }

const sectionLabel = (text: string, color?: string) => (
  <div style={{ color: color ?? 'var(--fg-accent)' }} className="text-[11px] font-bold tracking-[0.14em] uppercase mb-[10px]">{text}</div>
)

function PastEntry({ e }: { e: HistoryEntry }) {
  const [open, setOpen] = useState(false)
  const isCancel = e.tag === 'cancelada'

  return (
    <div className="rounded-[12px] overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-[12px] cursor-pointer text-left"
        style={{ background: 'var(--bg-soft)', border: 'none' }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-[0.06em] uppercase px-[8px] py-[3px] rounded-pill"
              style={{ background: isCancel ? '#FCE9E7' : '#E5F4EC', color: isCancel ? '#B3261E' : '#1F7A4D' }}>
              {isCancel ? 'Cancelada' : 'Completada'}
            </span>
            <span className="text-[13px] font-semibold text-fg1 truncate">{e.service}</span>
          </div>
          <div className="flex items-center gap-1 mt-[4px]">
            <Clock size={11} className="text-fg3 flex-shrink-0" />
            <span className="text-[12px] text-fg2">{e.date}</span>
          </div>
        </div>
        {open
          ? <ChevronDown size={16} className="text-fg3 flex-shrink-0" />
          : <ChevronRight size={16} className="text-fg3 flex-shrink-0" />
        }
      </button>

      {open && (
        <div className="px-4 pb-[14px] pt-[2px] flex flex-col gap-[10px]" style={{ background: 'var(--bg-elevated)' }}>
          {e.diagnostico ? (
            <div>
              <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-fg2 mb-[6px]">Diagnóstico</div>
              <div className="text-[13px] leading-[1.55] whitespace-pre-wrap" style={{ color: 'var(--fg1)' }}>
                {e.diagnostico}
              </div>
            </div>
          ) : (
            <div className="text-[13px] italic text-fg3">
              {isCancel ? 'Cita cancelada — sin información médica.' : 'Sin diagnóstico registrado.'}
            </div>
          )}
          {e.receta && (
            <div>
              <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-fg2 mb-[6px]">Receta</div>
              <div className="flex gap-[8px] items-start text-[13px] leading-[1.55] whitespace-pre-wrap px-3 py-[8px] rounded-[8px]"
                style={{ background: '#FFF8E5', border: '1px solid #F0E0A8', color: 'var(--fg1)' }}>
                <Pill size={14} style={{ color: '#7A5A1F', flexShrink: 0, marginTop: 2 }} />
                <span>{e.receta}</span>
              </div>
            </div>
          )}
          {e.photos && e.photos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {e.photos.map((p, i) => (
                <div key={i} className="w-[64px] h-[64px] rounded-[8px] overflow-hidden" style={{ background: 'var(--kd-parchment-700)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.preview} alt={p.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function HistoryDetailPopup({ entry, onClose }: Props) {
  const { completedHistory } = useApp()
  const isCancel = entry.tag === 'cancelada'
  const headerBg = isCancel ? '#B3261E' : 'var(--kd-prussian-blue)'

  const petHistory = completedHistory.filter(
    h => h.pet === entry.pet && (h.date !== entry.date || h.service !== entry.service)
  )

  return (
    <div className="fixed inset-0 z-[60] flex justify-center items-center p-6 animate-fade-in"
      style={{ background: 'rgba(3,0,39,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-[min(680px,100%)] max-h-[92vh] bg-kd-white rounded-[24px] flex flex-col animate-sheet-in overflow-hidden shadow-lg"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-[14px] px-[22px] py-[18px] text-white" style={{ background: headerBg }}>
          <button onClick={onClose} className="w-10 h-10 rounded-pill border-none flex items-center justify-center cursor-pointer" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff' }}>
            <X size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-75">
              {isCancel ? 'Cancelada' : 'Completada'} · {entry.service}
            </div>
            <div className="font-display font-bold text-[26px] tracking-[-0.01em] mt-[2px]">
              {entry.pet} · {entry.owner}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-75">{entry.breed}</div>
            <div className="text-[14px] font-semibold mt-1 opacity-90">{entry.date}</div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-[22px] flex flex-col gap-[22px]">
          {entry.diagnostico ? (
            <div>
              {sectionLabel('Diagnóstico')}
              <div className="px-[14px] py-3 rounded-[12px] text-[14px] leading-[1.55] whitespace-pre-wrap"
                style={{ background: 'var(--kd-parchment-200)', border: '1px solid var(--border)', color: 'var(--fg1)' }}>
                {entry.diagnostico}
              </div>
            </div>
          ) : !isCancel && (
            <div>
              {sectionLabel('Diagnóstico')}
              <div className="px-[14px] py-3 rounded-[12px] text-[14px] italic text-fg3"
                style={{ background: 'var(--kd-parchment-200)', border: '1px solid var(--border)' }}>
                Sin diagnóstico registrado
              </div>
            </div>
          )}

          {entry.receta && (
            <div>
              {sectionLabel('Receta / Prescripción')}
              <div className="px-[14px] py-3 rounded-[12px] flex gap-[10px] items-start text-[14px] leading-[1.55] whitespace-pre-wrap"
                style={{ background: '#FFF8E5', border: '1px solid #F0E0A8', color: 'var(--fg1)' }}>
                <Pill size={18} style={{ color: '#7A5A1F', flexShrink: 0, marginTop: 1 }} />
                <span>{entry.receta}</span>
              </div>
            </div>
          )}

          {entry.photos && entry.photos.length > 0 && (
            <div>
              {sectionLabel('Fotografías')}
              <div className="grid gap-[10px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))' }}>
                {entry.photos.map((photo, i) => (
                  <div key={i}>
                    <div className="rounded-[10px] overflow-hidden" style={{ aspectRatio: '1/1', background: 'var(--kd-parchment-700)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.preview} alt={photo.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[10px] text-fg2 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">{photo.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isCancel && !entry.diagnostico && (
            <div className="px-4 py-[14px] rounded-[12px] flex gap-[10px] items-center text-[14px]"
              style={{ background: '#FCE9E7', border: '1px solid #F0BAB6', color: '#7A1614' }}>
              <X size={18} className="flex-shrink-0" />
              Esta cita fue cancelada. No hay información médica registrada.
            </div>
          )}

          {/* Historial previo del paciente */}
          <div>
            <div className="flex items-center gap-2 mb-[12px]">
              {sectionLabel(`Historial de ${entry.pet}`)}
              {petHistory.length > 0 && (
                <span className="text-[11px] font-bold px-[8px] py-[3px] rounded-pill -mt-[10px]"
                  style={{ background: 'var(--kd-lavender)', color: 'var(--kd-persian-blue)' }}>
                  {petHistory.length}
                </span>
              )}
            </div>
            {petHistory.length > 0 ? (
              <div className="flex flex-col gap-2">
                {petHistory.map((h, i) => <PastEntry key={i} e={h} />)}
              </div>
            ) : (
              <div className="px-[14px] py-[12px] rounded-[12px] text-[13px] italic text-fg3"
                style={{ background: 'var(--kd-parchment-200)', border: '1px solid var(--border)' }}>
                Esta es la primera visita registrada de {entry.pet}.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-[22px] py-[14px] flex justify-end" style={{ background: 'var(--kd-parchment-200)', borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="px-7 py-3 rounded-pill border border-border bg-white cursor-pointer font-sans text-[14px] font-semibold text-fg1">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
