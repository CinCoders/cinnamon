// Public API — v2 (server entry, RSC-safe).
//
// Scoped to `PageWithAuthServer` and its config types. `hasAccess`,
// `RequireAuthServer`, `PageServer`, `ForbiddenPageServer` still exist and are
// built, but are not re-exported until validated. To expose one later, add it here.

export { PageWithAuthServer } from "./lib-components/PageWithAuth/PageWithAuthServer";
export type { PageServerProps } from "./lib-components/Page/PageServer";
export type { CinnamonSession, CinnamonUser } from "./auth/types";

export type { NavbarProps } from "./lib-components/Navbar/Navbar";
export type { FooterProps } from "./lib-components/Footer/Footer";
export type {
  User,
  SidebarData,
  SidebarNavItem,
  SidebarNavGroup,
  System,
  Link,
  LinkComponent,
  Position,
  Role,
} from "./interfaces";

// Icon library (RSC-safe).
export { resolveCinnamonIcon, getAvailableIconIds } from "./icons";
export type { CinnamonIconId } from "./icons";
export { IconRenderer } from "./lib-components/IconRender";
export type { IconRendererProps } from "./lib-components/IconRender";
