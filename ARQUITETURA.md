# Arquitetura da Cinnamon

## Objetivo deste documento

Este documento explica a arquitetura atual da `cinnamon` de forma didatica, com foco especial na branch `v2-auth`.

Ele existe para responder perguntas como:

- o que a biblioteca realmente entrega;
- quais camadas existem na arquitetura;
- onde entra auth;
- onde entra compatibilidade com Next;
- como preservar o que funcionava no legado sem impedir a evolucao da `v2`.

## Leitura rapida

Se precisarmos resumir a arquitetura em uma frase:

> A Cinnamon e uma biblioteca de application shell que organiza layout, navegacao e auth de forma reutilizavel, mantendo compatibilidade com apps React client-side e com consumo server-first em Next.

## Contexto historico

### Legado (`main`)

No legado, a biblioteca foi construida com:

- MUI;
- `styled-components`;
- forte acoplamento com auth client-side;
- consumo pensado principalmente para React SPA.

Esse modelo funcionava para o contexto original, mas trazia algumas limitacoes:

- pouca separacao entre client e server;
- dependencia forte do provider de autenticacao;
- dificuldade para consumo em Next com Server Components;
- contratos publicos menos claros para evolucao futura.

### Migracao (`v2` e `v2-auth`)

A migracao iniciou a troca de stack visual para:

- TailwindCSS;
- componentes inspirados em Shadcn/Radix;
- build com Vite;
- CSS compilado e distribuido separadamente.

Dentro dessa transicao, a branch `v2-auth` passou a tratar o problema mais delicado:

- desacoplar auth do provider;
- manter compatibilidade com consumidores legados;
- tornar a biblioteca consumivel em Next, incluindo fluxo server-first.

### Papel da `v2-auth`

A `v2-auth` nao e a etapa final da biblioteca.

Ela funciona como uma branch de consolidacao arquitetural antes do merge em `v2`.

O objetivo dela e fechar especialmente:

- contrato de auth;
- compatibilidade client;
- compatibilidade Next/server;
- paridade visual entre `Page` e `PageServer`;
- clareza do contrato publico.

## O que a Cinnamon entrega

A Cinnamon nao e apenas uma colecao de componentes isolados.

O que ela entrega de verdade e um **application shell reutilizavel**.

Esse shell e formado principalmente por:

- `Page`;
- `PageServer`;
- `PageWithAuth`;
- `PageWithAuthServer`;
- `RequireAuth`;
- `RequireAuthServer`;
- `Navbar`;
- `Footer`;
- tipos compartilhados;
- helpers de auth;
- registro de icones e estruturas de navegacao.

Em outras palavras: a biblioteca organiza a moldura da aplicacao, nao apenas pecas visuais soltas.

## Visao por camadas

Para entender a arquitetura, vale pensar nela em camadas.

## 1. Camada de contrato publico

### O que e

Esta e a camada que o projeto consumidor enxerga quando instala `@cincoders/cinnamon`.

Ela e composta por:

- exports do pacote principal;
- exports da entrada `@cincoders/cinnamon/server`;
- tipos publicos;
- helpers publicos;
- props aceitas pelos componentes.

### Por que ela importa

Uma biblioteca pode ter um codigo interno excelente e ainda assim ser dificil de usar se o contrato publico for confuso.

Na Cinnamon, essa camada e importante porque:

- os consumers precisam importar os mesmos tipos da lib;
- a API precisa ser previsivel em React SPA e em Next;
- a migracao nao pode quebrar usos antigos sem controle.

### Como pensar essa camada na `v2-auth`

Hoje a estrategia mais saudavel e separar mentalmente essa camada em duas partes:

- **camada estavel**: o que queremos sustentar como contrato principal da `v2`;
- **camada de compatibilidade**: o que ainda suportamos porque ja existia em consumers reais.

Exemplos da camada estavel:

- `Page`;
- `PageServer`;
- `PageWithAuth`;
- `PageWithAuthServer`;
- `RequireAuth`;
- `RequireAuthServer`;
- tipos como `User`, `System`, `SideMenuLink`.

Exemplos da camada de compatibilidade:

- namespaces como `AuthUtils`;
- entradas legadas de auth via OIDC;
- comportamentos herdados que ainda precisamos preservar para apps existentes.

## 2. Camada de composicao do shell

### O que e

Esta e a camada que monta a estrutura principal da pagina.

Os componentes mais importantes aqui sao:

- `Page`;
- `PageServer`;
- `Navbar`;
- `Footer`;
- `ToastContainer` da biblioteca;
- contexto opcional da navbar.

### Responsabilidade

Essa camada responde por perguntas como:

- onde a navbar fica;
- onde o footer fica;
- como o `<main>` ocupa a viewport;
- como o toast se posiciona;
- como a pagina centraliza ou distribui seu conteudo.

### Por que ela e o coracao da lib

Muitos componentes de biblioteca sao apenas "blocos visuais".

A Cinnamon vai alem disso: ela organiza a estrutura da pagina inteira.

Por isso, `Page` e `PageServer` sao tao importantes. Eles definem a experiencia global da aplicacao.

