const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: {
    mode: 'all',
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        beat: 'beat 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        gray: colors.gray,
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
