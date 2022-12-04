/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        light: "#F1F3EB",
        dark: "#42424A",
        primary: "#979097"
      }
    },
  },
  plugins: [require('@tailwindcss/forms'),require('tw-elements/dist/plugin')],
}