## 3. Camada de auth

### Conceito

Aqui e importante separar tres ideias que no dia a dia costumam ser misturadas:

- **autenticacao**: saber quem e o usuario;
- **autorizacao**: saber se ele pode acessar algo;
- **provider**: tecnologia usada para login, token e sessao.

Exemplo:

- Keycloak e um provider;
- OIDC e um protocolo/caminho de integracao;
- `hasAccess` e uma regra de autorizacao;
- `CinnamonSession` e o contrato interno da biblioteca.

### Como era no legado

No legado, a auth ficava mais acoplada ao provider client.

Na pratica, a biblioteca trabalhava muito perto do objeto do `react-oidc-context` e do token bruto.

Isso funcionava em SPA, mas nao era um desenho bom para SSR/Next.

### Como a `v2-auth` reorganiza isso

O centro da auth passa a ser a `CinnamonSession`.

Ela representa o minimo necessario para a biblioteca tomar decisoes:

- `isAuthenticated`;
- `roles`;
- dados essenciais do usuario;
- opcionalmente o bruto recebido do provider.

### Fluxo mental da auth

O jeito certo de pensar a auth da Cinnamon hoje e:

`provider -> adaptador -> CinnamonSession -> hasAccess -> renderizacao`

Esse fluxo importa porque separa responsabilidades:

- o provider autentica;
- o adaptador traduz os dados;
- a Cinnamon decide acesso;
- a UI so reflete o resultado.

### Compatibilidade retroativa

Mesmo com `CinnamonSession` como contrato interno, a API publica ainda precisa suportar casos legados.

Isso e importante porque consumidores como o `prorank-front` ja chamavam algo como:

`AuthUtils.hasAccess(auth, roles)`

Ou seja: o consumidor passava o objeto cru do OIDC.

Na `v2-auth`, a direcao arquitetural correta e:

- internamente a biblioteca trabalha orientada a sessao;
- externamente ela continua aceitando fluxos antigos que ja funcionavam.

Isso evita quebra de compatibilidade enquanto a arquitetura evolui.

## 4. Camada client-side de protecao

### O que e

Esta camada existe para apps React SPA ou para trechos client de apps hibridos.

Os principais componentes aqui sao:

- `RequireAuth`;
- `PageWithAuth`.

### Responsabilidade

Essa camada:

- recebe auth no formato client;
- adapta para sessao;
- aplica autorizacao;
- decide entre renderizar conteudo, tela proibida ou redirecionamento para login.

### Quando usar

Ela e o caminho natural para:

- apps Vite/CRA/React Router;
- cenarios em que toda a auth acontece no client;
- consumidores legados que ja trabalham com OIDC no browser.

### Exemplo mental

No `prorank-front`, esta e a camada mais importante.

Ele serve justamente para validar se a Cinnamon continua funcionando bem no fluxo client com Keycloak/OIDC.

## 5. Camada server-first de protecao

### O que e

Esta camada existe para consumo em Next e outros cenarios orientados a server.

Os principais componentes aqui sao:

- `RequireAuthServer`;
- `PageWithAuthServer`;
- `PageServer`.

### Responsabilidade

Essa camada assume que:

- a sessao ja foi resolvida antes;
- a decisao de acesso deve acontecer no server;
- a biblioteca deve receber apenas dados serializaveis.

### Por que isso importa

Em Next, nao basta um componente "ser React".

Ele precisa respeitar:

- limites de serializacao;
- ausencia de browser APIs no server;
- fronteiras claras entre renderizacao no servidor e interatividade no client.

### Fluxo oficial

O fluxo oficial server-first da Cinnamon e:

1. resolver sessao no server;
2. autorizar no server;
3. renderizar `PageServer` ou `PageWithAuthServer` com props serializaveis;
4. deixar a parte interativa hidratar no client.

Esse fluxo e especialmente importante no `info-cin-front`, que e o principal consumidor para validar o uso Next real.

## 6. Camada de pontes client para o shell server-first

### O problema

Existe um desafio importante aqui:

- `Page` client mede altura real de navbar/footer;
- usa isso para ajustar o `main`;
- posiciona o toast com base na navbar.

Ja o `PageServer`, por ser server component, nao pode depender diretamente desse tipo de logica de browser.

### A solucao adotada

Para resolver isso, a `v2-auth` introduziu pontes client:

- `NavbarClientShell`;
- `FooterClientShell`;
- `ToastClientShell`.

Esses wrappers vivem em `PageClientBridges.tsx`.

### O que essas pontes fazem

Elas:

- hidratam no client;
- medem altura real via `ResizeObserver`;
- atualizam variaveis CSS globais;
- permitem que o shell server-first use essas medidas sem o consumer precisar escrever logica extra.

### Por que essa camada e importante

Ela ajuda a cumprir uma meta central da migracao:

> `PageServer` precisa produzir o mesmo shell visual do `Page`, sem obrigar o consumidor Next a reimplementar comportamentos do client.

Essa camada e uma ponte entre:

- o mundo server-first;
- e a necessidade real de medicao/interatividade no browser.

## 7. Camada de navegacao e dados compartilhados

