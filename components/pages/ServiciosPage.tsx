'use client'
import { useState } from 'react'
import { Info, SlidersHorizontal, Timer, X, ListChecks, Syringe, TestTube, FlaskConical, Microscope, Sparkles, ShieldCheck, Stethoscope, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = { Syringe, TestTube, FlaskConical, Microscope, Sparkles, ShieldCheck, Stethoscope }
import { PageChrome } from './PageChrome'
import type { ServiceCatalogItem } from '@/lib/types'


const CATALOG_DEV: ServiceCatalogItem[] = [
  { id: 'vacuna',     label: 'Vacunación',       desc: 'Aplicación de vacunas según cartilla.',       icon: 'Syringe',      mins: 20, prep: 'Sin requisitos especiales.',                   enabled: true },
  { id: 'sangre',     label: 'Examen de sangre', desc: 'Toma de muestra para análisis clínico.',      icon: 'TestTube',     mins: 15, prep: 'Ayuno de 8 horas.',                             enabled: true },
  { id: 'orina',      label: 'Examen de orina',  desc: 'Análisis general y sedimento urinario.',      icon: 'FlaskConical', mins: 15, prep: 'Muestra fresca recomendada.',                   enabled: true },
  { id: 'fecal',      label: 'Examen fecal',     desc: 'Coproparasitoscópico de 3 muestras.',         icon: 'Microscope',   mins: 15, prep: 'Muestras de 3 días distintos.',                  enabled: true },
  { id: 'dental',     label: 'Limpieza dental',  desc: 'Profilaxis dental con sedación.',              icon: 'Sparkles',     mins: 60, prep: 'Ayuno de 12 horas. Estudios prequirúrgicos.',    enabled: true },
  { id: 'desparasit', label: 'Desparasitación',  desc: 'Interna y externa según peso.',                icon: 'ShieldCheck',  mins: 15, prep: 'Sin requisitos especiales.',                   enabled: true },
  { id: 'consulta',   label: 'Consulta general', desc: 'Revisión médica integral.',                    icon: 'Stethoscope',  mins: 30, prep: 'Lleva la cartilla actualizada.',                enabled: true },
]

function DurationModal({ service, onSave, onClose }: { service: ServiceCatalogItem; onSave: (mins: number) => void; onClose: () => void }) {
  const [mins, setMins] = useState(service.mins)
  const DUR_MIN = 5, DUR_MAX = 120, DUR_STEP = 5
  const pct = ((mins - DUR_MIN) / (DUR_MAX - DUR_MIN)) * 100

  return (
    <div className="fixed inset-0 z-[70] flex justify-center items-center p-6 animate-fade-in"
      style={{ background: 'rgba(3,0,39,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-[min(460px,100%)] bg-kd-white rounded-[24px] overflow-hidden shadow-lg animate-sheet-in"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-[14px] px-[22px] py-[18px] text-white" style={{ background: 'var(--kd-prussian-blue)' }}>
          <button onClick={onClose} className="w-10 h-10 rounded-pill border-none flex items-center justify-center cursor-pointer" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff' }}>
            <X size={20} />
          </button>
          <div>
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-75">Editar duración</div>
            <div className="font-display font-bold text-[22px] tracking-[-0.01em] mt-[2px]">{service.label}</div>
          </div>
        </div>
        <div className="px-9 pt-10 pb-7 flex flex-col items-center gap-9">
          <div className="text-center leading-none">
            <div className="font-display font-extrabold text-[96px] tracking-[-0.04em]" style={{ color: 'var(--kd-persian-blue)' }}>{mins}</div>
            <div className="text-[17px] font-semibold text-fg2 mt-[6px] tracking-[-0.01em]">minutos</div>
          </div>
          <div className="w-full">
            <input type="range" className="dur-slider" min={DUR_MIN} max={DUR_MAX} step={DUR_STEP} value={mins}
              onChange={e => setMins(Number(e.target.value))}
              style={{ background: `linear-gradient(to right, var(--kd-persian-blue) ${pct}%, var(--kd-parchment-700) ${pct}%)` }} />
            <div className="flex justify-between mt-[10px] text-[12px] text-fg3 font-medium">
              <span>5 min</span><span>120 min</span>
            </div>
          </div>
        </div>
        <div className="px-9 pb-8 flex gap-[10px] justify-end">
          <button onClick={onClose} className="px-[26px] py-[13px] rounded-pill border border-border bg-white cursor-pointer font-sans text-[14px] font-semibold text-fg1">Cancelar</button>
          <button onClick={() => onSave(mins)} className="px-8 py-[13px] rounded-pill border-none text-white cursor-pointer font-sans text-[14px] font-bold shadow-md"
            style={{ background: 'var(--kd-persian-blue)', boxShadow: '0 4px 14px rgba(20,52,203,0.3)' }}>Guardar</button>
        </div>
      </div>
    </div>
  )
}

export function ServiciosPage() {
  const [list, setList] = useState<ServiceCatalogItem[]>(CATALOG_DEV)
  const [editing, setEditing] = useState<ServiceCatalogItem | null>(null)

  const toggle = (id: string) => setList(l => l.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  const saveDuration = (id: string, mins: number) => {
    setList(l => l.map(s => s.id === id ? { ...s, mins } : s))
    setEditing(null)
  }

  return (
    <PageChrome title="Servicios" subtitle="Lo que la clínica ofrece a los miembros">
      {editing && <DurationModal service={editing} onSave={m => saveDuration(editing.id, m)} onClose={() => setEditing(null)} />}

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-20 h-20 rounded-pill bg-kd-lavender flex items-center justify-center text-kd-persian">
            <ListChecks size={36} strokeWidth={1.5} />
          </div>
          <div className="font-display font-bold text-[22px] tracking-[-0.01em]">Sin servicios configurados</div>
          <div className="text-[14px] text-fg2 max-w-[320px] leading-[1.5]">
            Los servicios que ofrece tu clínica se configuran desde <strong>Vet Manager</strong>.
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-3 items-center bg-kd-lavender text-kd-persian rounded-[16px] px-[18px] py-[14px] mb-[18px]">
            <Info size={20} className="flex-shrink-0" />
            <div className="text-[13px] leading-[1.5]">
              Estos son los servicios que aparecen disponibles cuando un miembro agenda desde la app. Desactiva los que no estés ofreciendo hoy.
            </div>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {list.map(s => {
              const Icon = ICON_MAP[s.icon]
              return (
                <div key={s.id} className="bg-bg-elevated border border-border rounded-[16px] p-[18px] transition-opacity"
                  style={{ opacity: s.enabled ? 1 : 0.55 }}>
                  <div className="flex justify-between items-start gap-[10px]">
                    <div className="w-11 h-11 rounded-[12px] bg-kd-lavender text-kd-persian flex items-center justify-center">
                      {Icon && <Icon size={22} strokeWidth={1.85} />}
                    </div>
                    <button onClick={() => toggle(s.id)} aria-label="Toggle"
                      className="w-11 h-[26px] rounded-pill border-none cursor-pointer relative transition-colors"
                      style={{ background: s.enabled ? '#1F7A4D' : 'var(--kd-parchment-700)' }}>
                      <span className="absolute top-[3px] w-5 h-5 rounded-pill bg-white shadow-sm transition-all"
                        style={{ left: s.enabled ? 21 : 3 }} />
                    </button>
                  </div>
                  <div className="font-display font-bold text-[18px] mt-[14px] tracking-[-0.01em]">{s.label}</div>
                  <div className="text-[13px] text-fg2 mt-1 leading-[1.5]">{s.desc}</div>
                  <div className="flex gap-[10px] mt-[14px] text-[12px] text-fg2">
                    <span className="inline-flex items-center gap-1"><Timer size={13} />{s.mins} min</span>
                    <span className="w-px bg-border" />
                    <span className="flex-1">{s.prep}</span>
                  </div>
                  <button onClick={() => setEditing(s)}
                    className="mt-[14px] w-full inline-flex items-center justify-center gap-[7px] px-4 py-[10px] rounded-pill border border-border bg-transparent cursor-pointer font-sans text-[13px] font-semibold text-fg2 transition-colors"
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--kd-lavender)'; e.currentTarget.style.color = 'var(--kd-persian-blue)'; e.currentTarget.style.borderColor = 'var(--kd-persian-blue)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg2)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                    <SlidersHorizontal size={14} />Editar duración
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </PageChrome>
  )
}
