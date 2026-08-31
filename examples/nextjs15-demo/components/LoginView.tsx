import React from "react";
import { ServerBoundary } from "./ServerBoundary";
import { LoginButton } from "./LoginButton";

export function LoginView() {
  return (
    <main className="demo-container" style={{ maxWidth: "760px", marginTop: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.5rem 0" }}>
          Cinnamon v2 — Portal de Autenticação
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
          Autenticação OIDC / Keycloak real com Server e Client Components
        </p>
      </div>

      <ServerBoundary
        title="Tela Principal de Login (Server Component)"
        description="Esta tela é renderizada no servidor (RSC). O botão abaixo é um Client Component que dispara o redirecionamento OIDC real para o Keycloak (Authorization Code + PKCE, client público)."
      >
        <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #fecaca" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#991b1b", margin: "0 0 0.75rem 0" }}>
            Login via Keycloak
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#475569", margin: "0 0 1.25rem 0", lineHeight: 1.5 }}>
            Usuários de teste importados de <code>setup/realm.json</code>:
          </p>
          <ul style={{ fontSize: "0.875rem", color: "#334155", margin: "0 0 1.25rem 1.25rem" }}>
            <li><strong>admin / admin</strong> — role <code>admin</code> (acesso a Gráficos)</li>
            <li><strong>user / user</strong> — role <code>user</code> (Gráficos → ForbiddenPage)</li>
          </ul>

          <LoginButton />

          <div
            style={{
              marginTop: "1.5rem",
              background: "#f8fafc",
              padding: "0.85rem",
              borderRadius: "6px",
              fontSize: "0.75rem",
              color: "#64748b",
            }}
          >
            <div><strong>Verificação:</strong></div>
            <ul style={{ margin: "0.25rem 0 0 1.25rem", padding: 0 }}>
              <li>O access token é validado no servidor contra o JWKS do realm (<code>getServerSession</code>).</li>
              <li>Sem redirecionamento automático: a tela aguarda a ação do usuário.</li>
              <li>Borda vermelha = Server Component; o botão (borda implícita) = Client Component.</li>
            </ul>
          </div>
        </div>
      </ServerBoundary>
    </main>
  );
}
