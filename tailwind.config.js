module.exports = {
  corePlugins: {
    listStyleType: false,
    listStylePosition: false,
    preflight: false
  },
  purge: ['./src/**/*.{js,jsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        'spin-reverse': 'spin 2s linear infinite',
      }
    },
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
    },
    colors: {
      black: 'rgba(0,0,0,0.87)',
      grey: '#bfd0da',
      darkGrey: '#7c878e',
      lighterGrey: '#f5f8f9',
      white: '#ffffff',
    }
  },
  variants: {
    extend: {}
  },
  plugins: [],
  prefix: 'tw-'
}
