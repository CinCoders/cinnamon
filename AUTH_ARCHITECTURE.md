# Auth Architecture

## Conceitos Necessários

Para entender a auth da Cinnamon por completo, é importante separar alguns conceitos que no dia a dia costumam aparecer misturados.

### Autenticação

Autenticação responde à pergunta: "quem é o usuário?".

É o momento em que o sistema reconhece que uma pessoa fez login e passa a saber quem ela é.

### Autorização

Autorização responde à pergunta: "esse usuário pode acessar este recurso?".

Aqui o foco já não é mais identidade, e sim permissão. Um usuário pode estar autenticado e, ainda assim, não ter acesso a determinada página, ação ou sistema.

### Provider de autenticação

O provider é a tecnologia que faz o trabalho concreto de login, logout, renovação de sessão, entrega de token e dados do usuário.

Exemplos:

- Keycloak
- OIDC
- `react-oidc-context`

Esse provider é uma dependência de integração do projeto consumidor, não deveria ser o contrato central da biblioteca.

### Contrato interno da biblioteca

O contrato interno da biblioteca é a forma como a própria Cinnamon representa auth internamente.

Isso é importante porque a biblioteca precisa funcionar de modo consistente mesmo quando o consumer usa stacks diferentes. Se o contrato interno depender diretamente de um provider específico, a lib fica acoplada demais ao ambiente em que nasceu.

Na `v2`, esse contrato deve ser `CinnamonSession`.

### Roles

Roles são permissões de alto nível associadas ao usuário.

Exemplos:

- `admin`
- `coordinator`
- `student`

Na Cinnamon, a autorização gira em torno dessas roles. A biblioteca recebe uma lista de roles permitidas e decide se a sessão atual possui acesso.

### Token / JWT

Em muitos cenários, especialmente com Keycloak, os dados do usuário e suas roles vêm em um token JWT.

Esse token é útil como fonte de dados, mas ele não deveria ser o contrato principal da biblioteca. O papel do token deve ser alimentar uma estrutura mais estável e desacoplada, que é a sessão da Cinnamon.

## Como Funcionava no Legado

No legado, a auth da Cinnamon estava mais acoplada ao provider e ao ambiente client.

Na prática, o fluxo era aproximadamente este:

1. o componente recebia `AuthContextProps` de `react-oidc-context`
2. o token era lido diretamente do provider
3. as roles eram extraídas diretamente do token
4. a regra de autorização era aplicada a partir desse objeto de auth
5. a UI era renderizada ou bloqueada com base nisso

Esse modelo funcionava para o cenário em que a biblioteca foi criada, mas trazia algumas limitações.

### Acoplamento ao `react-oidc-context`

O contrato real da auth no legado ficava muito próximo do provider usado no client.

Em vez de a Cinnamon dizer "eu trabalho com uma sessão", o comportamento efetivo era mais próximo de "eu sei trabalhar com esse objeto específico de auth".

### Extração direta de roles do token

As roles eram extraídas do token no próprio fluxo de autorização.

Isso fazia sentido como implementação, mas deixava a lógica de auth muito dependente do formato do token e do provider utilizado para obtê-lo.

### Dependência do provider como contrato real

No legado, a biblioteca não tinha uma fronteira tão clara entre:

- provider
- token
- regras de autorização
- UI protegida

Isso deixava a auth mais difícil de adaptar, testar e transportar para outros cenários.

### Limitações para SSR e Next

Esse desenho é mais natural em aplicações React SPA, onde quase tudo nasce no client.

Em Next.js, especialmente com Server Components, esse modelo começa a gerar fricção porque:

- o provider client não é o melhor ponto de entrada para toda a auth
- a decisão de acesso muitas vezes deve acontecer no server
- a biblioteca precisa distinguir com clareza o que é integração client e o que é contrato central

Em resumo: no legado, a Cinnamon dependia demais do provider OIDC/Keycloak como base da autorização.

## Como Está na `v2-auth`

A `v2-auth` reorganiza essa arquitetura para que a auth da Cinnamon fique mais estável, previsível e preparada para React SPA e Next.js.

### `CinnamonSession` como contrato oficial

Na `v2`, o centro da auth deve ser `CinnamonSession`.

Essa sessão representa o mínimo necessário para que a biblioteca tome decisões de autorização:

- se o usuário está autenticado
- quais roles ele possui
- quais dados úteis do usuário podem ser usados pela UI

Com isso, a Cinnamon deixa de depender diretamente do provider para entender auth.

### `hasAccess(...)` como regra oficial

A regra de autorização da Cinnamon gira em torno de uma função simples e previsível:

`hasAccess(session, permittedRoles)`

Essa regra responde apenas se a sessão atual pode ou não acessar determinado recurso.

Isso torna a autorização mais portátil e mais fácil de reaproveitar em client e server.

Na implementação atual da `v2-auth`, `hasAccess` aceita:

- `CinnamonSession`
- objeto legado compatível com OIDC
- `null` / `undefined`

Ou seja: internamente a direção continua sendo session-first, mas a API pública ainda preserva compatibilidade com consumers legados como o `prorank-front`.

### Provider client tratado como adaptação

