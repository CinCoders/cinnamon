# Changelog

All notable changes to `@cincoders/cinnamon` are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [2.0.0] — in progress

### Summary

v2 is a full rewrite of the library's foundation. The styling stack (MUI + styled-components) was replaced with TailwindCSS v4 + Base UI, the build was restructured to support React Server Components (RSC) with three entry points (client / server / icons), and the auth model was decoupled from any specific provider. All existing components were migrated, and new server-first variants were added for Next.js App Router consumers.

---

### Added

#### Server Components (Next.js 15 App Router)

- **`@cincoders/cinnamon/server`** — new server entry point:
  - `PageServer` — layout shell without client-side JS; measures shell height via CSS variables.
  - `PageWithAuthServer` — server-authorizing page wrapper; expects `CinnamonSession` + `onUnauthenticated` callback.
  - `RequireAuthServer` — server-side authorization gate; renders children or redirects.
- **`NavbarClientProvider`** — lets server-first layouts provide Navbar context without wrapping the entire page in `"use client"`.
- **`NavbarClientShell`**, **`FooterClientShell`**, **`ToastClientShell`** — client bridges that handle hydration and `ResizeObserver`-based shell measurement, updating shell CSS variables automatically.
- **`preserveModules: true` + `rollup-preserve-directives`** — Vite lib build now emits one module per source file, preserving `"use client"` / `"use server"` directives so Next.js can correctly split the RSC boundary.

#### Auth

- **`CinnamonSession`** — normalized session contract, independent of any specific auth provider:
  ```ts
  type CinnamonSession = {
    isAuthenticated: boolean;
    roles: string[];
    user?: { id?: string; email?: string; name?: string; username?: string };
    raw?: unknown;
  };
  ```
- **`sessionFromOidcAuth(auth)`** — adapts a `react-oidc-context` auth object to `CinnamonSession` by decoding the JWT payload client-side.
- **`unsafeDecodeJwtPayload(token)`** — client-side JWT decode without signature verification (documented as unsafe by design).
- **`OidcAuthLike`** — structural interface for the OIDC auth object, removing the hard dependency on `react-oidc-context` types at the call site.
- **`hasAccess(session, roles)`** — updated to accept both `CinnamonSession` and legacy OIDC auth objects for backward compatibility.
- `AuthUtils` re-exported namespace for legacy call sites.

#### CSS and Design Tokens

- **Standalone `cinnamon.css`** artifact — compiled CSS shipped separately, safe for SSR imports.
- **Shell CSS variables** (declared in `:root`):
  - `--cinnamon-shell-nav-height` / `--cinnamon-shell-footer-height` / `--cinnamon-shell-offset` — updated at runtime by `NavbarClientShell`/`FooterClientShell`; `PageServer` uses `calc(100vh - var(--cinnamon-shell-offset))` for `min-height`.
  - `--cinnamon-shell-inline` — horizontal padding used by Navbar and Footer shells.
  - `--cinnamon-shell-max-width` — max-width cap for shell elements.
  - `--cinnamon-main-padding` — default padding for `Page`'s `<main>` element.
- **Design token CSS vars** (usable as Tailwind utilities via `@theme inline`):
  - `--color-cinnamon-primary: #db1e2f`
  - `--color-cinnamon-dark: #2c2c2c`
  - `--color-cinnamon-footer-bg: #424242`
  - `--color-cinnamon-footer-bar: #616161`

#### Icon Registry

- **`CinnamonIconId`** — type-safe icon ID registry; components accept `iconId` as an alternative to `iconUrl` or `IconComponent`, ensuring identical rendering in both client and server paths. Backed by `@hugeicons/core-free-icons` data.
- **`Icon`** — renders whichever of `iconUrl` / `IconComponent` / `iconId` is provided, in that precedence. This is the renamed `IconRenderer`.
- **`@cincoders/cinnamon/icons`** — third subpath entry. Re-exports `Icon`, the typed registry (`resolveCinnamonIcon`, `getAvailableIconIds`, `CinnamonIconId`), `HugeiconsIcon`, and the full `@hugeicons/core-free-icons` set (`export *`, tree-shakeable, `sideEffects: false`). Hugeicons packages are kept external in `vite.icons.config.ts` so the icon set tree-shakes from the consumer's `node_modules`.

#### SideMenu

