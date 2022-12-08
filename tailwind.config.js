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
        light: "#F3F7F3",
        dark: "#1F141E",
        primary: "#E12427"
      }
    },
  },
  plugins: [require('@tailwindcss/forms'),require('tw-elements/dist/plugin')],
}
