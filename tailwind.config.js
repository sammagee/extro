const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      animation: {
        beat: 'beat 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        gray: colors.zinc,
        green: colors.emerald,
        brand: colors.emerald,
      },
      keyframes: {
        beat: {
          '0%, 40%, 80%, 100%': { transform: 'scale(1)' },
          '20%, 60%': { transform: 'scale(1.15)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.200'),
            code: {
              color: theme('colors.gray.300'),
            },
            strong: {
              color: theme('colors.gray.300'),
            },
            a: {
              color: theme('colors.gray.300'),
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
