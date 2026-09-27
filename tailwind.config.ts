import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "rgba(24, 24, 27, 0.75)",
          subtle: "rgba(18, 18, 22, 0.6)",
          hover: "rgba(39, 39, 42, 0.8)",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          active: "#6366f1",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        violet: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        emerald: {
          500: "#10b981",
        },
        amber: {
          500: "#f59e0b",
        }
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "brand-gradient": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      boxShadow: {
        "glow-brand": "0 0 25px -5px rgba(99, 102, 241, 0.4)",
        "glow-violet": "0 0 25px -5px rgba(139, 92, 246, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};
export default config;
