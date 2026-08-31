# Cinnamon v2 — Demo Next 15

Verifica as fronteiras server/client da `@cincoders/cinnamon` v2 no Next.js 15
App Router **e** o fluxo de autenticação contra um Keycloak real.

Não há nada mockado: o login é Authorization Code + PKCE contra o realm
`cinnamon-example`, e o `access_token` é validado no servidor contra o JWKS do realm.

## API pública nesta versão

A v2 expõe **apenas o guard de autenticação** e o que ele renderiza. O resto da
lib existe no código e no bundle, mas **não é importável** pelo pacote até ser
validado com os times consumidores.

| Entry | Exporta |
|---|---|
| `@cincoders/cinnamon` | `PageWithAuth`, `Navbar`, `Footer`, `ToastContainer`, `toast` + tipos (`PageProps`, `NavbarProps`, `FooterProps`, `OidcAuthLike`, `CinnamonSession`, `CinnamonUser`, `System`, `SideMenuLink`, `LinkComponent`, …) |
| `@cincoders/cinnamon/server` | `PageWithAuthServer` + tipos (`PageServerProps`, `CinnamonSession`, `CinnamonUser`, `NavbarProps`, `FooterProps`, …) |
| `@cincoders/cinnamon/cinnamon.css` | CSS compilado |

Não exposto (por enquanto): `Page`, `RequireAuth`, `Dialog`, `ImageInput`,
`ErrorScreen`, `IconRenderer`, `Button`, `hasAccess`, `RequireAuthServer`,
`PageServer`, `ForbiddenPageServer`, `useNavbar`, `sessionFromOidcAuth`,
`AuthUtils`. Para liberar um deles, adicione o re-export em `src/index.ts` ou
`src/entry-server.ts`.

## Setup

```bash
# 1. Keycloak local (realm + usuários importados de ./setup/realm.json)
docker compose up -d
#    aguarde ~20s; console em http://localhost:8080  (admin / admin)

# 2. Build da lib + deps do demo
cd ../.. && npm run build:lib && cd examples/nextjs15-demo
npm install

# 3. Rodar
npm run dev            # http://localhost:3000
```

Depois de editar a lib: `npm run refresh-lib`.

`.env` já vem com os valores do Keycloak local (client **público**, sem secret —
seguro versionar). Sobrescreva em `.env.local` para apontar para outro realm.

## Usuários de teste

| Usuário | Senha | Role | Efeito |
|---|---|---|---|
| `admin` | `admin` | `admin` | acessa `/graficos` |
| `user`  | `user`  | `user`  | `/graficos` → `ForbiddenPage` (403) |

## Páginas

| Página | Tipo | Verifica |
|--------|------|----------|
| `/` | Server Component | Índice das páginas de teste. `getServerSession()` (cookie httpOnly → JWKS) + `Navbar`/`Footer` client com `auth` real do `react-oidc-context`. |
| `/login` | Server + Client btn | Redireciona para o Keycloak (PKCE). Nenhum redirect automático. |
| `/client-page` | Client Component | **`PageWithAuth`** como guard único de página privada, com sessão OIDC real. Importa só do pacote publicado. |
| `/graficos` | Server Component | **`PageWithAuthServer`** como guard: `getServerSession()` valida o JWT contra o JWKS; não logado → `redirect("/login")`; sem a role → `ForbiddenPage` 403 server-side. |
| `/server-entry` | Server Component | Entry `@cincoders/cinnamon/server` isolado: dois `PageWithAuthServer` lado a lado (concedido vs `ForbiddenPage`) contra a sessão real. |
| `/interativo` | Server + Client | Dados carregados por SSR e entregues como props; client fica interativo (useState, filtros, `ToastContainer`/`toast` da lib). |
| `/server-import-client` | Server Component | Um Server Component importa `Navbar`/`Footer` do entry principal. Se `preserveModules` / `rollup-preserve-directives` regredirem, `next build` quebra aqui. |

## `PageWithAuth` — protegendo uma página privada

`PageWithAuth` (client) e `PageWithAuthServer` (RSC) são o guard pronto para
páginas privadas: eles decidem **loading → redirect/login → 403 → conteúdo** e já
montam o `Page`/`PageServer` (Navbar + Footer + layout). O consumidor não escreve
`RequireAuth` na mão.

