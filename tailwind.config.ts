import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      minHeight: {
        "main-content": "calc(100vh - 64px)"
      },
      colors: {
        'stock-red': '#EA5E5B',
        'stock-green': '#51a551',
      },
      margin: {
        'home-market-info': "12px auto 60px",
      },
      boxShadow: {
        'home-market-info': "0 1px 3px rgba(0,0,0,0.15)",
      }
    },
  },
  
  plugins: [],
};
export default config;
