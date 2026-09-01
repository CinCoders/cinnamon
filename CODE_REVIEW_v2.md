# Code Review — Cinnamon `v2` (React 18 → Next.js 15 + Tailwind)

**Repositório:** `CinCoders/cinnamon` @ branch `v2` (commit `24f4ac6`)
**Foco:** integração Keycloak, fronteiras server/client (RSC), empacotamento da lib e padrões Next.js.
**Método:** leitura integral de `src/`, além de execução real de `tsc` (strict + build), `npm run build:lib` e inspeção dos artefatos em `dist/`.

## Como ler este relatório

Cada item tem: **severidade**, **arquivo:linha**, **o problema (com evidência)** e **2 sugestões de correção com prós/contras**.

Severidades:
- 🔴 **Bloqueador** — quebra a integração Next 15 / build / tipos.
- 🟠 **Alto** — bug funcional ou de contrato (inclui Keycloak).
- 🟡 **Médio** — code smell, código morto, inconsistência de design system.
- 🔵 **Baixo** — limpeza / ergonomia.

### Evidências reproduzíveis coletadas
```
npx tsc -p tsconfig.app.json --noEmit      → exit 2 (erros de tipo reais)
npm run build:lib:js                        → exit 0
npm run build:lib:types (tsc build.json)    → exit 2  (2 erros em Navbar.tsx)
npm run build:lib   (cadeia js&&types&&css) → exit 2  (falha na etapa de types)
grep -c "use client" dist/cinnamon.esm.js   → 0       (bundle principal SEM diretivas)
grep -rl 'from "@/' dist/**/*.d.ts          → 15 arquivos (.d.ts vazando alias @/)
```

---

## 🔴 BLOQUEADORES

### 1. O bundle principal (`.`) descarta todas as diretivas `"use client"` → componentes quebram em Server Components do Next 15
**Arquivos:** `vite.lib.config.ts:12-37`, evidência em `dist/cinnamon.esm.js` (0 ocorrências de `use client`).

O entry `.` (`import { Page, Navbar, Dialog, ... } from "@cincoders/cinnamon"`) é buildado em **library mode** com `formats: ["es","cjs","iife"]` e **entry única** (`src/index.ts`). Isso faz o Rollup **agrupar tudo em um único arquivo** e **remover as diretivas de módulo** — o plugin `rollup-preserve-directives` só é usado em `vite.server.config.ts`, nunca no build principal.

Confirmação empírica: `dist/cinnamon.esm.js` e `dist/cinnamon.ssr.js` têm **zero** `"use client"`, mesmo os 22 componentes-fonte tendo a diretiva. Consequência: quando um consumidor Next 15 importa `Page`/`Navbar`/`Dialog`/`ImageInput`/`Toast` do entry principal dentro de uma árvore Server Component (o default no App Router), esses módulos rodam como server e disparam erro em runtime (`useState`/`createContext`/`useEffect` só funcionam em Client Components). O próprio README (`README.md:120-136`) mostra `import { Page } from "@cincoders/cinnamon"` em uma função exportada como página — que no App Router seria server e quebraria.

> Observação: o entry `./server` está **correto** (usa `preserveModules: true` + `preserveDirectives()` — verifiquei que `dist/server/**` mantém `"use client"` nos módulos client e omite nos server puros). O problema é exclusivamente o entry principal, que carrega a maior parte dos componentes visuais.

**Sugestão A — Aplicar `preserveModules` + `preserveDirectives` também no build principal (recomendada)**
Reescrever `vite.lib.config.ts` para espelhar o `vite.server.config.ts`: `output.preserveModules: true`, `preserveModulesRoot: "src"`, plugin `preserveDirectives()`, entry `src/index.ts`, formato `es` (e `cjs` num segundo output se necessário).
- **Prós:** cada componente mantém seu próprio boundary `"use client"`; funciona igual ao shadcn/MUI v6 em RSC; tree-shaking real; alinha os dois entries numa mesma estratégia.
- **Contras:** o formato `iife`/`min.js` (UMD para `<script>`) é incompatível com `preserveModules` — teria que ser um build separado (ou abandonado, já que Next não usa UMD); muda o layout de `dist` e exige atualizar `main`/`module`/`exports` no `package.json`.

