// import path from "path";
// import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
  
// });

import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 3000,
    allowedHosts: [
      "leadsourcing-frontend-production.up.railway.app",
      "localhost",
    ],
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 3000,
    allowedHosts: true, // <- Change to boolean true instead of string "all"
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});