import type { Config } from "tailwindcss";

/**
 * Material Design 3 Theme Reference:
 * https://m3.material.io/styles/color/the-color-system/tokens
 * https://m3.material.io/styles/typography/tokens
 * https://m3.material.io/styles/elevation/tokens
 */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  plugins: [],
};
export default config;
