'use client'
import { useState, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuthCtx } from '@/context/AuthContext'

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuthCtx()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // transition state: 'idle' | 'out' | 'in'
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [dir, setDir] = useState<1 | -1>(1) // 1 = forward, -1 = back
  const pendingStep = useRef<'email' | 'password'>('email')

  const slideStyle = {
    transition: phase === 'in' ? 'opacity 220ms ease, transform 220ms ease' : phase === 'out' ? 'opacity 160ms ease, transform 160ms ease' : 'none',
    opacity: phase === 'out' ? 0 : 1,
    transform: phase === 'out'
      ? `translateX(${dir * -22}px)`
      : phase === 'in'
        ? `translateX(${dir * 22}px)`
        : 'translateX(0)',
  }

  const go = (nextStep: 'email' | 'password', direction: 1 | -1) => {
    setError('')
    setDir(direction)
    setPhase('out')
    pendingStep.current = nextStep
    setTimeout(() => {
      setStep(nextStep)
      setPhase('in')
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('idle')))
    }, 170)
  }

  const handleContinue = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    go('password', 1)
  }

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
    } else {
      await new Promise(r => setTimeout(r, 2500))
      router.replace('/')
    }
  }

  if (loading && !error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8">
        <Image src="/SVG/partners-logo.svg" alt="Kate&Doug for Vets" width={200} height={50} priority />
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid #e0e0e0', borderTopColor: '#1434CB', animation: 'spin 700ms linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[380px] flex flex-col gap-6">

        <div className="flex justify-center mb-8">
          <Image src="/SVG/partners-logo.svg" alt="Kate&Doug for Vets" width={220} height={55} />
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div style={slideStyle}>
            {step === 'email' ? (
              <div className="flex flex-col gap-5">
                <h1 className="text-[26px] font-bold leading-tight tracking-[-0.01em]" style={{ color: '#000' }}>
                  ¿Cuál es tu correo electrónico?
                </h1>

                <form onSubmit={handleContinue} className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Introducir correo electrónico"
                    autoComplete="email"
                    autoFocus
                    className="w-full px-4 py-[14px] text-[15px] rounded-[8px] outline-none"
                    style={{ border: '1.5px solid #E0E0E0', background: '#fff', color: '#000' }}
                  />
                  {error && <p className="text-[13px] text-center" style={{ color: '#B3261E' }}>{error}</p>}
                  <button
                    type="submit"
                    disabled={!email.trim()}
                    className="w-full py-[15px] rounded-[8px] text-[16px] font-bold border-none cursor-pointer"
                    style={{
                      background: email.trim() ? '#1434CB' : '#e0e0e0',
                      color: email.trim() ? '#fff' : '#999',
                      transition: 'background 300ms ease, color 300ms ease',
                    }}
                  >
                    Continuar
                  </button>
                </form>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: '#E0E0E0' }} />
                  <span className="text-[13px]" style={{ color: '#767676' }}>o</span>
                  <div className="flex-1 h-px" style={{ background: '#E0E0E0' }} />
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={signInWithGoogle} type="button"
                    className="w-full flex items-center justify-center gap-3 py-[14px] rounded-[8px] text-[15px] font-semibold cursor-pointer bg-white hover:bg-[#f5f5f5] active:bg-[#ebebeb] transition-colors duration-150"
                    style={{ border: '1.5px solid #E0E0E0', color: '#000' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
                  </button>
                  <button type="button"
                    className="w-full flex items-center justify-center gap-3 py-[14px] rounded-[8px] text-[15px] font-semibold cursor-pointer bg-white hover:bg-[#f5f5f5] active:bg-[#ebebeb] transition-colors duration-150"
                    style={{ border: '1.5px solid #E0E0E0', color: '#000' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continuar con Apple
                  </button>
                </div>

                <p className="text-[11px] text-center leading-[1.6]" style={{ color: '#767676' }}>
                  Al continuar, aceptas los{' '}
                  <span className="underline cursor-pointer">Términos de servicio</span>{' '}
                  y la{' '}
                  <span className="underline cursor-pointer">Política de privacidad</span>{' '}
                  de Kate&amp;Doug.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <button onClick={() => go('email', -1)}
                    className="text-[13px] font-semibold mb-3 bg-transparent border-none cursor-pointer p-0 block"
                    style={{ color: '#1434CB' }}>
                    ← {email}
                  </button>
                  <h1 className="text-[26px] font-bold leading-tight tracking-[-0.01em]" style={{ color: '#000' }}>
                    Introduce tu contraseña
                  </h1>
                </div>

                <form onSubmit={handleSignIn} className="flex flex-col gap-3">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    autoFocus
                    className="w-full px-4 py-[14px] text-[15px] rounded-[8px] outline-none"
                    style={{ border: '1.5px solid #E0E0E0', background: '#fff', color: '#000' }}
                  />
                  {error && <p className="text-[13px] text-center" style={{ color: '#B3261E' }}>{error}</p>}
                  <button type="submit" disabled={loading || !password}
                    className="w-full py-[15px] rounded-[8px] text-[16px] font-bold border-none cursor-pointer"
                    style={{ background: password && !loading ? '#1434CB' : '#e0e0e0', color: password && !loading ? '#fff' : '#999', transition: 'background 300ms ease, color 300ms ease' }}>
                    {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
