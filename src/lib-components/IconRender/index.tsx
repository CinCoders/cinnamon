"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveCinnamonIcon, type CinnamonIconId } from "@/icons";

export interface IconRendererProps {
  iconUrl?: string;
  alt?: string;
  IconComponent?: React.ComponentType<any>;
  iconId?: CinnamonIconId;
  className?: string;
  sizeRem?: number; // opcional, default ~2.35
}

export function IconRenderer({
  iconUrl,
  alt = "",
  IconComponent,
  iconId,
  className,
  sizeRem = 2.35,
}: IconRendererProps) {
  const size = `${sizeRem}rem`;
  const RegistryIcon = resolveCinnamonIcon(iconId);

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={alt ? `${alt} icon` : "icon"}
        style={{ width: size, height: size }}
      />
    );
  }

  if (IconComponent) {
    return <IconComponent className={cn(className)} />;
  }

  if (RegistryIcon) {
    return <RegistryIcon className={cn(className)} />;
  }

  return null;
}
