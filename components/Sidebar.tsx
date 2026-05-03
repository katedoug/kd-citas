'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, CalendarCheck, History, ListChecks, Clock, Settings, CircleHelp, Bell, CalendarOff, Flag } from 'lucide-react'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { useApp } from '@/context/AppContext'

const ITEMS = [
  { href: '/citas',     label: 'Citas en vivo',   Icon: CalendarCheck },
  { href: '/historial', label: 'Historial',        Icon: History },
  { href: '/servicios', label: 'Servicios',        Icon: ListChecks },
  { href: '/horarios',  label: 'Horarios',         Icon: Clock },
  { href: '/ajustes',   label: 'Ajustes',          Icon: Settings },
  { href: '/ayuda',     label: 'Ayuda y soporte',  Icon: CircleHelp },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, triggerNewApptDemo, forceEmpty, setForceEmpty } = useApp()
  const pathname = usePathname()
  const close = () => setSidebarOpen(false)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className="fixed inset-0 z-40 transition-opacity"
        style={{
          background: 'rgba(3,0,39,0.4)',
          backdropFilter: 'blur(4px)',
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? 'auto' : 'none',
        }}
      />
      {/* Drawer */}
      <aside
        className="fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-kd-white shadow-lg transition-transform duration-300"
        style={{
          width: 'min(360px, 90vw)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-border">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-[14px] bg-kd-parchment-700 flex items-center justify-center text-fg3 font-display font-bold text-[22px]">
                —
              </div>
              <div>
                <div className="font-display font-semibold text-[18px] leading-tight text-fg1">Mi clínica</div>
                <div className="text-[12px] text-fg3">Configura en Vet Manager</div>
              </div>
            </div>
            <button onClick={close} className="w-9 h-9 rounded-pill border-none bg-kd-parchment cursor-pointer flex items-center justify-center">
              <X size={18} />
            </button>
          </div>
          <div className="mt-[14px] inline-flex items-center gap-2 px-[14px] py-[8px] rounded-pill text-[13px] font-semibold text-white" style={{ background: 'var(--kd-prussian-blue)' }}>
            <span className="w-2 h-2 rounded-pill bg-[#5DD39E]" />
            Aceptando citas hasta 8:00 pm
          </div>
        </div>

        {/* Nav */}
        <nav className="p-2 flex-1">
          {ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href || (href === '/citas' && pathname === '/')
            return (
              <Link key={href} href={href} onClick={close}
                className="w-full flex gap-[14px] items-center px-4 py-[14px] rounded-[12px] cursor-pointer text-left no-underline transition-colors"
                style={{
                  background: active ? 'var(--kd-lavender)' : 'transparent',
                  color: active ? 'var(--kd-persian-blue)' : 'var(--fg1)',
                  fontWeight: active ? 600 : 500,
                  fontSize: 15,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <Icon size={20} strokeWidth={1.85} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button onClick={triggerNewApptDemo}
            className="w-full px-4 py-3 rounded-pill border border-border bg-white cursor-pointer font-sans text-[13px] font-semibold text-fg2 flex items-center justify-center gap-2">
            <Bell size={16} />
            Probar aviso de cita nueva
          </button>
          <button onClick={() => { setForceEmpty(!forceEmpty); close() }}
            className="mt-2 w-full px-4 py-3 rounded-pill border border-border bg-white cursor-pointer font-sans text-[13px] font-semibold text-fg2 flex items-center justify-center gap-2">
            {forceEmpty ? <CalendarOff size={16} /> : <CalendarCheck size={16} />}
            {forceEmpty ? 'Limpiar citas de prueba' : 'Cargar citas de prueba'}
          </button>
          <button className="mt-2 w-full px-4 py-3 rounded-pill cursor-pointer font-sans text-[13px] font-semibold flex items-center justify-center gap-2"
            style={{ border: '1px solid #F0BAB6', background: '#FCE9E7', color: '#B3261E' }}>
            <Flag size={16} />
            Reportar problema
          </button>
          <SignedIn>
            <div className="mt-3 flex items-center gap-3 px-1">
              <UserButton afterSignOutUrl="/login" />
              <div className="text-[12px] text-fg2 font-medium font-sans">Mi cuenta</div>
            </div>
          </SignedIn>
          <div className="mt-[10px] text-[11px] text-fg3 text-center">Kate&amp;Doug · v2.0 · Modo clínica</div>
        </div>
      </aside>
    </>
  )
}
