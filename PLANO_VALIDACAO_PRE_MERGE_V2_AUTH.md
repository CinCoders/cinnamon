# Plano de Validacao Pre-Merge da `v2-auth`

## Objetivo

Este documento organiza as validacoes que precisam acontecer antes do merge da branch `v2-auth` em `v2`.

O foco desta etapa nao e iniciar uma nova rodada de arquitetura, e sim confirmar que o que foi definido na `v2-auth` funciona na pratica, com seguranca suficiente para seguir a implementacao em `v2`.

## Contexto

- O legado da Cinnamon esta na branch `main`.
- A branch atual de consolidacao arquitetural e a `v2-auth`.
- O objetivo imediato e dar merge de `v2-auth` em `v2`.
- Depois disso, a evolucao continua em `v2`.

## Criterios que precisam ser fechados antes do merge

- validar o fluxo real no `info-cin-front`;
- validar ausencia de regressao no `prorank-front`;
- revisar inconsistencias pequenas de API e documentacao;
- fechar a sensacao de "API estavel + camada compat" na pratica, nao so no discurso;
- testar composicao client/server em cenarios relevantes;
- testar auth e rotas de forma definitiva;
- limpar a branch o maximo possivel antes do merge.

## Bloco 1 - Validacao real em consumers

### Objetivo

Provar que a arquitetura da Cinnamon funciona fora da propria biblioteca.

### `info-cin-front`

Este projeto e o principal validador do fluxo Next/server-first.

Precisamos validar:

- consumo real com `PageServer` e `PageWithAuthServer`;
- shell completo com `navbar`, `footer`, `toast`, side menu e systems popup quando aplicavel;
- uso de props serializaveis;
- fluxo de auth resolvido no server;
- redirect de nao autenticado;
- comportamento de autorizado e nao autorizado;
- ordem do CSS e impacto de resets globais;
- equivalencia visual entre consumo Next e comportamento esperado da biblioteca.

### `prorank-front`

Este projeto e o principal validador da compatibilidade client e do fluxo legado com Keycloak/OIDC.

Precisamos validar:

- `PageWithAuth` em SPA;
- `RequireAuth` em SPA;
- `AuthUtils.hasAccess` com auth legado;
- comportamento de login, forbidden e permissao;
- ausencia de regressao na navegacao protegida;
- integracao com o fluxo client ja existente.

### `cinnamon`

A propria biblioteca continua sendo referencia de implementacao e comparacao.

Precisamos validar:

- Storybook como referencia visual;
- exemplos de consumo;
- consistencia entre o comportamento documentado e o comportamento real do codigo.

## Bloco 2 - Validacao de composicao client/server

### Objetivo

Garantir que a arquitetura suporta arvores mistas entre Client Components e Server Components sem depender apenas do caso mais simples.

### Cenários minimos a testar

- server -> client
- client -> server
- client -> server -> client
- server -> client -> server
- `PageServer` com children client interativos
- `PageWithAuthServer` com children client
- `PageWithAuth` com children dependentes de auth client
- shell completo com navbar/footer/toast dentro desses arranjos

### O que observar

- erro de serializacao;
- erro de hidratacao;
- warnings no console;
- quebra de layout;
- quebra de auth;
- comportamento divergente entre SPA e Next.

### Resultado esperado

As composicoes relevantes devem funcionar sem warnings importantes, sem erro de serializacao e sem divergencia visual inesperada.

## Bloco 3 - Validacao definitiva de auth e rotas

### Objetivo

Fechar a camada de auth de forma pratica, cobrindo os principais modelos de obtencao de sessao e os estados reais de acesso.

### Modelos de auth a considerar

- auth client via OIDC/Keycloak;
- sessao resolvida no server;
- auth via cookie;
- fluxo hibrido: sessao por cookie no server + hidratacao client.

### Cenários que precisam ser cobertos

- nao autenticado;
- autenticado sem role;
- autenticado com role valida;
- sessao expirada;
- token ausente;
- cookie ausente;
- token ou cookie malformado;
- redirect para login;
- forbidden;
- acesso direto por URL protegida;
- refresh em rota protegida;
- logout e retorno ao app.

### O que precisa ser verificado

- comportamento final da UI;
- console do navegador;
- logs do servidor, quando houver;
- coerencia entre redirect, forbidden e conteudo autorizado;
- equivalencia entre o contrato documentado e o fluxo real.

### Observacao importante sobre cookie

Auth via cookie merece atencao especial porque reforca o modelo server-first.

Nesse caso, a sessao tende a ser resolvida no servidor antes da renderizacao, o que combina naturalmente com:

