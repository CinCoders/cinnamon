# Legacy to V2 Migration Summary

## Visão geral

O repositório `cinnamon` está passando por uma migração estrutural importante.

O legado, representado principalmente pela branch `main`, foi construído com:

- MUI
- `styled-components`
- Rollup
- maior acoplamento entre UI, autenticação e lógica de navegação

A `v2`, e especialmente a `v2-auth`, representa a nova direção da biblioteca:

- TailwindCSS
- Shadcn / Radix
- Vite em modo biblioteca
- arquitetura mais desacoplada
- separação entre componentes client e server
- foco em compatibilidade com React SPA e Next.js

O objetivo da migração não é apenas trocar a stack visual. O objetivo real é preservar os comportamentos importantes do legado, modernizar a implementação e preparar a Cinnamon para cenários que o legado não atendia bem, especialmente consumo em projetos Next com Server Components.

## O que mudou de forma intencional

As mudanças mais importantes da migração foram:

- substituição de MUI e `styled-components` por Tailwind + Radix/Shadcn
- substituição do build com Rollup por Vite
- redução do acoplamento da autenticação ao provider
- criação de caminhos separados para client e server
- organização da biblioteca para consumo mais previsível como pacote externo

Essas mudanças são desejadas. O principal cuidado da migração é garantir que a evolução arquitetural não produza regressões funcionais ou quebras silenciosas para quem dependia do comportamento do legado.

## Tabela comparativa: legado vs v2-auth

| Área | Legado `main` | `v2-auth` atual | Status | O que manter / observar |
|---|---|---|---|---|
| Stack visual | MUI + `styled-components` + Rollup | Tailwind + Radix/Shadcn + Vite | Mudou de forma intencional | A troca de stack parece saudável; o que precisa ser preservado é comportamento e API útil, não a implementação antiga. |
| Contrato público da lib | Exportava `Navbar`, `Footer`, `Page`, `RequireAuth`, `PageWithAuth`, `ToastContainer`, `AuthUtils`, `useNavbar` e outros | Continua exportando o núcleo em `src/index.ts` | Parcialmente preservado | Vale conferir se itens antigos importantes como `useNavbar` e `Toast` continuam exportados do jeito esperado por consumidores legados. |
| `Page` como shell da aplicação | Combinava `Navbar` + conteúdo + `Footer`; calculava altura para ocupar viewport; suportava toast e overrides de componentes | Faz praticamente o mesmo em `src/lib-components/Page/Page.tsx` | Preservado | Esse é um bom exemplo de comportamento migrado com fidelidade. |
| Contexto dinâmico da navbar | `Page` criava contexto para alterar título, busca e links lateralmente | Continua com contexto em `src/lib-components/Page/useNavbar.tsx` | Preservado | Bom manter porque parece parte importante da ergonomia da lib. |
| API do `useNavbar` | No legado existia `useNavbar` para atualizar partes da navbar | Em `v2-auth` ainda existe, mas a API está simplificada em `src/lib-components/Page/useNavbar.tsx` | Preservado com risco | Tem um detalhe para revisar: hoje existe `setSearchFuncion` com typo no nome. Se algum consumer esperar outra assinatura, isso pode virar incompatibilidade. |
| `Navbar` com side menu | Mostrava botão hamburguer e menu lateral quando havia links | Continua em `src/lib-components/Navbar/Navbar.tsx` | Preservado | Comportamento-base parece mantido. |
| `Navbar` com busca | Input de busca chamando callback a cada mudança | Continua em `src/lib-components/Navbar/Navbar.tsx` | Preservado | Vale só validar visual e responsividade. |
| `Navbar` com popup do usuário | Avatar/menu do usuário com dados vindos de `auth` | Continua em `src/lib-components/Navbar/Navbar.tsx` e `src/components/UserPopup/UserPopup.tsx` | Preservado | Mantém o comportamento funcional principal. |
| `Navbar` com popup de sistemas | Exibia grade de sistemas e, no legado, filtrava por role quando havia `auth` | Continua exibindo em `src/components/SystemsPopup/SystemsPopup.tsx` | Possível regressão | No legado havia filtro por `visibleRole`; no código atual da navbar isso não aparece. Isso pode mudar a visibilidade de sistemas para usuários sem permissão. |
| Integração da navbar com `auth` | Bastante acoplada a `react-oidc-context` | Ainda aceita `auth`, mas está menos acoplada | Melhorou | Isso está alinhado com o objetivo da migração. |
| `Footer` | Mesmo papel institucional, com versão grande/pequena e assinatura CInCoders | Continua em `src/lib-components/Footer/Footer.tsx` | Preservado com diferenças | A estrutura funcional foi mantida; ajustes finos de spacing ainda fazem sentido. |
| Assinatura visual do footer | No legado aparecia o ícone de coração | No atual o `img` continua lá, mas o `src` está comentado em `src/lib-components/Footer/Footer.tsx` | Regressão visual pequena | Se essa assinatura for importante, precisa religar o asset ou remover o `img` vazio. |
| `RequireAuth` loading | Mostrava loading por alguns segundos; se demorasse demais, mostrava erro amigável | Continua com a mesma lógica em `src/lib-components/RequireAuth/RequireAuth.tsx` | Preservado | A experiência principal foi mantida. |
| `RequireAuth` autorização | No legado dependia diretamente de OIDC + decode do token | Agora monta uma sessão e delega para `src/auth/hasAccess.ts` | Melhorou | Essa é uma evolução boa e consistente com o contexto do projeto. |
| `RequireAuth` quando autenticado sem permissão | Legado redirecionava para rota `/forbidden` | Atual renderiza `ForbiddenPage` diretamente em `src/lib-components/RequireAuth/RequireAuth.tsx` | Mudança comportamental relevante | Essa diferença pode afetar apps que dependiam da navegação para uma rota específica. Vale decidir se isso foi intencional. |
| `RequireAuth` quando não autenticado | Redirecionava para login via `signinRedirect()` | Continua fazendo isso em `src/lib-components/RequireAuth/RequireAuth.tsx` | Preservado | Comportamento principal mantido. |
| `PageWithAuth` | Composição simples: `RequireAuth` + `Page` | Continua igual em `src/lib-components/PageWithAuth/PageWithAuth.tsx` | Preservado | Boa migração, sem inventar complexidade. |
| Compatibilidade SSR / Next | Legado não estava estruturado para server components | Agora há versões server-safe em `src/entry-server.ts`, `src/lib-components/RequireAuth/RequireAuthServer.tsx` e `src/lib-components/PageWithAuth/PageWithAuthServer.tsx` | Melhorou muito | Essa é provavelmente a maior evolução arquitetural da `v2-auth`. |
| CSS da biblioteca | No legado o consumo era mais embutido no stack visual antigo | Agora o CSS é separado e precisa import explícito | Mudança intencional | Precisa ficar muito bem documentado porque impacta integração real. |