- **Animated accent rail** — the open drawer now draws a vertical accent line with a rounded connector that tracks the active item, plus a dashed grey rail that follows the row under hover/keyboard focus. Ported from the internal `HookSidebar` prototype. Motion uses spring physics and honours `prefers-reduced-motion`.
- **`activeHref?: string` prop** on `SideMenu` (and forwarded from `Navbar` as `activeHref`) — the current route's href. The library stays router-agnostic: the consumer passes `usePathname()` (Next.js) or `useLocation().pathname` (react-router). When it matches an item's `href`, the accent rail highlights that row and sets `aria-current="page"`. Nested `children` rows are matched too.

#### Package

- **`motion`** (Framer Motion, `^13`) added to `dependencies` — required by the new `SideMenu` accent rail. Externalized in all three Vite builds, so it resolves from the consumer's tree.
- **`dependencies` reduced to 7** — `@base-ui/react`, `@hugeicons/core-free-icons`, `@hugeicons/react`, `clsx`, `motion`, `tailwind-merge`, `tailwind-variants`. `tailwindcss` and `tw-animate-css` are `devDependencies` only (the CSS is precompiled to `dist/cinnamon.css`). Every runtime dependency is externalized in the Vite lib / server / icons builds, so `dist/` no longer vendors any `node_modules` (was ~456 files / ~3 MB).
- **`sideEffects: ["**/*.css"]`** in `package.json` — enables correct tree-shaking of unused components.
- **`prepublishonly: "npm run build:lib"`** — build is always up to date before publish.
- **`react-oidc-context`** moved to `peerDependencies` (optional) — not forced on consumers using other OIDC providers or server-only auth.

#### Developer Experience

- Storybook stories added for `Dialog`, `ImageInput`, `ErrorScreen`, `ForbiddenPage`, `Navbar`, `Footer`, and `SystemsPopup`.
- `examples/nextjs15-demo/` — regression harness for Next.js 15 App Router covering client pages, server pages, RSC boundary, mock OIDC, and real Keycloak via Docker.

---

### Changed

#### Styling Stack

- **MUI + styled-components → TailwindCSS v4 + Base UI primitives.** All components rebuilt from scratch. No MUI or styled-components packages are present in v2.
- Tailwind v4's `@theme inline` replaces `tailwind.config.js` for color token configuration.
- **`class-variance-authority` → `tailwind-variants`.** `tv()` is now the only variant library; it has `tailwind-merge` built in, so a `tv()` result is not re-wrapped in `cn()`.

#### Build System

- **Vite in library mode** replaces any previous bundling setup.
- Three separate bundles, one Vite config each:
  - `dist/index.js` — client entry (all `"use client"` components).
  - `dist/server/entry-server.js` — server entry (RSC-safe, no browser APIs).
  - `dist/icons/entry-icons.js` — icons entry (`Icon`, the typed registry, and the full `@hugeicons/core-free-icons` re-export; hugeicons kept external).
- `tsc-alias` post-processes `.d.ts` files to rewrite `@/` path aliases, ensuring consumers receive clean type declarations.

#### Auth

- `NavbarProps.auth` now accepts `OidcAuthLike` (structural interface) instead of the concrete `react-oidc-context` `AuthContextProps` type.
- `RequireAuth` and `PageWithAuth` accept `OidcAuthLike`, normalized internally to `CinnamonSession` before any authorization check.

#### Components

- **`Page`**: `createNavbarContext` prop removed — context is always provided. `ResizeObserver` replaces `window.addEventListener("resize")` for accurate shell measurement.
- **`PageWithAuth`**: `createNavbarContext` prop removed (cascading from `Page`).
- **`useNavbar()`**: `setSearchFuncion` typo corrected to `setSearchFunction`. `setSideMenuLinks` and `setSearchFunction` now have proper types (`SideMenuLink[]` and `(s: string) => void`) instead of `any`.
- **`Navbar`**: `searchDropdownLabelsList` prop removed (was declared but never consumed). `IconComponent` prop now typed as `ComponentType<{ className?: string }>`.
- **`Footer`**: hard-coded hex colors replaced with design token CSS vars (`bg-cinnamon-footer-bg`, `bg-cinnamon-footer-bar`). `phoneToTel()` helper moved to `src/lib/utils.ts`.
- **`SideMenu`** — **BREAKING vs v1**: the component was rewritten. The public prop contract is unchanged (`links: SideMenuLink[]`, `top`, `visibility`, `setVisibility`, `linkComponent`), so v1 call sites compile as-is, but the rendering changed: the open drawer now carries an animated accent rail (see _Added_) and pulls in `motion` as a runtime dependency. Consumers that vendored their own copy of the v1 `SideMenu` styles, or relied on the exact prior DOM structure, must revalidate. New optional `activeHref` prop (see _Added_).
- **`IconRenderer` → `Icon`** — **BREAKING**: the component `IconRenderer` and its `IconRendererProps` type were renamed to `Icon` / `IconProps`. `IconComponent` prop now typed as `ComponentType<{ className?: string }>` (was `any`).
- **`ErrorScreen`**: `enum httpErrors` replaced with `const httpErrors as const` + type alias — no runtime JS emitted; same call-site syntax (`httpErrors.NOTFOUND_404`) preserved. Unknown error types now render a generic fallback instead of returning `null`.

