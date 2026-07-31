/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b0b',
        bone: '#f7f5f2',
        sand: '#e8e2d8',
        clay: '#a89685',
        stone: '#6b6560',
        mist: '#d8d3cc',
        accent: '#8a7159',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(3.5rem, 9vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        display: ['clamp(2.5rem, 5vw, 5.5rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
        title: ['clamp(1.75rem, 3vw, 3rem)', { lineHeight: '1.1' }],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        fadeUp: 'fadeUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
        fadeIn: 'fadeIn 1.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
