# AGENTS — Cinnamon v2 Codebase Guide

This file describes the Cinnamon codebase for AI coding assistants (Claude Code, GitHub Copilot Workspace, etc.). Read it before making any changes.

---

## Project Overview

`@cincoders/cinnamon` is a React component library. It provides:

- A standardized application shell (Navbar + Footer + Page layout)
- Authentication-aware page composition (`PageWithAuth`, `RequireAuth`)
- Server-safe RSC components (`@cincoders/cinnamon/server` entry)
- A normalized auth contract (`CinnamonSession`) decoupled from any specific provider

The current branch (`v2`) is a full rewrite of the legacy `main` branch (MUI + styled-components). v2 uses TailwindCSS v4, Radix UI, and supports Next.js 15 App Router.

---

## Build Commands

```bash
npm run build:lib           # Full build: JS + types + CSS
npm run build:lib:js        # Vite library bundles only
npm run build:lib:types     # tsc + tsc-alias (type declarations)
npm run build:lib:css       # Standalone cinnamon.css only
npm run storybook           # Dev server for visual testing
npm run build-storybook     # Static Storybook site
npx tsc --noEmit            # Type check without emitting
npm run build-link          # build:lib + npm link (local consumer testing)
```

In the `examples/nextjs15-demo/` consumer:

```bash
npm run refresh-lib         # Rebuilds the lib and re-installs it in the demo
npm run dev                 # Next.js dev server
npm run build               # next build (validates .d.ts and RSC boundaries)
npm run typecheck           # tsc --noEmit in the consumer context
```

**Always run `npm run refresh-lib` in the demo after changing the library source**, before verifying behavior.

---

## Architecture

### Two Entry Points

The library exposes two separate entry points, each with its own Vite output:

| Entry | Import path | Contains |
|---|---|---|
| Client | `@cincoders/cinnamon` | All `"use client"` components, hooks |
| Server | `@cincoders/cinnamon/server` | RSC-safe components (no browser APIs) |

`src/index.ts` → client entry  
`src/entry-server.ts` → server entry

**Rule**: Never import server-only components in `src/index.ts`. Never use browser globals (`window`, `document`, `navigator`) in any file exported from `src/entry-server.ts`.

### RSC Boundary Preservation

The Vite build uses `preserveModules: true` (in `vite.lib.config.ts`) together with `rollup-preserve-directives`. This emits one module per source file and keeps `"use client"` / `"use server"` directives intact. Without this, Next.js cannot correctly split the RSC boundary and will either error or silently hydrate server components.

Do not remove `preserveModules: true` or `rollup-preserve-directives` from the Vite config.

### CSS

Styles are compiled to `dist/cinnamon.css` from `src/styles/globals.css` (Tailwind v4). The `exports` map exposes it as `@cincoders/cinnamon/cinnamon.css` — no `dist/` in the public path.

Design tokens live in the `@theme inline` block in `globals.css`:

```css
@theme inline {
  --color-cinnamon-primary: #db1e2f;
  --color-cinnamon-dark: #2c2c2c;
  --color-cinnamon-footer-bg: #424242;
  --color-cinnamon-footer-bar: #616161;
}
```

Tailwind v4 generates utility classes from these: `bg-cinnamon-primary`, `text-cinnamon-dark`, etc. **Always use the token utilities in components, never hard-coded hex strings.**

### Shell CSS Variables

Set in `:root` by the compiled CSS, updated at runtime by client bridge components:

- `--cinnamon-shell-nav-height` — current Navbar height (px)
- `--cinnamon-shell-footer-height` — current Footer height (px)
- `--cinnamon-shell-offset` — sum of nav + footer height
- `--cinnamon-shell-inline`, `--cinnamon-shell-max-width`, `--cinnamon-main-padding` — layout constants

`NavbarClientShell` and `FooterClientShell` use `ResizeObserver` to keep these in sync. This pattern (CSS vars + ResizeObserver) is correct and intentional — do not replace it with `window.resize` events.

### Auth Model

```
Provider (Keycloak / cookie / any) → CinnamonSession → hasAccess(session, roles) → render
```

`CinnamonSession` is the single internal auth contract:

```ts
type CinnamonSession = {
  isAuthenticated: boolean;
  roles: string[];
  user?: { id?: string; email?: string; name?: string; username?: string };
  raw?: unknown;
};
```

`OidcAuthLike` is a structural interface (duck type) for `react-oidc-context`'s auth object. Components accept it and normalize it internally. This decouples the library from the `react-oidc-context` concrete type.

`sessionFromOidcAuth(auth: OidcAuthLike): CinnamonSession` — client-side adapter; decodes the JWT payload to extract roles.

---

## File Structure

