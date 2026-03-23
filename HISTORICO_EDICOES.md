# Histórico de Edições

## 2026-03-20
- Reaplicado o filtro de `systemsList` no `Navbar` para respeitar `visibleRole`, reconstruindo a sessão a partir do `auth` ou das `positions` do usuário e deixando os itens íntegros quando não há sessão.
- Adicionados exports públicos de tipos (`User`, `SideMenuLink`, `System` etc.) e um registro interno de ícones (`iconId`) para garantir o mesmo conjunto visual entre client e server; `IconRenderer`, `SideMenu` e `SystemsPopup` passaram a aceitar `iconId`, permitindo que consumidores server-side usem apenas dados serializáveis.

## 2026-03-23
- A `.cinnamon-footer-shell` e a `.cinnamon-navbar-shell` passaram a forçar `width: 100%`, `max-width` e `margin-inline: auto`, preservando o alinhamento do shell mesmo quando o consumidor aplica resets globais de `margin`/`padding`.
- O bloco inferior do footer reutiliza a mesma shell, mas com `max-width` liberado, garantindo que a faixa legal continue ocupando toda a largura.
- Foram documentadas as variáveis CSS expostas em `cinnamon.css` para que consumidores possam ajustar `--cinnamon-shell-inline`, `--cinnamon-shell-max-width` e `--cinnamon-main-padding` conforme o contexto visual.
