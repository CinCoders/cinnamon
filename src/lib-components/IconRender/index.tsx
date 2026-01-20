"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconRendererProps {
  iconUrl?: string;
  alt?: string;
  IconComponent?: React.ComponentType<any>;
  className?: string;
  sizeRem?: number; // opcional, default ~2.35
}

export function IconRenderer({
  iconUrl,
  alt = "",
  IconComponent,
  className,
  sizeRem = 2.35,
}: IconRendererProps) {
  const size = `${sizeRem}rem`;

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={alt ? `${alt} icon` : "icon"}
          style={{ width: size, height: size }}
        />
      ) : IconComponent ? (
        <IconComponent />
      ) : null}
    </div>
  );
}
