import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const external = [
  "react",
  "react-dom",
  "react-router-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false, // não apaga o dist do build principal
    lib: {
      entry: path.resolve(__dirname, "src/entry-server.ts"),
      formats: ["es"],
      fileName: () => "cinnamon.server.js",
    },
    rollupOptions: {
      external,
      output: {
        format: "es",
        entryFileNames: "cinnamon.server.js",
      },
    },
  },
});