**Sugestão B — Marcar o bundle inteiro como client via banner e documentar**
Manter a entry única mas injetar `"use client"` no topo do bundle (ex.: `output.banner: '"use client";'`) e deixar explícito que o entry `.` é 100% client; server-first só via `./server`.
- **Prós:** mudança mínima; previsível; o consumidor sempre pode importar do `.` dentro de um client component.
- **Contras:** perde a capacidade de usar componentes sem interatividade (`Footer`, `ErrorScreen`, `Button`) como Server Components — tudo vira client, aumentando o JS enviado ao browser; banner em `iife`/`cjs` pode não ficar como primeira linha válida; é uma regressão em relação ao objetivo declarado da v2 ("clearer client/server boundaries").

---

### 2. `npm run build:lib` falha (exit 2): a etapa de types quebra em 2 erros de tipo no `Navbar`
**Arquivo:** `src/lib-components/Navbar/Navbar.tsx:103` e `:268`.

A cadeia `build:lib:js && build:lib:types && build:lib:css` para na etapa de types porque `tsc -p tsconfig.build.json` retorna exit 2:
```
Navbar.tsx(103,17): TS2339 Property 'given_name' does not exist on type
  '{ sub?; email?; name?; preferred_username? }'.
Navbar.tsx(268,23): TS2559 Type 'OidcAuthLike' has no properties in common with type 'AuthLike'.
```
- **:103** — `profile` lê `p.given_name`, mas o tipo do `profile` do OIDC (`src/auth/types.ts:31-36`) não declara `given_name`. Resultado funcional: **o nome/inicial do usuário vindo do Keycloak nunca aparece** (fica string vazia).
- **:268** — o `Navbar` passa `auth` (`OidcAuthLike`) para `UserPopup`, cujo prop `auth` é `AuthLike = { signoutRedirect? }` (`src/components/UserPopup/UserPopup.tsx:9-11`). `OidcAuthLike` declara `signinRedirect`, não `signoutRedirect` → **o logout pelo menu do usuário é frágil/quebrado no contrato** (só funciona se o objeto real do `react-oidc-context` tiver `signoutRedirect`, que existe em runtime mas não no tipo).

**Sugestão A — Corrigir o contrato de tipos do OIDC e do `profile` (recomendada)**
Adicionar `given_name?: string` e `signoutRedirect?` ao tipo do usuário/OIDC em `src/auth/types.ts`, e alinhar `UserPopup.AuthLike` com `OidcAuthLike` (ou um tipo comum `CinnamonOidcAuth`).
- **Prós:** conserta os dois erros na raiz, destrava o build e faz o nome/logout do Keycloak realmente funcionarem; tipos passam a refletir o objeto real do provider.
- **Contras:** exige mapear com cuidado quais claims do Keycloak são garantidos (`given_name` é opcional dependendo do mapper) — precisa de fallback para `name`.

**Sugestão B — Derivar o nome só de claims já tipados + `noEmitOnError:false`/CI tolerante**
Trocar `p.given_name` por `p.name`/`p.preferred_username` (já tipados) e adicionar `signoutRedirect` só onde é usado.
- **Prós:** correção pontual e imediata, sem redesenhar tipos; menos risco de regressão.
- **Contras:** não resolve o problema estrutural de `OidcAuthLike` estar incompleto; se depender de `given_name` para "primeiro nome", muda comportamento visual; mascarar erros de tipo no build (ex.: `--noEmitOnError false`) esconde regressões futuras.

---

### 3. Os `.d.ts` emitidos vazam o alias `@/` → tipos quebram no consumidor
**Arquivos:** 15 `.d.ts` em `dist/` (ex.: `dist/lib-components/Navbar/Navbar.d.ts:2-3` → `from "@/interfaces"`, `from "@/auth"`; `dist/interfaces/index.d.ts:2` → `from "@/icons"`).

