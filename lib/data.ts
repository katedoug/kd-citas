import type { Appointment, ServiceDef, StatusMeta, HistoryEntry } from './types'

// ── Permanent config (not mock) ─────────────────────────────────────────────

export const SERVICES: Record<string, ServiceDef> = {
  vacuna:     { id: 'vacuna',     label: 'Vacunación',       icon: 'Syringe',      mins: 20, color: '#1F7A4D' },
  sangre:     { id: 'sangre',     label: 'Examen de sangre', icon: 'TestTube',     mins: 15, color: '#B3261E' },
  orina:      { id: 'orina',      label: 'Examen de orina',  icon: 'FlaskConical', mins: 15, color: '#B5651D' },
  fecal:      { id: 'fecal',      label: 'Examen fecal',     icon: 'Microscope',   mins: 15, color: '#7A5A1F' },
  dental:     { id: 'dental',     label: 'Limpieza dental',  icon: 'Sparkles',     mins: 60, color: '#1434CB' },
  desparasit: { id: 'desparasit', label: 'Desparasitación',  icon: 'ShieldCheck',  mins: 15, color: '#1F7A4D' },
  consulta:   { id: 'consulta',   label: 'Consulta general', icon: 'Stethoscope',  mins: 30, color: '#1434CB' },
}

export const STATUS_META: Record<string, StatusMeta> = {
  por_confirmar: { label: 'Por confirmar', color: '#1F7A4D', bg: '#E5F4EC', dot: '#1F7A4D' },
  proxima:       { label: 'Próxima',       color: '#1434CB', bg: '#E8EDFF', dot: '#1434CB' },
  completada:    { label: 'Completada',    color: '#5C5C5C', bg: '#F0EEE8', dot: '#5C5C5C' },
  cancelada:     { label: 'Cancelada',     color: '#B3261E', bg: '#FCE9E7', dot: '#B3261E' },
}

// ── Development-only mock data ───────────────────────────────────────────────

const isDev = process.env.NODE_ENV === 'development'

function dShift(base: Date, days: number, hour: number, min = 0): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  d.setHours(hour, min, 0, 0)
  return d
}

