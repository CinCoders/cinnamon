# Mini Documento de Decisao - Cinnamon (2026-03-25)

## Contexto

- O legado da Cinnamon esta na branch `main`.
- O trabalho atual esta na branch `v2-auth`.
- O objetivo imediato e finalizar a `v2-auth` para permitir merge em `v2`.
- Depois disso, a continuidade da implementacao deve seguir em `v2`, ja com a camada de auth e compatibilidade Next mais estabilizadas.

## Objetivo desta etapa

Esta etapa nao e mais sobre iniciar a migracao. O foco agora e fechar as decisoes necessarias para que a `v2-auth` possa ser integrada com seguranca na `v2`, preservando:

- compatibilidade com o comportamento importante do legado;
- consumo client em projetos React SPA;
- consumo server-first em projetos Next;
- previsibilidade do contrato publico da biblioteca.

## Decisao 1 - Alinhar `Page` e `PageServer` em resultado visual

### Decisao

`Page` continua sendo a referencia de comportamento visual do shell, e `PageServer` deve convergir para o mesmo resultado final o maximo possivel.

### Motivo

O objetivo da migracao nao e apenas fazer a biblioteca "rodar" em Next. O objetivo e permitir que o shell renderize de forma equivalente em React SPA e em Next, reduzindo divergencias de layout e comportamento entre os consumers.

### Impacto no `cinnamon`

- `PageServer` deve ser tratado como parte do shell oficial, nao como adaptacao secundaria.
- Diferencas inevitaveis entre client e server devem ser minimas e explicitamente documentadas.

### Impacto no `info-cin-front`

- O `info-cin-front` passa a ser o principal campo de validacao do shell server-first.
- O consumo real em Next deve ser comparado com o resultado visual esperado do Storybook/client.

### Impacto no `prorank-front`

- Impacto indireto.
- O `prorank-front` continua relevante para validar se o shell client nao regrediu.

## Decisao 2 - Fechar auth com compatibilidade retroativa

### Decisao

`CinnamonSession` permanece como contrato interno central da auth, mas a API publica deve continuar aceitando o fluxo legado baseado em OIDC quando isso ja era suportado anteriormente.

### Motivo

O desenho interno baseado em sessao e melhor para desacoplamento, SSR e Next. Ainda assim, a migracao nao pode quebrar consumers legados que dependem de chamadas como `AuthUtils.hasAccess(auth, roles)` com o objeto cru do OIDC.

### Diretriz

- Internamente, a Cinnamon deve normalizar auth para `CinnamonSession`.
- Externamente, a biblioteca deve manter compatibilidade com o uso legado que ja funcionava.
- Migracoes futuras podem ser sugeridas no README, mas nao devem ser obrigatorias agora.

### Impacto no `cinnamon`

- Helpers publicos de auth devem suportar compatibilidade de entrada.
- O contrato interno continua organizado em torno de `session -> hasAccess -> renderizacao`.

### Impacto no `info-cin-front`

- O consumo Next pode seguir server-first com sessao resolvida no servidor.
- O app nao precisa herdar acoplamentos antigos de OIDC se nao fizer sentido para o fluxo Next.

### Impacto no `prorank-front`

- O `prorank-front` continua servindo como referencia real de compatibilidade client com Keycloak/OIDC.
- Fluxos legados que hoje funcionam precisam continuar funcionando enquanto a migracao estiver em curso.

## Decisao 3 - Assumir um caminho oficial server-first para Next

### Decisao

Para projetos Next, a Cinnamon deve assumir oficialmente um fluxo server-first:

1. resolver sessao no servidor;
2. autorizar no servidor;
3. renderizar o shell com props serializaveis;
4. hidratar no client apenas o que for interativo.

### Motivo

O valor da `v2-auth` esta justamente em suportar consumo real em Next com melhor separacao entre responsabilidades server/client. Sem isso, a compatibilidade com Next fica tecnica, mas nao arquiteturalmente consolidada.

### Impacto no `cinnamon`

- A fronteira server/client precisa ficar mais previsivel.
- O caminho `@cincoders/cinnamon/server` deve ser tratado como entrada oficial para cenarios Next.

### Impacto no `info-cin-front`

