import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          dark: '#0f1f35',
          light: '#2d4a6f',
        },
        secondary: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
        },
        accent: {
          DEFAULT: '#64748b',
          light: '#94a3b8',
        },
        cream: {
          DEFAULT: '#faf9f7',
          light: '#fefefe',
          dark: '#f5f4f2',
        },
      },
    },
  },
  plugins: [],
}
export default config
