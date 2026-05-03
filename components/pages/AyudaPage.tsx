'use client'
import { useState } from 'react'
import { Phone, MessageCircle, Plus, Minus } from 'lucide-react'
import { PageChrome } from './PageChrome'

const FAQS = [
  { q: '¿Cómo confirmo una cita nueva?',
    a: 'Toca la cita verde o el aviso de "Cita nueva" cuando suene el ladrido y presiona Confirmar cita.' },
  { q: '¿Qué hago si un miembro llega antes de tiempo?',
    a: 'Abre la cita y pulsa Marcar como llegó. Eso avisará al equipo médico.' },
  { q: '¿Puedo cancelar una cita desde aquí?',
    a: 'Sí, abre la cita y usa Reportar problema. El miembro recibirá la actualización en su app.' },
  { q: '¿Dónde veo el expediente médico de la mascota?',
    a: 'Por privacidad, los expedientes detallados y la información financiera viven en la app de Kate&Doug Vets.' },
  { q: '¿La tablet sigue funcionando sin internet?',
    a: 'Las citas ya cargadas se muestran offline. Las nuevas llegarán cuando recuperes conexión.' },
]

export function AyudaPage() {
  const [open, setOpen] = useState<number>(0)

  return (
    <PageChrome title="Ayuda y soporte" subtitle="Resuelve dudas frecuentes o contáctanos">
      {/* Contact strip */}
      <div className="rounded-[20px] p-[22px] mb-6 flex gap-[18px] items-center flex-wrap text-white"
        style={{ background: 'var(--kd-prussian-blue)' }}>
        <div className="flex-1 min-w-[220px]">
          <div className="font-display text-[22px] font-bold tracking-[-0.01em]">¿Necesitas ayuda en vivo?</div>
          <div className="text-[13px] opacity-80 mt-1">Soporte de Kate&amp;Doug, lunes a domingo de 8 am a 10 pm.</div>
        </div>
        <button className="inline-flex items-center gap-2 px-[22px] py-3 rounded-pill border-none cursor-pointer font-sans text-[14px] font-bold"
          style={{ background: '#fff', color: 'var(--kd-prussian-blue)' }}>
          <Phone size={16} />Llamar a soporte
        </button>
        <button className="inline-flex items-center gap-2 px-[22px] py-3 rounded-pill cursor-pointer font-sans text-[14px] font-semibold text-white"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)' }}>
          <MessageCircle size={16} />Chat
        </button>
      </div>

      <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-fg-accent mb-3">Preguntas frecuentes</div>
      <div className="bg-bg-elevated border border-border rounded-[16px] overflow-hidden">
        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <button onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full text-left px-[18px] py-4 border-none bg-transparent cursor-pointer flex justify-between items-center gap-3 text-fg1 font-sans">
                <span className="text-[15px] font-semibold">{f.q}</span>
                {isOpen ? <Minus size={18} className="text-fg2 flex-shrink-0" /> : <Plus size={18} className="text-fg2 flex-shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-[18px] pb-4 text-[14px] text-fg2 leading-[1.55]">{f.a}</div>
              )}
            </div>
          )
        })}
      </div>
    </PageChrome>
  )
}
