# CSS Import – Decisões e Debate

## Contexto

- Todos os consumidores do `@cincoders/cinnamon` são portais internos do CIn/UFPE.
- O objetivo explícito é que os portais compartilhem o mesmo shell visual (Navbar/Footer/Page), logo **o CSS da biblioteca deve ser aplicado sempre**.
- Na v2 o CSS é disponibilizado como `dist/cinnamon.css`, exigindo que cada projeto faça `import "@cincoders/cinnamon/dist/cinnamon.css"`. Isso garante previsibilidade, mas implica atualizar todos os apps.

## Situação atual

1. **Import manual obrigatório** – cada app precisa importar o CSS no entry.
2. **Risco com resets** – se Tailwind preflight ou outro reset vier depois do `cinnamon.css`, o layout quebra (footer desalinha, navbar perde `flex`, etc.).
3. **Storybook x produção** – no Storybook o CSS é aplicado por último e tudo funciona; em alguns apps o reset veio depois e causou divergência.

## Motivações para manter o CSS separado

- Permite consumo em qualquer stack (Next, CRA, Vite) sem runtime de CSS-in-JS.
- Mantém os componentes React “puros” e server-friendly.
- Facilita overrides globais (variáveis CSS expostas) e controle explícito da ordem dos resets.

## Possíveis caminhos para eliminar o import manual

| Caminho | Benefícios | Custos/Riscos |
| --- | --- | --- |
| **1. CSS-in-JS (styled-components/emotion)** | Consumidor não importa nada; estilos via JS | Bundle maior (~10–15 KB runtime), hidratação obrigatória, volta para o stack legado |
| **2. Import automático no entry da lib** (`import "./dist/cinnamon.css"` dentro do bundle) | Zero configuração no consumer | O CSS vira side-effect obrigatório, dificulta quem quer controlar ordem/overrides; tree-shaking não remove |
| **3. Injeção dinâmica de `<style>`** | Não precisa importar; funciona mesmo sem bundler | Possível duplicação (cada carga injeta outra tag), comportamento diferente em SSR, mais difícil debugar overrides |
| **4. Entrada auxiliar** (`import "@cincoders/cinnamon/register";`) | Oferece conveniência sem tirar controle de quem prefere o CSS manual | Ainda exige ajuste nos apps, mas reduz o risco de “esquecer” o import |

## Recomendação preliminar

- **Manter o `dist/cinnamon.css` como fonte da verdade** (garante consistência e evita runtime extra).
- **Criar uma entrada auxiliar** no futuro (`@cincoders/cinnamon/register`) que apenas faça `import "./dist/cinnamon.css"` para os apps que não querem lembrar do import.
- **Documentar com destaque** (README e futuros playbooks) que:
  - o CSS deve ser importado sempre;
  - resets do consumidor precisam vir antes do `cinnamon.css` ou ser desativados;
  - o objetivo é que todos os portais compartilhem o mesmo visual.

## Pendências

- Decidir se/como forneceremos a entrada auxiliar “register”.
- Avaliar se algum app realmente precisa controlar a ordem manualmente (caso sim, manteremos o import explícito).
- Após validar internamente, atualizar todos os consumidores (Info CIn, ProRank, etc.) com o padrão acordado.
