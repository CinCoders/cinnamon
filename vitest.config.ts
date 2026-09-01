/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import path from "node:path";

// Unit tests da lógica pura de auth. Roda em node, isolado do setup
// browser-mode do Storybook (@storybook/addon-vitest).
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
