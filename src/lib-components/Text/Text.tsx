import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const text = tv({
  base: "text-cinnamon-dark dark:text-gray-100",
  variants: {
    variant: {
      title: "text-2xl font-bold tracking-tight sm:text-3xl",
      subtitle: "text-lg font-semibold tracking-tight",
      description: "mt-1 text-sm text-gray-600 dark:text-gray-400",
      announce: "text-lg font-semibold",
      tag: "block text-sm font-medium text-gray-700 dark:text-gray-300",
      alarm: "mt-1 text-xs text-red-500",
      headline: "text-base font-semibold text-gray-900 dark:text-gray-100",
      alert: "text-xl font-semibold text-gray-900 dark:text-gray-100",
      murmur: "max-w-md text-sm text-gray-600 dark:text-gray-400",
      emphasis: "font-semibold",
      whisper: "text-xs text-blue-800 dark:text-blue-300",
      faint: "text-xs text-gray-400 dark:text-gray-500",
    },
  },
  defaultVariants: { variant: "description" },
});

const tagByVariant = {
  title: "h1",
  subtitle: "h2",
  description: "p",
  announce: "h2",
  tag: "label",
  alarm: "p",
  headline: "h3",
  alert: "h2",
  murmur: "p",
  emphasis: "span",
  whisper: "p",
  faint: "span",
} as const;

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof text> {
  as?: keyof JSX.IntrinsicElements;
}

export function Text({ variant, as, className, ...props }: TextProps) {
  const Tag = as ?? tagByVariant[variant ?? "description"];
  return React.createElement(Tag, { className: text({ variant, className }), ...props });
}
