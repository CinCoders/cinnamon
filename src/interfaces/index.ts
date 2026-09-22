import type { AnchorHTMLAttributes, ComponentType, SVGProps } from "react";
import type { CinnamonIconId } from "@/icons";

/**
 * Injectable link component. Lets the consumer pass `next/link`,
 * react-router's `Link`, etc., to preserve client-side routing.
 * The internal default is a plain `<a>` (full reload on internal navigation in Next).
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
  /** Name shown in the applications menu. Recommended up to ~24 characters — longer titles are truncated with an ellipsis. */
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

/** Collapsible sidebar section. Rendered under a clickable label. */
export interface SidebarNavGroup {
  id: string | number;
  label: string;
  defaultOpen?: boolean;
  items: SidebarNavItem[];
}

/**
 * The application's sidebar content. Rendered inside a Drawer,
 * opened by the Navbar's menu button.
 */
export interface SidebarData {
  /** Application name, shown at the top of the sidebar. */
  appName?: string;
  /** Application logo, shown next to the name at the top of the sidebar. */
  appLogoSrc?: string;
  navMain: SidebarNavItem[];
  navGroups?: SidebarNavGroup[];
}

export interface Option {
  value: string;
  text: string;
}

/**
 * A notice shown in the Navbar's notification bell. The lib does not fetch
 * this data — the consuming app fetches from its own API (e.g. Comunica)
 * and passes the ready list via `Navbar.notifications`.
 */
export interface NotificationItem {
  id: string;
  title: string;
  summary?: string;
  read: boolean;
  createdAt: string;
  /** Link to the notice's detail page (within the app or another system). */
  href?: string;
}
