# Handoff: v2 publish scoped to PageWithAuth + real-Keycloak demo

**Created:** 2026-08-31 20:16
**Branch:** v2
**Status:** ready-for-review

## Goal

Publish `@cincoders/cinnamon` v2 exposing **only** `PageWithAuth` /
`PageWithAuthServer` (plus what they render internally) so a new project can adopt
the pre-configured auth guard for private pages. Other components are not deleted,
just not exported until validated. Alongside this, the `examples/nextjs15-demo/`
consumer was reworked to authenticate against a **real Keycloak** (no mocks) and
to validate the trimmed public surface.

No issue/PR URL. Work is local, uncommitted.

## What was done

### 1. Demo now runs against real Keycloak (earlier in session)

- `examples/nextjs15-demo/docker-compose.yml` — bumped Keycloak `18.0.0` →
  `26.0`, dropped `--http-relative-path=/auth`, switched to
  `KC_BOOTSTRAP_ADMIN_USERNAME/PASSWORD`. Issuer is now
  `http://localhost:8080/realms/cinnamon-example`.
- `examples/nextjs15-demo/setup/realm.json` — front client
  `cinnamon-example-front` got `standardFlowEnabled: true`,
  `pkce.code.challenge.method: S256`, `post.logout.redirect.uris`. Users
  `admin/admin` (role `admin`) and `user/user` (role `user`) already had
  firstName/lastName.
- `examples/nextjs15-demo/.env` + `.env.example` — single realm
  `cinnamon-example`, `NEXT_PUBLIC_KC_AUTHORITY`, `NEXT_PUBLIC_KC_CLIENT_ID`,
  `KC_ISSUER`. All `Intranet` / `raulpcoelho` / `Hr-Back` references removed.
- `examples/nextjs15-demo/package.json` — added `jose` (JWKS verification).
- **Deleted:** `components/MockOidcProvider.tsx`, `components/RealOidcProvider.tsx`,
  `components/RoleSwitcher.tsx`, `lib/mockSession.ts`, `lib/auth-shared.ts`,
  `lib/auth.ts` barrel, `app/api/auth/login/route.ts`,
  `app/api/auth/logout/route.ts`.
- **New:** `components/AuthProvider.tsx` (single real `react-oidc-context`
  provider, module-level stable config — fixes an infinite "carregando sessão"
  loop caused by inline `new WebStorageStateStore` + per-route `redirect_uri`),
  `components/ServerSessionBridge.tsx` (client posts the real access_token to
  `/api/auth/session`, uses `router.refresh()`, `syncing` ref + readable
  `cinnamon_session_state` cookie to avoid reload loops),
  `components/SessionPanel.tsx` (real roles + Keycloak logout, replaces
  RoleSwitcher), `components/LoginButton.tsx`, `lib/oidc.ts`
  (`toOidcAuthLike` — narrows react-oidc-context auth to `OidcAuthLike`, **no
  fabricated tokens**), `lib/auth-server.ts` (`getServerSession()` verifies JWT
  vs realm JWKS with `jose`, builds `CinnamonSession`),
  `app/api/auth/session/route.ts` (POST validates token → httpOnly cookie;
  DELETE clears; POST body parse is `.catch(() => null)` → clean 400 not 500).
- `app/layout.tsx` wraps app in `<AuthProvider>` + `<ServerSessionBridge />`.
- `app/page.tsx` gained a data-driven **TestIndex** section (array `TEST_PAGES`)
  linking every test page from the post-login home.

### 2. Library public surface reduced to PageWithAuth (this session's main task)

- `src/index.ts` — now exports ONLY: `PageWithAuth`, `Navbar`, `Footer`,
  `ToastContainer`, `toast`, and types (`PageProps`, `NavbarProps`, `FooterProps`,
  `OidcAuthLike`, `CinnamonSession`, `CinnamonUser`, `User`, `SideMenuLink`,
  `System`, `Link`, `LinkComponent`, `Position`, `Role`).
  `Navbar`/`Footer`/`Toast` are in because `PageWithAuth` renders them
  internally — real dependencies, not new risk.
