import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function phoneToTel(phone?: string): string {
  if (!phone) return "";
  return phone.replace(/[() -]+/g, "");
}

/**
 * Inline an `?raw` SVG as an `<img src>`-safe data URI. Used instead of a plain
 * `import "*.svg"` when the file is over Vite's inline limit — Vite would emit a
 * separate asset with a root-absolute `/assets/...` URL that consumers serving
 * the package from `node_modules` cannot resolve.
 */
export function svgDataUri(raw: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(raw)}`;
}