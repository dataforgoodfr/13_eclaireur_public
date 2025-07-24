import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				'homepage-header': 'url("/transparency.png")'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
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
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: '#2E4488',
					50: '#f1f6fd',
					100: '#dfebfa',
					200: '#c6dbf7',
					300: '#9fc5f1',
					400: '#72a5e8',
					500: '#5185e0',
					600: '#3c6ad4',
					700: '#3356c2',
					800: '#2f479e',
					900: '#2e4488',
					950: '#1e284d',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#F4D65C',
					50: '#fefbec',
					100: '#fbf3ca',
					200: '#f7e790',
					300: '#f4d65c',
					400: '#f1c12e',
					500: '#eaa316',
					600: '#cf7d10',
					700: '#ac5a11',
					800: '#8c4614',
					900: '#733a14',
					950: '#421d06',
					foreground: '#000000'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
