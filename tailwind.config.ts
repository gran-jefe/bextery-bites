import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#BD4935',
          brown: '#9A684D',
          rose: '#D0B7B2',
          dark: '#4F4140',
          cream: '#FAF3F1',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['var(--font-saillen)', 'serif'],
        body: ['var(--font-poppins)', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        'lg': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(79, 65, 64, 0.1)',
        'warm': '0 8px 24px rgba(189, 73, 53, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
