'use client'
import { useState } from 'react'
import { ShieldCheck, User, Bell, Zap, Type, Building2, Image, Users, CreditCard, ExternalLink, LogOut, RefreshCcw } from 'lucide-react'
import { PageChrome } from './PageChrome'

function VetManagerModal({ onClose }: { onClose: () => void }) {
  const items = [
    { Icon: Building2,  text: 'Nombre y dirección de la clínica' },
    { Icon: Image,      text: 'Logo y fotografías' },
    { Icon: Users,      text: 'Equipo veterinario y roles' },
    { Icon: CreditCard, text: 'Información de facturación' },
  ]
  return (
    <div className="fixed inset-0 z-[70] flex justify-center items-center p-6 animate-fade-in"
      style={{ background: 'rgba(3,0,39,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-[min(420px,100%)] bg-kd-white rounded-[24px] overflow-hidden shadow-lg animate-sheet-in"
        onClick={e => e.stopPropagation()}>
        <div className="bg-kd-lavender px-8 py-9 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-white"
            style={{ background: 'var(--kd-persian-blue)' }}>
            <ShieldCheck size={30} strokeWidth={1.75} />
          </div>
          <div>
            <div className="font-display font-bold text-[22px] tracking-[-0.01em] text-fg1">
              Solo para administradores
            </div>
            <div className="text-[13px] text-fg2 mt-[6px] leading-[1.55]">
              Los cambios al perfil de la clínica se gestionan desde{' '}
              <strong style={{ color: 'var(--kd-persian-blue)' }}>Vet Manager</strong>.
            </div>
          </div>
        </div>

        <div className="px-7 pt-6 pb-4">
          <div className="rounded-[14px] border border-border p-[16px_18px] flex flex-col gap-3"
            style={{ background: 'var(--kd-parchment-200)' }}>
            {items.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-kd-lavender text-kd-persian flex items-center justify-center flex-shrink-0">
                  <Icon size={15} />
                </div>
                <span className="text-[13px] text-fg1 font-medium">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-fg3 mt-[14px] leading-[1.6] text-center">
            Accede a <strong>Vet Manager</strong> con tu cuenta de administrador para editar esta información.
          </p>
        </div>

        <div className="px-7 pb-7 flex flex-col gap-2">
          <button className="w-full py-[14px] rounded-pill border-none text-white cursor-pointer font-sans text-[14px] font-bold inline-flex items-center justify-center gap-2"
            style={{ background: 'var(--kd-persian-blue)', boxShadow: '0 4px 14px rgba(20,52,203,0.3)' }}>
            <ExternalLink size={16} />Abrir Vet Manager
          </button>
          <button onClick={onClose} className="w-full py-[13px] rounded-pill border border-border bg-transparent cursor-pointer font-sans text-[14px] font-semibold text-fg2">
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-fg-accent mb-3">{title}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function SettingRow({ Icon, label, hint, children }: { Icon: React.ElementType; label: string; hint?: string; children?: React.ReactNode }) {
  return (
    <div className="bg-bg-elevated border border-border rounded-[14px] p-[14px_16px] flex gap-[14px] items-center">
      <div className="w-9 h-9 rounded-[10px] bg-kd-lavender text-kd-persian flex items-center justify-center flex-shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold">{label}</div>
        {hint && <div className="text-[12px] text-fg2 mt-[2px]">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

function SwitchSm({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} aria-label="Toggle"
      className="w-11 h-[26px] rounded-pill border-none cursor-pointer relative flex-shrink-0 transition-colors"
      style={{ background: value ? '#1F7A4D' : 'var(--kd-parchment-700)' }}>
      <span className="absolute top-[3px] w-5 h-5 rounded-pill bg-white shadow-sm transition-all"
        style={{ left: value ? 21 : 3 }} />
    </button>
  )
}

export function AjustesPage() {
  const [staffName, setStaffName] = useState('Equipo de piso')
  const [notifSound, setNotifSound] = useState(true)
  const [autoConfirm, setAutoConfirm] = useState(false)
  const [bigText, setBigText] = useState(false)
  const [showVetManager, setShowVetManager] = useState(false)

  return (
    <PageChrome title="Ajustes" subtitle="Configuración de esta tablet">
      {showVetManager && <VetManagerModal onClose={() => setShowVetManager(false)} />}

      <SettingsSection title="Perfil de la clínica">
        <div className="bg-bg-elevated border border-border rounded-[16px] p-[18px] flex gap-4 items-center">
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-white font-display font-bold text-[24px] flex-shrink-0 bg-kd-parchment-700 text-fg3">
            <span className="text-fg3 text-[20px]">—</span>
          </div>
          <div className="flex-1">
            <div className="font-display text-[20px] font-bold tracking-[-0.01em] text-fg2">Nombre de la clínica</div>
            <div className="text-[13px] text-fg3">Configura en Vet Manager</div>
          </div>
          <button onClick={() => setShowVetManager(true)}
            className="px-4 py-[10px] rounded-pill border border-border bg-transparent cursor-pointer font-sans text-[13px] font-semibold text-fg1">
            Editar
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Esta tablet">
        <SettingRow Icon={User} label="Identificador del piso" hint="Nombre que aparece en el log interno.">
          <input value={staffName} onChange={e => setStaffName(e.target.value)}
            className="px-3 py-2 rounded-[10px] border border-border bg-bg-elevated text-fg1 font-sans text-[14px] min-w-[180px] outline-none" />
        </SettingRow>
        <SettingRow Icon={Bell} label="Sonido de cita nueva" hint="Reproduce un ladrido cuando llega una cita.">
          <SwitchSm value={notifSound} onChange={setNotifSound} />
        </SettingRow>
        <SettingRow Icon={Zap} label="Auto-confirmar citas" hint="Las citas pasan a próximas sin confirmación manual.">
          <SwitchSm value={autoConfirm} onChange={setAutoConfirm} />
        </SettingRow>
        <SettingRow Icon={Type} label="Texto más grande" hint="Aumenta el tamaño de letra para piso ruidoso.">
          <SwitchSm value={bigText} onChange={setBigText} />
        </SettingRow>
      </SettingsSection>

      <SettingsSection title="Privacidad">
        <div className="bg-bg-elevated border border-border rounded-[16px] p-[18px] flex gap-[14px]">
          <div className="w-11 h-11 rounded-[12px] bg-kd-lavender text-kd-persian flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div className="flex-1">
            <div className="font-display text-[17px] font-bold tracking-[-0.01em]">Modo clínica</div>
            <div className="text-[13px] text-fg2 mt-1 leading-[1.5]">
              Esta versión sólo muestra citas. La información financiera, expedientes detallados y datos
              administrativos viven en la app de Kate&amp;Doug Vets, separada de esta tablet.
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Sesión">
        <div className="flex gap-[10px] flex-wrap">
          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-pill border cursor-pointer font-sans text-[14px] font-semibold"
            style={{ border: '1px solid #F0BAB6', background: '#FCE9E7', color: '#B3261E' }}>
            <LogOut size={16} />Cerrar sesión de la tablet
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-pill border border-border bg-transparent cursor-pointer font-sans text-[14px] font-semibold text-fg1">
            <RefreshCcw size={16} />Reiniciar app
          </button>
        </div>
        <div className="mt-[18px] text-[12px] text-fg3">Kate&amp;Doug · v1.0 · Modo clínica</div>
      </SettingsSection>
    </PageChrome>
  )
}
