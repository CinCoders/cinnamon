# PageServer Consumption Notes

## Context

Os prints comparando Storybook vs. consumo em Next mostraram que vários elementos (hambúrguer, avatar, grid de sistemas, footer completo) não aparecem quando os props necessários não são passados. A `PageServer` apenas repassa os mesmos componentes client (`Navbar`, `Footer`, `SideMenu`, `SystemsPopup`). Ela não injeta mocks. Portanto, o consumer Next deve reproduzir exatamente os dados usados na story para obter o mesmo visual.

## Navbar

- `hamburger` e `SideMenu`: só renderizam quando `navbar.sideMenuLinks` é um array não vazio (`Navbar.tsx:96-105`, `Navbar.tsx:210`). Os links precisam seguir a interface `SideMenuLink` (id, title, href, optional children).
- `SystemsPopup`: depende de `navbar.systemsList`. Lista vazia ou com campos incompletos faz o botão não aparecer. Use o formato `{ title, href, iconUrl/IconComponent, description }` igual ao `testSystems` de `src/stories/sampleData/SampleData.tsx`.
- `Avatar/UserPopup`: aparece apenas quando `hiddenUser` é `false` **e** `navbar.user` possui `name/email/username`. Caso contrário, `Navbar` nem renderiza o botão vermelho com inicial (`Navbar.tsx:169-197`).
- Search/input: `haveSearchBar` precisa estar `true` para exibir o campo à direita.
- `IconComponent`/`currentSystemIconUrl`: opcionais; o Storybook injeta um ícone customizado.

## Footer

- Os blocos de título, telefone, e-mail, link e descrição são condicionais. Se qualquer um desses props faltar em `footer`, o respectivo trecho não aparece (`Footer.tsx:49-93`).
- A faixa inferior sempre mostra o copyright, mas `signatureText`, `signatureLink` e `appVersion` também são opcionais.

## Storybook como referência

- `src/stories/Page.stories.tsx` injeta `testUser`, `testLinks` e `testSystems` além dos textos de footer.
- Esses mocks estão definidos em `src/stories/sampleData/SampleData.tsx`. Reutilizá-los como base ajuda a garantir que o consumo em Next replique o layout.

## Consumo em Next

- O snippet atual (`page-info-cin.txt`) usa `<PageWithAuthServer>` sem props de `navbar`/`footer`, então a página resultante mostra apenas o esqueleto.
- Para igualar ao Storybook, passe algo como:

```tsx
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
    telephoneComplement: "Internal number: xxxx / xxxx",
    email: "sample@email.com",
    link: "https://www.google.com",
    textLink: "Site",
    description: "Footer's description with \n line break",
    copyrightText: "CIn UFPE | All rights reserved",
  }}
>
  {children}
</PageWithAuthServer>
```

Adapte os dados reais do Info-CIn, mas a estrutura precisa seguir a interface da lib. Sem esses props, `PageServer` não tem como renderizar a UI completa.
