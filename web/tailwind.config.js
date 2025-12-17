/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#052F2A',
        surface: '#0B3F39',
        'mint-surface': '#CDE8DC',
        'mint-surface-alt': '#DCEFE6',
        'text-primary': '#E7F5F1',
        'text-secondary': '#BBE1D5',
        'text-dark': '#0B3F39',
        'accent-green': '#11C48D',
        'accent-teal': '#00BFA5',
        'accent-lime': '#AEEA00',
        'accent-purple': '#B39DDB',
        'accent-orange': '#FFA726',
        'accent-yellow': '#FFD54F',
        'accent-yellow-dark': '#F57F17',
        divider: '#114C45',
        primary: '#2E7D32',
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        'text-light': '#9E9E9E',
      },
      spacing: {
        xs: '6px',
        sm: '10px',
        md: '16px',
        lg: '20px',
        xl: '28px',
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '22px',
        pill: '28px',
      },
    },
  },
  plugins: [],
}