- O `info-cin-front` e o principal projeto para completar e validar esse fluxo.
- O objetivo deve ser sair do mock atual e chegar a um consumo real de shell, auth e layout.

### Impacto no `prorank-front`

- Nenhum impacto estrutural imediato.
- O `prorank-front` continua sendo um consumer SPA/client.

## Decisao 4 - Consolidar o contrato publico em "estavel + compat"

### Decisao

A API publica da Cinnamon deve ser organizada em duas camadas:

- camada estavel: o contrato principal que queremos sustentar na `v2`;
- camada de compatibilidade: pontos legados ainda suportados para evitar quebra de consumers.

### Motivo

A `v2-auth` precisa chegar ao merge em `v2` com uma API mais clara, sem exigir uma limpeza abrupta que quebre integracoes ja existentes.

### Camada estavel

- `Page`
- `PageServer`
- `PageWithAuth`
- `PageWithAuthServer`
- `RequireAuth`
- `RequireAuthServer`
- tipos publicos
- helpers principais de auth

### Camada de compatibilidade

- entradas legadas de auth baseadas em OIDC
- aliases/namespaces como `AuthUtils`
- eventuais props antigas ainda relevantes para consumers reais

### Impacto no `cinnamon`

- Os exports devem refletir melhor essa separacao.
- Inconsistencias pequenas de contrato devem ser revisadas antes do merge em `v2`.
- O objetivo nao e eliminar compatibilidade, e sim torna-la consciente e controlada.

## Leitura final para a branch `v2-auth`

A `v2-auth` deve ser considerada pronta para merge em `v2` quando estiver clara nestes quatro pontos:

1. `PageServer` suficientemente alinhado com `Page` em resultado visual.
2. Auth interna orientada a `CinnamonSession`, sem quebrar uso legado com OIDC.
3. Caminho oficial server-first para Next definido e validado.
4. Contrato publico consolidado com separacao clara entre API estavel e compatibilidade.

## Papel dos consumers nesta fase

### `info-cin-front`

Serve para validar:

- consumo Next;
- fluxo server-first;
- equivalencia visual do shell;
- aplicacao correta do CSS da biblioteca;
- composicao real de `navbar`, `footer`, auth e layout.

### `prorank-front`

Serve para validar:

- compatibilidade client com Keycloak/OIDC;
- preservacao do consumo SPA;
- ausencia de regressao em fluxos legados que ja funcionavam com a Cinnamon.

## Proximo passo recomendado

Usar este documento como base de decisao para:

- fechar os ajustes da `v2-auth`;
- verificar os impactos em `info-cin-front` e `prorank-front`;
- preparar o merge de `v2-auth` em `v2` com o menor numero possivel de ambiguidades arquiteturais.

1. Alinhar Page e PageServer em resultado visual

Problema real
Hoje Page e PageServer não produzem o shell da mesma forma. O Page mede navbar/footer e compensa altura dinâmica; o PageServer não. Isso faz com que o consumo Next possa ficar visualmente diferente do consumo SPA.

Opções

Fazer o PageServer replicar o comportamento visual do Page o máximo possível.
Simplificar o Page para se aproximar do modelo mais estático do PageServer.
Assumir oficialmente que haverá diferença entre SPA e Next.
Trade-offs

Opção 1 preserva melhor a promessa da migração: “renderizar igual”.
Opção 2 pode simplificar a implementação, mas arrisca regredir o client que já funciona bem.
Opção 3 é a mais barata tecnicamente, mas enfraquece bastante a proposta da biblioteca.
Minha recomendação
Seguir com a opção 1. O objetivo da Cinnamon não parece ser apenas “rodar no Next”, e sim entregar o mesmo shell com previsibilidade. Então eu trataria equivalência visual como requisito, não como bônus.

Decisão prática sugerida

Page continua sendo a referência de comportamento visual.
PageServer deve convergir para esse mesmo resultado final, mesmo que internamente use outra estratégia.
Se houver diferença inevitável, ela precisa ser mínima e documentada. 2. Fechar o contrato oficial de auth sem quebrar legado

Problema real
Internamente, CinnamonSession é um contrato melhor. Mas consumers legados como o prorank-front usam AuthUtils.hasAccess(auth, roles) com o objeto cru do OIDC. Se a v2 parar de aceitar isso, quebra consumo existente.

Opções

