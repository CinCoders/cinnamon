import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { resolveCinnamonIcon, type CinnamonIconId } from "@/icons";

export interface IconProps {
  iconUrl?: string;
  alt?: string;
  IconComponent?: ComponentType<{ className?: string }>;
  iconId?: CinnamonIconId;
  className?: string;
  sizeRem?: number; // opcional, default ~2.35
}

/**
 * Renderiza um ícone a partir de uma das três fontes suportadas, nesta ordem
 * de precedência: `iconUrl` (imagem), `IconComponent` (componente do consumidor),
 * `iconId` (chave do registry da lib).
 */
export function Icon({
  iconUrl,
  alt = "",
  IconComponent,
  iconId,
  className,
  sizeRem = 2.35,
}: IconProps) {
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
