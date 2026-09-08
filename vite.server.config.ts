import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import preserveDirectives from "rollup-preserve-directives";
import pkg from "./package.json" with { type: "json" };

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
  define: {
    __CINNAMON_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist/server",
    emptyOutDir: false,
    copyPublicDir: false,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/entry-server.ts"),
      external,
      preserveEntrySignatures: "exports-only",
      plugins: [preserveDirectives()],
      output: {
        dir: "dist/server",
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
