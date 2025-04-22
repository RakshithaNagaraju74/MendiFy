/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'pastel-purple': '#f3e8ff',
        animation: {
          'bounce-slow': 'bounce 2.5s infinite',
          rotate: {
            1: '1deg',
          },
        },
      },
    },
  },
  
  plugins: [],
}
