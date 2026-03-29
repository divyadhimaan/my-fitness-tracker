import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
      colors: {
        clay:   { DEFAULT: '#E8B4A0', light: '#FDF6F3', dark: '#C07050' },
        sage:   { DEFAULT: '#A0C4B8', light: '#F3FAF8', dark: '#3A8A72' },
        slate:  { DEFAULT: '#A0AED4', light: '#F3F5FC', dark: '#4050A0' },
        lavender: { DEFAULT: '#C4A0D4', light: '#FAF3FC', dark: '#8050A0' },
        ink:    { DEFAULT: '#2A2520', muted: '#5A524A', faint: '#9A9087' },
        cream:  { DEFAULT: '#FAFAF8', card: '#FFFFFF', border: '#EDE8E3' },
      },
    },
  },
  plugins: [],
}
export default config
