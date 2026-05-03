/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#EBE2C8',
        ink: '#0F0A05',
        'ink-soft': '#3D362A',
        'ink-mute': '#6B6253',
        border: '#D4C7A3',
        forest: '#0F4029',
        'forest-dark': '#082819',
        'forest-tint': '#E2EBE4',
        copper: '#B5663D',
        'copper-tint': '#F7E8D9',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 4px 6px rgba(15, 10, 5, 0.08)',
        'warm-lg': '0 10px 15px rgba(15, 10, 5, 0.12)',
      },
    },
  },
  plugins: [],
}
