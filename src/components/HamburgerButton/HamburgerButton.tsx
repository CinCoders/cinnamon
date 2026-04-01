"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface HamburgerButtonProps {
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
}

export function HamburgerButton({
  isOpen = false,
  onClick = () => {},
  className,
  "aria-label": ariaLabel = "Open menu",
}: HamburgerButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group",
        // tamanho e layout igual ao original
        "relative h-4 w-[30px] p-0",
        // fundo branco do original (e mantém legível no dark)
        "bg-background",
        className
      )}
    >
      {/* Top */}
      <span
        className={cn(
          "absolute left-0 top-0 h-px w-full bg-[#db1e2f] transition-all duration-200 ease-in-out",
          // hover só quando fechado: top sobe
          !isOpen && "group-hover:top-[-20%]",
          // aberto: vira parte do X
          isOpen && "top-1/2 -translate-y-1/2 -rotate-45"
        )}
      />
      {/* Middle */}
      <span
        className={cn(
          "absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#db1e2f] transition-all duration-200 ease-in-out",
          isOpen && "opacity-0"
        )}
      />
      {/* Bottom */}
      <span
        className={cn(
          "absolute left-0 bottom-0 h-px w-full bg-[#db1e2f] transition-all duration-200 ease-in-out",
          // hover só quando fechado: bottom desce
          !isOpen && "group-hover:bottom-[-20%]",
          // aberto: vira parte do X
          isOpen && "bottom-1/2 translate-y-1/2 rotate-45"
        )}
      />

      {/* Trick: precisamos do `group-hover:*` funcionar */}
      <span className="sr-only">{ariaLabel}</span>
    </Button>
  );
}
