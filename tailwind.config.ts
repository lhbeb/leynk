import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: '#58A9BE',
        'accent-2': '#D75852',
        'accent-3': '#F3C845',
        'text-primary': '#2C3A42',
        'bg-primary': '#F7F7EF',
      },
    },
  },
  plugins: [],
};
export default config;

