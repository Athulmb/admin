/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/**/*.{js,jsx,ts,tsx}', // Included from the second config
    ],
    theme: {
      extend: {
        typography: {
          outlined: {
            css: {
              '--tw-text-opacity': '1',
              color: 'transparent',
              '-webkit-text-stroke': '1px #22c55e',
            },
          },
        },
        animation: {
          scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
          first: 'moveVertical 30s ease infinite',
          second: 'moveInCircle 20s reverse infinite',
          third: 'moveInCircle 40s linear infinite',
          fourth: 'moveHorizontal 40s ease infinite',
          fifth: 'moveInCircle 20s ease infinite',
          spinSlow: 'spinSlow 4s linear infinite',
        },
        keyframes: {
          scroll: {
            to: {
              transform: 'translate(calc(-50% - 0.5rem))',
            },
          },
          moveHorizontal: {
            '0%': { transform: 'translateX(-50%) translateY(-10%)' },
            '50%': { transform: 'translateX(50%) translateY(10%)' },
            '100%': { transform: 'translateX(-50%) translateY(-10%)' },
          },
          moveInCircle: {
            '0%': { transform: 'rotate(0deg)' },
            '50%': { transform: 'rotate(180deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          moveVertical: {
            '0%': { transform: 'translateY(-50%)' },
            '50%': { transform: 'translateY(50%)' },
            '100%': { transform: 'translateY(-50%)' },
          },
          spinSlow: {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        },
      },
    },
    plugins: [],
  };
  