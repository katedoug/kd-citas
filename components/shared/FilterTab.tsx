'use client'

interface Props {
  label: string
  count: number
  active: boolean
  onClick: () => void
}

export function FilterTab({ label, count, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-[8px] px-[18px] py-[10px] rounded-pill border-none cursor-pointer font-sans text-[14px] font-semibold whitespace-nowrap transition-colors"
      style={{
        background: active ? 'var(--kd-onyx)' : 'transparent',
        color: active ? '#fff' : 'var(--fg2)',
      }}
    >
      {label}
      <span
        className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-[6px] rounded-pill text-[12px] font-bold"
        style={{
          background: active ? 'rgba(255,255,255,0.2)' : 'var(--kd-parchment-700)',
          color: active ? '#fff' : 'var(--fg2)',
        }}
      >
        {count}
      </span>
    </button>
  )
}