function buildMockAppointments(): Appointment[] {
  const base = new Date(2026, 4, 4)
  return [
    {
      id: 'A-2061', code: '#KD-2061', status: 'por_confirmar',
      pet: { name: 'Luna', species: 'Perro', breed: 'Beagle', age: '4 años', sex: 'H', weight: '12 kg', avatar: 'L', color: '#1434CB' },
      owner: { name: 'María', initials: 'MR' },
      services: ['vacuna', 'desparasit'],
      specifics: { vacuna: 'Refuerzo anual (DHPPi+L)' },
      note: 'Le da miedo el corte de uñas. Por favor traer premios.',
      plan: 'Bienestar Plus', start: dShift(base, 0, 9, 30), durationMin: 35, arrivedAt: null, isNew: true,
    },
    {
      id: 'A-2058', code: '#KD-2058', status: 'proxima',
      pet: { name: 'Marcelo', species: 'Gato', breed: 'Doméstico pelo corto', age: '2 años', sex: 'M', weight: '4.8 kg', avatar: 'M', color: '#7A5A1F' },
      owner: { name: 'Diego', initials: 'DV' },
      services: ['consulta', 'sangre'], note: 'Vómito intermitente desde el viernes.',
      plan: 'Bienestar', start: dShift(base, 0, 10, 30), durationMin: 45,
    },
    {
      id: 'A-2055', code: '#KD-2055', status: 'proxima',
      pet: { name: 'Frida', species: 'Perro', breed: 'Xoloitzcuintle', age: '6 años', sex: 'H', weight: '14 kg', avatar: 'F', color: '#B5651D' },
      owner: { name: 'Renata', initials: 'RT' },
      services: ['dental'], note: null,
      plan: 'Bienestar Plus', start: dShift(base, 0, 11, 30), durationMin: 60,
    },
    {
      id: 'A-2054', code: '#KD-2054', status: 'proxima',
      pet: { name: 'Coco', species: 'Perro', breed: 'French Poodle', age: '8 años', sex: 'M', weight: '6 kg', avatar: 'C', color: '#1F7A4D' },
      owner: { name: 'Andrés', initials: 'AS' },
      services: ['orina', 'fecal'], note: 'Muestras ya las trae el dueño.',
      plan: 'Bienestar', start: dShift(base, 0, 13, 0), durationMin: 20,
    },
    {
      id: 'A-2050', code: '#KD-2050', status: 'proxima',
      pet: { name: 'Nina', species: 'Gato', breed: 'Siamés', age: '7 años', sex: 'H', weight: '3.9 kg', avatar: 'N', color: '#0F28A1' },
      owner: { name: 'Sofía', initials: 'SP' },
      services: ['consulta'], note: null,
      plan: 'Bienestar', start: dShift(base, 0, 16, 30), durationMin: 30,
    },
    {
      id: 'A-2049', code: '#KD-2049', status: 'completada',
      pet: { name: 'Toby', species: 'Perro', breed: 'Labrador', age: '3 años', sex: 'M', weight: '28 kg', avatar: 'T', color: '#7A5A1F' },
      owner: { name: 'Carlos', initials: 'CL' },
      services: ['vacuna'], specifics: { vacuna: 'Antirrábica' }, note: null,
      plan: 'Bienestar Plus', start: dShift(base, 0, 8, 30), durationMin: 20, completedAt: dShift(base, 0, 8, 48),
    },
    {
      id: 'A-2047', code: '#KD-2047', status: 'cancelada',
      pet: { name: 'Bruno', species: 'Perro', breed: 'Bulldog Francés', age: '2 años', sex: 'M', weight: '11 kg', avatar: 'B', color: '#B3261E' },
      owner: { name: 'Paola', initials: 'PG' },
      services: ['consulta', 'desparasit'], note: null,
      plan: 'Bienestar', start: dShift(base, 0, 14, 0), durationMin: 30,
      cancelledAt: dShift(base, 0, 9, 12), cancelReason: 'Reagendó para mañana 11:00',
    },
    {
      id: 'A-2070', code: '#KD-2070', status: 'proxima',
      pet: { name: 'Pipo', species: 'Perro', breed: 'Schnauzer', age: '5 años', sex: 'M', weight: '9 kg', avatar: 'P', color: '#1434CB' },
      owner: { name: 'Lucía', initials: 'LM' },
      services: ['dental'], note: 'Sarro acumulado, primera limpieza.',
      plan: 'Bienestar Plus', start: dShift(base, 1, 9, 0), durationMin: 60,
    },
    {
      id: 'A-2071', code: '#KD-2071', status: 'proxima',
      pet: { name: 'Bruno', species: 'Perro', breed: 'Bulldog Francés', age: '2 años', sex: 'M', weight: '11 kg', avatar: 'B', color: '#B3261E' },
      owner: { name: 'Paola', initials: 'PG' },
      services: ['consulta', 'desparasit'], note: 'Reagendado desde el lunes.',
      plan: 'Bienestar', start: dShift(base, 1, 11, 0), durationMin: 30,
    },
    {
      id: 'A-2072', code: '#KD-2072', status: 'proxima',
      pet: { name: 'Mochi', species: 'Gato', breed: 'British Shorthair', age: '1 año', sex: 'H', weight: '3.2 kg', avatar: 'M', color: '#0F28A1' },
      owner: { name: 'Iván', initials: 'IB' },
      services: ['vacuna', 'consulta'], specifics: { vacuna: 'Triple felina' }, note: 'Primera visita.',
      plan: 'Bienestar', start: dShift(base, 1, 12, 30), durationMin: 40,
    },
    {
      id: 'A-2074', code: '#KD-2074', status: 'proxima',
      pet: { name: 'Rocco', species: 'Perro', breed: 'Pastor Belga', age: '4 años', sex: 'M', weight: '32 kg', avatar: 'R', color: '#1F7A4D' },
      owner: { name: 'Ximena', initials: 'XF' },
      services: ['sangre', 'orina'], note: 'Ayuno de 12 hrs confirmado.',
      plan: 'Bienestar Plus', start: dShift(base, 1, 16, 0), durationMin: 30,
    },
    {
      id: 'A-2080', code: '#KD-2080', status: 'proxima',
      pet: { name: 'Olivia', species: 'Perro', breed: 'Golden Retriever', age: '6 años', sex: 'H', weight: '26 kg', avatar: 'O', color: '#B5651D' },
      owner: { name: 'Mauricio', initials: 'MV' },
      services: ['vacuna', 'desparasit'], note: null,
      plan: 'Bienestar', start: dShift(base, 2, 10, 0), durationMin: 30,
    },
    {
      id: 'A-2082', code: '#KD-2082', status: 'proxima',
      pet: { name: 'Simba', species: 'Gato', breed: 'Maine Coon', age: '3 años', sex: 'M', weight: '6.4 kg', avatar: 'S', color: '#7A5A1F' },
      owner: { name: 'Fer', initials: 'FH' },
      services: ['dental'], note: 'Le incomodan las luces fuertes.',
      plan: 'Bienestar Plus', start: dShift(base, 2, 13, 30), durationMin: 60,
    },
  ]
}

