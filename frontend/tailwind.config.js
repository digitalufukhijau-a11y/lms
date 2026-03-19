/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
        },
        accent: {
          500: 'rgb(var(--accent-500) / <alpha-value>)',
        },
        ink: {
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
        },
        surface: {
          0: 'rgb(var(--surface-0) / <alpha-value>)',
          1: 'rgb(var(--surface-1) / <alpha-value>)',
          2: 'rgb(var(--surface-2) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        danger: {
          500: 'rgb(var(--danger-500) / <alpha-value>)',
        },
        warn: {
          500: 'rgb(var(--warn-500) / <alpha-value>)',
        },
        success: {
          500: 'rgb(var(--success-500) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.6875rem', { lineHeight: '1.4' }],
        sm: ['0.8125rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.7' }],
        lg: ['1.125rem', { lineHeight: '1.4' }],
        xl: ['1.25rem', { lineHeight: '1.3' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '4xl': ['2rem', { lineHeight: '1.25' }],
        '5xl': ['2.625rem', { lineHeight: '1.15' }],
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
        16: '4rem',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,.06)',
        md: '0 4px 12px rgba(0,0,0,.08)',
        lg: '0 8px 24px rgba(0,0,0,.12)',
        '2xl': '0 20px 60px rgba(0,0,0,.18)',
      },
    },
  },
  plugins: [],
}