#### Package

- **CSS import path**: `@cincoders/cinnamon/cinnamon.css` (previously `@cincoders/cinnamon/dist/cinnamon.css`). The `dist/` prefix no longer leaks into the public API.

---

### Fixed

#### Accessibility (a11y)

- **`Dialog` — WCAG 2.1 SC 2.1.2 (No Keyboard Trap)**: the Radix `onEscapeKeyDown` / `onPointerDownOutside` handlers were calling `e.preventDefault()`, trapping keyboard users inside the modal indefinitely. After the Base UI migration those handlers are gone entirely: Base UI's `Dialog` closes on Escape and outside-press by default and reports the change through `onOpenChange`, which is wired to `onHide()`.
- **`ImageInput` — keyboard and touch access**: the upload overlay was shown only on `mouseenter`, making upload impossible for keyboard and touch users. The overlay is now always in the DOM (visibility controlled via CSS opacity); the `<input>` uses `sr-only` instead of `hidden` so it participates in the tab order; `onFocus`/`onBlur` on the fieldset show/hide the overlay for keyboard users; the `<label>` has `tabIndex={0}` for direct activation.

#### Bugs

- **`RequireAuth` — race condition**: `auth` (the full OIDC context object) was included in the `useEffect` dependency array. Because providers like `react-oidc-context` return a new object reference on every render, this caused the effect to re-run continuously, potentially firing `signinRedirect()` multiple times. `auth` is no longer in the dep array; only the stable primitives `auth.isAuthenticated` and `auth.isLoading` remain.
- **`ForbiddenPage` — logout freeze**: `handleLogout` had no error handling. A network error during `signoutRedirect()` would leave the page frozen with no feedback. The call is now wrapped in `try/catch` with a console error fallback.
- **`ImageInput`**: `setFile` prop type corrected to `File | null` (was `File`, missing the null case). `FileReader.onerror` now handled — failed reads no longer fail silently. JS-side file type validation added (`ALLOWED_TYPES` check), so the `accept` attribute on the `<input>` is no longer the only guard.

#### Build

- **`RequireAuthServer` removed from main entry** (`src/index.ts`): a server component was leaking into the client entry point. It is now only available via `@cincoders/cinnamon/server`.

---

### Removed

- **MUI (Material UI)** — all components fully migrated to TailwindCSS + Base UI.
- **styled-components** — replaced by TailwindCSS utility classes and CSS variables.
- **`@radix-ui/react-{accordion,dialog,slot,tooltip}`** — migrated to `@base-ui/react`. Radix's `asChild` + `Slot` is replaced by Base UI's `render` prop (`Button` keeps an `asChild` prop implemented via `useRender`); parts are renamed (`Content` → `Popup`, `Overlay` → `Backdrop`, `Accordion.Content` → `Accordion.Panel`); state attributes changed (`data-state="open"` → `data-panel-open` / `data-starting-style` / `data-ending-style`).
- **`class-variance-authority`** — migrated to `tailwind-variants`.
- **`lucide-react`, `@tabler/icons-react`** — migrated to `@hugeicons/*`. The semantic `iconId` values (`"home"`, `"users"`, …) are unchanged; only the backing icon set changed.
- **`cmdk`, `cn`, `shadcn`** — no longer used. `shadcn` (the CLI) had been wrongly listed in `dependencies` and pulled a large install tree.
- **8 unused `src/components/ui/*` primitives** — `command`, `dropdown-menu`, `sidebar`, `avatar`, `input-group`, `textarea`, `skeleton`, `dialog`. Never exported; restore any with `npx shadcn add` if needed.
- **`@import "shadcn/tailwind.css"`** from `globals.css` — dead after removing the `shadcn` package, and redundant with `@import "tailwindcss"`.
- **`createNavbarContext` prop** from `PageProps` and `PageWithAuthProps` — context is always provided; the flag was a source of subtle state desync.
- **`searchDropdownLabelsList` prop** from `NavbarProps` — was declared but never used internally.
- **`RequireAuthServer` from the main client entry** — moved exclusively to the server entry.

