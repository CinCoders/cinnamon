import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function phoneToTel(phone?: string): string {
  if (!phone) return "";
  return phone.replace(/[() -]+/g, "");
}