- `src/entry-server.ts` — now exports ONLY: `PageWithAuthServer` + types
  (`PageServerProps`, `CinnamonSession`, `CinnamonUser`, `NavbarProps`,
  `FooterProps`, and the domain types).
- **Removed from public API (still on disk + in `dist/`, just not re-exported):**
  `Page`, `RequireAuth`, `RequireAuthServer`, `Dialog`, `ImageInput`,
  `ErrorScreen`/`httpErrors`, `IconRenderer`, `Button`/`buttonVariants`,
  `hasAccess`, `PageServer`, `ForbiddenPageServer`, `NavbarContext`,
  `NavbarClientProvider`, `useNavbar`, `useNavbarContext`, `ForbiddenPage`,
  `sessionFromOidcAuth`, `AuthUtils`, `* from "./lib/utils"`, `Option` type,
  `CinnamonIconId` type.
- Rollup tree-shakes the now-unreachable JS: `dist/lib-components/Dialog/` and
  `dist/lib-components/ImageInput/` have only `.d.ts`, no `.js`. `Navbar`,
  `Footer`, `Toast`, `hasAccess` etc. still get `.js` because `PageWithAuth`
  pulls them. All `.d.ts` are still emitted (tsc emits everything).

### 3. Demo adjusted to the trimmed surface

- `app/client-page/page.tsx` — imports `PageWithAuth` from `@cincoders/cinnamon`
  (published). Uses it as the sole guard, `permittedRoles: ["user"]`.
- `app/graficos/page.tsx` — imports `PageWithAuthServer` from
  `@cincoders/cinnamon/server`. Sole guard, `permittedRoles: ["admin"]`,
  `onUnauthenticated: () => redirect("/login")`, navbar injected via
  `components={{ navbar: <NavbarClientWrapper /> }}`.
- `app/server-entry/page.tsx` — removed the standalone `hasAccess` matrix (not
  published); kept the two `PageWithAuthServer` blocks (grant vs ForbiddenPage).
- `components/InteractivePlaygroundClient.tsx` — removed `Dialog` + `ImageInput`
  usage (not published). Now a `Toast` + SSR→client hydration demo; imports
  `toast`/`ToastContainer` from `@cincoders/cinnamon`.
- `components/SessionPanel.tsx`, `app/page.tsx`, `app/interativo/page.tsx`,
  `components/NavbarClientWrapper.tsx`, `app/server-import-client/page.tsx` —
  import `Navbar`/`Footer`/`toast` from `@cincoders/cinnamon` (all published).
- `examples/nextjs15-demo/tsconfig.json` + `next.config.ts` — reverted to
  clean state (an aborted `@cinnamon-internal` / `@cinnamon-dist` source-alias
  approach was tried and backed out; deep-importing lib source into the demo
  broke on the SVG asset pipeline — Next has no loader for the lib's raw SVG
  imports).
- README of the demo rewritten: new "API pública nesta versão" table, updated
  page table, `PageWithAuth` usage section (client + server snippets).

## Current state

- **`npx tsc --noEmit` in repo root: passes (exit 0).**
- **`npm run build:lib` in repo root: passes.** Verified
  `dist/index.d.ts` / `dist/entry-server.d.ts` and the JS `export{...}` lines
  contain only the intended names.
- **`examples/nextjs15-demo`: `npx tsc --noEmit` passes, `npm run build`
  passes (exit 0).** All 6 pages compile against the trimmed package.
- Pre-existing non-blocking noise: demo `next build` prints an ESLint
  "Converting circular structure to JSON" warning (eslint-config-next ^16 vs
  Next 15.5) — not caused by this work, does not fail the build.