hasAccess aceitar só CinnamonSession, e criar outro helper para OIDC.
hasAccess aceitar ambos: CinnamonSession e auth cru compatível com OIDC.
Manter dois helpers públicos distintos e empurrar consumidores para migração manual.
Trade-offs

Opção 1 é a mais “limpa”, mas quebra legado.
Opção 2 preserva compatibilidade e permite evolução interna.
Opção 3 também funciona, mas aumenta fricção para quem já usa a API antiga.
Minha recomendação
Seguir com a opção 2. O contrato interno continua sendo CinnamonSession, mas a API pública deve continuar aceitando o fluxo legado. Em outras palavras:

por dentro: provider -> adapter -> session -> hasAccess
por fora: o consumer pode passar sessão ou OIDC, e a lib adapta
Isso respeita exatamente o objetivo que você definiu: o que já funcionava precisa continuar funcionando.

Decisão prática sugerida

hasAccess público deve aceitar:
CinnamonSession
objeto compatível com OIDC legado
a implementação pode normalizar tudo para CinnamonSession internamente
o README pode depois sugerir migração gradual para session-first, mas sem exigir isso agora
Essa mesma lógica vale para outros pontos de compatibilidade pública ligados à auth.

3. Estabilizar a fronteira server/client do shell

Problema real
Hoje existe suporte server, mas a fronteira ainda não está plenamente consolidada. Para o consumer Next, precisa ficar claro o que é seguro/renderizado no server e o que depende de hidratação client.

Opções

Tornar o caminho Next explicitamente server-first, com fronteiras bem definidas.
Manter a abordagem híbrida atual e documentar melhor.
Empurrar mais coisas para client para reduzir complexidade.
Trade-offs

Opção 1 dá mais clareza arquitetural e mais previsibilidade para Next.
Opção 2 é menos trabalho no curto prazo, mas mantém ambiguidade.
Opção 3 simplifica a implementação, mas enfraquece o ganho real de suportar Next.
Minha recomendação
Seguir com a opção 1. O valor da v2 está justamente em suportar Next de forma séria, então a biblioteca precisa assumir um caminho oficial server-first para esse cenário.

Decisão prática sugerida

Next deve ter um fluxo oficial claro:
resolver sessão no server
autorizar no server
renderizar shell com props serializáveis
hidratar apenas o que é interativo
a documentação e os exports devem refletir isso como caminho principal para Next 4. Consolidar o contrato público da biblioteca

Problema real
A arquitetura pode até estar boa, mas se a API pública estiver inconsistente, com gaps de export, typos ou compatibilidades indefinidas, o consumer sente instabilidade.

Opções

Fechar uma API pública “final” já agora.
Continuar ajustando aos poucos, conforme os consumers forem reclamando.
Separar claramente API estável de API transitória/compat.
Trade-offs

Opção 1 dá clareza, mas exige mais decisão agora.
Opção 2 é mais confortável no curto prazo, mas espalha incerteza.
Opção 3 costuma ser o melhor equilíbrio quando há legado em jogo.
Minha recomendação
Seguir com a opção 3. Fechar um núcleo estável, mas assumir explicitamente alguns itens como camada de compatibilidade.

Decisão prática sugerida

API estável:
Page, PageServer
PageWithAuth, PageWithAuthServer
RequireAuth, RequireAuthServer
tipos públicos
helpers de auth compatíveis
camada compat:
entradas legadas de auth/OIDC
aliases/namespaces como AuthUtils
eventuais props antigas ainda suportadas
revisar detalhes como:
export de useNavbar
typo setSearchFuncion
assinatura de ForbiddenPage
comportamento esperado de AuthUtils.hasAccess
Síntese das recomendações
Se eu resumir o debate até aqui, minha posição fica assim:

PageServer deve convergir visualmente com Page.
CinnamonSession deve ser o contrato interno central, mas sem quebrar o uso legado com OIDC.
O caminho oficial para Next deve ser server-first e explicitamente documentado.
A API pública deve ser consolidada em “estável + compat”, em vez de tentar forçar uma limpeza abrupta.
Se quiser, no próximo passo eu posso transformar isso em um mini documento de decisão para o cinnamon, no formato:

decisão
motivo
impacto em info-cin-front
impacto em prorank-front
impacto no README
