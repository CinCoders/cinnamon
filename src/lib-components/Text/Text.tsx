import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const text = tv({
  base: "text-cinnamon-dark dark:text-gray-100",
  variants: {
    variant: {
      title: "text-2xl font-bold tracking-tight sm:text-3xl",
      subtitle: "text-lg font-semibold tracking-tight",
      description: "mt-1 text-sm text-gray-600 dark:text-gray-400",
    },
  },
  defaultVariants: { variant: "description" },
});

const tagByVariant = {
  title: "h1",
  subtitle: "h2",
  description: "p",
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
