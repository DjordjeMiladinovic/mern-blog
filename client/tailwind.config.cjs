// tailwind.config.cjs
const flowbite = require('flowbite/plugin');
const tailwindScrollbar = require('tailwind-scrollbar');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite, tailwindScrollbar],
};
