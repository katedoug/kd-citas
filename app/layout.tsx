import * as Sentry from '@sentry/nextjs'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { esMX } from '@clerk/localizations'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
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
        <ClerkProvider localization={esMX as Parameters<typeof ClerkProvider>[0]['localization']}>
          <AppProvider>
            <ClientShell>{children}</ClientShell>
          </AppProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
