# Next Compatibility Considerations

## Problema

A branch `v2-auth` da Cinnamon não está mais tentando apenas modernizar o legado; ela também precisa garantir consumo real em projetos Next.js, mantendo comportamento e aparência equivalentes ao uso em projetos React SPA.

Esse objetivo traz uma exigência nova para a biblioteca: além de funcionar no browser, ela precisa respeitar corretamente a separação entre código seguro para server e código que depende de ambiente client. No legado, essa distinção praticamente não existia, porque a biblioteca foi pensada para aplicações React tradicionais, com renderização concentrada no client.

Na `v2-auth`, essa separação começou a ser construída, principalmente com pares como `Page` / `PageServer`, `RequireAuth` / `RequireAuthServer` e `PageWithAuth` / `PageWithAuthServer`. Mesmo assim, a compatibilidade com Next ainda precisa ser consolidada para que o consumo da lib em um projeto Next produza a mesma interface e a mesma experiência que em um projeto React.

## Considerações

### 1. A arquitetura atual está no caminho certo

A Cinnamon já demonstra intenção clara de suportar cenários híbridos client/server.

Isso aparece em:

- `src/lib-components/RequireAuth/RequireAuth.tsx`
- `src/lib-components/RequireAuth/RequireAuthServer.tsx`
- `src/lib-components/Page/Page.tsx`
- `src/lib-components/Page/PageServer.tsx`
- `src/lib-components/PageWithAuth/PageWithAuth.tsx`
- `src/lib-components/PageWithAuth/PageWithAuthServer.tsx`
- `src/entry-server.ts`

Essa separação é importante porque o Next moderno não trata tudo como componente client. Parte da árvore pode e deve ser resolvida no servidor, especialmente quando envolve sessão, autorização e redirecionamento.

### 2. O maior problema do legado era o acoplamento ao client

O Cinnamon legado foi construído para React tradicional e, por isso, assumia implicitamente:

- ambiente de navegador
- fluxo centrado em hooks e estado client-side
- dependência direta de provider de autenticação
- uso acoplado de roteamento client
- pouca distinção entre UI, autenticação e lógica de navegação

Esse modelo não se encaixa bem em Next com Server Components, porque nesse ambiente não basta que o componente “seja React”; ele também precisa ser seguro para renderização no servidor.

### 3. Server Components exigem atenção diferente

Em Next, componentes server e client têm responsabilidades distintas.

Os server components:

- não devem depender de browser APIs
- não devem carregar lógica client-only sem fronteira explícita
- são bons lugares para leitura de sessão, autorização inicial e redirecionamento

Os client components:

- podem usar hooks e estado
- podem depender de interatividade
- podem lidar com menus, popups, efeitos e provider client-side

Por isso, a Cinnamon não pode apenas “funcionar no React”. Ela precisa definir claramente quais componentes são client, quais são server-safe e como o consumer deve combiná-los.

### 4. A auth evoluiu bem, mas ainda precisa ser consolidada como contrato

A `v2-auth` já melhorou bastante em relação ao legado ao introduzir um modelo mais desacoplado, baseado em sessão e checagem de permissões.

Pontos positivos:

- `src/auth/hasAccess.ts` centraliza a regra de autorização
- `src/auth/keycloak.ts` mantém helpers úteis sem obrigar a lib inteira a depender do provider
- `RequireAuthServer` já recebe `session`, `permittedRoles` e `onUnauthenticated`, o que é um contrato mais limpo para Next

Mesmo assim, ainda existe uma duplicidade de abordagem:

- no client, `RequireAuth` continua fortemente orientado a `react-oidc-context`
- no server, o fluxo já é mais agnóstico e orientado a sessão

Isso indica que a auth está bem encaminhada, mas ainda precisa de uma definição final sobre qual é o contrato oficial da biblioteca e qual parte é apenas adaptação de compatibilidade.

### 5. O cenário Next depende de um caminho oficial server-first

Para projetos Next, o caminho mais robusto tende a ser:

- obter sessão no server
- validar autenticação e permissão no server
- só enviar para o client o que realmente precisa de interatividade

