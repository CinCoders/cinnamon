# Resumo Abrangente do Projeto Cinnamon

## 1. **Visão Geral do Projeto**

A **Cinnamon** (`@cincoders/cinnamon`) é uma biblioteca React reutilizável de componentes focada em layout padronizado de aplicações, navegação e composição de páginas com autenticação. A biblioteca foi desenvolvida para o CIn (Centro de Informática da UFPE) e está em processo de modernização arquitetural significativa.

O projeto está organizado em três branches principais:

- **`main`**: Versão legada (MUI + styled-components)
- **`v2`**: Migração inicial para Tailwind + Shadcn
- **`v2-auth`**: Branch atual, focada em desacoplamento de autenticação e compatibilidade com React SPA e Next.js

---

## 2. **Objetivo da Migração (v2 / v2-auth)**

### De:

- MUI + styled-components
- Rollup como bundler
- Forte acoplamento entre UI, autenticação e lógica

### Para:

- **TailwindCSS** + **Shadcn/Radix**
- **Vite** em modo biblioteca
- Arquitetura desacoplada
- Separação explícita entre componentes client e server
- Compatibilidade com:
  - React SPA tradicional
  - Next.js com Server Components

**Objetivo central**: Modernizar a implementação preservando comportamentos importantes do legado, enquanto prepara a biblioteca para cenários que o legado não atendia bem, especialmente consumo em projetos Next.js.

---

## 3. **Arquitetura de Autenticação**

### Evolução Conceitual

**Legado (`main`):**

- Acoplada ao provider OIDC/Keycloak
- Dependência direta de `react-oidc-context`
- Extração de roles diretamente do token
- Modelo específico para aplicações React SPA

**v2-auth (atual):**

- Centrada em `CinnamonSession` como contrato oficial
- Uso de `hasAccess(session, permittedRoles)` como regra universal
- Provider tratado como camada de integração, não contrato principal
- Preparada para client e server

### Modelo de Sessão

```typescript
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

### Fluxo Mental da Auth v2

```
Provider → Adapter → CinnamonSession → hasAccess() → Renderização
```

Essa separação garante que a Cinnamon não dependa do ambiente onde nasceu.

### Implementação Prática

**Client (React):**

```tsx
<PageWithAuth
  authProps={{
    auth, // compatível com react-oidc-context
    permittedRoles: ["admin"],
  }}
  navbar={{ title: "Dashboard" }}
  footer={{ copyrightText: "My Organization" }}
>
  {children}
</PageWithAuth>
```

**Server (Next.js):**

```tsx
<PageWithAuthServer
  authProps={{
    session, // CinnamonSession
    permittedRoles: ["admin"],
    onUnauthenticated: () => {
      /* redirect logic */
    },
  }}
  navbar={{ title: "Admin" }}
  footer={{ copyrightText: "My Organization" }}
>
  {children}
