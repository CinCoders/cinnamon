# Cinnamon

`@cincoders/cinnamon` is a React component library focused on standardized application layout, navigation, and authentication-aware page composition.

The current `v2` direction replaces the legacy MUI + `styled-components` stack with:

- TailwindCSS
- Radix / Shadcn-based primitives
- Vite in library mode
- clearer client/server boundaries
- support for both React SPA and Next.js scenarios

## Current Scope

Cinnamon is centered around reusable application-shell components such as:

- `Page`
- `PageServer`
- `PageWithAuth`
- `PageWithAuthServer`
- `RequireAuth`
- `RequireAuthServer`
- `Navbar`
- `Footer`
- auth helpers and utilities
- shared type exports (`User`, `System`, `SideMenuLink`, etc.)
- design assets such as the Cinnamon icon registry (`iconId`)

The goal is not only to provide isolated UI pieces, but to offer a reusable structure for authenticated web applications.

## Installation

```bash
npm install @cincoders/cinnamon
```

Peer dependencies expected by the library:

- `react`
- `react-dom`
- `react-router-dom`

## Importing CSS

Cinnamon ships its styles as a separate CSS artifact.

You must import the library CSS in the consumer project:

```ts
import "@cincoders/cinnamon/dist/cinnamon.css";
```

Without this import, components may render structurally but will not have the intended visual appearance.

### Tailwind Preflight / Global Resets

Many consumer projects use TailwindCSS (or another design system) with a global “preflight” reset. If that reset runs *after* you import Cinnamon’s CSS it will override the library’s utility classes (e.g., forcing every `button`/`input` to be transparent and removing `transform` definitions). When that happens the shell stops behaving correctly: the hamburger menu stays open, the systems popup never closes, the user avatar disappears, etc.

When integrating Cinnamon make sure your reset does **not** clobber the library styles. Recommended approaches:

- prefer disabling Tailwind’s preflight for the app that consumes Cinnamon (`corePlugins: { preflight: false }` in `tailwind.config.*`), or
- keep your custom reset scoped to your own selectors and always import `@cincoders/cinnamon/dist/cinnamon.css` after any other base styles.

This small precaution ensures the Storybook layout matches what you get in React/Next consumers.

### Variáveis de layout do shell

Para padronizar o espaçamento independentemente do reset aplicado pelo consumidor, o arquivo `cinnamon.css` expõe variáveis CSS globais:

- `--cinnamon-shell-inline`: padding horizontal usado pelo `Navbar` e pelo bloco superior do `Footer`.
- `--cinnamon-shell-max-width`: limite máximo aplicado às shells (`.cinnamon-navbar-shell` e `.cinnamon-footer-shell`) antes que um reset externo remova o `margin: auto`.
- `--cinnamon-main-padding`: preenchimento padrão aplicado ao conteúdo principal gerenciado por `Page`.

Caso um produto precise alterar esses valores, basta sobrescrevê-los no escopo global antes ou depois de importar a folha de estilos:

```css
:root {
  --cinnamon-shell-max-width: 80rem;
  --cinnamon-shell-inline: clamp(20px, 3vw, 48px);
}
```

Essa abordagem mantém o alinhamento horizontal dos blocos mesmo quando o consumidor zera `margin`/`padding` em todos os elementos.

## Basic Usage in React

```tsx
import "@cincoders/cinnamon/dist/cinnamon.css";

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

## Auth Model

The `v2-auth` branch moves authorization toward a more decoupled model.

The core authorization idea is:

- represent the current user through a session-like object
- evaluate access through roles
- avoid coupling the whole library to a specific auth provider

Current session shape:

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

## Client Auth Usage

For client-side React apps, `RequireAuth` and `PageWithAuth` currently accept an auth object compatible with `react-oidc-context`.

```tsx
import "@cincoders/cinnamon/dist/cinnamon.css";

import { PageWithAuth } from "@cincoders/cinnamon";

export function ProtectedPage({ auth }: { auth: any }) {
  return (
    <PageWithAuth
      authProps={{
        auth,
        permittedRoles: ["admin"],
      }}
      navbar={{ title: "Dashboard" }}
      footer={{ copyrightText: "My Organization" }}
    >
      <div>Protected content</div>
    </PageWithAuth>
  );
}
```

## Next.js and Server Usage

For server-oriented scenarios, Cinnamon exposes a separate server entry:

```ts
import {
  PageServer,
  PageWithAuthServer,
  RequireAuthServer,
} from "@cincoders/cinnamon/server";
```

Example:

```tsx
import "@cincoders/cinnamon/dist/cinnamon.css";

import { PageWithAuthServer } from "@cincoders/cinnamon/server";

export default function ProtectedRoute() {
  const session = {
    isAuthenticated: true,
    roles: ["admin"],
    user: { name: "Ada" },
  };

  return (
    <PageWithAuthServer
      authProps={{
        session,
        permittedRoles: ["admin"],
        onUnauthenticated: () => {
          throw new Error("Redirect not implemented in this example.");
        },
      }}
      navbar={{ title: "Admin" }}
      footer={{ copyrightText: "My Organization" }}
    >
      <div>Protected content</div>
    </PageWithAuthServer>
  );
}
```

In a real Next.js app, `onUnauthenticated` should usually trigger a framework redirect.

### Shared Icons and Types

To keep the visual language consistent between Client and Server components, the library exposes a small icon registry. Any component that accepts an `iconId` (e.g. `Navbar` → `SideMenuLink`, `SystemsPopup`) renders the exact same SVG whether it is hydrated on the client or serialized via `PageServer`. Consumers may still pass `iconUrl` or `IconComponent`, but using `iconId` is the recommended zero-config path.

All public interfaces (`User`, `System`, `SideMenuLink`, `Role`, etc.) are exported from `@cincoders/cinnamon`. Server-first apps (Next.js) should import those types instead of redefining them locally so that future library updates stay in sync.

## Public Exports

Main entry:

- `Page`
- `PageServer`
- `PageWithAuth`
- `PageWithAuthServer`
- `RequireAuth`
- `RequireAuthServer`
- `Navbar`
- `Footer`
- `ForbiddenPage`
- auth helpers
- utility helpers
- icon registry helpers (`CinnamonIconId`, `resolveCinnamonIcon`)
- shared data interfaces (`User`, `System`, `SideMenuLink`, etc.)

Server entry:

- `RequireAuthServer`
- `PageWithAuthServer`
- `PageServer`

## Development

Useful scripts:

```bash
npm run storybook
npm run build-storybook
npm run build:lib
```

Library build details:

- JavaScript bundles are built with Vite
- type declarations are generated with TypeScript
- standalone CSS is generated separately

## Repository Notes

- `main` contains the legacy implementation
- `v2` is the Tailwind/Shadcn migration
- `v2-auth` focuses on auth decoupling and React/Next compatibility

Additional internal project notes are available in:

- `PROJECT_CONTEXT.md`
- `NEXT_COMPATIBILITY_CONSIDERATIONS.md`
- `LEGACY_TO_V2_MIGRATION_SUMMARY.md`

## Current Status

The library is already functional as a reusable package, but the migration is still being consolidated.

Current focus areas:

- finalizing the auth contract
- ensuring consistent consumption in Next.js
- preserving important legacy behavior while modernizing the implementation
- documenting integration expectations clearly for consumer projects
