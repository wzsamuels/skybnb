/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './node_modules/tw-elements/dist/js/**/*.js',
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  theme: {
    extend: {
      colors: {
        light: "#F3F7F3",
        dark: "#1F141E",
        primary: "#E12427"
      },
      boxShadow: {
        'full': '0px 6px 20px rgba(0,0,0,0.2)'
      }
    },
  },
  plugins: [require('@tailwindcss/forms'),require('tw-elements/dist/plugin'), require('@tailwindcss/line-clamp')],
}
