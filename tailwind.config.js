/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolate: {
          DEFAULT: '#3d2b1f',
          light: '#5d4037',
          dark: '#2b1d15',
        },
        'pitch-green': {
          DEFAULT: '#2e7d32',
          light: '#4caf50',
          dark: '#1b5e20',
        },
      },
    },
  },
  plugins: [],
}