</PageWithAuthServer>
```

---

## 4. **Componentes Principais Cobertos**

A biblioteca fornece um conjunto de componentes de aplicação shell:

| Componente                            | Descrição                                                               | Status           |
| ------------------------------------- | ----------------------------------------------------------------------- | ---------------- |
| `Page` / `PageServer`                 | Shell da aplicação (Navbar + conteúdo + Footer)                         | Preservado       |
| `Navbar`                              | Navegação com suporte a busca, menu lateral, avatar e popup de sistemas | Preservado       |
| `Footer`                              | Rodapé institucional com dados de contato                               | Preservado       |
| `RequireAuth` / `RequireAuthServer`   | Proteção de rotas com verificação de autenticação e autorização         | Evolução aguarde |
| `PageWithAuth` / `PageWithAuthServer` | Composição de `RequireAuth` + `Page`                                    | Preservado       |
| `ForbiddenPage`                       | Página de acesso negado                                                 | Novo             |
| `SideMenu`                            | Menu lateral com ícones e links                                         | Preservado       |
| `SystemsPopup`                        | Grade de sistemas acessíveis ao usuário                                 | Preservado       |
| Helpers de auth                       | `hasAccess()`, `useNavbar()` e utilitários                              | Melhorado        |

---

## 5. **Mudanças de Comportamento: Legado vs. v2-auth**

### Mudanças Intencionais Principais

| Aspecto                | Legado                                 | v2-auth                                | Impacto                                                 |
| ---------------------- | -------------------------------------- | -------------------------------------- | ------------------------------------------------------- |
| **Stack visual**       | MUI + styled-components                | Tailwind + Radix/Shadcn                | Intencional; preservar comportamento, não implementação |
| **Contrato de auth**   | Acoplado a OIDC                        | CinnamonSession                        | Evolução arquitetural desejada                          |
| **Acesso negado**      | Redireciona para `/forbidden`          | Renderiza `ForbiddenPage` inline       | Mudança comportamental a validar                        |
| **Filtro de sistemas** | `visibleRole` filtra sistemas por role | Reintegrado em 2026-03-20              | Regressão corrigida                                     |
| **CSS**                | Embutido no stack                      | Separado (import explícito necessário) | Intencional; facilita distribuição                      |
| **Suporte SSR/Next**   | Não estruturado                        | Componentes server-safe dedicados      | Grande evolução arquitetural                            |

### Retenção de Comportamento

- **Navbar com side menu**: Renderiza hambúrguer e menu lateral quando `sideMenuLinks` é não-vazio
- **Navbar com busca**: Input de busca com callback em cada mudança
- **Navbar com avatar/popup do usuário**: Integração com dados do usuário
- **Navbar com popup de sistemas**: Exibe grade de sistemas acessíveis
- **RequireAuth loading**: Loading inicial com timeout para erro amigável
- **RequireAuth autenticado**: Redirecionamento para login via `signinRedirect()`
- **Page Layout**: Cálculo dinâmico de altura para ocupar viewport

---

## 6. **Histórico de Edições (Recente)**

### 2026-03-20

- Reaplicado filtro de `systemsList` no `Navbar` para respeitar `visibleRole`
- Adicionados exports públicos de tipos: `User`, `SideMenuLink`, `System`, etc.
- Criado registro interno de ícones (`iconId`) para consistência entre client e server
- Componentes `IconRenderer`, `SideMenu` e `SystemsPopup` agora aceitam `iconId` (dados serializáveis)

### 2026-03-23

- `.cinnamon-footer-shell` e `.cinnamon-navbar-shell` agora forçam `width: 100%`, `max-width` e `margin-inline: auto`
- Preservação de alinhamento mesmo com resets globais do consumidor
- Documentação de variáveis CSS expostas:
  - `--cinnamon-shell-inline`: padding horizontal
  - `--cinnamon-shell-max-width`: limite máximo
  - `--cinnamon-main-padding`: padding do conteúdo principal

### 2026-03-24 (Experimentos Revertidos)

- Migração do footer para CSS totalmente independente (não Tailwind)
- Suporte a botões condicionais na Navbar
- Tentativa de suportar logo à esquerda sem adaptações do consumidor
- Revertidos para reavalidação de impacto em todos os projetos

---

## 7. **Considerações de Compatibilidade com Next.js**

### Desafios Principais

1. **Server Components são diferentes de Cliente**
   - Não devem depender de browser APIs
   - São ideais para leitura de sessão, autorização e redirecionamento
   - Precisam de fronteira clara entre server-safe e client-only

2. **Separação Client/Server ainda em consolidação**
   - `PageServer` renderiza `Navbar` e `Footer` (client)
   - Indica fronteira híbrida que precisa de atenção
   - Risk: consumidor pode ficar confuso sobre o que é server-safe

3. **Layout pode divergir**
- `Page` (client):
  - Mede a altura real da navbar e do footer usando `ResizeObserver` + refs.
  - Atualiza o `min-height` do `<main>` para `calc(100vh - diff)` e posiciona o `ToastContainer` a partir da altura medida.
- `PageServer` depois de 26/03/2026:
  - Continua sendo um Server Component puro, mas delega Navbar/Footer/Toast para wrappers `use client`.
  - Os wrappers vivem em `src/lib-components/Page/PageClientBridges.tsx` porque precisam ser Client Components. Eles encapsulam Navbar/Footer/Toast e expõem apenas uma API serializável para o `PageServer`.
  - `NavbarClientShell` e `FooterClientShell` aplicam `ResizeObserver`, salvam os valores em variáveis CSS globais (`--cinnamon-shell-nav-height`, `--cinnamon-shell-footer-height`) e calculam `--cinnamon-shell-offset` (soma das duas alturas). Esse valor é usado pelo `<main>` server-first para replicar o `min-height: calc(100vh - diff)` do Page client.
  - `ToastClientShell` lê `--cinnamon-shell-nav-height` e posiciona os toasts exatamente como no SPA.
  - Fluxo oficial documentado no README: **resolver sessão no server → autorizar → renderizar `PageServer` ou `PageWithAuthServer` com props serializáveis → deixar os wrappers client da Cinnamon hidratarem Navbar/Footer/Toast**, garantindo que o shell em Next tenha o mesmo espaçamento, centralização e comportamento visual do SPA sem o consumidor precisar escrever JS adicional.

4. **CSS é ponto crítico**
   - Distribuído como artefato separado (`./dist/cinnamon.css`)
   - Exige import explícito no projeto consumidor
   - Em Next, deve ser importado no layout global
   - Sem esse passo, a biblioteca renderiza mas sem estilos visuais

5. **Consistência de Ícones e Tipos**
   - Biblioteca expõe registro oficial de ícones via `iconId`
   - Interfaces (`User`, `System`, `SideMenuLink`) também exportadas
   - Permite `PageServer` receber apenas dados serializáveis e renderizar igual ao client

### Status de Conclusão

A compatibilidade com Next deve ser considerada **concluída** quando:

- ✅ Fluxo de auth estabilizado para client e server
- ✅ Exports da lib claros para consumo em Next
- ✅ CSS da Cinnamon aplicado corretamente
- ✅ Shell visual em Next equivalente ao shell em React
- ✅ Sem diferenças inesperadas por separação server/client

---

## 8. **Consumo em Projetos Next (PageServer)**

### Comportamento Esperado

`PageServer` apenas repassa componentes client. **Não injeta mocks**. O consumidor deve fornecer todos os dados necessários:

### Navbar - Elementos Condicionais

| Elemento                  | Condição de Renderização                                         | Props Necessários                                                 |
| ------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Hambúrguer + SideMenu** | `navbar.sideMenuLinks` não vazio                                 | Array de `SideMenuLink`                                           |
| **SystemsPopup**          | `navbar.systemsList` não vazio                                   | Array com `title`, `href`, `iconUrl/IconComponent`, `description` |
| **Avatar/UserPopup**      | `hiddenUser === false` E `navbar.user` tem `name/email/username` | Objeto `User` com dados                                           |
| **Search Bar**            | `haveSearchBar === true`                                         | -                                                                 |

### Footer - Elementos Condicionais

- `title`, `telephone`, `telephoneComplement`, `email`, `link`, `textLink`, `description` → todos opcionais
- `copyrightText` → sempre renderizado
- `signatureText`, `signatureLink`, `appVersion` → opcionais

### Exemplo Completo para Next

```tsx
import { PageWithAuthServer } from "@cincoders/cinnamon/server";
import testUser, testLinks, testSystems from "@cincoders/cinnamon/dist/stories/sampleData";

