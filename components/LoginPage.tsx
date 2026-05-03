'use client'
import { useState, FormEvent } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

function FloatInput({ id, label, type, value, onChange }: {
  id: string; label: string; type: string; value: string; onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const raised = focused || value.length > 0
  return (
    <div className="relative">
      <label htmlFor={id} className="absolute left-4 pointer-events-none transition-all font-sans"
        style={{
          top: raised ? 10 : '50%',
          transform: raised ? 'none' : 'translateY(-50%)',
          fontSize: raised ? 10 : 15,
          fontWeight: raised ? 700 : 400,
          letterSpacing: raised ? '0.08em' : 0,
          textTransform: raised ? 'uppercase' : 'none',
          color: focused ? 'var(--kd-persian-blue)' : 'var(--kd-onyx-300)',
        }}>
        {label}
      </label>
      <input id={id} type={type} value={value}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-[12px] text-[15px] font-sans outline-none transition-colors"
        style={{
          padding: raised ? '26px 16px 10px' : '18px 16px',
          border: `1.5px solid ${focused ? 'var(--kd-persian-blue)' : 'var(--kd-parchment-700)'}`,
          background: '#fff',
          color: 'var(--kd-onyx)',
          boxSizing: 'border-box',
        }} />
    </div>
  )
}

function SocialBtn({ icon, label, onClick }: { icon: 'apple' | 'google'; label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex-1 flex items-center justify-center gap-[10px] py-[14px] px-[10px] rounded-[12px] cursor-pointer font-sans text-[14px] font-semibold"
      style={{ border: '1.5px solid var(--kd-parchment-700)', background: '#fff', color: 'var(--kd-onyx)' }}>
      {icon === 'apple' ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      {label}
    </button>
  )
}

export function LoginPage() {
  const { signIn, isLoaded, setActive } = useSignIn()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const canSubmit = email.length > 0 && password.length > 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit || loading || !isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/')
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { longMessage?: string; message?: string }[] }
      setError(clerkErr.errors?.[0]?.longMessage ?? clerkErr.errors?.[0]?.message ?? 'Correo o contraseña incorrectos')
      setLoading(false)
    }
  }

  const handleSocial = async (strategy: 'oauth_apple' | 'oauth_google') => {
    if (!isLoaded) return
    await signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/login',
      redirectUrlComplete: '/',
    })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px] flex flex-col gap-7">
        <div className="flex justify-center">
          <Image src="/logo-kateandoug-wordmark.svg" alt="Kate&Doug" width={120} height={40} />
        </div>
        <div>
          <h1 className="font-display font-bold text-[30px] tracking-[-0.015em] leading-tight m-0" style={{ color: 'var(--kd-onyx)' }}>
            Bienvenido de vuelta
          </h1>
          <p className="text-[15px] mt-2 leading-[1.5] m-0" style={{ color: 'var(--kd-onyx-500)' }}>
            Inicia sesión para gestionar las citas de tu clínica.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FloatInput id="email" label="Correo electrónico" type="email" value={email} onChange={setEmail} />
          <FloatInput id="password" label="Contraseña" type="password" value={password} onChange={setPassword} />
          <div className="flex justify-end -mt-[2px]">
            <button type="button" className="bg-transparent border-none cursor-pointer p-0 text-[13px] font-semibold font-sans"
              style={{ color: 'var(--kd-persian-blue)' }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          {error && (
            <p className="text-[13px] font-medium text-center rounded-[10px] px-4 py-3 m-0"
              style={{ color: '#B3261E', background: '#FCE9E7' }}>
              {error}
            </p>
          )}
          <button type="submit" disabled={loading || !isLoaded}
            className="w-full py-[17px] px-6 mt-1 rounded-[12px] border-none text-white text-[16px] font-bold font-sans tracking-[-0.01em] transition-colors cursor-pointer"
            style={{ background: loading ? 'rgba(20,52,203,0.65)' : 'var(--kd-persian-blue)', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="flex items-center gap-[14px]">
          <div className="flex-1 h-px" style={{ background: 'var(--kd-parchment-700)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--kd-onyx-300)' }}>o continúa con</span>
          <div className="flex-1 h-px" style={{ background: 'var(--kd-parchment-700)' }} />
        </div>

        <div className="flex gap-3">
          <SocialBtn icon="apple" label="Apple" onClick={() => handleSocial('oauth_apple')} />
          <SocialBtn icon="google" label="Google" onClick={() => handleSocial('oauth_google')} />
        </div>

        <p className="text-[12px] text-center leading-[1.6] m-0" style={{ color: 'var(--kd-onyx-300)' }}>
          Al continuar, aceptas los{' '}
          <span className="cursor-pointer font-semibold" style={{ color: 'var(--kd-persian-blue)' }}>Términos de servicio</span>{' '}
          y la{' '}
          <span className="cursor-pointer font-semibold" style={{ color: 'var(--kd-persian-blue)' }}>Política de privacidad</span>{' '}
          de Kate&amp;Doug.
        </p>
      </div>
    </div>
  )
}
