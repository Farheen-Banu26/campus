import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Tailwind v4 uses built-in engine (NO postcss.config.js)
export default defineConfig({
  plugins: [react()],
});