- `RequireAuthServer`;
- `PageWithAuthServer`;
- `CinnamonSession` como contrato recebido pela biblioteca.

Isso ajuda a mostrar que a Cinnamon nao depende de um provider client especifico para funcionar.

## Bloco 4 - Consolidacao do contrato publico

### Objetivo

Confirmar na pratica a ideia de que a Cinnamon possui:

- uma camada estavel;
- uma camada de compatibilidade.

### Revisoes necessarias

- exports do pacote principal;
- exports do entry `@cincoders/cinnamon/server`;
- compatibilidade de `AuthUtils.hasAccess`;
- coerencia entre `CinnamonSession` e entradas legadas;
- comportamento e documentacao de `Page`, `PageServer`, `PageWithAuth`, `PageWithAuthServer`;
- consistencia dos exemplos do README;
- pequenas inconsistencias de naming, props e comentarios.

### Resultado esperado

Ao final dessa revisao, a compatibilidade retroativa deve estar comprovada nos consumers, e nao apenas descrita na documentacao.

## Bloco 5 - Limpeza de pre-merge

### Objetivo

Deixar a `v2-auth` limpa o suficiente para entrar em `v2` sem carregar ruido desnecessario.

### O que limpar

- comentarios excessivos;
- arquivos auxiliares e rascunhos;
- codigo comentado antigo;
- documentacao redundante ou desatualizada;
- pontos pequenos de API claramente confusos.

### O que evitar nesta etapa

- refatoracoes grandes sem necessidade;
- reescrita extensa por motivo apenas estetico;
- mudancas conceituais novas perto do merge.

### Principio desta limpeza

Esta e uma limpeza de integracao, nao o refactor final da biblioteca.

O objetivo aqui e reduzir ruido e melhorar a transicao para `v2`.

## Ordem recomendada de execucao

1. Validar consumo real no `info-cin-front`.
2. Validar ausencia de regressao no `prorank-front`.
3. Testar composicoes relevantes client/server.
4. Fechar auth e rotas nos cenarios principais.
5. Revisar contrato publico e documentacao.
6. Fazer limpeza de pre-merge.
7. Preparar merge de `v2-auth` em `v2`.

## Checklist de liberacao para merge

- fluxo real no `info-cin-front` validado;
- ausencia de regressao no `prorank-front`;
- auth funcionando nos cenarios principais, incluindo cookie se adotado;
- composicoes client/server sem quebra relevante;
- contrato publico coerente;
- documentacao alinhada com o comportamento real;
- branch limpa o suficiente para seguir a implementacao em `v2`.

## Leitura final

Se este plano for executado com sucesso, a `v2-auth` deixara de ser apenas uma branch com boa direcao arquitetural e passara a ser uma base confiavel para continuar o trabalho em `v2`.

## Status de execucao atual

### `info-cin-front`

Status atual: **parcialmente validado**

O que ja foi feito:

- criacao de um laboratorio isolado em `src/app/cinnamon-lab`;
- validacao de auth server-first via cookie;
- validacao dos cenarios `admin`, `viewer`, `forbidden` e `nao autenticado`;
- validacao de redirect server-side para login;
- validacao basica de shell completo com `PageWithAuthServer`;
- validacao de composicoes mistas client/server no laboratorio;
- validacao visual do `systemsList` com filtro por role.

Achados dessa rodada:

- o shell server-first esta renderizando e respeitando os cenarios de auth esperados;
- o popup de sistemas respondeu corretamente aos papeis da sessao;
- o componente client interativo dentro do shell hidratou normalmente;
- o componente client envolvendo children renderizados no server tambem funcionou;
- o usuario esperado na navbar nao apareceu, mesmo com `hiddenUser: false` e `user` informado;
- o icone do trecho `Made with [icone] by CInCoders` continua ausente no footer, o que confirma a pendencia ja conhecida da lib.

Pendencias que continuam abertas nesta frente:

- revisar por que o usuario nao aparece na navbar no fluxo server-first;
- decidir se a ordem atual entre `cinnamon.css` e `globals.css` precisa ser ajustada para evitar interferencia de reset;
- avaliar se o `info-cin-front` precisa declarar formalmente `@cincoders/cinnamon` ou se seguira apenas como ambiente de validacao local durante esta fase.

### `prorank-front`

Status atual: **validado no que diz respeito à Cinnamon**

Checkpoint ja confirmado:

