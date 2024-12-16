module.exports = {
  corePlugins: {
    listStyleType: false,
    listStylePosition: false,
    preflight: false
  },
  purge: ['./src/**/*.{js,jsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    screens: {
      sm: '640px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1536px'
    },
    fontSize: {
      xs: '10px',
      sm: '12px',
      md: '14px',
      lg: '18px',
      xl: '24px'
    }
  },
  variants: {
    extend: {}
  },
  plugins: [],
  prefix: 'tw-'
}