```
src/
  index.ts                    ← client entry (all "use client" exports)
  entry-server.ts             ← server entry (RSC-safe exports only)
  auth/
    types.ts                  ← CinnamonSession, OidcAuthLike, CinnamonUser
    hasAccess.ts              ← role authorization logic
    sessionFromOidcAuth.ts    ← OidcAuthLike → CinnamonSession adapter
    unsafeDecodeJwtPayload.ts ← client-side JWT decode (no signature verify)
    index.ts
  interfaces/
    index.ts                  ← Role, Position, User, System, SideMenuLink, etc.
  lib/
    utils.ts                  ← cn(), phoneToTel(), other pure utils
  styles/
    globals.css               ← Tailwind v4 base + @theme inline tokens
  lib-components/
    Dialog/
    ErrorScreen/
    ForbiddenPage/
    Footer/
    IconRender/
    ImageInput/
    Navbar/
    Page/
      Page.tsx                ← client layout shell
      PageServer.tsx          ← RSC layout shell
      PageClientBridges.tsx   ← NavbarClientShell, FooterClientShell, ToastClientShell
      useNavbar.tsx           ← NavbarContext, useNavbar(), useNavbarContext()
    PageWithAuth/
    RequireAuth/
  components/
    ui/                       ← Radix UI + shadcn/ui primitives
    Toast/
  assets/
    icons/                    ← SVG icon registry (CinnamonIconId)
```

---

## What NOT to Change

### Auth Architecture

**Do not change the auth architecture, props, flow, boolean flags, or component naming in the auth-related components.** This includes:

- `RequireAuth`, `RequireAuthServer`, `PageWithAuth`, `PageWithAuthServer`, `ForbiddenPage`, `ForbiddenPageServer`
- Props named `auth`, `permittedRoles`, `publicURL`, `onUnauthenticated`
- The boolean `isAuthenticated`, `isLoading` usage pattern in `RequireAuth`
- The `LegacyForbiddenAuth` type in `ForbiddenPage` (backward compat)

Auth components are sensitive and need careful validation with the teams that consume them. Only fix confirmed bugs (race conditions, unhandled exceptions, security leaks) without altering the observable API or behavior.

### RSC Build Config

Do not modify:
- `vite.lib.config.ts` — `preserveModules`, `rollup-preserve-directives`, externals list
- `tsconfig.lib.json` — paths used by `tsc-alias`
- `package.json` → `exports` map — the two-entry structure is intentional

### Demo Secrets

`examples/nextjs15-demo/` contains a demo frontend using **public client OIDC** (Authorization Code + PKCE, no client secret). Never add the `Hr-Back` confidential client secret to any frontend file. The demo is a public client and must remain so.

---

## Conventions

### TailwindCSS v4

- Tokens go in `@theme inline` inside `src/styles/globals.css` — not in `tailwind.config.js` (v3 pattern, not applicable here).
- Use token utility classes (`bg-cinnamon-primary`) — never hard-coded hex strings in components.
- Arbitrary values (`bg-[#db1e2f]`) are forbidden for design tokens; they're allowed only for truly one-off values.

### TypeScript

- No `any` without an explicit comment explaining why.
- `React.ComponentType<{ className?: string }>` for icon component props — not `ComponentType<any>`.
- `as const` objects + type aliases for enumerations (not TypeScript `enum`, which emits runtime code).
- Path alias `@/` resolves to `src/` — use it in source files; `tsc-alias` rewrites the declarations for consumers.

### Comments

Comments go in only when the WHY is non-obvious — a hidden constraint, a workaround for a specific bug, an invariant. Do not comment what code does.

### No Backwards-Compatibility Shims

If a prop or export is removed, remove it cleanly. Do not add `// removed`, unused `_vars`, or re-export stubs.

---

## Testing and Validation

There is no Jest/Vitest test suite. Validation is visual and type-level:

1. **Type check**: `npx tsc --noEmit` in the library root.
2. **Storybook**: `npm run storybook` — stories exist for Dialog, ImageInput, ErrorScreen, ForbiddenPage, Navbar, Footer, SystemsPopup.
3. **Demo consumer** (`examples/nextjs15-demo/`):
   - `npm run refresh-lib && npm run dev`
   - `/client-page` — full client path with Keycloak mock
   - `/server-entry` — server-first path, `hasAccess` matrix, ForbiddenPage
   - `/server-import-client` — verifies no runtime error at RSC boundary
   - `npm run build` — validates `.d.ts` output and RSC split
   - `npm run typecheck` — verifies consumer types

Run steps 1 and 3 (`build` + `typecheck`) before declaring a change complete.

---

## Known Deprecated Items

These exist intentionally for backward compatibility and will be removed in a future major:

| Item | Status | Replacement |
|---|---|---|
| `AuthUtils` namespace | Deprecated | Use named exports directly |
| `user?: User` prop on Navbar | Deprecated | Use `auth: OidcAuthLike` |
| `setSearchFuncion` (typo) in `useNavbar()` | Deprecated | Use `setSearchFunction` |
| `LegacyForbiddenAuth` | Deprecated | Will align to `OidcAuthLike` |

Do not remove deprecated items unless a major version bump is planned and consumers are migrated.

---

## Validated Consumers

Changes should be validated against the two known consumer projects:

- **`info-cin-front`** — Next.js App Router, server-first session, cookie-backed auth.
- **`prorank-front`** — Vite SPA, Keycloak/OIDC client flow via `react-oidc-context`.

The demo at `examples/nextjs15-demo/` covers the majority of both paths.
