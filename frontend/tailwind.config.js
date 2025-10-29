/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dota-themed colors
        'dota': {
          'primary': '#1c1c1f',
          'secondary': '#282830',
          'accent': '#5383e8',
          'gold': '#d4af37',
          'red': '#dc3545',
          'green': '#28a745',
        },
        // Rank colors
        'rank': {
          'herald': '#595247',
          'guardian': '#6b9440',
          'crusader': '#a67f3d',
          'archon': '#c49147',
          'legend': '#b74aa8',
          'ancient': '#4f9bd6',
          'divine': '#5cb3f7',
          'immortal': '#e4ae39',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'dota-gradient': 'linear-gradient(135deg, #1c1c1f 0%, #282830 100%)',
      },
    },
  },
  plugins: [],
}