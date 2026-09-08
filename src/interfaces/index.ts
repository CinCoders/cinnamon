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

export interface SidebarNavItem {
  id: string | number;
  title: string;
  href?: string;
  external?: boolean;
  IconComponent?: ComponentType<{ className?: string }>;
  iconId?: CinnamonIconId;
}

/** Seção colapsável da sidebar. Renderizada sob um rótulo clicável. */
export interface SidebarNavGroup {
  id: string | number;
  label: string;
  defaultOpen?: boolean;
  items: SidebarNavItem[];
}

/**
 * Conteúdo da sidebar da aplicação. Renderizada dentro de um Drawer,
 * aberta pelo botão de menu do Navbar.
 */
export interface SidebarData {
  navMain: SidebarNavItem[];
  navGroups?: SidebarNavGroup[];
}

export interface Option {
  value: string;
  text: string;
}
