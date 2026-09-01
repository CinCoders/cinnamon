import type { AnchorHTMLAttributes, ComponentType, SVGProps } from "react";
import type { CinnamonIconId } from "@/icons";

/**
 * Componente de link injetável. Permite ao consumidor passar `next/link`,
 * o `Link` do react-router, etc., para preservar client-side routing.
 * O default interno é um `<a>` cru (full reload em navegação interna no Next).
 */
export type LinkComponent = ComponentType<
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>;

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Position {
  id: number;
  name: string;
  roles?: Role[];
}

export interface User {
  name: string;
  email: string;
  username?: string;
  profilePictureUrl?: string;
  positions?: Position[];
}

export interface System {
  title: string;
  iconUrl?: string;
  IconComponent?: ComponentType<SVGProps<SVGSVGElement>>;
  iconId?: CinnamonIconId;
  description: string;
  href: string;
  visibleRole?: string;
}

export interface Link {
  id: number;
  iconUrl?: string;
  IconComponent?: ComponentType<{ className?: string }>;
  iconId?: CinnamonIconId;
  title: string;
  href?: string;
  external?: boolean;
}

export interface SideMenuLink extends Link {
  children?: Link[];
}

export interface Option {
  value: string;
  text: string;
}