- **Everything is uncommitted.** `examples/` is entirely untracked (new dir).
  Tracked files modified: `src/index.ts`, `src/entry-server.ts`, plus a large
  set of pre-existing v2 working-tree changes NOT made this session
  (`.storybook/preview.tsx`, many `src/**` refactors, deleted SearchDropdown /
  ui/sheet / ui/scroll-area / ui/toaster / stories, `vite.*.config.ts`,
  `globals.css`, root `README.md`, `package.json`, `package-lock.json`). Only
  `src/index.ts` and `src/entry-server.ts` were touched by this session on the
  tracked side.
- Runtime login flow against Keycloak was NOT verified in this session — Docker
  is unavailable in this environment. Build + typecheck only.

## Key decisions

1. **Publish Navbar/Footer/Toast alongside PageWithAuth**, not just the guard.
   Rationale: `PageWithAuth` → `Page` → renders `Navbar`/`Footer`; `PageServer`
   renders them via client bridges. Consumers must be able to type the
   `navbar`/`footer` prop objects and fire toasts. They are transitive deps, so
   exposing them adds no new unvalidated risk. The user explicitly chose this
   over trimming the demo or deep-importing source.
2. **Trim the entry re-exports, do not delete or move files.** The `exports`
   map + `preserveEntrySignatures: "exports-only"` means unexported modules are
   unreachable through the package even though they exist in `dist/`. `.d.ts`
   for everything still emit — harmless, consumers can't reach them.
3. **Demo imports only from the package** (`@cincoders/cinnamon` /
   `/server`). The earlier idea of a `@cinnamon-internal` alias to
   `../../src` was abandoned: the lib source uses its own `@/*` alias and a
   Vite SVG asset pipeline that Next can't resolve. Any page that needed a
   non-published component was reworked to drop it.
4. **Server session via client-written cookie**, not a server-side code
   exchange. `react-oidc-context` does the browser PKCE flow; `ServerSessionBridge`
   POSTs the token to `/api/auth/session` which validates (jose/JWKS) before
   setting an httpOnly cookie. Documented as a BFF stand-in. This was a user
   decision from earlier in the session.
5. **`server-entry` keeps two `PageWithAuthServer` blocks** instead of being
   deleted — preserves coverage of the server-side ForbiddenPage render without
   needing `hasAccess` exported.

## What's next

1. **Verify the runtime flow** (needs Docker):
   `cd examples/nextjs15-demo && docker compose up -d`, wait ~20s,
   `npm run dev`, clear localStorage + cookies for `localhost:3000`, then:
   - `/login` → "Entrar com Keycloak" → login as `user/user` → back on `/`,
     session populated (one `router.refresh()`).
   - `/graficos` as `user` → `ForbiddenPage` 403 server-rendered.
   - Log out, hit `/graficos` directly → redirected to `/login`.
   - Log in as `admin/admin` → `/graficos` renders charts.
   - `/client-page` → `PageWithAuth` renders (has `user`); temporarily change
     its `permittedRoles` to `["admin"]` and reload as `user` → `ForbiddenPage`.
   - `/server-import-client` → no runtime error (RSC boundary intact).
2. **Update root `CHANGELOG.md`** (untracked, exists) with the v2 API-surface
   scope decision before publishing.
3. **Decide commit strategy.** The tracked working tree has a large amount of
   pre-existing v2 work mixed in. This session only intentionally changed
   `src/index.ts`, `src/entry-server.ts`, and the untracked `examples/` tree.
   Stage those explicitly; do not blanket `git add -A`.
4. **Consider whether `package.json` `version` / publish config** needs a bump
   before `npm publish` (`prepublishonly` already runs `build:lib`).
5. Optional: silence the demo's ESLint circular-structure warning by pinning
   `eslint-config-next` to a version matching Next 15.5.

## Blockers / Open questions

- **Docker unavailable here** — runtime auth flow unverified. Next agent (or
  human) must run the checklist in "What's next" #1.
- **Root `README.md` is heavily modified** in the working tree (558-line diff)
  from pre-existing v2 work, not this session. Confirm with the user whether
  that belongs in the same commit or a separate one.
