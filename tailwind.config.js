/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pale: '#F4F7FC',
        navy: '#1C2B5E',
        'navy-soft': '#2A5298',
        'navy-mute': '#6B7FA3',
        border: '#C9D8EE',
        blue: '#2A5298',
        'blue-dark': '#1C2B5E',
        'blue-tint': '#E8EFF8',
        mid: '#4A86C8',
        'mid-tint': '#EBF3FB',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 4px 6px rgba(28, 43, 94, 0.08)',
        'warm-lg': '0 10px 15px rgba(28, 43, 94, 0.12)',
      },
    },
  },
  plugins: [],
}
