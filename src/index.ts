// Public API — v2 (client entry).
//
// Scoped to `PageWithAuth` and the components it renders internally
// (Navbar, Footer, Toast). The rest (Dialog, ImageInput, ErrorScreen,
// IconRenderer, Button, RequireAuth, Page, the useNavbar hooks, ...) still
// exist in src/ and are built, but are intentionally NOT re-exported until
// validated with the consuming teams. To expose one later, add it here.

export { PageWithAuth } from "./lib-components/PageWithAuth/PageWithAuth";
export type { PageProps } from "./lib-components/Page/Page";

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