---

### Deprecated

The following are kept for backward compatibility with v1 consumers during the migration window. They will be removed in a future major version.

| Item | Replacement |
|------|-------------|
| `AuthUtils` namespace | Import named exports directly from `@cincoders/cinnamon` |
| `user?: User` prop on `Navbar` | Pass an `OidcAuthLike` object via `auth`, or use the `CinnamonSession` path |
| `LegacyForbiddenAuth` type in `ForbiddenPage` | Will be replaced by `OidcAuthLike` in a future cleanup |
| `setSearchFuncion` (typo) in `useNavbar()` | Renamed to `setSearchFunction` — update call sites |

---

## Migration Guide: v1 → v2

### 1. Replace the CSS import

```diff
- import "@cincoders/cinnamon/dist/cinnamon.css";
+ import "@cincoders/cinnamon/cinnamon.css";
```

### 2. Remove MUI/styled-components

v2 ships no MUI or styled-components. If your app extends or overrides MUI styles from Cinnamon, those overrides should be removed or rewritten in Tailwind/CSS.

### 3. Update auth usage (optional, recommended)

v1 consumers can still pass the raw `react-oidc-context` object:

```tsx
// Still works in v2 (compat layer)
<PageWithAuth authProps={{ auth, permittedRoles: ["admin"] }} ...>
```

To adopt the new model:

```tsx
import { sessionFromOidcAuth, hasAccess } from "@cincoders/cinnamon";

const session = sessionFromOidcAuth(auth);
if (hasAccess(session, ["admin"])) { ... }
```

### 4. Next.js / App Router consumers

Import server components from the dedicated server entry:

```ts
import { PageServer, PageWithAuthServer, RequireAuthServer }
  from "@cincoders/cinnamon/server";
```

Resolve `CinnamonSession` on the server (from your cookie/token store) and pass it directly — no client auth provider needed:

```tsx
export default async function ProtectedPage() {
  const session = await getSessionFromCookie(); // your implementation
  return (
    <PageWithAuthServer
      authProps={{ session, permittedRoles: ["admin"], onUnauthenticated: redirect("/login") }}
      navbar={{ title: "Dashboard" }}
      footer={{ copyrightText: "My Org" }}
    >
      ...
    </PageWithAuthServer>
  );
}
```

### 5. Update `useNavbar()` call sites

```diff
- const { setSearchFuncion } = useNavbar();
+ const { setSearchFunction } = useNavbar();
```

### 6. Rename `IconRenderer` → `Icon`

```diff
- import { IconRenderer, type IconRendererProps } from "@cincoders/cinnamon";
+ import { Icon, type IconProps } from "@cincoders/cinnamon";

- <IconRenderer iconId="home" />
+ <Icon iconId="home" />
```

The semantic `iconId` values are unchanged. The backing icon set moved from
`lucide-react` to `@hugeicons/*`, so the rendered glyphs differ slightly. If you
passed a `lucide-react` component through `IconComponent`, swap it for a
Hugeicons one, an `iconId`, or an `iconUrl`.

### 7. `Page` — remove `createNavbarContext`

```diff
- <Page createNavbarContext={false} ...>
+ <Page ...>
```

Context is now always provided. If you needed `createNavbarContext={false}` to avoid context overhead, the impact was minimal — `useMemo` ensures no unnecessary re-renders.

### 8. SideMenu — highlight the active route (optional)

The rewritten `SideMenu` can highlight the current page in the drawer. Pass the
current path down through `Navbar`:

```tsx
"use client";
import { usePathname } from "next/navigation";

<Navbar
  sideMenuLinks={links}
  activeHref={usePathname()}   // react-router: useLocation().pathname
  ...
/>
```

Without `activeHref` the drawer behaves as before (expandable groups, hover
state), just with the new accent rail on hover/focus.

`motion` is now a dependency of the library. With a normal install it is pulled
in automatically; in a monorepo with hoisting disabled, add `motion` to the
consumer's `package.json`.

### 9. Tailwind preflight conflict

If your consumer project runs its own Tailwind (v3 or v4), make sure the Cinnamon CSS import comes **after** your own base styles, or disable Tailwind's preflight in your app:

```js
// tailwind.config.js (v3)
module.exports = {
  corePlugins: { preflight: false },
};
```

Without this, your reset may override Cinnamon's utility classes (transforms, button appearance, etc.).

---

## [1.x] — Legacy

The v1 branch (`main`) contains the original MUI + styled-components implementation. It remains available for reference but is no longer actively maintained. New features and fixes are developed exclusively on `v2`.