- Is publishing `Navbar`/`Footer`/`Toast` acceptable to the consuming teams, or
  should the demo instead be trimmed further so only `PageWithAuth`/
  `PageWithAuthServer` + types are public? (User already answered: publish them.
  Flag here only if that gets revisited.)

## How to continue

1. Read this handoff file.
2. `cd /home/ecb/projects/work/cinnamon-review`, confirm branch `v2`.
3. Verify build state:
   `npx tsc --noEmit && npm run build:lib` (root),
   then `cd examples/nextjs15-demo && npx tsc --noEmit && npm run build`.
   All should exit 0.
4. Inspect the published surface:
   `cat dist/index.d.ts dist/entry-server.d.ts` and
   `grep -o 'export{[^}]*}' dist/index.js dist/server/entry-server.js`.
5. If Docker is available, run the runtime checklist ("What's next" #1).
6. Then move to commit strategy ("What's next" #3) — stage `src/index.ts`,
   `src/entry-server.ts`, and `examples/` explicitly.

## Key files

### Library (public API — the core change)
- `src/index.ts` — client entry, trimmed to `PageWithAuth` + Navbar/Footer/Toast + types.
- `src/entry-server.ts` — server entry, trimmed to `PageWithAuthServer` + types.
- `src/lib-components/PageWithAuth/PageWithAuth.tsx` — client guard: loading →
  `signinRedirect()` → `ForbiddenPage` → `Page` + children.
- `src/lib-components/PageWithAuth/PageWithAuthServer.tsx` — RSC guard: takes
  `session: CinnamonSession | null`, `permittedRoles`, `onUnauthenticated`
  (must throw, e.g. `redirect()`); no role → `ForbiddenPageServer`.
- `src/lib-components/RequireAuth/RequireAuth.tsx` — internal, used by
  PageWithAuth. NOT exported.
- `vite.lib.config.ts` / `vite.server.config.ts` — `preserveModules: true` +
  `rollup-preserve-directives` + `preserveEntrySignatures: "exports-only"`.
  The reason trimming the entry is sufficient. DO NOT change these.
- `package.json` `exports` map — two-entry structure (`.` and `./server`).

### Demo — PageWithAuth pages (validate the published surface)
- `examples/nextjs15-demo/app/client-page/page.tsx` — `PageWithAuth` from
  `@cincoders/cinnamon`, sole guard.
- `examples/nextjs15-demo/app/graficos/page.tsx` — `PageWithAuthServer` from
  `@cincoders/cinnamon/server`, sole guard, `redirect("/login")` on unauth.
- `examples/nextjs15-demo/app/server-entry/page.tsx` — two `PageWithAuthServer`
  blocks (grant vs forbidden).

### Demo — auth plumbing
- `examples/nextjs15-demo/lib/auth-server.ts` — `getServerSession()`, JWKS verify.
- `examples/nextjs15-demo/lib/oidc.ts` — `toOidcAuthLike()`.
- `examples/nextjs15-demo/components/AuthProvider.tsx` — the real OIDC provider,
  stable module-level config (do not re-inline the store or use per-route
  redirect_uri — that caused the infinite loading loop).
- `examples/nextjs15-demo/components/ServerSessionBridge.tsx` — token → cookie
  sync, loop-guarded.
- `examples/nextjs15-demo/app/api/auth/session/route.ts` — POST validates + sets
  cookie, DELETE clears.

### Demo — config / docs
- `examples/nextjs15-demo/docker-compose.yml` — Keycloak 26, realm import.
- `examples/nextjs15-demo/setup/realm.json` — realm `cinnamon-example`, users
  `admin/admin` + `user/user`, public PKCE client.
- `examples/nextjs15-demo/.env` / `.env.example` — realm config (public, safe to commit).
- `examples/nextjs15-demo/README.md` — "API pública nesta versão" table +
  `PageWithAuth` usage guide.
- `examples/nextjs15-demo/app/page.tsx` — `TEST_PAGES` array drives the test index.