`build:lib:types` roda `tsc` com `emitDeclarationOnly` e `paths: { "@/*": ["src/*"] }`, mas o `tsc` **não reescreve** aliases nos arquivos de saída. Os `.d.ts` publicados contêm `import ... from "@/..."`, que o projeto consumidor não tem mapeado → erros de resolução de tipo (`Cannot find module '@/interfaces'`). Ou seja: os componentes até funcionam em runtime, mas o consumidor perde tipagem/IntelliSense e pode quebrar o `tsc` do app dele.

**Sugestão A — Pós-processar os `.d.ts` com `tsc-alias` (recomendada)**
Adicionar `tsc-alias` ao passo de types: `tsc -p tsconfig.build.json && tsc-alias -p tsconfig.build.json`.
- **Prós:** solução consagrada e de baixo esforço; reescreve `@/` para caminhos relativos reais; mantém o layout de arquivos atual.
- **Contras:** adiciona uma devDependency e um passo no pipeline; precisa manter o `tsc-alias` alinhado com mudanças de `paths`.

**Sugestão B — Empacotar os tipos com um dts-bundler (`tsup`/`api-extractor`/`vite-plugin-dts`)**
Gerar um único `index.d.ts` (e `entry-server.d.ts`) achatado, sem imports internos por alias.
- **Prós:** entrega types mais limpos e um único arquivo por entry; elimina 100% do vazamento de caminhos internos; melhora a superfície pública.
- **Contras:** troca maior no build; bundlers de dts às vezes têm arestas com `preserveModules`/tipos genéricos complexos; mais configuração para manter os dois entries (`.` e `./server`).

---

## 🟠 ALTO — Keycloak e contratos de auth

### 4. Roles só lidos de `realm_access` — roles de client (`resource_access`) são ignorados
**Arquivo:** `src/auth/keycloak.ts:48-51` (`unsafeDecodeRolesFromKeycloakAccessToken`).

O extractor retorna apenas `payload?.realm_access?.roles`. O próprio `KeycloakPayload` (`:3-10`) declara `resource_access?: Record<string, { roles }>`, mas ele é ignorado. Em muitos setups de Keycloak, as roles relevantes ficam em `resource_access[clientId].roles` (client roles). Consequência: `hasAccess` e a filtragem de sistemas no Navbar falham para quem depende de client roles — um risco direto para "garantir que a integração com o Keycloak funcione".

**Sugestão A — Unir realm + resource roles com opção de client (recomendada)**
Aceitar um `clientId` opcional e mesclar `realm_access.roles` com `resource_access[clientId].roles` (ou todos os clients).
- **Prós:** cobre os dois modelos de role do Keycloak; retrocompatível (default continua realm); resolve casos reais de autorização.
- **Contras:** precisa expor/definir o `clientId` (config nova); merge de todos os clients pode incluir roles indesejadas se não for filtrado.

**Sugestão B — Documentar explicitamente que só realm roles são suportadas**
Manter o comportamento e deixar claro no README + tipos que a lib assume realm roles.
- **Prós:** zero código novo; expectativa alinhada.
- **Contras:** limita a lib; empurra o problema para cada consumidor reimplementar a extração; contraria o objetivo de centralizar auth na Cinnamon.

---

### 5. Decodificação de JWT sem validação de assinatura no caminho de autorização
**Arquivo:** `src/auth/keycloak.ts:17-51` (`unsafeDecodeJwtPayload` / `unsafeDecode...`).

Os helpers estão corretamente nomeados como `unsafe` e comentados ("não usar para autorização real no server"). Porém `hasAccess` (usado inclusive por `RequireAuthServer`) acaba consumindo roles derivadas desse decode via `sessionFromOidcAuth`. No caminho **client** isso é aceitável (a UI não é fronteira de segurança). No **server**, se alguém montar a `CinnamonSession` a partir do token decodificado sem validar assinatura, vira brecha de autorização.

