/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        'aurora-a': {
          '0%, 100%': { transform: 'translate(-8%, -6%) scale(1)' },
          '50%':      { transform: 'translate(10%, 8%) scale(1.18)' },
        },
        'aurora-b': {
          '0%, 100%': { transform: 'translate(6%, 4%) scale(1.1)' },
          '50%':      { transform: 'translate(-10%, -8%) scale(0.9)' },
        },
        'aurora-c': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '50%':      { transform: 'translate(-6%, 10%) scale(1.15)' },
        },
        'reveal-up': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        sheen: {
          '0%':   { transform: 'translateX(-140%) skewX(-18deg)' },
          '100%': { transform: 'translateX(240%) skewX(-18deg)' },
        },
        'badge-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(224,184,113,0.5)' },
          '50%':      { boxShadow: '0 0 0 6px rgba(224,184,113,0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease both',
        'aurora-a': 'aurora-a 20s ease-in-out infinite',
        'aurora-b': 'aurora-b 24s ease-in-out infinite',
        'aurora-c': 'aurora-c 28s ease-in-out infinite',
        'reveal-up': 'reveal-up 0.55s cubic-bezier(.2,.75,.25,1) both',
        sheen: 'sheen 3.6s ease-in-out infinite',
        'badge-pulse': 'badge-pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
