export interface Pet {
  name: string
  species: string
  breed: string
  age: string
  sex: 'H' | 'M'
  weight: string
  avatar: string
  color: string
}

export interface Owner {
  name: string
  initials: string
}

export type AppointmentStatus = 'por_confirmar' | 'proxima' | 'completada' | 'cancelada'

export interface Appointment {
  id: string
  code: string
  status: AppointmentStatus
  pet: Pet
  owner: Owner
  services: string[]
  specifics?: Record<string, string>
  note: string | null
  plan: string
  start: Date
  durationMin: number
  arrivedAt?: Date | null
  completedAt?: Date | null
  cancelledAt?: Date | null
  cancelReason?: string | null
  isNew?: boolean
}

export interface ServiceDef {
  id: string
  label: string
  icon: string
  mins: number
  color: string
}

export interface StatusMeta {
  label: string
  color: string
  bg: string
  dot: string
}

export interface HistoryEntry {
  date: string
  pet: string
  breed: string
  owner: string
  service: string
  tag: 'completada' | 'cancelada'
  diagnostico?: string | null
  receta?: string | null
  photos?: { name: string; preview: string }[]
  vacuna?: VacunaData | null
}

export interface ServiceCatalogItem {
  id: string
  label: string
  desc: string
  icon: string
  mins: number
  prep: string
  enabled: boolean
}

export interface ScheduleRow {
  day: string
  open: string
  close: string
  closed: boolean
}

export interface VacunaData {
  nombre: string
  aplicadaEn: string   // ISO date string YYYY-MM-DD
  proximaEn: string | null
}

export interface ConsultaData {
  diagnostico: string
  receta: string | null
  photos: { name: string; preview: string }[]
  vacuna: VacunaData | null
}