**Sugestão A — Separar fisicamente o caminho server e exigir sessão já validada (recomendada)**
No `entry-server`, aceitar **apenas** `CinnamonSession` construída pelo consumidor após validar o token (via `jose`/introspection), e não exportar os helpers `unsafe*` do entry server.
- **Prós:** torna impossível cair no decode inseguro no server; deixa a fronteira de confiança explícita; alinhado ao modelo "server recebe session pronta" já sugerido no README.
- **Contras:** exige que cada consumidor faça a validação (mais fricção); precisa de doc/exemplo claro com `jose`.

**Sugestão B — Adicionar um verificador opcional de assinatura na própria lib**
Oferecer um `verifyKeycloakToken(token, { jwksUri })` (usando `jose`) como helper server.
- **Prós:** centraliza a validação correta na lib; ergonomia melhor para os apps.
- **Contras:** adiciona dependência e responsabilidade de segurança à lib; precisa lidar com cache de JWKS, clock skew, etc.; aumenta a superfície de manutenção.

---

### 6. `RequireAuthServer` retorna o resultado de `onUnauthenticated()` como JSX
**Arquivo:** `src/lib-components/RequireAuth/RequireAuthServer.tsx:30-32`.

`return onUnauthenticated();` assume que a função **sempre lança** (ex.: `redirect()` do Next, que faz throw). Se um consumidor passar uma função que não lança (retorna `void`/`undefined`), o componente renderiza `undefined` → erro do React. O tipo `() => never` sinaliza a intenção, mas nada garante em runtime.

**Sugestão A — Não renderizar o retorno; chamar e então lançar/retornar `null` (recomendada)**
```tsx
if (!session?.isAuthenticated) { onUnauthenticated(); return null; }
```
- **Prós:** seguro mesmo se a função não lançar; mantém a API; sem crash de render.
- **Contras:** se o consumidor esquecer de lançar, o fluxo segue para `return null` silenciosamente (sem redirect) — pode mascarar erro de integração (mitigável com um `console.warn` em dev).

**Sugestão B — Aceitar uma `redirectTo: string` opcional e a lib decide**
Expor `loginUrl`/`redirectTo` e deixar o consumidor escolher entre callback OU URL, com a lib fazendo o `throw` internamente.
- **Prós:** API mais à prova de erro; menos boilerplate no consumidor.
- **Contras:** reacopla a lib a detalhes de navegação; em Next o redirect ideal é `redirect()` (server action), então a lib ainda precisaria do callback para não importar `next/navigation`.

---

## 🟡 MÉDIO — Bugs funcionais, código morto e design system

### 7. Duas bibliotecas de toast; `sonner`/`AppToaster` é código morto
**Arquivos:** `src/components/ui/toaster.tsx` (sonner) vs `src/components/Toast/Toast.tsx` (react-toastify). `package.json:71-72` lista ambas.

`AppToaster` (sonner) não é exportado nem usado em lugar nenhum (confirmei por grep). `react-toastify` é o toast realmente exportado (`ToastContainer`, `toast`). Resultado: dependência `sonner` inteira no bundle sem uso + confusão de qual é o toast oficial.

**Sugestão A — Remover `sonner` e o `toaster.tsx` (recomendada).** Prós: menos peso e ambiguidade. Contras: se havia intenção de migrar para sonner (mais moderno/menor), perde esse caminho — decidir antes.
**Sugestão B — Padronizar em `sonner` e aposentar `react-toastify`.** Prós: sonner é mais leve e sem CSS externo (o `Toast.tsx` importa `react-toastify/dist/ReactToastify.css`, um side-effect de CSS problemático em SSR). Contras: quebra a API pública `toast`/`ToastContainer` já documentada; exige migração dos consumidores.

