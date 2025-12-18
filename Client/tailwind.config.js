// /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',  // Blue-500
        accent: '#6366f1',   // Indigo-500
        neutral: '#94a3b8',  // Slate-400
      },
    },
  },
  plugins: [],
}