- o app esta resolvendo `@cincoders/cinnamon` para o workspace local `../cinnamon`, ou seja, ja funciona como consumidor real da `v2-auth`;
- apesar disso, o `package.json` ainda declara `^1.3.0`, entao o projeto esta em estado de validacao local, nao de dependencia formal consolidada.
- o `build` do app voltou a passar depois de dois ajustes de compatibilidade na lib:
  - `ForbiddenPage` voltou a aceitar `auth` e `publicURL` como props opcionais de compatibilidade;
  - `OidcAuthLike` passou a aceitar `user: null`, refletindo melhor o formato real do `react-oidc-context`.
- a `ForbiddenPage` da `v2-auth` deixou de ser placeholder e agora possui uma versao Tailwind funcional para exercitar o fluxo legado no navegador.
- a validacao no navegador confirmou:
  - login e fluxo client legado funcionando;
  - `PageWithAuth` e `RequireAuth` em uso real;
  - `AuthUtils.hasAccess(auth, roles)` funcionando com OIDC legado;
  - navegacao protegida por role funcionando;
  - `ForbiddenPage` renderizando corretamente no fluxo client;
  - footer da Cinnamon sem o erro do icone quebrado apos o ajuste do asset.

Leitura desta frente:

- os erros de `ERR_CONNECTION_REFUSED`, `AxiosError` e falhas do backend foram tratados como erros do projeto/ambiente, nao da Cinnamon;
- do ponto de vista da biblioteca, a frente do `prorank-front` cumpriu seu papel de validar compatibilidade client com Keycloak/OIDC e ausencia de regressao relevante no shell e no fluxo de auth.
  Isso respeita exatamente o que você pediu: usar o projeto só como validador, mexendo apenas onde isso ajuda a provar o que queremos no cinnamon v2.

Conclusão desta primeira leitura
Se eu resumir em uma frase:
o info-cin-front já mostra que a integração com Next existe, mas ainda não prova o fluxo real que precisamos para liberar a v2-auth.

O próximo passo mais lógico é eu partir para a definição do menor conjunto de mudanças necessárias no info-cin-front para ele virar esse laboratório de validação real, sem contaminar o produto além do necessário.

===========================================
NAO APAGAR ESTE TEXTO, DEIXA QUE EU APAGO DEPOIS

Começando pelo info-cin-front, o diagnóstico atual é bem claro: ele já prova que a Cinnamon pode ser importada e renderizada em Next, mas ainda não valida o cenário real que precisamos antes do merge.

O que o info-cin-front está validando hoje

-O app já importa o CSS da Cinnamon em layout.tsx.
-A home já usa PageWithAuthServer em page.tsx.
-Então ele já cobre, de forma básica:
-import do pacote;
-uso da entrada @cincoders/cinnamon/server;
-renderização server-side do shell.

O que ainda está claramente experimental:

-A sessão em page.tsx é mockada inline.
-O redirect de não autenticado ainda é placeholder.
-O arquivo tem várias tentativas comentadas, o que mostra que ele está funcionando como laboratório, não como fluxo real consolidado.

O shell está incompleto para o que queremos validar:
-não há sideMenuLinks;
-não há systemsList;
-o footer está parcial;
-não há validação real de toast;
-não há auth resolvida via cookie/sessão real do servidor.

Pontos importantes que encontrei:

-O info-cin-front não declara @cincoders/cinnamon no package.json. Então a integração atual depende de link/local state do ambiente, não de uma dependência formal.
-Existe um helper de cookies server-side em utils.ts, o que é um bom sinal: o projeto já tem vocabulário técnico para testar auth resolvida no servidor.
-O middleware.ts atual só injeta x-current-path; ele ainda não participa de auth.
-As rotas reais do app, especialmente em staff, ainda usam o layout próprio do projeto. Ou seja: a Cinnamon ainda não foi exercitada em uma página “de verdade” do produto, só na home/laboratório.
-A ordem dos estilos ainda merece atenção: o cinnamon.css está vindo antes do globals.css, e esse globals.css carrega Tailwind base/reset. Isso pode interferir justamente no tipo de paridade visual que estamos tentando provar.

Minha leitura objetiva:
-Hoje o info-cin-front está num estágio de prova técnica mínima, não de validação real do fluxo Next/server-first.

Para transformar ele num validador útil da v2-auth, eu seguiria pelo caminho mais enxuto possível:

Menor caminho útil para validação:

-Não mexer nas rotas reais de negócio ainda.
-Criar ou consolidar uma rota/laboratório dedicada do próprio info-cin-front para validar a Cinnamon.
-Nessa rota, trocar a sessão mockada por um fluxo de sessão resolvida no server.
Exercitar nela:
autenticado;
não autenticado;