Na `v2-auth`, o provider de autenticação continua podendo existir no fluxo client, especialmente para manter compatibilidade com aplicações React que já usam OIDC.

Mas a ideia correta é:

- o provider autentica
- um adaptador transforma esses dados em `CinnamonSession`
- a Cinnamon trabalha com a sessão

Ou seja, o provider deixa de ser o contrato principal e passa a ser uma camada de integração.

### Server consumindo `session` diretamente

No server, especialmente em Next, o caminho ideal é ainda mais claro:

- obter a sessão no server
- decidir autenticação e autorização no server
- renderizar ou redirecionar a partir desse estado

Nesse cenário, o server não precisa conhecer o provider client. Ele precisa conhecer apenas a sessão da Cinnamon.

### `RequireAuth` como camada client

`RequireAuth` continua sendo importante para cenários React SPA e também para fluxos client em apps híbridos.

Mas conceitualmente ele deve ser entendido como a camada client que recebe um provider compatível, adapta isso para `CinnamonSession` e então usa a regra central da biblioteca.

No estado atual da `v2-auth`, o fluxo de `RequireAuth` é:

1. observar `auth.isLoading`
2. montar `sessionFromOidcAuth(auth)`
3. verificar acesso
4. renderizar `children`, `ForbiddenPage` ou acionar `signinRedirect()`

Isso é importante porque confirma que o caminho client ainda existe e continua sendo uma camada de adaptação, não o contrato central da biblioteca.

### `RequireAuthServer` como caminho natural para Next

`RequireAuthServer` representa melhor a direção arquitetural desejada para Next.js.

Nesse modelo, a Cinnamon recebe uma sessão já resolvida, aplica a regra de autorização e decide:

- renderizar o conteúdo
- renderizar estado proibido
- acionar redirecionamento para não autenticado

Esse fluxo combina melhor com SSR e com a ideia de Server Components.

Na implementação atual, o caminho server trabalha com:

- `session: CinnamonSession | null`
- `permittedRoles`
- `onUnauthenticated`

Ou seja: autenticação ausente no server não dispara integração com provider; ela delega ao consumer a responsabilidade de redirecionar, por exemplo usando `redirect()` no Next.

## Diferença Central Entre Legado e `v2-auth`

No legado, a auth da Cinnamon girava em torno do provider OIDC; na `v2-auth`, a auth da Cinnamon gira em torno de `CinnamonSession`, tratando o provider apenas como integração.

## Fluxo Mental da Auth

Uma forma simples de pensar a auth da `v2` é:

1. o provider autentica e entrega dados brutos
2. um adaptador transforma esses dados em `CinnamonSession`
3. a Cinnamon aplica `hasAccess(session, permittedRoles)`
4. os componentes decidem o que renderizar

Em forma resumida:

`provider -> adapter -> session -> hasAccess -> renderização`

Esse fluxo é importante porque separa responsabilidades de maneira mais saudável:

- o provider cuida de login e sessão externa
- o adaptador traduz isso para o formato da Cinnamon
- a Cinnamon decide acesso
- a UI apenas reflete o resultado

## Compatibilidade Retroativa no Estado Atual

A `v2-auth` não abandonou o legado abruptamente.

Hoje, a compatibilidade retroativa está preservada em pontos importantes:

- `PageWithAuth` e `RequireAuth` continuam aceitando auth compatível com `react-oidc-context`;
- `AuthUtils.hasAccess(auth, roles)` continua funcionando com o objeto cru do provider;
- `OidcAuthLike` aceita `user: null`, refletindo o formato real do `react-oidc-context`;
- `ForbiddenPage` continua aceitando `auth` e `publicURL` como props opcionais de compatibilidade no fluxo client.

Isso permite que a biblioteca evolua internamente para um contrato session-first sem quebrar os consumers antigos imediatamente.

## O Que Ainda Não Está Totalmente Fechado

Embora a arquitetura de auth esteja bem consolidada, alguns pontos continuam claramente posicionados como compatibilidade ou melhoria futura:

- `NavbarProps.auth` ainda está permissivo para aceitar o provider cru;
- o entry `@cincoders/cinnamon/server` ainda exporta só os componentes server-safe, e não um conjunto mais amplo de tipos;
- o typo histórico `setSearchFuncion` continua exposto em `useNavbar()` por compatibilidade.

Esses pontos não mudam a direção da arquitetura, mas ajudam a descrever com honestidade o estado atual da branch.

## Por Que Isso Importa

O principal objetivo da `v2` não é apenas reorganizar código. O objetivo é desacoplar auth do provider e preparar a biblioteca para cenários mais amplos, especialmente:

- React SPA
- SSR
- Next.js com componentes server e client

Quando a auth gira em torno de `CinnamonSession`, a Cinnamon ganha um contrato interno mais estável e previsível. Isso facilita:

- manutenção
- compatibilidade entre ambientes
- reaproveitamento da regra de autorização
- integração com diferentes consumidores

Em outras palavras: a `v2` tenta fazer com que a Cinnamon deixe de depender do ambiente onde nasceu e passe a ter uma arquitetura de auth própria, clara e sustentável.