A Cinnamon já aponta nessa direção com `RequireAuthServer` e `PageWithAuthServer`, mas esse fluxo ainda precisa ser tratado como o caminho oficial de uso no Next, e não apenas como uma alternativa técnica.

### 6. O layout ainda pode divergir entre React SPA e Next

Hoje existe uma diferença importante entre `Page` e `PageServer`.

Em `src/lib-components/Page/Page.tsx`:

- a altura da navbar e do footer é medida no client
- o `main` ajusta o `minHeight` com base nessas medidas
- o toast considera deslocamento vertical a partir da navbar

Em `src/lib-components/Page/PageServer.tsx`:

- o layout usa um `minHeight: 100vh`
- não reproduz a mesma lógica dinâmica de compensação visual
- o toast não recebe o mesmo tratamento

Isso significa que o shell visual no Next pode não ficar exatamente igual ao shell visual no React SPA, mesmo quando ambos usam os mesmos componentes.

### 7. `PageServer` ainda tem uma fronteira híbrida que merece atenção

Embora `PageServer` exista como entrada server-safe, ele ainda renderiza `Navbar` e `Footer`, que são componentes client.

Isso não torna a abordagem inválida, mas mostra que a fronteira entre server e client ainda está em consolidação. O próprio código já sugere essa preocupação com um comentário de evolução futura.

O risco aqui não é só técnico; é também de previsibilidade. Para o consumer Next, precisa ficar muito claro:

- o que ele pode renderizar no server com segurança
- o que será hidratado no client
- quais diferenças visuais ou comportamentais são esperadas

### 8. O CSS da lib é um ponto crítico para equivalência visual

A Cinnamon já separa o CSS da biblioteca e o publica como artefato próprio, o que é bom para distribuição.

Isso aparece em:

- `src/styles/cinnamon.css`
- `src/styles/globals.css`
- `scripts/build-standalone-css.mjs`
- export do pacote para `./dist/cinnamon.css`

O problema é que essa estratégia depende de import explícito no projeto consumidor.

Em projetos Next, isso precisa ser feito no lugar correto, normalmente no layout global da aplicação. Se esse passo não for seguido exatamente como esperado, a biblioteca pode até renderizar corretamente em termos de estrutura, mas a interface visual não vai refletir o design esperado.

Portanto, “compatibilidade com Next” não depende apenas de componentes server-safe. Também depende de uma estratégia clara e documentada de carregamento de CSS.

### 9. O objetivo real não é apenas renderizar, e sim renderizar igual

Para esta migração, não basta dizer que a Cinnamon “funciona no Next”.

O objetivo real é:

- funcionar em React SPA
- funcionar em Next
- manter auth coerente nos dois cenários
- preservar a interface visual no Next como se o consumer fosse um projeto React tradicional

Isso exige validar:

- navbar
- footer
- side menu
- popups
- toast
- estilos globais
- boundaries client/server

Se qualquer um desses pontos depender implicitamente do ambiente SPA, a experiência em Next tende a divergir.

### 10. Critério de conclusão

A compatibilidade com Next deve ser considerada concluída apenas quando:

- o fluxo de auth estiver estabilizado para client e server
- os exports da lib estiverem claros para consumo em Next
- o CSS da Cinnamon estiver sendo aplicado corretamente no consumer Next
- o shell visual renderizado em Next estiver equivalente ao shell visual em React
- não houver diferenças inesperadas de comportamento decorrentes da separação entre server e client

## Resumo

A `v2-auth` já construiu a base necessária para suportar Next.js, principalmente ao separar componentes client e server e ao reduzir o acoplamento da auth ao provider. O principal desafio agora não é mais iniciar essa compatibilidade, e sim fechá-la com consistência.

Em outras palavras: a arquitetura já aponta para a direção correta, mas ainda é necessário consolidar o contrato de auth, estabilizar o caminho server-first para Next, alinhar `Page` e `PageServer` em termos de resultado visual e garantir que o CSS da biblioteca seja consumido corretamente para que a interface no Next apareça da mesma forma que em um projeto React.
