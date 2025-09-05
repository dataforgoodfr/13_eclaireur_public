import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'kanit-bold': [
          'var(--font-kanit)',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        tag: [
          '14px',
          {
            lineHeight: 'auto',
            fontWeight: '400',
          },
        ],
        'tag-lg': [
          '16px',
          {
            lineHeight: 'auto',
            fontWeight: '400',
          },
        ],
        'tag-mobile': [
          '14px',
          {
            lineHeight: 'auto',
            fontWeight: '400',
          },
        ],
        link: [
          '18px',
          {
            lineHeight: 'auto',
          },
        ],
      },
      backgroundImage: {
        // 'homepage-header': 'url("/transparency.png")',
        'gradient-fade':
          'linear-gradient(to right, transparent 0%, #FAF79E 10%, #FAF79E 90%, transparent 100%)',
      },
      colors: {
        // Semantic colors
        primary: {
          DEFAULT: '#303F8D', // Bleu
          light: '#CAD2FC', // Bleu clair
          foreground: '#FFFFFF',
          50: '#f1f5fd',
          100: '#e0e9f9',
          200: '#c9d9f4',
          300: '#a3c1ed',
          400: '#779fe3',
          500: '#577fda',
          600: '#4364cd',
          700: '#3952bc',
          800: '#303f8d',
          900: '#2e3c7a',
          950: '#20274b',
        },
        secondary: {
          DEFAULT: '#F4D93E', // Jaune (Yellow)
          dark: '#EE8100', // Brand 01 or similar
          foreground: '#000',
          50: '#fdfbe9',
          100: '#fbf8c6',
          200: '#f9ed8f',
          300: '#f4d93e',
          400: '#f0c81f',
          500: '#e0b012',
          600: '#c1890d',
          700: '#9a630e',
          800: '#804e13',
          900: '#6d4016',
          950: '#3f2109',
        },
        warning: {
          DEFAULT: '#F59E42', // Orange, or use Brand 02 if more suitable
          foreground: '#000',
        },
        info: {
          DEFAULT: '#AEB8E6', // Bleu clair (optional)
          foreground: '#2E4488',
        },
        muted: {
          DEFAULT: '#737373', // Gris
          default: '#737373', // Gris
          light: '#E2E2E2', // Gris clair
          border: '#F6F6F6', // Gris border
          foreground: 'hsl(var(--muted-foreground))',
        },
        background: '#fff', // Blanc
        foreground: '#303F8D', // Primary color as default text color
        // Brand/Chart colors for data viz, etc
        brand: {
          1: '#FAF79E', // Brand 01
          2: '#E8F787', // Brand 02
          3: '#D7F787', // Brand 03
        },
        score: {
          A: '#79B381',
          B: '#B2D675',
          C: '#FFDE8B',
          D: '#FFA466',
          E: '#FF8573',
        },
        'score-transparence': {
          1: '#00C882',
          2: '#7FF083',
          3: '#F4D93E',
          4: '#FFB020',
          5: '#FB735F',
          mp: 'var(--brand-2)',
          subvention: 'var(--brand-1)',
          // jaune
          nodata: 'var(--secondary)',
        },
        treemap: {
          // Legacy color palette (multicolored)
          legacy: {
            1: '#E8F787', // light green
            2: '#FAF79E', // very light yellow
            3: '#CAD2FC', // light blue
            4: '#F4D93E', // yellow
            5: '#EE8100', // dark orange
          },
          // New green palette (3 shades)
          green: {
            light: '#C8E6C8',
            medium: '#58A858',
            dark: '#1A5A1A',
          },
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          secondary: {
            foreground: {
              '1': 'var(--card-secondary-foreground-1)',
              '2': 'var(--card-secondary-foreground-2)',
              '3': 'var(--card-secondary-foreground-3)',
              '4': 'var(--card-secondary-foreground-4)',
            },
          },
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'tl-br': '0.5rem 0 0.5rem 0', // Custom utility for top-left and bottom-right rounding
        'tl-br-sm': '0.25rem 0 0.25rem 0', // Small version
        'tl-br-lg': '0.75rem 0 0.75rem 0', // Large version
        'tl-br-xl': '1rem 0 1rem 0', // Extra large version
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    animate,
    plugin(({ addBase }) => {
      addBase({
        h1: {
          fontSize: '36px',
          lineHeight: '40px',
          fontWeight: '700',
          '@media (min-width: 1024px)': {
            fontSize: '44px',
            lineHeight: '56px',
          },
        },
        h2: {
          fontSize: '32px',
          lineHeight: '38px',
          fontWeight: '700',
          '@media (min-width: 1024px)': {
            fontSize: '40px',
            lineHeight: '44px',
          },
        },
        h3: {
          fontSize: '28px',
          lineHeight: '32px',
          fontWeight: '700',
          '@media (min-width: 1024px)': {
            fontSize: '32px',
            lineHeight: '36px',
          },
        },
        h4: {
          fontSize: '22px !important',
          lineHeight: '28px !important',
          fontWeight: '700 !important',
          '@media (min-width: 1024px)': {
            fontSize: '24px !important',
            lineHeight: '28px !important',
          },
        },
      });
    }),
  ],
} satisfies Config;
