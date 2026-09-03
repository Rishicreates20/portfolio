/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        base: '#08080b',
        raise: '#0f0f14',
        surface: 'rgba(255,255,255,0.035)',
        line: 'rgba(255,255,255,0.09)',
        line2: 'rgba(255,255,255,0.16)',
        fg: '#eceae3',
        dim: '#9a9aa4',
        faint: '#5f5f6a',
        accent: '#e9a23b',
        accent2: '#f3c17a',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        glow: { '0%,100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
