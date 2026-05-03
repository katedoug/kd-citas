import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'kd-prussian':      'var(--kd-prussian-blue)',
        'kd-persian':       'var(--kd-persian-blue)',
        'kd-lavender':      'var(--kd-lavender)',
        'kd-onyx':          'var(--kd-onyx)',
        'kd-white':         'var(--kd-white)',
        'kd-parchment':     'var(--kd-parchment)',
        'kd-parchment-200': 'var(--kd-parchment-200)',
        'kd-parchment-700': 'var(--kd-parchment-700)',
        bg:                 'var(--bg)',
        'bg-elevated':      'var(--bg-elevated)',
        'bg-soft':          'var(--bg-soft)',
        fg1:                'var(--fg1)',
        fg2:                'var(--fg2)',
        fg3:                'var(--fg3)',
        border:             'var(--border)',
        'fg-accent':        'var(--fg-accent)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-sans)',    'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)',    'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '6px', sm: '10px', md: '14px', lg: '20px', xl: '28px', pill: '999px',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      keyframes: {
        fadeIn:      { from: { opacity: '0' }, to: { opacity: '1' } },
        stepIn:      { from: { transform: 'translateX(18px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        stepBack:    { from: { transform: 'translateX(-18px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        sheetIn:     { from: { transform: 'translateY(20px) scale(0.98)', opacity: '0' }, to: { transform: 'translateY(0) scale(1)', opacity: '1' } },
        slideUpFade: { from: { transform: 'translate(-50%,30px)', opacity: '0' }, to: { transform: 'translate(-50%,0)', opacity: '1' } },
        newApptIn:   { '0%': { transform: 'scale(1.05)', opacity: '0' }, '60%': { transform: 'scale(0.98)', opacity: '1' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
      animation: {
        'fade-in':     'fadeIn 200ms cubic-bezier(0.32,0.72,0.0,1)',
        'step-in':     'stepIn 260ms cubic-bezier(0.22,1,0.36,1)',
        'step-back':   'stepBack 260ms cubic-bezier(0.22,1,0.36,1)',
        'sheet-in':    'sheetIn 320ms cubic-bezier(0.22,1,0.36,1)',
        'slide-up':    'slideUpFade 280ms cubic-bezier(0.22,1,0.36,1)',
        'new-appt':    'newApptIn 400ms cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
}
export default config