### 8. Componentes e props "fantasma" (dead code / API enganosa)
- `src/components/ui/sheet.tsx` e `src/components/ui/scroll-area.tsx`: definidos, **não exportados nem usados** (o `SideMenu` usa um `<aside>` próprio).
- `src/components/SearchDropdown/SearchDropdown.tsx`: não exportado no `index.ts`, não usado pelo `Navbar` (que tem seu próprio `<input>`).
- `NavbarProps.searchDropdownLabelsList` (`Navbar.tsx:32`) e `NavbarProps.logoutFunction` (`:33`): declarados na interface pública mas **nunca desestruturados/usados** no componente.
- `NavbarProps.IconComponent` (`:39`, `:63`): desestruturado mas nunca renderizado (o `tsc` acusa `IconComponent is declared but its value is never read`).

**Sugestão A — Remover o código/props mortos (recomendada).** Prós: superfície pública honesta; menos manutenção. Contras: se `SearchDropdown`/`Sheet` fazem parte do roadmap, precisa decidir mantê-los "internos" documentadamente.
**Sugestão B — Ligar de fato o que faz sentido** (ex.: usar `SearchDropdown` no Navbar via `searchDropdownLabelsList`, usar `Sheet` como base do `SideMenu`). Prós: aproveita o trabalho já feito e entrega a feature implícita na API. Contras: mais esforço e testes; muda comportamento visual.

### 9. Tokens de tema referenciados mas não definidos → utilitários sem cor
**Arquivos:** `src/components/ui/input.tsx:13` (`border-input`), `src/components/ui/tooltip.tsx:21` (`bg-popover`, `text-popover-foreground`) vs `src/styles/globals.css:43-55` (define só `background/foreground/muted/primary/border/ring`).

`@theme inline` não define `--color-input`, `--color-popover`, `--color-popover-foreground`. No Tailwind v4 esses utilitários não são gerados corretamente → borda do `Input` e fundo do `Tooltip` ficam sem a cor pretendida.

**Sugestão A — Adicionar os tokens faltantes ao `@theme inline` (recomendada).** Prós: correção mínima e completa o design system. Contras: precisa escolher valores coerentes (light/dark).
**Sugestão B — Trocar as classes por tokens já existentes** (ex.: `border-border`, `bg-muted`). Prós: sem novos tokens. Contras: perde granularidade semântica (popover ≠ muted); diverge do padrão shadcn.

### 10. Cor de marca (`#DB1E2F`) hardcoded em vez de token; `--primary` é navy
**Arquivos:** `Navbar.tsx:252`, `ForbiddenPage.tsx:48/51`, `SideMenu`, `SystemsPopup.tsx:36` usam `#db1e2f`; mas `globals.css:12` define `--primary: 222.2 47.4% 11.2%` (navy). O `UserPopup.tsx:42` usa `bg-primary` (navy) para o avatar, enquanto o `Navbar` usa vermelho — **avatares com cores diferentes** para a mesma marca.

**Sugestão A — Definir `--primary` como o vermelho CInCoders e trocar os hex por `bg-primary`/`text-primary` (recomendada).** Prós: um único ponto de verdade da marca; dark mode e temização passam a funcionar. Contras: revisar todos os usos de `bg-primary` que hoje assumem navy (ex.: botões default).
**Sugestão B — Criar um token dedicado `--color-brand` e usar nos pontos vermelhos.** Prós: separa "primary do design system" de "vermelho da marca"; menos risco de regressão nos botões. Contras: mais um token para manter; ainda exige trocar todos os hex.

### 11. `UserPopup`: seta do accordion não gira (seletor no elemento errado)
**Arquivo:** `src/components/UserPopup/UserPopup.tsx:90-92`. O `data-[state=open]:rotate-180` está num `<span>` que **não** recebe `data-state` (o Radix coloca `data-state` no `Accordion.Trigger`, o elemento pai). A seta `▼` nunca gira.

**Sugestão A — Mover o indicador para dentro do `Trigger` usando `[&[data-state=open]>svg]` ou um `AccordionTrigger` com ícone (recomendada).** Prós: gira corretamente; padrão shadcn. Contras: pequeno refactor de markup.
**Sugestão B — Controlar a rotação via estado React (`open`) do item.** Prós: independente do DOM do Radix. Contras: reintroduz estado manual que o Radix já gerencia; mais código.

