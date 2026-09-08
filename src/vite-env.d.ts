/** Injected at build time from package.json `version` (see vite configs). */
declare const __CINNAMON_VERSION__: string;

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.svg?raw" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}
