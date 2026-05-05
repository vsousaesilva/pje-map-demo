/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pje: {
          blue:    '#004b8d',
          mid:     '#0066cc',
          light:   '#1a90ff',
          accent:  '#e8a000',
          sidebar: '#1a2b42',
          hover:   '#243d5c',
          active:  '#004b8d',
        },
      },
      fontFamily: {
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
    },
  },
  plugins: [],
}
