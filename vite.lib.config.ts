import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import preserveDirectives from "rollup-preserve-directives";

const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "motion",
  "motion/react",
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
    emptyOutDir: true,
    copyPublicDir: false,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/index.ts"),
      external,
      preserveEntrySignatures: "exports-only",
      plugins: [preserveDirectives()],
      output: {
        dir: "dist",
        format: "es",
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        exports: "named",
      },
    },
  },
});
