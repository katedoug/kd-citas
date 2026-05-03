'use client'
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Sidebar } from './Sidebar'
import { Toast } from './shared/Toast'
import { NewAppointmentAlert } from './NewAppointmentAlert'

export function ClientShell({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast, newAlertAppt, setNewAlertAppt, handleCancel, handleOpenFromAlert } = useApp()

  useEffect(() => {
    if (isLoaded && !userId && !pathname.startsWith('/login')) {
      router.replace('/login')
    }
  }, [isLoaded, userId, pathname, router])

  if (!isLoaded || (!userId && !pathname.startsWith('/login'))) {
    return null
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-kd-parchment">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>
      {toast && <Toast message={toast.message} icon={toast.icon} />}
      {newAlertAppt && (
        <NewAppointmentAlert
          appt={newAlertAppt}
          onDismiss={() => setNewAlertAppt(null)}
          onView={handleOpenFromAlert}
          onReject={() => {
            handleCancel(newAlertAppt)
            setNewAlertAppt(null)
          }}
        />
      )}
    </div>
  )
}
