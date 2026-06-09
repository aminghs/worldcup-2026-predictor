/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Original branding palette — deep "pitch" navy + electric accent
        pitch: {
          950: '#070b1a',
          900: '#0b1224',
          800: '#111a33',
          700: '#1a2747',
          600: '#24365f',
        },
        accent: {
          DEFAULT: '#16e0a3', // electric green
          400: '#3ef0bb',
          600: '#0bb582',
        },
        gold: '#f5c451',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'trophy-bounce': {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.25s ease-out',
        'trophy-bounce': 'trophy-bounce 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