---

## 9. **Checkpoint de Validação no `info-cin-front`**

Para evitar contaminar as rotas reais do produto, foi criado um laboratório isolado em:

- `src/app/cinnamon-lab`

Esse laboratório passou a servir como campo controlado de validação da `v2-auth` em Next.

### O que foi validado

- leitura de sessão via cookie no server;
- redirect server-side para login;
- uso de `PageWithAuthServer` com shell completo;
- cenários `admin`, `viewer`, `forbidden` e `guest`;
- popup de sistemas reagindo às roles da sessão;
- composição mista:
  - server -> client
  - client recebendo children renderizados no server
- hidratação de componente client dentro do shell server-first.

### O que os testes confirmaram

- o fluxo server-first da Cinnamon está funcional em um consumer Next;
- o shell consegue renderizar com dados serializáveis sem exigir lógica extra no app;
- o modelo baseado em cookie reforça que a Cinnamon não depende de provider client para funcionar em Next.

### Achados relevantes

- o avatar/usuário da navbar não apareceu no cenário em que o `user` foi passado e `hiddenUser` estava `false`, então esse ponto precisa ser revisado na lib;
- o ícone do trecho `Made with [icone] by CInCoders` continua ausente no footer, confirmando a pendência visual já conhecida.

---

## 10. **Checkpoint de Validação no `prorank-front`**

O `prorank-front` foi usado como consumidor real da `v2-auth` no fluxo client legado com Keycloak/OIDC.

### O que foi validado

- login com OIDC em uso real;
- `PageWithAuth` em SPA;
- `RequireAuth` em SPA;
- `AuthUtils.hasAccess(auth, roles)` com o objeto legado do `react-oidc-context`;
- navegacao protegida por role;
- `ForbiddenPage` no fluxo client;
- shell visual da Cinnamon no app.

### Ajustes na lib que foram necessarios

- `OidcAuthLike` passou a aceitar `user: null`, acompanhando o formato real do `AuthContextProps`;
- `ForbiddenPage` voltou a aceitar `auth` e `publicURL` como props de compatibilidade;
- `RequireAuth` passou a repassar `auth` e `publicURL` para a `ForbiddenPage` no acesso negado client-side;
- o asset do coracao no footer foi corrigido.

