import * as Sentry from '@sentry/nextjs'
import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/context/AuthContext'
import { ClientShell } from '@/components/ClientShell'

export function generateMetadata(): Metadata {
  return {
    title: 'Kate&Doug · Citas Clínica',
    description: 'Panel de citas para clínicas veterinarias Kate&Doug',
    other: {
      ...Sentry.getTraceData(),
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <AppProvider>
            <ClientShell>{children}</ClientShell>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
