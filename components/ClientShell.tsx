'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
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
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8">
        <Image src="/SVG/partners-logo.svg" alt="Kate&Doug for Vets" width={200} height={50} priority />
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid #e0e0e0', borderTopColor: '#1434CB', animation: 'spin 700ms linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
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
