import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:opacity-90",
      secondary: "bg-muted text-foreground hover:opacity-90",
      outline: "border border-border bg-background hover:bg-muted",
      ghost: "hover:bg-muted",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
      "icon-sm": "h-8 w-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  /** Compose with another element (e.g. an anchor) instead of a `<button>`. */
  asChild?: boolean;
  render?: useRender.RenderProp;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, render, children, ...props }, ref) => {
    // `asChild` (Radix Slot idiom) composes with the single child element;
    // `render` is base-ui's native form. Both resolve to `useRender`'s `render`.
    const renderProp =
      render ??
      (asChild && React.isValidElement(children)
        ? (children as React.ReactElement)
        : <button />);

    return useRender({
      render: renderProp,
      ref,
      props: {
        className: button({ variant, size, className }),
        ...props,
        ...(asChild || render ? {} : { children }),
      },
    });
  },
);
Button.displayName = "Button";

export { button as buttonVariants };
