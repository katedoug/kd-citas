'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface Clinic {
  id: string
  name: string
  slug: string | null
  role: string
  organization_name: string
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  isLoaded: boolean
  clinics: Clinic[]
  activeClinic: Clinic | null
  setActiveClinic: (c: Clinic) => void
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function fetchClinics(userId: string): Promise<Clinic[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('clinic_users')
    .select('role, clinics(id, name, slug, organizations(name))')
    .eq('user_id', userId)
    .eq('is_active', true)
  if (error || !data) return []
  return data.map((row: any) => ({
    id: row.clinics.id,
    name: row.clinics.name,
    slug: row.clinics.slug,
    role: row.role,
    organization_name: row.clinics.organizations?.name ?? '',
  }))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoaded, setIsLoaded] = useState(!supabase)
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [activeClinic, setActiveClinic] = useState<Clinic | null>(null)

  const loadClinics = async (userId: string) => {
    const list = await fetchClinics(userId)
    setClinics(list)
    if (list.length === 1) setActiveClinic(list[0])
  }

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) loadClinics(data.session.user.id)
      setIsLoaded(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        loadClinics(session.user.id)
      } else {
        setClinics([])
        setActiveClinic(null)
      }
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) {
      if (email === 'demo@katedoug.mx' && password === 'demo1234') {
        setSession({ user: { id: 'demo', email } } as never)
        return { error: null }
      }
      return { error: 'Correo o contraseña incorrectos' }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signInWithGoogle = async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
  }

  const signOut = async () => {
    if (!supabase) { setSession(null); return }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      session, user: session?.user ?? null, isLoaded,
      clinics, activeClinic, setActiveClinic,
      signIn, signInWithGoogle, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthCtx(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthCtx must be used inside AuthProvider')
  return ctx
}
