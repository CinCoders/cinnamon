"use client";

import { PageWithAuth } from "@cincoders/cinnamon";
import { useAuth } from "../../components/AuthProvider";
import { toOidcAuthLike } from "../../lib/oidc";
import { RenderProbe } from "../../components/RenderProbe";

// Full client path: `PageWithAuth` is the single guard for a private page.
// It owns loading state, auto-redirects to Keycloak when unauthenticated, and
// renders ForbiddenPage when the session lacks `permittedRoles` — no manual
// RequireAuth wiring in the consumer.
export default function ClientPage() {
  const auth = toOidcAuthLike(useAuth());

  return (
    <PageWithAuth
      authProps={{
        auth,
        permittedRoles: ["user"], // qualquer usuário do realm tem `user`; troque para ["admin"] para ver ForbiddenPage
      }}
      navbar={{
        title: "Página privada (PageWithAuth + Keycloak real)",
        auth,
        systemsList: [
          {
            title: "Área Admin",
            href: "http://localhost:3001",
            description: "Visível apenas para role admin",
            visibleRole: "admin",
          },
          {
            title: "Área Comum",
            href: "http://localhost:3002",
            description: "Visível para qualquer usuário autenticado",
            visibleRole: "user",
          },
        ],
      }}
      footer={{}}
    >
      <div style={{ padding: "1rem 2rem", background: "#eff6ff", borderBottom: "1px solid #bfdbfe" }}>
        <h1 style={{ fontFamily: "system-ui, sans-serif" }}>
          Conteúdo protegido por <code>PageWithAuth</code>
          <RenderProbe label="esta página" />
        </h1>
        <p style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
          Se você chegou aqui, o <code>PageWithAuth</code> já: (1) aguardou o carregamento da sessão,
          (2) confirmou autenticação no Keycloak, (3) validou a role <code>user</code>.
        </p>
      </div>

      <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h2>O que este teste cobre</h2>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ background: "#e5e7eb" }}>
              <th style={{ padding: "6px 12px", border: "1px solid #ccc", textAlign: "left" }}>Cenário</th>
              <th style={{ padding: "6px 12px", border: "1px solid #ccc", textAlign: "left" }}>Comportamento do PageWithAuth</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "6px 12px", border: "1px solid #ccc" }}>Sessão carregando</td>
              <td style={{ padding: "6px 12px", border: "1px solid #ccc" }}>Tela &quot;Carregando...&quot; (timeout de 6s → mensagem de falha)</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 12px", border: "1px solid #ccc" }}>Não autenticado</td>
              <td style={{ padding: "6px 12px", border: "1px solid #ccc" }}>Chama <code>signinRedirect()</code> → login do Keycloak</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 12px", border: "1px solid #ccc" }}>Autenticado sem a role</td>
              <td style={{ padding: "6px 12px", border: "1px solid #ccc" }}><code>ForbiddenPage</code> (troque <code>permittedRoles</code> para <code>[&quot;admin&quot;]</code> e logue como <code>user</code>)</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 12px", border: "1px solid #ccc" }}>Autenticado com a role</td>
              <td style={{ padding: "6px 12px", border: "1px solid #ccc" }}>Renderiza <code>Page</code> + este conteúdo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageWithAuth>
  );
}
