module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors :{
        navy : '#03093a',
        red : '#ff0303',
        yellow : '#fff617',
        green : '#70ff00',
        blue : '#00b7f1',
        purple:'#950eff',
        pink:'#ff0ebb',
        logo:'#ff6666',
        dark :'#181818'
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#000000',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
          },
        },
      },
    },
    screens : {
      'xs' : '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
