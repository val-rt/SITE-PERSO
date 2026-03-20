/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#0B1120',    // Bleu nuit très profond (fond)
        bgCard: '#1E293B',    // Bleu ardoise (pour les cartes)
        accentBlue: '#3B82F6', // Bleu électrique (boutons, surlignages)
        textLight: '#F8FAFC', // Blanc cassé/bleuté pour le texte
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}