## Leituras principais da comparação

### 1. O comportamento central foi preservado

Os principais blocos conceituais do legado continuam existindo na `v2-auth`:

- `Page`
- `Navbar`
- `Footer`
- `RequireAuth`
- `PageWithAuth`

Isso mostra que a migração não rompeu a ideia original da biblioteca. O que mudou foi principalmente a forma de implementar.

### 2. A auth melhorou arquiteturalmente

No legado, a autorização estava mais diretamente acoplada ao provider e ao token.

Na `v2-auth`, a autorização passou a orbitar em torno de:

- sessão
- roles
- `hasAccess`

Essa mudança é importante porque prepara a biblioteca para múltiplos cenários de consumo, especialmente Next.js.

### 3. Ainda existem diferenças que precisam de decisão explícita

Nem toda mudança entre legado e `v2-auth` é automaticamente um problema. Algumas podem ser evoluções corretas. O ponto importante é que elas sejam conscientes.

As diferenças que merecem validação são:

- renderizar `ForbiddenPage` inline versus redirecionar para `/forbidden`
- perda do filtro por role em `systemsList`
- diferenças na API pública exportada
- diferenças finas na API do `useNavbar`
- pequenos regressos visuais no footer

### 4. A maior evolução da v2 é o suporte estrutural a Next

O legado não foi desenhado para SSR ou Server Components.

A `v2-auth` começou a tratar isso com mais clareza ao separar entradas client e server, o que faz desta migração algo maior que uma simples troca de tecnologia visual.

## Prioridades sugeridas a partir desse resumo

Com base no estado atual da migração, as prioridades mais razoáveis são:

1. Fechar o contrato final de auth.
2. Consolidar o suporte a consumo em projetos Next.
3. Garantir equivalência visual e funcional entre React SPA e Next.
4. Revisar regressões funcionais herdadas da migração.
5. Ajustar inconsistências visuais e documentar o consumo da lib.

## Resumo executivo

A migração do legado para a `v2` está bem avançada e já preserva a maior parte do comportamento central da Cinnamon. A biblioteca evoluiu de uma base fortemente acoplada a MUI, `styled-components` e lógica client-side para uma arquitetura mais moderna, desacoplada e preparada para React SPA e Next.

O principal trabalho restante não é reescrever o legado, e sim consolidar decisões: fechar a camada de auth, garantir suporte real a Next, preservar os comportamentos importantes da versão antiga e corrigir inconsistências que surgiram durante a transição.
