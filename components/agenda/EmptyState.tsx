'use client'
import { CalendarCheck, Bell, PawPrint, Coffee } from 'lucide-react'

interface Props { filter: string; totalCount: number; openHours?: string }

function EmptyIllustration() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/empty-pet.svg" width={220} height={220} alt="" aria-hidden />
  )
}

const COPY: Record<string, { title: string; sub: string }> = {
  all:           { title: 'Todo tranquilo por aquí',    sub: 'Cuando un miembro agende desde su app, la cita aparecerá aquí.' },
  por_confirmar: { title: 'No hay citas por confirmar', sub: 'Las citas nuevas llegan aquí antes de pasar a próximas.' },
  proxima:       { title: 'No hay próximas citas',      sub: 'Las citas confirmadas y pendientes de hoy aparecen aquí.' },
  completada:    { title: 'Aún no hay completadas',     sub: 'Conforme termines las citas del día, se moverán aquí.' },
}

function Tip({ Icon, title, body }: { Icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="bg-kd-white border border-border rounded-md p-[14px] flex flex-col gap-[6px]">
      <div className="w-8 h-8 rounded-[10px] bg-kd-lavender text-kd-persian flex items-center justify-center">
        <Icon size={16} />
      </div>
      <div className="text-[13px] font-semibold">{title}</div>
      <div className="text-[12px] text-fg2 leading-[1.4]">{body}</div>
    </div>
  )
}

export function EmptyState({ filter, totalCount, openHours = '8:00 pm' }: Props) {
  const copy = COPY[filter] ?? COPY.all

  if (totalCount === 0) {
    return (
      <div className="min-h-full px-6 py-10 flex flex-col items-center justify-center gap-6">
        <div className="bg-kd-white border border-border rounded-xl p-[36px_40px_32px] max-w-[560px] w-full text-center shadow-sm flex flex-col items-center">
          <EmptyIllustration />
          <div className="font-display font-bold text-[32px] tracking-[-0.01em] leading-tight mt-2 text-balance">{copy.title}</div>
          <div className="text-[15px] text-fg2 mt-[10px] leading-[1.5] max-w-[380px]">{copy.sub}</div>
          <div className="mt-[22px] inline-flex items-center gap-2 bg-kd-lavender text-kd-persian px-4 py-[10px] rounded-pill text-[13px] font-semibold">
            <span className="w-2 h-2 rounded-pill bg-[#1F7A4D]" />
            Aceptando citas hasta {openHours}
          </div>
        </div>
        <div className="max-w-[560px] w-full grid gap-[10px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
          <Tip Icon={Bell} title="Te avisaremos" body="Sonará un ladrido cuando llegue una cita nueva." />
          <Tip Icon={PawPrint} title="Sin pendientes" body="Buen momento para revisar insumos del día." />
          <Tip Icon={Coffee} title="Tómate un café" body="El día apenas empieza." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-10 flex flex-col items-center justify-center text-center gap-4">
      <div className="w-[88px] h-[88px] rounded-pill bg-kd-lavender flex items-center justify-center text-kd-persian">
        <CalendarCheck size={36} strokeWidth={1.6} />
      </div>
      <div className="font-display font-bold text-[24px] tracking-[-0.01em] leading-tight">{copy.title}</div>
      <div className="text-[14px] text-fg2 max-w-[360px] leading-[1.5]">{copy.sub}</div>
    </div>
  )
}
