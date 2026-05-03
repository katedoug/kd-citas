'use client'
import type { Pet } from '@/lib/types'

interface Props { pet: Pet; size?: number }

export function PetAvatar({ pet, size = 44 }: Props) {
  return (
    <div
      style={{ width: size, height: size, background: pet.color, fontSize: size * 0.42 }}
      className="rounded-pill flex items-center justify-center text-white font-display font-bold flex-shrink-0"
    >
      {pet.avatar}
    </div>
  )
}
