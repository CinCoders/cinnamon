// Public API — v2 (client entry).
//
// Scoped to `PageWithAuth` and the components it renders internally
// (Navbar, Footer, Toast), plus the ready-made error screens. The rest
// (Dialog, ImageInput, IconRenderer, Button, RequireAuth, Page, the
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

export type { NavbarProps } from "./lib-components/Navbar/Navbar";
export type { FooterProps } from "./lib-components/Footer/Footer";

// Auth contract types for `authProps.auth`.
export type {
  OidcAuthLike,
  CinnamonSession,
  CinnamonUser,
} from "./auth/types";

// Domain types used by NavbarProps.
export type {
  User,
  SideMenuLink,
  System,
  Link,
  LinkComponent,
  Position,
  Role,
} from "./interfaces";
