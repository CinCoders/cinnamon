# Cinnamon – Project Context (v2 / v2-auth)

## 📌 Overview

O repositório `cinnamon` contém a evolução de uma biblioteca de componentes utilizada pelo CIn.

A organização é baseada em branches:

- `main` → versão legado (MUI + styled-components)
- `v2` → migração para Tailwind + Shadcn
- `v2-auth` → branch atual, focada em autenticação e na construção de uma Page reutilizável compatível com React e Next

---

## 🎯 Objetivo da migração

Migrar de:

- MUI
- styled-components
- forte acoplamento de UI + lógica

Para:

- TailwindCSS
- Shadcn (Radix)
- Vite (lib mode)
- arquitetura desacoplada
- compatibilidade com:
  - React SPA
  - Next.js (incluindo Server Components)

---

## ⚠️ PROBLEMÁTICA PRINCIPAL

Construir uma biblioteca que funcione tanto em React tradicional quanto em Next (com Server Components).

Isso exige:

- separação entre client/server components
- desacoplamento de auth
- evitar dependência direta de browser APIs
- garantir que componentes possam rodar em ambiente SSR

---

## 🏗️ Arquitetura atual

src/
  auth/
  lib-components/
  index.ts

dist/
  cinnamon.esm.js
  cinnamon.ssr.js
  cinnamon.css

---

## 🔑 Regras importantes

- `src/index.ts` define o contrato público
- Tipos consumidos externamente (`User`, `SideMenuLink`, `System`, etc.) são exportados do pacote para evitar duplicação em apps Next
- Ícones usados pela Navbar/SideMenu/SystemsPopup são resolvidos via registro (`iconId`) para manter consistência entre client e server
- CSS é separado → precisa importar manualmente
- React é peerDependency
- não remover React da lib em dev

---

## 🔐 Auth – evolução

Legado:
- dependente de OIDC
- AuthUtils acoplado

Novo:
- CinnamonSession
- hasAccess(session, roles)
- desacoplado de provider

---

## 🚨 Problemas enfrentados

- exports não encontrados → corrigido via index.ts
- erro react/jsx-runtime → causado por remoção de React na lib
- conflito React 18 vs 19
- CSS não carregado
- Vite não resolvendo symlink corretamente

---

## 🧪 Teste com consumer externo

- validação feita com prorank-front
- revelou problemas reais de integração
- confirmou necessidade de CSS e ajustes no Vite

---

## 🎨 Estado atual

✔️ Lib buildando  
✔️ Lib consumida  
✔️ Auth funcionando  
✔️ CSS aplicado  

🔧 Ajustes:
- Navbar layout
- Footer spacing

---

## 🧠 Lições importantes

- Lib React + Vite + link local é complexo
- Nunca remover React da lib em dev
- CSS separado exige import explícito
- Compatibilidade React + Next é o maior desafio

---

## 📌 Resumo executivo

Cinnamon está migrando de MUI para Tailwind + Shadcn. O maior desafio é garantir compatibilidade entre React SPA e Next (Server Components), exigindo desacoplamento de auth e separação clara entre client/server components. A lib já está funcional em consumer externo, restando ajustes finos e consolidação da arquitetura.
