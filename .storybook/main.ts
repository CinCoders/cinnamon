import type { StorybookConfig } from '@storybook/react-vite';
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],

  "addons": [
    //"@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],

  "framework": "@storybook/react-vite",

  async viteFinal(viteConfig) {
    const replacement = path.resolve(dirname, "../src");
    
    viteConfig.resolve ??= {};
    const currentAlias = viteConfig.resolve.alias;
    
    // alias can be array or object: we treat both cases
    viteConfig.resolve.alias = Array.isArray(currentAlias) 
      ? [...currentAlias, { find: "@", replacement }]
      : { ...(currentAlias ?? {}), "@": replacement };

    // --- Tailwind v4 plugin ---
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(tailwindcss());

    return viteConfig;
  },
};
export default config;