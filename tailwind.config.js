/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light "stadium" palette
        cream: '#efe9df', // warm page background
        sand: '#f5f1ea', // subtle hover / inset surfaces
        ink: '#1c2333', // primary text
        line: '#e7e0d4', // hairline borders on cards
        brand: {
          DEFAULT: '#16a34a', // emerald green (headers, primary actions)
          600: '#15803d',
          50: '#e8f6ee',
        },
        gold: '#f59e0b', // 1st place / round titles
        // position-badge accents
        pos1: '#f59e0b',
        pos2: '#7c8aa5',
        pos3: '#f97316',
        pos4: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.97)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'trophy-bounce': {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.2s ease-out',
        'trophy-bounce': 'trophy-bounce 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
