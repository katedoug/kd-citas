'use client'

import { createContext, useContext, useState, useMemo, useEffect, useCallback, ReactNode } from 'react'
import { APPOINTMENTS, STATIC_HISTORY, SERVICES, fmtTime, TODAY } from '@/lib/data'
import type { Appointment, HistoryEntry, ConsultaData } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface AppContextValue {
  // Appointments
  appts: Appointment[]
  activeAppts: Appointment[]
  counts: Record<string, number>
  filter: string
  setFilter: (f: string) => void
  updateAppt: (id: string, patch: Partial<Appointment>) => void

  // Handlers
  handleConfirm: (a: Appointment) => void
  handleMarkArrived: (a: Appointment) => void
  handleCompleteConsulta: (a: Appointment, data: ConsultaData) => void
  handleComplete: (a: Appointment) => void
  handleCancel: (a: Appointment) => void
  triggerNewApptDemo: () => void

  // Modals
  openAppt: Appointment | null
  setOpenAppt: (a: Appointment | null) => void
  consultaAppt: Appointment | null
  setConsultaAppt: (a: Appointment | null) => void
  newAlertAppt: Appointment | null
  setNewAlertAppt: (a: Appointment | null) => void
  handleOpenFromAlert: () => void

  // History
  completedHistory: HistoryEntry[]

  // Toast
  toast: { message: string; icon: string } | null
  showToast: (message: string, icon?: string) => void

  // UI
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
  forceEmpty: boolean
  setForceEmpty: (v: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false)
  const [forceEmpty, setForceEmptyState] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openAppt, setOpenAppt] = useState<Appointment | null>(null)
  const [consultaAppt, setConsultaAppt] = useState<Appointment | null>(null)
  const [newAlertAppt, setNewAlertAppt] = useState<Appointment | null>(null)
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null)
  const [completedHistory, setCompletedHistory] = useState<HistoryEntry[]>([])
  const [appts, setAppts] = useState<Appointment[]>([])

  // Sync dark mode class
  const setDarkMode = useCallback((v: boolean) => {
    setDarkModeState(v)
    document.documentElement.classList.toggle('kd-dark', v)
  }, [])

  // Dev tool: load/unload mock appointments. In prod APPOINTMENTS=[] so this is a no-op.
  const setForceEmpty = useCallback((v: boolean) => {
    setForceEmptyState(v)
    setAppts(v ? APPOINTMENTS : [])
    setCompletedHistory(v ? STATIC_HISTORY : [])
  }, [])

  const activeAppts = useMemo(
    () => appts.filter(a => a.status !== 'cancelada'),
    [appts]
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: activeAppts.length, por_confirmar: 0, proxima: 0, completada: 0 }
    activeAppts.forEach(a => { c[a.status] = (c[a.status] ?? 0) + 1 })
    return c
  }, [activeAppts])

  const showToast = useCallback((message: string, icon = 'check') => {
    setToast({ message, icon })
    setTimeout(() => setToast(null), 2200)
  }, [])

  const updateAppt = useCallback((id: string, patch: Partial<Appointment>) => {
    setAppts(list => list.map(a => a.id === id ? { ...a, ...patch } : a))
    setOpenAppt(prev => prev && prev.id === id ? { ...prev, ...patch } : prev)
  }, [])

  const pushToHistorial = useCallback((a: Appointment, tag: 'completada' | 'cancelada', extra?: Partial<HistoryEntry>) => {
    const serviceLabel = a.services.map(sid => SERVICES[sid]?.label).filter(Boolean).join(' · ')
    setCompletedHistory(prev => [{
      date: 'Hoy · ' + fmtTime(new Date()),
      pet: a.pet.name, breed: a.pet.breed,
      owner: a.owner.name, service: serviceLabel, tag, ...extra,
    }, ...prev])
  }, [])

  const handleConfirm = useCallback((a: Appointment) => {
    updateAppt(a.id, { status: 'proxima', isNew: false })
    showToast('Cita confirmada', 'check-circle')
  }, [updateAppt, showToast])

  const handleMarkArrived = useCallback((a: Appointment) => {
    updateAppt(a.id, { arrivedAt: new Date() })
    setConsultaAppt(a)
    showToast('Llegada registrada', 'door-open')
  }, [updateAppt, showToast])

  const handleCompleteConsulta = useCallback((a: Appointment, { diagnostico, receta, photos }: ConsultaData) => {
    setAppts(list => list.filter(appt => appt.id !== a.id))
    setConsultaAppt(null)
    setOpenAppt(null)
    pushToHistorial(a, 'completada', { diagnostico, receta, photos })
    showToast('Consulta completada', 'check-check')
  }, [pushToHistorial, showToast])

  const handleComplete = useCallback((a: Appointment) => {
    updateAppt(a.id, { status: 'completada', completedAt: new Date() })
    setOpenAppt(null)
    showToast('Cita completada', 'check-check')
  }, [updateAppt, showToast])

  const handleCancel = useCallback((a: Appointment) => {
    setAppts(list => list.filter(appt => appt.id !== a.id))
    setOpenAppt(null)
    pushToHistorial(a, 'cancelada')
    showToast('Cita cancelada', 'x-circle')
  }, [pushToHistorial, showToast])

  const triggerNewApptDemo = useCallback(() => {
    setSidebarOpen(false)
    let target = appts.find(a => a.status === 'por_confirmar' && a.isNew)
    if (!target) {
      target = appts.find(a => a.status === 'proxima')
      if (target) updateAppt(target.id, { status: 'por_confirmar', isNew: true })
    }
    if (target) {
      setNewAlertAppt({ ...target, status: 'por_confirmar', isNew: true })
      try {
        const audio = new Audio('/dog-bark.mp3')
        audio.volume = 0.8
        setTimeout(() => audio.play().catch(() => {}), 250)
      } catch {}
    }
  }, [appts, updateAppt])

  const handleOpenFromAlert = useCallback(() => {
    setOpenAppt(newAlertAppt)
    setNewAlertAppt(null)
  }, [newAlertAppt])

  // Supabase realtime — new appointments
  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel('appointments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointments' }, (payload) => {
        // Map DB row to Appointment shape and show alert
        console.log('New appointment from Supabase:', payload)
      })
      .subscribe()
    return () => { supabase?.removeChannel(channel) }
  }, [])

  const value: AppContextValue = {
    appts, activeAppts, counts, filter, setFilter, updateAppt,
    handleConfirm, handleMarkArrived, handleCompleteConsulta, handleComplete, handleCancel,
    triggerNewApptDemo,
    openAppt, setOpenAppt,
    consultaAppt, setConsultaAppt,
    newAlertAppt, setNewAlertAppt, handleOpenFromAlert,
    completedHistory,
    toast, showToast,
    sidebarOpen, setSidebarOpen,
    darkMode, setDarkMode,
    forceEmpty, setForceEmpty,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
