import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-green': '#10b981',
        'eco-green-light': '#34d399',
        'eco-green-dark': '#047857',
        'eco-blue': '#3b82f6',
        'eco-blue-light': '#60a5fa',
        'eco-blue-dark': '#1d4ed8',
        'eco-gold': '#fbbf24',
        'brand-black': '#0a0a0a',
        'brand-gray': '#171717',
        'brand-gray-light': '#262626'
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
