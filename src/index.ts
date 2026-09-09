// Public API — v2 (client entry).
//
// Scoped to `PageWithAuth` and the components it renders internally
// (Navbar, Footer, Toast), the ready-made error screens, and the icon
// library. The rest (Dialog, ImageInput, Button, RequireAuth, Page, the
// useNavbar hooks, ...) still exist in src/ and are built, but are
// intentionally NOT re-exported until validated with the consuming teams.
// To expose one later, add it here.

export { PageWithAuth } from "./lib-components/PageWithAuth/PageWithAuth";
export type { PageProps } from "./lib-components/Page/Page";

// Ready-made error screens for consumers to render on 4xx/5xx states.
// `ForbiddenPage` is what `PageWithAuth` renders internally on a failed
// role check; exposed here so a consumer can also render it directly
// (e.g. a standalone `/forbidden` route).
export { ErrorScreen, httpErrors } from "./lib-components/ErrorScreen/ErrorScreen";
export type { ErrorScreenProps } from "./lib-components/ErrorScreen/ErrorScreen";
export { ForbiddenPage } from "./lib-components/ForbiddenPage/ForbiddenPage";
export type { ForbiddenPageProps } from "./lib-components/ForbiddenPage/ForbiddenPage";

// Rendered by PageWithAuth — exposed so consumers can build/type the
// `navbar` / `footer` props and fire toasts from their pages.
export { Navbar } from "./lib-components/Navbar/Navbar";
export { Footer } from "./lib-components/Footer/Footer";
export { ToastContainer, toast } from "./components/Toast/Toast";

// Form primitives + the search field composed from them.
export { Input } from "./components/ui/input";
export type { InputProps } from "./components/ui/input";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
export { SearchInput } from "./lib-components/SearchInput/SearchInput";
export type { SearchInputProps } from "./lib-components/SearchInput/SearchInput";

export type { NavbarProps } from "./lib-components/Navbar/Navbar";
export type {
  FooterProps,
  FooterVariant,
  FooterLink,
  FooterLinkColumn,
  FooterSocialLink,
  FooterContact,
  FooterSupport,
} from "./lib-components/Footer/Footer";

// Auth contract types for `authProps.auth`.
export type {
  OidcAuthLike,
  CinnamonSession,
  CinnamonUser,
} from "./auth/types";

// Domain types used by NavbarProps.
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

// Icon library — resolve a `CinnamonIconId` string to a component without
// pulling an icon package into the consumer. `IconRenderer` renders any of the
// supported icon sources (`iconId`, `IconComponent`, or `iconUrl`).
export {
  resolveCinnamonIcon,
  getAvailableIconIds,
} from "./icons";
export type { CinnamonIconId } from "./icons";
export { IconRenderer } from "./lib-components/IconRender";
export type { IconRendererProps } from "./lib-components/IconRender";
