# Histórico de Edições

## 2026-03-20
- Reaplicado o filtro de `systemsList` no `Navbar` para respeitar `visibleRole`, reconstruindo a sessão a partir do `auth` ou das `positions` do usuário e deixando os itens íntegros quando não há sessão.
- Adicionados exports públicos de tipos (`User`, `SideMenuLink`, `System` etc.) e um registro interno de ícones (`iconId`) para garantir o mesmo conjunto visual entre client e server; `IconRenderer`, `SideMenu` e `SystemsPopup` passaram a aceitar `iconId`, permitindo que consumidores server-side usem apenas dados serializáveis.