### 12. Navegação com `<a>` cru — sem client-side routing no Next
**Arquivos:** `SideMenu.tsx:75-113` (`SameTabLink`/`NewTabLink`), `SystemsPopup.tsx:23`, `UserPopup.tsx:60`.

Links internos usam `<a href>`, que no Next causa **full page reload** (perde o SPA/streaming). Uma lib de componentes agnóstica não deveria hardcodar `<a>` para navegação interna.

**Sugestão A — Aceitar um `linkComponent`/`as` injetável (ex.: passar `next/link`) com fallback para `<a>` (recomendada).** Prós: mantém a lib agnóstica e habilita client routing no Next/React Router. Contras: leve complexidade de API; consumidor precisa passar o componente.
**Sugestão B — Detectar externo vs interno e deixar `<a>` só para externos, documentando que internos devem ser injetados.** Prós: simples. Contras: não resolve o reload dos internos por padrão.

### 13. `enum httpErrors` viola o próprio lint (`erasableSyntaxOnly`)
**Arquivo:** `src/lib-components/ErrorScreen/ErrorScreen.tsx:6-11`. Sob `tsconfig.app.json` (`erasableSyntaxOnly: true`), `tsc` acusa `TS1294: This syntax is not allowed`. `enum` não é erasable.

**Sugestão A — Trocar por `const` object + union type (recomendada):** `export const httpErrors = { NOTFOUND_404: 0, ... } as const; type HttpError = (typeof httpErrors)[keyof typeof httpErrors]`. Prós: compatível com o lint, tree-shakeable, mesmo uso `httpErrors.NOTFOUND_404`. Contras: muda o tipo do enum (union numérica) — revisar assinaturas de `ErrorScreenProps`.
**Sugestão B — Usar string union direta** (`errorType: "404" | "501" | "503-inactive" | "503-maintenance"`). Prós: mais legível/serializável (bom p/ props vindas do server). Contras: breaking change na API pública `httpErrors`.

---

## 🔵 BAIXO — limpeza e ergonomia

### 14. `react-router-dom` como `peerDependency` obrigatória, mas não usada
**Arquivo:** `package.json:79`. Grep em `src/` (fora de stories) → **nenhum** uso de `react-router`. Para uma lib mirando Next 15 (que tem router próprio), isso força consumidores a instalar react-router à toa.
- **A (recomendada):** remover de `peerDependencies`. Prós: alinha com Next. Contras: se algum consumidor SPA legado dependia do tipo, precisa comunicar.
- **B:** mover para `peerDependenciesMeta` como `optional: true`. Prós: não quebra SPAs. Contras: mantém uma dependência conceitualmente morta.

### 15. `useNavbar` com `any` e typo `setSearchFuncion`
**Arquivo:** `src/lib-components/Page/useNavbar.tsx:27-31`. `setSideMenuLinks(sideMenuLinks: any)`, `setSearchFuncion` (sic). O README (`:308`) até assume o typo como "compat".
- **A (recomendada):** tipar com `NavbarProps["sideMenuLinks"]`/`["searchFunction"]` e adicionar `setSearchFunction` como alias correto, mantendo o antigo `@deprecated`. Prós: type-safety + caminho de saída do typo. Contras: dois nomes por um tempo.
- **B:** só corrigir tipos e manter o nome. Prós: mínimo. Contras: perpetua o typo na API.

### 16. `main` do package aponta para `cinnamon.ssr.js`, fora do mapa `exports`
**Arquivo:** `package.json:12` (`"main": "dist/cinnamon.ssr.js"`) enquanto `exports["."]` (`:21-25`) só mapeia o `.esm.js`. Em ambientes que respeitam `exports`, o `main` é ignorado; o `.ssr.js` (CJS) fica sem ponto de entrada oficial e ainda carrega o problema do item #1.
- **A (recomendada):** alinhar `exports` e `main`/`module` após decidir a estratégia do item #1 (idealmente dropar o `.ssr.js`/`iife` se migrar para `preserveModules`). Prós: consistência. Contras: acoplado à decisão do #1.
- **B:** adicionar `require`/`node` ao mapa `exports`. Prós: dual ESM/CJS explícito. Contras: manter dois formatos com boundaries corretos é mais trabalho.

