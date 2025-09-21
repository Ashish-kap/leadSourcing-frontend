import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-checkbox",
          ],
          utils: ["axios", "clsx", "tailwind-merge"],
        },
      },
    },
    target: "esnext",
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
  },
  define: {
    global: "globalThis",
  },
});