### O que e

Esta camada define as estruturas que trafegam entre biblioteca e consumidores.

Exemplos:

- `User`;
- `System`;
- `SideMenuLink`;
- `Role`;
- `Position`;
- `iconId`.

### Por que isso importa

Sem tipos compartilhados, cada app reinventa interfaces locais e a integracao fica fragil.

Ao exportar os tipos oficiais, a Cinnamon:

- reduz duplicacao;
- melhora compatibilidade entre consumers;
- facilita serializacao para Next;
- mantem coerencia visual e estrutural.

### Registro de icones

O `iconId` existe para resolver um problema pratico:

- em consumo client e facil passar um componente React;
- em consumo server isso complica, porque o dado precisa ser serializavel.

Com `iconId`, o consumer passa apenas um identificador estavel, e a biblioteca resolve o icone internamente.

Isso ajuda bastante no uso de:

- side menu;
- systems popup;
- navbars compartilhadas;
- consumo em Next.

## 8. Camada de estilos e distribuicao de CSS

### O que e

Na `v2`, o CSS da biblioteca e distribuido separadamente como:

`dist/cinnamon.css`

### Por que isso foi escolhido

Essa abordagem:

- evita runtime de CSS-in-JS;
- funciona bem com SSR;
- facilita consumo em diferentes stacks;
- mantem a biblioteca mais previsivel como pacote externo.

### O custo dessa escolha

O app consumidor precisa importar o CSS explicitamente.

Exemplo:

```ts
import "@cincoders/cinnamon/dist/cinnamon.css";
```

### Onde mora o risco

O maior risco aqui nao e "esquecer o CSS".

O maior risco real e:

- o app importar o CSS corretamente;
- mas algum reset global vir depois e sobrescrever partes importantes do shell.

Foi por isso que a documentacao passou a enfatizar:

- ordem dos imports;
- preflight do Tailwind;
- variaveis CSS globais do shell.

### O que essa camada sustenta

Ela sustenta visualmente:

- alinhamento do shell;
- espacamento padrao;
- compensacao de altura entre navbar/footer/main;
- consistencia entre Storybook e apps consumidores.

## 9. Camada de consumidores

A arquitetura da Cinnamon so faz sentido quando vista junto com os consumers reais.

## `prorank-front`

### Papel arquitetural

O `prorank-front` e o principal validador de:

- consumo client;
- auth com Keycloak/OIDC;
- compatibilidade retroativa com uso legado;
- ausencia de regressao em SPA.

### O que ele nos ensina

Ele mostra se a biblioteca continua funcional para quem ainda esta no fluxo classico:

- `react-oidc-context`;
- auth no client;
- `PageWithAuth`;
- verificacoes de permissao no browser.

## `info-cin-front`

### Papel arquitetural

O `info-cin-front` e o principal validador de:

- consumo Next;
- fluxo server-first;
- shell renderizado no App Router;
- equivalencia entre consumo server e client.

### O que ele nos ensina

Ele mostra se a proposta arquitetural da `v2-auth` realmente funciona fora da biblioteca:

- sessao resolvida no server;
- auth e redirect no server;
- props serializaveis;
- Navbar/Footer/Page renderizados com o mesmo resultado do Storybook/client.

## 10. Como as camadas se conectam

Uma forma simples de visualizar a arquitetura e esta:

1. O consumer escolhe o fluxo:
   - SPA/client;
   - Next/server-first.
2. O consumer importa o contrato publico da Cinnamon.
3. A auth entra:
   - como OIDC legado no client;
   - como `CinnamonSession` no server.
4. A biblioteca monta o shell:
   - `Page` no client;
   - `PageServer` no fluxo server-first.
5. As pontes client hidratam o que precisa de browser.
6. O CSS global da biblioteca garante o resultado visual.

## 11. Estado atual da arquitetura na `v2-auth`

Hoje a arquitetura da `v2-auth` ja tem direcao clara.

Pontos que ja estao razoavelmente consolidados:

- auth orientada a sessao como contrato interno;
- compatibilidade retroativa com fluxos OIDC legados;
- entrada server para Next;
- fluxo server-first documentado;
- paridade visual inicial entre `Page` e `PageServer` via bridges client;
- tipos e icones compartilhados para consumo serializavel.

Pontos que ainda exigem atencao antes de considerar a etapa totalmente concluida:

- validacao do fluxo real no `info-cin-front`;
- validacao de nao regressao no `prorank-front`;
- refinamento do contrato publico final antes do merge em `v2`;
- fechamento de pequenas inconsistencias de API e documentacao.

## 12. Resumo final

Se precisarmos guardar apenas a ideia mais importante deste documento, ela e esta:

> A Cinnamon esta deixando de ser uma biblioteca de componentes fortemente acoplada ao client e ao provider de auth, para se tornar uma biblioteca de application shell com contrato mais claro, auth desacoplada e consumo previsivel tanto em React SPA quanto em Next server-first.

Essa e a razao de existir da `v2-auth`.

Ela nao tenta apenas modernizar implementacao.

Ela tenta estabilizar a arquitetura antes que a evolucao continue em `v2`.
