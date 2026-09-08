import type { StorybookConfig } from '@storybook/react-vite';
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const { version } = JSON.parse(
  readFileSync(path.resolve(dirname, "../package.json"), "utf8"),
) as { version: string };

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],

  "features": {
    sidebarOnboardingChecklist: false
  },

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

    viteConfig.define = {
      ...viteConfig.define,
      __CINNAMON_VERSION__: JSON.stringify(version),
    };

    return viteConfig;
  },
};
export default config;
