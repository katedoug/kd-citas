'use client'
import { useState, useRef, useCallback } from 'react'
import { X, Printer, MessageSquare, CheckCheck, ImagePlus } from 'lucide-react'
import { fmtTime, relDayLabel, sameDay, TODAY } from '@/lib/data'
import type { Appointment, ConsultaData } from '@/lib/types'

interface Props { appt: Appointment; onClose: () => void; onComplete: (a: Appointment, data: ConsultaData) => void }

function Switch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-11 h-[26px] rounded-pill border-none cursor-pointer flex-shrink-0 relative transition-colors"
      style={{ background: value ? '#1F7A4D' : 'var(--kd-parchment-700)' }}>
      <span className="absolute top-[3px] w-5 h-5 rounded-pill bg-white transition-all shadow-sm"
        style={{ left: value ? 21 : 3 }} />
    </button>
  )
}

const sectionLabel = 'text-[11px] font-bold tracking-[0.14em] uppercase text-fg-accent'
const iconBtn = 'w-11 h-11 rounded-pill border border-border bg-white cursor-pointer flex items-center justify-center text-fg1'
const secBtn  = 'px-5 py-3 rounded-pill border border-border bg-white cursor-pointer font-sans text-[14px] font-semibold text-fg1'

export function ConsultaPopup({ appt, onClose, onComplete }: Props) {
  const [diagnostico, setDiagnostico] = useState('')
  const [requiereReceta, setRequiereReceta] = useState(false)
  const [receta, setReceta] = useState('')
  const [agregarFotos, setAgregarFotos] = useState(false)
  const [photos, setPhotos] = useState<{ id: string; name: string; preview: string; progress: number }[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return
    Array.from(fileList).filter(f => /^image\//i.test(f.type) || /\.(heic|heif|jpg|jpeg|png|webp)$/i.test(f.name)).forEach(file => {
      const id = Math.random().toString(36).slice(2)
      const reader = new FileReader()
      reader.onload = e => {
        const preview = e.target?.result as string
        setPhotos(prev => [...prev, { id, name: file.name, preview, progress: 0 }])
        let p = 0
        const tick = setInterval(() => {
          p = Math.min(100, p + Math.random() * 28 + 12)
          setPhotos(prev => prev.map(ph => ph.id === id ? { ...ph, progress: Math.round(p) } : ph))
          if (p >= 100) clearInterval(tick)
        }, 110)
      }
      reader.readAsDataURL(file)
    })
  }, [])

  return (
    <div className="fixed inset-0 z-[64] flex justify-center items-center p-6 animate-fade-in"
      style={{ background: 'rgba(3,0,39,0.55)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-[min(820px,100%)] max-h-[92vh] bg-kd-white rounded-[24px] flex flex-col animate-sheet-in overflow-hidden shadow-lg"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-[14px] px-[22px] py-[18px] text-white" style={{ background: 'var(--kd-prussian-blue)' }}>
          <button onClick={onClose} className="w-10 h-10 rounded-pill border-none flex items-center justify-center cursor-pointer" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff' }}>
            <X size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-75">En consulta · {appt.code}</div>
            <div className="font-display font-bold text-[26px] tracking-[-0.01em] mt-[2px]">{appt.pet.name} · {appt.owner.name}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-75">{sameDay(appt.start, TODAY) ? 'Hoy' : relDayLabel(appt.start)}</div>
            <div className="font-display font-bold text-[26px] tracking-[-0.01em] mt-[2px]">{fmtTime(appt.start)}</div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-[22px] flex flex-col gap-6">
          {/* Diagnóstico */}
          <div>
            <div className={`${sectionLabel} mb-[10px]`}>Diagnóstico</div>
            <textarea value={diagnostico} onChange={e => setDiagnostico(e.target.value)}
              placeholder="Describe los síntomas, observaciones y diagnóstico..."
              rows={4} className="w-full px-[14px] py-3 rounded-[12px] text-[14px] leading-[1.5] font-sans resize-y outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--kd-parchment-200)', color: 'var(--fg1)', boxSizing: 'border-box' }} />
          </div>

          {/* Receta */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: requiereReceta ? 12 : 0 }}>
              <div className={sectionLabel}>Requiere receta</div>
              <Switch value={requiereReceta} onChange={setRequiereReceta} />
            </div>
            {requiereReceta && (
              <textarea value={receta} onChange={e => setReceta(e.target.value)}
                placeholder="Escribe la prescripción, dosis e indicaciones..."
                rows={3} className="w-full px-[14px] py-3 rounded-[12px] text-[14px] leading-[1.5] font-sans resize-y outline-none"
                style={{ border: '1px solid #F0E0A8', background: '#FFF8E5', color: 'var(--fg1)', boxSizing: 'border-box' }} />
            )}
          </div>

          {/* Fotos */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: agregarFotos ? 12 : 0 }}>
              <div className={sectionLabel}>Agregar fotografías</div>
              <Switch value={agregarFotos} onChange={setAgregarFotos} />
            </div>
            {agregarFotos && (
              <div>
                <div onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-[12px] p-[28px_20px] text-center cursor-pointer flex flex-col items-center gap-2 transition-all"
                  style={{ border: `2px dashed ${dragOver ? 'var(--kd-persian-blue)' : 'var(--border)'}`, background: dragOver ? 'var(--kd-lavender)' : 'var(--kd-parchment-200)' }}>
                  <div className="w-11 h-11 rounded-[12px] bg-kd-lavender text-kd-persian flex items-center justify-center">
                    <ImagePlus size={22} strokeWidth={1.85} />
                  </div>
                  <div className="text-[14px] font-semibold">Arrastra fotos aquí o toca para seleccionar</div>
                  <div className="text-[12px] text-fg2">JPG, PNG o HEIC</div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e => addFiles(e.target.files)} />
                {photos.length > 0 && (
                  <div className="mt-3 grid gap-[10px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}>
                    {photos.map(photo => (
                      <div key={photo.id} className="relative">
                        <div className="rounded-[10px] overflow-hidden relative" style={{ aspectRatio: '1/1', background: 'var(--kd-parchment-700)' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo.preview} alt={photo.name} className="w-full h-full object-cover" />
                          {photo.progress < 100 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[6px] px-3" style={{ background: 'rgba(3,0,39,0.52)' }}>
                              <div className="w-full h-1 rounded-pill overflow-hidden" style={{ background: 'rgba(255,255,255,0.25)' }}>
                                <div className="h-full rounded-pill bg-white transition-[width]" style={{ width: `${photo.progress}%` }} />
                              </div>
                              <div className="text-white text-[11px] font-semibold">{photo.progress}%</div>
                            </div>
                          )}
                        </div>
                        <button onClick={() => setPhotos(p => p.filter(x => x.id !== photo.id))}
                          className="absolute -top-[6px] -right-[6px] w-[22px] h-[22px] rounded-pill border-none flex items-center justify-center cursor-pointer shadow-sm"
                          style={{ background: 'var(--kd-onyx)', color: '#fff' }}>
                          <X size={11} strokeWidth={2.5} />
                        </button>
                        <div className="text-[10px] text-fg2 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">{photo.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-[18px] py-[18px] flex gap-[10px] items-center flex-wrap" style={{ background: 'var(--kd-parchment-200)', borderTop: '1px solid var(--border)' }}>
          <button className={iconBtn}><Printer size={18} /></button>
          <button className={iconBtn}><MessageSquare size={18} /></button>
          <button className={secBtn}>Reportar problema</button>
          <div className="flex-1" />
          <button onClick={() => onComplete(appt, { diagnostico, receta: requiereReceta ? receta : null, photos: photos.map(p => ({ name: p.name, preview: p.preview })) })}
            className="inline-flex items-center gap-2 px-6 py-[14px] rounded-pill border-none text-white text-[15px] font-semibold cursor-pointer shadow-md font-sans"
            style={{ background: 'var(--kd-persian-blue)' }}>
            <CheckCheck size={18} />Marcar como completado
          </button>
        </div>
      </div>
    </div>
  )
}
