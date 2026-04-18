/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1814',
          muted: '#5c5850',
          faint: '#9b978e',
        },
        paper: {
          DEFAULT: '#faf9f6',
          warm: '#f4f1ea',
          card: '#ffffff',
        },
        rule: {
          DEFAULT: '#e8e4da',
          strong: '#ccc8be',
        },
        accent: {
          DEFAULT: '#2c4a8a',
          light: '#edf1fa',
          muted: '#6b87c0',
        },
        danger: {
          DEFAULT: '#c0392b',
          light: '#fdf0ee',
        },
        warn: {
          DEFAULT: '#b07d2a',
          light: '#fdf6e8',
        },
        success: {
          DEFAULT: '#2a7a52',
          light: '#edf7f2',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'Fira Code', 'monospace'],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '20px',
      },
    },
  },
  plugins: [],
}