### 17. `Footer`/`ErrorScreen`/`IconRenderer` marcados `"use client"` sem necessidade
`Footer.tsx:1`, `IconRender/index.tsx:1` não têm interatividade (só props/render). Poderiam ser Server Components — o que só é possível se o item #1 for resolvido com `preserveModules`.
- **A (recomendada):** remover `"use client"` desses após corrigir o build. Prós: menos JS no client. Contras: `Footer` usa `new Date().getFullYear()` (server-time) — risco mínimo de mismatch em virada de ano.
- **B:** manter como client. Prós: zero risco. Contras: perde a vantagem de RSC.

### 18. Sem testes automatizados da lógica de auth
Não há script `test` nem testes unitários para `hasAccess`/`sessionFromOidcAuth`/`normalizeSession` (há só addon-vitest de stories). Auth é justamente o que "precisa garantir que funcione".
- **A (recomendada):** adicionar Vitest unit para `auth/*` (matriz: `*`, realm role, resource role, não-autenticado, session vs OIDC). Prós: trava o comportamento crítico. Contras: esforço inicial.
- **B:** cobrir via stories/interaction tests. Prós: reusa infra existente. Contras: lento e indireto para lógica pura.

### 19. `PageWithAuth` não repassa `flexDirection`
**Arquivo:** `src/lib-components/PageWithAuth/PageWithAuth.tsx:17-41`. Aceita `PageProps` mas não passa `flexDirection` ao `Page`. Prop silenciosamente ignorada.
- **A (recomendada):** repassar todas as props com `...rest`. Prós: paridade com `Page`. Contras: revisar o que faz sentido sob auth.
- **B:** documentar a omissão. Prós: zero código. Contras: API inconsistente.

### 20. `Dialog`: `acceptFunction`/`rejectFunction` não fecham o modal
**Arquivo:** `src/lib-components/Dialog/index.tsx:141-153`. Quando `acceptFunction`/`rejectFunction` são passados, `onHide` não é chamado → o diálogo permanece aberto (o caller precisa fechar manualmente). Pode ser intencional, mas diverge do comportamento "OK fecha".
- **A (recomendada):** chamar a função e então `onHide()` (com opção de `keepOpen`). Prós: comportamento previsível. Contras: quebra quem já fecha manualmente.
- **B:** documentar que o caller controla o fechamento. Prós: sem breaking change. Contras: pegadinha de ergonomia.

---

## Resumo executivo

**A integração Next 15 NÃO está pronta como está**, por três bloqueadores de empacotamento/tipos:
1. **#1** — o entry principal perde os `"use client"` (RSC quebra em runtime para a maioria dos componentes visuais).
2. **#2** — `npm run build:lib` falha (exit 2) por 2 erros de tipo no `Navbar`, que também **quebram nome/logout do Keycloak** na prática.
3. **#3** — os `.d.ts` publicados vazam `@/`, quebrando os tipos no consumidor.

O caminho **`./server`** está bem construído (boundaries corretos), e o desenho de auth (contrato `CinnamonSession` desacoplado do provider) é sólido. Os ajustes de Keycloak mais urgentes são **#4** (client roles) e **#5** (não confiar em JWT não validado no server).

**Ordem sugerida de correção:** #2 → #1 → #3 (destravam build + RSC + tipos) → #4/#5 (Keycloak) → #9/#10/#11 (design system/UI) → demais.

> Nota sobre "transformar server em client": após o item #1, o comportamento correto é o inverso do que a pergunta sugere — a maioria dos componentes **já é** client e só precisa **preservar** a diretiva no build. Os únicos candidatos a virar/permanecer server são `Footer`, `ErrorScreen` e `IconRenderer` (item #17), e os componentes do entry `./server`, que já estão corretos.
