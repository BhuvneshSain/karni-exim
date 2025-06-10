module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#EBB924',
        charcoal: {
          light: '#3A5161',
          DEFAULT: '#344C5D',
          dark: '#2D4251'
        },
        beige: '#FEFBE3',
        cornsilk: '#FFFCE4',
        'battleship-gray': '#798789',
        'karni': {
          primary: '#344C5D',
          secondary: '#EBB924',
          light: '#FEFBE3',
          dark: '#2D4251',
          gray: '#798789'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        display: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}