### Client — `PageWithAuth` (ver `app/client-page/page.tsx`)

```tsx
"use client";

import { PageWithAuth } from "@cincoders/cinnamon";
import { useAuth } from "react-oidc-context";

export default function PrivatePage() {
  const auth = useAuth(); // objeto OidcAuthLike (react-oidc-context)

  return (
    <PageWithAuth
      authProps={{
        auth,                       // sessão OIDC
        permittedRoles: ["admin"],  // ["*"] = qualquer autenticado
        // publicURL?: string       // opcional, compat v1
      }}
      navbar={{ title: "Área restrita", auth, systemsList: [/* ... */] }}
      footer={{ copyrightText: "CinCoders" }}
    >
      <h1>Conteúdo só para quem tem a role admin</h1>
    </PageWithAuth>
  );
}
```

Comportamento, nessa ordem:

| Estado da sessão | O que `PageWithAuth` faz |
|---|---|
| `auth.isLoading` | Tela "Carregando…" (após 6s, mensagem de falha de conexão) |
| não autenticado | chama `auth.signinRedirect()` → login do Keycloak |
| autenticado, sem nenhuma `permittedRoles` | renderiza `ForbiddenPage` |
| autenticado, com a role | renderiza `Page` + `children` |

`permittedRoles` casa se a sessão tiver **ao menos uma** das roles. `["*"]`
libera qualquer usuário autenticado.

### Server — `PageWithAuthServer` (ver `app/graficos/page.tsx`)

```tsx
import { redirect } from "next/navigation";
import { PageWithAuthServer } from "@cincoders/cinnamon/server";
import { getServerSession } from "@/lib/auth-server";

export default async function PrivatePage() {
  const session = await getServerSession(); // CinnamonSession (token já validado no JWKS)

  return (
    <PageWithAuthServer
      authProps={{
        session,
        permittedRoles: ["admin"],
        onUnauthenticated: () => redirect("/login"), // precisa lançar (redirect faz isso)
      }}
      footer={{ copyrightText: "CinCoders" }}
      // O PageServer padrão não tem OidcAuthLike no server; para uma Navbar com
      // usuário logado, injete uma Navbar client:
      components={{ navbar: <NavbarClientWrapper session={session} /> }}
    >
      <h1>Conteúdo server-first só para admin</h1>
    </PageWithAuthServer>
  );
}
```

Diferenças em relação ao client:

- Recebe `session: CinnamonSession | null`, não `auth`.
- `onUnauthenticated` **deve lançar** (o `redirect()` do Next lança) — se não lançar, nada é renderizado.
- Sem role → `ForbiddenPageServer` (403 renderizado no servidor, sem JS).
- É um Server Component: nada de `window`, hooks ou handlers.

### Levando para outro app

O único ponto específico do app é `getServerSession()` / o `auth` do client — ou
seja, como cada projeto transforma seu cookie/token numa `CinnamonSession` ou num
`OidcAuthLike`. O guard em si (`permittedRoles`, `onUnauthenticated`, layout) é
igual em todos. Copie o padrão de `app/graficos/page.tsx` (server) ou
`app/client-page/page.tsx` (client).

## Como a sessão server é obtida

O `react-oidc-context` faz o fluxo OIDC no browser. `ServerSessionBridge`
(client) envia o `access_token` para `POST /api/auth/session`, que **valida** o
token (assinatura + emissor via `jose`/JWKS) antes de gravá-lo num cookie
`httpOnly`. Os Server Components leem esse cookie e revalidam em
`getServerSession()`.

> Isso faz o papel de um BFF. Num app real o token seria gravado server-side no
> callback OIDC e nunca passaria pelo JS do browser.

## Server vs Client — como observar

1. **Badge `RenderProbe`** — `SERVER` (verde) antes da hidratação, `CLIENT` (azul) depois.
2. **Bordas** — vermelho = `ServerBoundary` (RSC), azul = `ClientBoundary`.
3. **Network tab** em `/server-entry`: JS mínimo, sem chunks de interatividade dos componentes server.
4. **`next build`**: valida os `.d.ts` e o split RSC dos dois entries.
