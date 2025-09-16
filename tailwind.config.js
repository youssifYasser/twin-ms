/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'ibm-plex': ['IBM Plex Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          bg: '#030712',
          border: 'rgba(55, 65, 81, 0.5)',
        },
        'active-page': 'rgba(59, 160, 145, 1)',
        'bg-card': 'rgb(8, 20, 30)',
      },
      backgroundImage: {
        'sidebar-gradient':
          'linear-gradient(0deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
        'appbar-gradient':
          'linear-gradient(90deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
      },
      backdropBlur: {
        24: '24px',
      },
      boxShadow: {
        appbar:
          '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
