# Cinnamon

`@cincoders/cinnamon` is a React component library from CInCoders focused on standardized application layout, navigation, and authentication-aware page composition. v2 replaces the legacy MUI + styled-components stack with TailwindCSS v4, Radix UI primitives, and first-class support for Next.js 15 App Router (React Server Components).

## Table of Contents

- [Installation](#installation)
- [CSS Setup](#css-setup)
- [Usage with React (SPA / Vite)](#usage-with-react-spa--vite)
  - [Layout without auth](#layout-without-auth)
  - [Navbar with systems menu](#navbar-with-systems-menu)
  - [Protected page with `PageWithAuth`](#protected-page-with-pagewithauth)
  - [Inline authorization](#inline-authorization)
- [Usage with Next.js (App Router)](#usage-with-nextjs-app-router)
  - [Protected server page](#protected-server-page)
  - [Inline server authorization gate](#inline-server-authorization-gate)
  - [Server layout with an updatable Navbar](#server-layout-with-an-updatable-navbar)
  - [Server-first flow summary](#server-first-flow-summary)
- [Authentication](#authentication)
  - [`OidcAuthLike`](#oidcauthlike)
  - [Manual session check](#manual-session-check)
- [Shared Icons](#shared-icons)
- [Customization](#customization)
  - [Shell CSS variables](#shell-css-variables)
  - [Design tokens](#design-tokens)
- [API Reference](#api-reference)
  - [Main entry — `@cincoders/cinnamon`](#main-entry--cincoderscinnamon)
  - [Server entry — `@cincoders/cinnamon/server`](#server-entry--cincoderscinnamonserver)
- [Development](#development)
- [Validated Consumers](#validated-consumers)
- [Repository](#repository)
- [License](#license)

---

## Installation

```bash
npm install @cincoders/cinnamon
```

**Peer dependencies:**

```bash
npm install react react-dom react-router-dom
```

`react-oidc-context` is an **optional** peer dependency — install it only if your app uses the Keycloak/OIDC client flow:

```bash
npm install react-oidc-context  # optional
```

---

## CSS Setup

Cinnamon ships its styles as a standalone compiled CSS artifact. Import it once in your application entry:

```ts
// React/Vite/CRA — src/main.tsx or src/index.tsx
import "@cincoders/cinnamon/cinnamon.css";

// Next.js App Router — app/layout.tsx
import "@cincoders/cinnamon/cinnamon.css";

// Next.js Pages Router — pages/_app.tsx
import "@cincoders/cinnamon/cinnamon.css";
```

### Tailwind Preflight Conflict

If your app runs its own Tailwind (v3 or v4), make sure Cinnamon's CSS is imported **after** your own base styles, or disable Tailwind's preflight in your app config:

```js
// tailwind.config.js (v3)
module.exports = {
  corePlugins: { preflight: false },
};
```

Without this precaution, your reset may override Cinnamon's utility classes (transforms, button appearance, etc.), causing the hamburger menu or popups to stop working.

---

## Usage with React (SPA / Vite)

Client-only apps import everything from the main entry `@cincoders/cinnamon`.

### Layout without auth

```tsx
import "@cincoders/cinnamon/cinnamon.css";
import { Page } from "@cincoders/cinnamon";

export function HomePage() {
  return (
    <Page
      navbar={{ title: "My App" }}
      footer={{ copyrightText: "My Organization" }}
    >
      <div>Page content</div>
    </Page>
  );
}
```

### Navbar with systems menu

```tsx
import { Page } from "@cincoders/cinnamon";

<Page
  navbar={{
    title: "My App",
    auth,
    systemsList: [
      {
        title: "RH",
        href: "https://rh.example.com",
        description: "Sistema de RH",
        visibleRole: "sys_hr-users",
        iconId: "cincoders",
      },
    ],
  }}
  footer={{ copyrightText: "CInCoders" }}
>
  ...
</Page>
```

### Protected page with `PageWithAuth`

`PageWithAuth` is the ready-made guard for a private page. It resolves
**loading → redirect/login → 403 → content** and mounts the `Page` shell
(Navbar + Footer + layout) for you.

```tsx
import "@cincoders/cinnamon/cinnamon.css";
import { useAuth } from "react-oidc-context";
import { PageWithAuth } from "@cincoders/cinnamon";

export function ProtectedPage() {
  const auth = useAuth();

  return (
    <PageWithAuth
      authProps={{
        auth,
        permittedRoles: ["sys_hr-users"], // ["*"] = any authenticated user
      }}
      navbar={{ title: "Dashboard", auth }}
      footer={{ copyrightText: "My Organization" }}
    >
      <div>Protected content</div>
    </PageWithAuth>
  );
}
```

Behavior, in order:

| Session state | What `PageWithAuth` renders |
|---|---|
| `auth.isLoading` | "Loading…" screen (after 6s, a connection-failure message) |
| not authenticated | calls `auth.signinRedirect()` → Keycloak login |
| authenticated, none of `permittedRoles` | `ForbiddenPage` |
| authenticated, has a role | `Page` + `children` |

`permittedRoles` matches if the session has **at least one** of the roles.
`["*"]` allows any authenticated user.

### Inline authorization

```tsx
import { RequireAuth } from "@cincoders/cinnamon";

<RequireAuth auth={auth} permittedRoles={["admin"]}>
  <AdminPanel />
</RequireAuth>
```

---

## Usage with Next.js (App Router)

Import server-safe components from the dedicated entry — they run in React
Server Components without pulling in browser APIs:

```ts
import {
  PageServer,
  PageWithAuthServer,
  RequireAuthServer,
  ForbiddenPageServer,
} from "@cincoders/cinnamon/server";
```

Resolve the session on the server (from cookies/headers) and pass a
`CinnamonSession` directly — no provider needed. See [Authentication](#authentication)
for the session contract.

### Protected server page

```tsx
// app/dashboard/page.tsx
import "@cincoders/cinnamon/cinnamon.css";
import { PageWithAuthServer } from "@cincoders/cinnamon/server";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth"; // your implementation

export default async function DashboardPage() {
  const session = await getSessionFromCookies();

  return (
    <PageWithAuthServer
      authProps={{
        session,
        permittedRoles: ["admin"],
        onUnauthenticated: () => redirect("/login"), // must throw; redirect() does
      }}
      navbar={{ title: "Dashboard" }}
      footer={{ copyrightText: "My Organization" }}
    >
      <p>Protected content visible only to admins.</p>
    </PageWithAuthServer>
  );
}
```

Differences from the client `PageWithAuth`:

- Receives `session: CinnamonSession | null`, not `auth`.
- `onUnauthenticated` **must throw** (Next's `redirect()` throws) — otherwise nothing renders.
- Missing role → `ForbiddenPageServer` (403 rendered on the server, no JS).
- It is a Server Component: no `window`, hooks, or event handlers.

### Inline server authorization gate

```tsx
import { RequireAuthServer } from "@cincoders/cinnamon/server";
import { redirect } from "next/navigation";

<RequireAuthServer
  session={session}
  permittedRoles={["sys_hr-users"]}
  onUnauthenticated={() => redirect("/forbidden")}
>
  <SensitiveContent />
</RequireAuthServer>
```

### Server layout with an updatable Navbar

For layouts where child pages need to update Navbar props (e.g., per-page title)
via `useNavbar()`, wrap with `NavbarClientProvider`:

```tsx
// app/layout.tsx
import { NavbarClientProvider } from "@cincoders/cinnamon";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NavbarClientProvider navbar={{ title: "My App" }}>
          {children}
        </NavbarClientProvider>
      </body>
    </html>
  );
}
```

### Server-first flow summary

1. **Resolve session on the server** — convert your token (Keycloak/OIDC) to `CinnamonSession` before reaching the component.
2. **Pass serializable props** — use `iconId` for icons (server-safe); avoid passing class instances.
3. **Shell hydration** — `NavbarClientShell`, `FooterClientShell`, and `ToastClientShell` hydrate automatically, measuring heights and updating the shell CSS variables. No extra code needed in the consumer.
4. **Redirects** — `onUnauthenticated` should call `next/navigation`'s `redirect()` on the server.

---

## Authentication

Cinnamon's internal authorization flows around a single normalized session object, independent of any specific provider:

```ts
type CinnamonSession = {
  isAuthenticated: boolean;
  roles: string[];
  user?: {
    id?: string;
    email?: string;
    name?: string;
    username?: string;
  };
  raw?: unknown;
};
```

The mental flow is:

```
provider → sessionFromOidcAuth() → CinnamonSession → hasAccess(session, roles) → render
```

- **Client** apps may still use `react-oidc-context`; Cinnamon normalizes the auth object internally via `sessionFromOidcAuth()`.
- **Server** apps (Next.js) resolve the session from cookies/headers before rendering and pass `CinnamonSession` directly.

### `OidcAuthLike`

For structural compatibility with `react-oidc-context` without importing its types:

```ts
type OidcAuthLike = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: {
    access_token: string;
    profile?: {
      sub?: string;
      email?: string;
      name?: string;
      preferred_username?: string;
      given_name?: string;
      family_name?: string;
    };
  } | null;
  signinRedirect: () => Promise<unknown> | unknown;
  signoutRedirect?: () => Promise<unknown> | unknown;
};
```

### Manual session check

```tsx
import { sessionFromOidcAuth, hasAccess } from "@cincoders/cinnamon";

const session = sessionFromOidcAuth(auth);
if (hasAccess(session, ["sys_hr-users"])) {
  // render protected content
}
```

`hasAccess(session, roles)` returns `true` if the session has **any** of the
required roles. It is available from both the main and the `/server` entry.

---

## Shared Icons

To ensure the same icon renders in both client and server paths, use `iconId` instead of `iconUrl`:

```tsx
import type { CinnamonIconId } from "@cincoders/cinnamon";

// In System / SideMenuLink / Navbar props:
{ iconId: "cincoders" } // type-checked against CinnamonIconId
```

Using `iconId` renders the official Cinnamon SVG registry — no URL or external asset needed. `iconUrl` and `IconComponent` remain supported as alternatives.

---

## Customization

### Shell CSS variables

Declared in `:root` by `cinnamon.css`. The first three are updated at runtime by the client shells.

| Variable | Default | Description |
|---|---|---|
| `--cinnamon-shell-nav-height` | `0px` | Current Navbar height |
| `--cinnamon-shell-footer-height` | `0px` | Current Footer height |
| `--cinnamon-shell-offset` | `0px` | `nav + footer` height sum |
| `--cinnamon-shell-inline` | `clamp(16px, 2vw, 40px)` | Horizontal shell padding |
| `--cinnamon-shell-max-width` | `72rem` | Shell max-width cap |
| `--cinnamon-main-padding` | `20px clamp(10px, 2%, 40px)` | `<main>` default padding |

Override in your app:

```css
:root {
  --cinnamon-shell-max-width: 80rem;
  --cinnamon-shell-inline: clamp(20px, 3vw, 48px);
}
```

### Design tokens

Available as Tailwind utilities (`bg-cinnamon-primary`, `text-cinnamon-dark`, etc.):

| Token | Value |
|---|---|
| `--color-cinnamon-primary` | `#db1e2f` |
| `--color-cinnamon-dark` | `#2c2c2c` |
| `--color-cinnamon-footer-bg` | `#424242` |
| `--color-cinnamon-footer-bar` | `#616161` |

---

## API Reference

### Main entry — `@cincoders/cinnamon`

**Layout**

| Export | Description |
|---|---|
| `Page` | Client layout shell — wraps Navbar + main + Footer, provides Navbar context |
| `PageWithAuth` | Client-side auth guard + layout; accepts `OidcAuthLike` |
| `NavbarClientProvider` | Provides Navbar context without mounting a full `Page` |

**Navigation**

| Export | Description |
|---|---|
| `Navbar` | Application top bar with systems menu, user popup, side menu |
| `Footer` | Application footer with contact info, copyright, and signature |
| `useNavbar()` | Hook to read/update Navbar props from any child component |
| `useNavbarContext()` | Low-level hook to access the raw `NavbarContext` value |
| `NavbarContext` | React context object (for custom providers) |

**Authorization**

| Export | Description |
|---|---|
| `RequireAuth` | Client-side auth gate; redirects unauthenticated users |
| `hasAccess(session, roles)` | Returns `true` if session has any of the required roles |
| `sessionFromOidcAuth(auth)` | Converts `OidcAuthLike` → `CinnamonSession` by decoding the JWT |

**UI Components**

| Export | Description |
|---|---|
| `Dialog` | Modal dialog (information / alert / confirmation / decision / error types) |
| `ErrorScreen` | Full-page error display for 404 / 501 / 503 states |
| `httpErrors` | Const object of error type keys (`httpErrors.NOTFOUND_404`, etc.) |
| `ImageInput` | Image file upload with preview, keyboard + touch accessible |
| `IconRenderer` | Renders an icon from `iconUrl`, `IconComponent`, or `iconId` |
| `ForbiddenPage` | 403 forbidden page with user email display and logout button |
| `ToastContainer` | Toast notification container |
| `toast` | Imperative toast trigger |

**Types**

| Export | Description |
|---|---|
| `CinnamonSession` | Normalized auth session contract |
| `OidcAuthLike` | Structural OIDC auth interface |
| `CinnamonUser` | User shape inside `CinnamonSession` |
| `User` | Legacy user shape (name, email, username, positions) |
| `System` | System entry in the systems menu |
| `SideMenuLink` | Navigation link in the side menu |
| `Role`, `Position`, `Link`, `Option` | Supporting data interfaces |
| `CinnamonIconId` | Union type of all valid icon registry IDs |
| `AuthUtils` | Namespace re-export of auth helpers (compat) |

### Server entry — `@cincoders/cinnamon/server`

| Export | Description |
|---|---|
| `PageServer` | RSC layout shell; uses CSS variables for shell offset |
| `PageWithAuthServer` | Server-side auth guard + layout; expects `CinnamonSession` |
| `RequireAuthServer` | Server-side authorization gate |
| `ForbiddenPageServer` | Static 403 page (no user data, no JS) |
| `hasAccess` | Same as main entry, available server-side |
| `CinnamonSession` | Type export for server session typing |

---

## Development

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Scripts

```bash
# Run Storybook dev server
npm run storybook

# Build Storybook static site
npm run build-storybook

# Full library build (JS + types + CSS)
npm run build:lib

# JS bundles only
npm run build:lib:js

# Type declarations only
npm run build:lib:types

# Standalone cinnamon.css only
npm run build:lib:css

# Build + npm pack (for local consumer testing)
npm run build-pack
```

### Build output

| Path | Content |
|---|---|
| `dist/index.js` | Client entry — all `"use client"` components |
| `dist/server/entry-server.js` | Server entry — RSC-safe, no browser APIs |
| `dist/cinnamon.css` | Compiled standalone CSS |
| `dist/**/*.d.ts` | Type declarations (path aliases rewritten by `tsc-alias`) |

### Type checking

```bash
npx tsc --noEmit
```

### Using the library in another project (without publishing to npm)

To test changes in a consumer project before publishing, pack the library into a tarball and install it directly — this exercises the real `exports` map and RSC entry split, same as a published package would.

```bash
# In this repo — builds the lib and produces cincoders-cinnamon-<version>.tgz
npm run build-pack

# In the consumer repo — install from the tarball's absolute path
npm install /absolute/path/to/cinnamon/cincoders-cinnamon-<version>.tgz
```

After changing the library source, repeat both steps to pick up the new build (`npm install` on the same tarball path won't refresh a cached copy — regenerate the `.tgz` first).

For a full working example, see [`examples/nextjs15-demo/`](examples/nextjs15-demo/README.md).

---

## Validated Consumers

The v2 library has been exercised in two real projects:

- **`info-cin-front`** — validated the Next.js/server-first path: cookie-backed session resolution, authorized/unauthorized states, server redirects, role filtering, mixed client/server composition.
- **`prorank-front`** — validated the legacy React SPA path with Keycloak/OIDC: `PageWithAuth`, `RequireAuth`, `AuthUtils.hasAccess`, forbidden flow, application shell.

---

## Repository

| Branch | Description |
|---|---|
| `main` | Legacy MUI + styled-components implementation (read-only reference) |
| `v2` | Current: TailwindCSS v4 + Radix UI + RSC support |

---

## License

MIT — © CInCoders, Centro de Informática, UFPE.
