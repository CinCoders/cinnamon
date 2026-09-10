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
  // Keep the icon packages external so the subpath entry stays tiny and the
  // consumer's bundler tree-shakes the icon set directly from node_modules.
  "@hugeicons/react",
  "@hugeicons/core-free-icons",
  // The Icon re-export pulls in @base-ui/react and the cn() utils; keep those
  // external too so the subpath entry never vendors node_modules.
  "@base-ui/react",
  /^@base-ui\/react\//,
  "clsx",
  "tailwind-merge",
  "tailwind-variants",
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
    outDir: "dist/icons",
    emptyOutDir: false,
    copyPublicDir: false,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/entry-icons.ts"),
      external,
      preserveEntrySignatures: "exports-only",
      plugins: [preserveDirectives()],
      output: {
        dir: "dist/icons",
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
