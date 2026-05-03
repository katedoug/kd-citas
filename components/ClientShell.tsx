'use client'
import { useApp } from '@/context/AppContext'
import { Sidebar } from './Sidebar'
import { Toast } from './shared/Toast'
import { NewAppointmentAlert } from './NewAppointmentAlert'

export function ClientShell({ children }: { children: React.ReactNode }) {
  const { toast, newAlertAppt, setNewAlertAppt, handleCancel, handleOpenFromAlert } = useApp()

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
