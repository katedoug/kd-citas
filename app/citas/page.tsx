'use client'
import { useApp } from '@/context/AppContext'
import { TopBar } from '@/components/TopBar'
import { Agenda } from '@/components/agenda/Agenda'
import { AppointmentPopup } from '@/components/AppointmentPopup'
import { ConsultaPopup } from '@/components/ConsultaPopup'
import type { ConsultaData } from '@/lib/types'

export default function CitasPage() {
  const {
    activeAppts, filter,
    openAppt, setOpenAppt,
    consultaAppt, setConsultaAppt,
    handleConfirm, handleComplete, handleCancel,
    handleMarkArrived, handleCompleteConsulta,
  } = useApp()

  return (
    <>
      <TopBar />
      <div className="scroll-area flex flex-col">
        <Agenda appts={activeAppts} filter={filter} onOpen={setOpenAppt} totalCount={activeAppts.length} />
      </div>

      {openAppt && (
        <AppointmentPopup
          appt={openAppt}
          onClose={() => setOpenAppt(null)}
          onConfirm={handleConfirm}
          onComplete={handleComplete}
          onCancel={handleCancel}
          onMarkArrived={handleMarkArrived}
          onOpenConsulta={(a) => { setConsultaAppt(a); setOpenAppt(null) }}
        />
      )}

      {consultaAppt && (
        <ConsultaPopup
          appt={consultaAppt}
          onClose={() => setConsultaAppt(null)}
          onComplete={(a, data: ConsultaData) => handleCompleteConsulta(a, data)}
        />
      )}
    </>
  )
}