function buildMockHistory(): HistoryEntry[] {
  return [
    {
      date: 'Hoy · 8:48 am', pet: 'Toby', breed: 'Labrador', owner: 'Carlos', service: 'Vacunación', tag: 'completada',
      diagnostico: 'Aplicación de refuerzo antirrábico sin incidencias. Perro en buen estado general, peso estable. Se recomienda próxima dosis en 12 meses.',
      receta: 'Sin prescripción.',
    },
    {
      date: 'Ayer · 5:30 pm', pet: 'Misha', breed: 'Persa', owner: 'Renata', service: 'Limpieza dental', tag: 'completada',
      diagnostico: 'Tartrectomía completa. Se encontró cálculo dental moderado en molares superiores. Encías rosadas y sin sangrado excesivo post-limpieza.',
      receta: 'Clorhexidina gel al 0.2% — aplicar con gasa en encías cada 48 hrs por 7 días.',
    },
    {
      date: 'Ayer · 2:15 pm', pet: 'Otto', breed: 'Pug', owner: 'Hugo', service: 'Consulta general', tag: 'completada',
      diagnostico: 'Consulta por tos seca intermitente de 5 días. Auscultación sin hallazgos pulmonares. Compatible con irritación de vías altas. Se descarta bronquitis.',
      receta: 'Bromhexina 8 mg/ml — 0.5 ml vía oral cada 12 hrs por 5 días.\nReposo relativo, evitar contacto con polvo y humo.',
    },
    {
      date: 'Ayer · 11:00 am', pet: 'Bruno', breed: 'Bulldog Francés', owner: 'Paola', service: 'Consulta · Desparasitación', tag: 'cancelada',
    },
    {
      date: '28 abr · 4:00 pm', pet: 'Canela', breed: 'Cocker Spaniel', owner: 'Lupita', service: 'Examen de sangre', tag: 'completada',
      diagnostico: 'Hemograma completo dentro de parámetros normales. Hematocrito 41%, leucocitos 8,200/µL. Sin anemia ni indicios de infección activa.',
    },
    {
      date: '28 abr · 12:30 pm', pet: 'Mango', breed: 'Border Collie', owner: 'Sergio', service: 'Vacunación · Desparasitación', tag: 'completada',
      diagnostico: 'Aplicación triple viral + desparasitación interna con milbemicina. Sin reacciones adversas durante la consulta.',
    },
    {
      date: '27 abr · 6:00 pm', pet: 'Pelusa', breed: 'Maltés', owner: 'Elena', service: 'Examen de orina', tag: 'completada',
      diagnostico: 'Urianálisis: pH 6.5, densidad 1.030, proteínas negativas. Sin cristales ni bacterias. Resultado dentro de la normalidad.',
    },
    {
      date: '27 abr · 11:30 am', pet: 'Apolo', breed: 'Boxer', owner: 'Ramiro', service: 'Limpieza dental', tag: 'completada',
      diagnostico: 'Limpieza profunda con ultrasonido. Extracción de pieza 308 con movilidad grado II. Sin complicaciones en procedimiento.',
      receta: 'Amoxicilina 500 mg — 1 comprimido cada 12 hrs por 7 días.\nMetronidazol 250 mg — 1 comprimido cada 24 hrs por 5 días.',
    },
    {
      date: '26 abr · 3:00 pm', pet: 'Nube', breed: 'Siberiano', owner: 'Vale', service: 'Consulta general', tag: 'completada',
      diagnostico: 'Revisión de rutina. Gato activo, peso 5.1 kg, pelaje en buen estado. Sin hallazgos relevantes. Se recomienda control en 6 meses.',
    },
    // Historial previo de Toby
    {
      date: '15 mar · 9:00 am', pet: 'Toby', breed: 'Labrador', owner: 'Carlos', service: 'Consulta general', tag: 'completada',
      diagnostico: 'Revisión por cojera en miembro posterior derecho. Se detecta leve inflamación articular compatible con displasia incipiente. Radiografías recomendadas.',
      receta: 'Meloxicam 1.5 mg — 1 ml/10 kg vía oral cada 24 hrs por 7 días.\nRestringir saltos y ejercicio intenso por 2 semanas.',
    },
    {
      date: '18 ene · 11:30 am', pet: 'Toby', breed: 'Labrador', owner: 'Carlos', service: 'Examen de sangre', tag: 'completada',
      diagnostico: 'Panel bioquímico: ALT 42 U/L, creatinina 1.1 mg/dL, glucosa 98 mg/dL. Todos los valores dentro del rango normal para su edad y talla.',
    },
    // Historial previo de Canela
    {
      date: '10 feb · 3:30 pm', pet: 'Canela', breed: 'Cocker Spaniel', owner: 'Lupita', service: 'Consulta general', tag: 'completada',
      diagnostico: 'Consulta por otitis externa bilateral recurrente. Cultivo positivo a Malassezia. Se ajusta tratamiento antifúngico.',
      receta: 'Posaconazol ótico — 4 gotas en cada oído cada 12 hrs por 10 días.\nLimpieza con solución fisiológica antes de aplicar.',
    },
    {
      date: '5 dic · 10:00 am', pet: 'Canela', breed: 'Cocker Spaniel', owner: 'Lupita', service: 'Vacunación', tag: 'completada',
      diagnostico: 'Vacunación anual DHPPi + Lepto. Estado general excelente. Sin reacciones durante observación.',
    },
    // Historial previo de Misha
    {
      date: '20 feb · 5:00 pm', pet: 'Misha', breed: 'Persa', owner: 'Renata', service: 'Consulta general', tag: 'completada',
      diagnostico: 'Consulta por pérdida de apetito de 4 días. Palpación abdominal sin masas. Posible estrés ambiental post-mudanza. Se recomienda observación.',
      receta: 'Mirtazapina 1.88 mg — 1/4 tab vía oral cada 72 hrs por 3 aplicaciones (estimulante de apetito).',
    },
    // Historial previo de Marcelo
    {
      date: '12 abr · 10:30 am', pet: 'Marcelo', breed: 'Doméstico pelo corto', owner: 'Diego', service: 'Vacunación', tag: 'completada',
      diagnostico: 'Triple felina aplicada sin incidencias. Peso 4.6 kg, buena condición corporal. Se programó refuerzo anual.',
    },
    {
      date: '8 feb · 9:00 am', pet: 'Marcelo', breed: 'Doméstico pelo corto', owner: 'Diego', service: 'Consulta general', tag: 'completada',
      diagnostico: 'Primera consulta. Gato de 2 años, castrado. Sin antecedentes relevantes. Exploración física sin hallazgos. Se recomienda plan preventivo anual.',
      receta: 'Antiparasitario interno (Milbemicina 16 mg) — dosis única vía oral.',
    },
  ]
}

export const APPOINTMENTS: Appointment[] = isDev ? buildMockAppointments() : []
export const STATIC_HISTORY: HistoryEntry[] = isDev ? buildMockHistory() : []
export const TODAY: Date = isDev ? new Date(2026, 4, 4) : new Date()

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES   = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
const MONTH_SHORT = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

export function fmtTime(d: Date): string {
  const h = d.getHours(), m = d.getMinutes()
  const ampm = h < 12 ? 'am' : 'pm'
  const h12 = ((h + 11) % 12) + 1
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function fmtDateLong(d: Date): string {
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`
}

export function fmtDateShort(d: Date): string {
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function relDayLabel(d: Date): string {
  const diff = Math.round((d.getTime() - TODAY.getTime()) / 86400000)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Mañana'
  if (diff === -1) return 'Ayer'
  return fmtDateLong(d)
}

export function totalDuration(appt: Appointment): number {
  return appt.services.reduce((s, sid) => s + (SERVICES[sid]?.mins ?? 0), 0)
}
