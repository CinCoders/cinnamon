# Histórico de Edições

## 2026-03-20
- Reaplicado o filtro de `systemsList` no `Navbar` para respeitar `visibleRole`, reconstruindo a sessão a partir do `auth` ou das `positions` do usuário e deixando os itens íntegros quando não há sessão.
- Adicionados exports públicos de tipos (`User`, `SideMenuLink`, `System` etc.) e um registro interno de ícones (`iconId`) para garantir o mesmo conjunto visual entre client e server; `IconRenderer`, `SideMenu` e `SystemsPopup` passaram a aceitar `iconId`, permitindo que consumidores server-side usem apenas dados serializáveis.

## 2026-03-23
- A `.cinnamon-footer-shell` e a `.cinnamon-navbar-shell` passaram a forçar `width: 100%`, `max-width` e `margin-inline: auto`, preservando o alinhamento do shell mesmo quando o consumidor aplica resets globais de `margin`/`padding`.
- O bloco inferior do footer reutiliza a mesma shell, mas com `max-width` liberado, garantindo que a faixa legal continue ocupando toda a largura.
- Foram documentadas as variáveis CSS expostas em `cinnamon.css` para que consumidores possam ajustar `--cinnamon-shell-inline`, `--cinnamon-shell-max-width` e `--cinnamon-main-padding` conforme o contexto visual.

## 2026-03-24 (experimentos revertidos)
- Testamos migrar o footer para CSS totalmente próprio (fora de Tailwind) e ajustar `AuthUtils.hasAccess`/`Navbar` para suportar botões condicionais e logotipo à esquerda sem exigir adaptações dos consumidores, mas a mudança foi revertida para reavaliar o impacto em todos os projetos.
- Os pontos seguem registrados aqui como pendências a estudar: garantir alinhamento do footer mesmo diante de resets extremos, expor uma prop consistente para posicionar o logo na Navbar e assegurar que `hasAccess` aceite tanto `CinnamonSession` quanto o objeto cru do `react-oidc-context`.

## 2026-03-26
- Atualizado `hasAccess` para aceitar tanto `CinnamonSession` quanto o objeto OIDC legado (via normalização interna com `sessionFromOidcAuth`), preservando compatibilidade com consumidores como o `prorank-front` enquanto mantemos o contrato interno orientado a sessão.
- `PageServer` passou a usar wrappers client (`NavbarClientShell`, `FooterClientShell`, `ToastClientShell`) que medem as alturas reais e atualizam variáveis CSS (`--cinnamon-shell-offset`). Com isso o shell server-first replica o layout do `Page` e mantém o fluxo oficial server-first para Next.

## 2026-03-29
- Criado um laboratório isolado no `info-cin-front` (`src/app/cinnamon-lab`) para validar a Cinnamon em Next sem interferir nas rotas reais do produto. O laboratório cobre sessão via cookie, redirect server-side, cenários `admin` / `viewer` / `forbidden` / `guest`, shell com `PageWithAuthServer` e composições mistas client/server.
- A rodada inicial de validação no navegador confirmou o fluxo server-first e o filtro de `systemsList` por role. Como achados, o avatar/usuário da navbar não apareceu mesmo com `hiddenUser: false`, e o ícone do trecho `Made with [icone] by CInCoders` continua ausente no footer.

## 2026-03-30
- O `prorank-front` foi confirmado como consumidor real da Cinnamon local (`../cinnamon`), mesmo ainda declarando `^1.3.0` no `package.json`.
- Para preservar compatibilidade com o fluxo client legado, a `ForbiddenPage` voltou a aceitar `auth` e `publicURL` como props opcionais, e o tipo `OidcAuthLike` passou a aceitar `user: null`, refletindo o formato real do `react-oidc-context`.
- Após regenerar os artefatos da biblioteca, o `build` do `prorank-front` voltou a passar contra a `v2-auth`, deixando a validação em navegador como próxima etapa desta frente.
- A `ForbiddenPage` da `v2-auth` deixou de ser apenas um placeholder e ganhou uma versão Tailwind compatível com o legado: ilustração 403, e-mail do usuário e botão de logout quando `auth` estiver disponível. A implementação evita dependência interna de `react-router-dom`, permitindo uso tanto no fluxo SPA quanto nos cenários server-first em que só queremos renderizar o estado proibido.
- A rodada de validação em navegador no `prorank-front` confirmou login, permissões por role, `PageWithAuth`, `RequireAuth`, `AuthUtils.hasAccess(auth, roles)`, `ForbiddenPage` e footer funcionando do ponto de vista da Cinnamon. Os erros restantes observados estavam ligados ao backend/API do próprio projeto e não foram tratados como regressão da lib.

## 2026-03-31
- O `PLANO_VALIDACAO_PRE_MERGE_V2_AUTH.md` foi alinhado com o estado real da branch: `prorank-front` passou a aparecer como validado do ponto de vista da Cinnamon, enquanto o `info-cin-front` permaneceu como parcialmente validado.
- O plano tambem passou a registrar explicitamente duas decisoes desta fase: nao bloquear o merge da `v2-auth` pelas exports legadas ausentes (`ImageInput`, `Dialog`, `ErrorScreen`, `httpErrors`) e manter o typo historico `setSearchFuncion` em `useNavbar()` como compatibilidade documentada, deixando um alias corrigido como melhoria futura.
- O `README.md` foi ajustado para refletir a API publica real da branch, removendo a promessa de helpers de icones nao reexportados no entry principal e deixando mais clara a fronteira entre camada estavel e camada de compatibilidade.
- A limpeza pre-merge foi iniciada com remocao de ruido claro no codigo: o bloco inteiro de implementacao antiga comentada em `Page.tsx` foi removido, assim como comentarios de caminho/contexto e restos comentados em `Navbar`, `useNavbar`, `UserPopup` e `entry-server`. Nao houve mudanca funcional nessa rodada.