### Conclusao desta frente

Do ponto de vista da Cinnamon, o `prorank-front` validou a camada compat do fluxo client legado. Os erros remanescentes observados no navegador estavam ligados ao backend/API do projeto e nao caracterizaram regressao da biblioteca.

export default function ProtectedPage() {
  return (
    <PageWithAuthServer
      navbar={{
        title: "Cinnamon",
        h1: true,
        haveSearchBar: true,
        hiddenUser: false,
        user: testUser,
        sideMenuLinks: testLinks,
        systemsList: testSystems,
      }}
      footer={{
        title: "FOOTER TITLE",
        telephone: "(xx) xxxx-xxxx",
        email: "sample@email.com",
        link: "https://www.google.com",
        textLink: "Site",
        description: "Footer description",
        copyrightText: "CIn UFPE | All rights reserved",
      }}
      authProps={{
        session: { /* CinnamonSession */ },
        permittedRoles: ["admin"],
        onUnauthenticated: () => { /* redirect */ },
      }}
    >
      {children}
    </PageWithAuthServer>
  );
}
```

---

## 9. **Installation e Integração**

### Instalação

```bash
npm install @cincoders/cinnamon
```

### Peer Dependencies

- `react`
- `react-dom`
- `react-router-dom`

### Import de CSS (Crítico)

```typescript
import "@cincoders/cinnamon/dist/cinnamon.css";
```

⚠️ **Atenção com Tailwind Preflight**: Se o consumidor usa Tailwind com preflight, ele pode clobbrar os estilos da Cinnamon. Solução:

- Desabilitar preflight no `tailwind.config.*`:
  ```js
  corePlugins: {
    preflight: false;
  }
  ```
- Ou manter resets scoped e sempre importar `cinnamon.css` depois

### Variáveis CSS Customizáveis

```css
:root {
  --cinnamon-shell-inline: 48px; /* padding horizontal */
  --cinnamon-shell-max-width: 80rem; /* limite máximo */
  --cinnamon-main-padding: 2rem; /* padding do conteúdo */
}
```

---

## 10. **Exports Públicos**

### Main Entry (`@cincoders/cinnamon`)

- Componentes: `Page`, `PageWithAuth`, `RequireAuth`, `Navbar`, `Footer`, `ForbiddenPage`
- Auth helpers: `hasAccess()`, helpers de Keycloak
- Utility helpers: `useNavbar()`, icon registry
- Tipos: `User`, `System`, `SideMenuLink`, `Role`, `CinnamonSession`, etc.
- Ícones: `CinnamonIconId`, `resolveCinnamonIcon()`

### Server Entry (`@cincoders/cinnamon/server`)

- `RequireAuthServer`
- `PageWithAuthServer`
- `PageServer`

---

## 11. **Prioridades Recomendadas**

Com base no estado atual, as prioridades sugeridas são:

1. ✅ **Fechar contrato final de auth**: `CinnamonSession` + `hasAccess()` + adaptadores
2. 🔄 **Consolidar suporte Next.js**: Validar equivalência visual e comportamental
3. 🔄 **Revisar regressões funcionais**: Renderização x Redirecionamento de `ForbiddenPage`, filtro de `visibleRole`
4. 🔄 **Garantir consumo de CSS**: Documentar corretamente para evitar problemas de integração
5. 🔄 **Estabilizar `Page` vs `PageServer`**: Alinhar lógica dinâmica de layout entre ambos

---

## 12. **Resumo Executivo**

A **Cinnamon está em fase avançada de migração** de uma arquitetura legada (MUI + styled-components) para uma moderna (Tailwind + Shadcn + Vite). A evolução não é apenas tecnológica; é também arquitetural:

- **Autenticação desacoplada**: Transição de `react-oidc-context` como contrato para `CinnamonSession`
- **Suporte estrutural a Next.js**: Pares de componentes client/server permitem consumo em aplicações modernas
- **Persistência de comportamento**: Componentes core (`Navbar`, `Footer`, `Page`, `RequireAuth`) mantêm funcionalidades principais
- **Preparação para escalabilidade**: Registro de ícones, tipos exportados e CSS separado facilitam compatibilidade futura

O principal trabalho restante não é reescrever o legado, mas **consolidar decisões finais**: fechar o contrato de auth, garantir equivalência visual entre React e Next, corrigir regressões menores e documentar claramente o consumo da biblioteca.
