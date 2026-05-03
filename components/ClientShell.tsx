'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthCtx } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { Sidebar } from './Sidebar'
import { Toast } from './shared/Toast'
import { NewAppointmentAlert } from './NewAppointmentAlert'

export function ClientShell({ children }: { children: React.ReactNode }) {
  const { isLoaded, user } = useAuthCtx()
  const router = useRouter()
  const pathname = usePathname()
  const { toast, newAlertAppt, setNewAlertAppt, handleCancel, handleOpenFromAlert } = useApp()

  useEffect(() => {
    if (isLoaded && !user && !pathname.startsWith('/login')) {
      router.replace('/login')
    }
  }, [isLoaded, user, pathname, router])

  if (!isLoaded || (!user && !pathname.startsWith('/login'))) {
    return null
  }

  if (pathname.startsWith('/login')) {
    return <>{children}</>
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
