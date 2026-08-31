"use client";

import React from "react";
import { toast, ToastContainer } from "@cincoders/cinnamon";
import { useAuth } from "./AuthProvider";
import { ClientBoundary } from "./ClientBoundary";

interface SessionPanelProps {
  /** Roles from the server-validated session. */
  roles: string[];
  userName?: string;
}

export function SessionPanel({ roles, userName }: SessionPanelProps) {
  const auth = useAuth();
  const isAdmin = roles.includes("admin");

  function handleLogin() {
    toast.info("Redirecionando para o Keycloak...");
    void auth.signinRedirect();
  }

  async function handleLogout() {
    toast.info("Encerrando sessão no Keycloak...");
    await fetch("/api/auth/session", { method: "DELETE" });
    void auth.signoutRedirect();
  }

  function handleTestToast() {
    toast.success("✅ Toast disparado pelo Client Component!");
  }

  return (
    <ClientBoundary
      title="Painel de Sessão Keycloak (Client Component)"
      description="Sessão OIDC real (Authorization Code + PKCE). As roles vêm do access token validado no servidor contra o JWKS do realm. Para testar 'admin' vs 'user', faça login com o usuário correspondente no Keycloak."
      interactiveProbe={true}
    >
      <ToastContainer topInitialPosition={64} toastProps={{ position: "top-right", autoClose: 2500 }} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #bfdbfe",
        }}
      >
        <div>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e3a8a", marginBottom: "0.25rem" }}>
            {auth.isAuthenticated ? (
              <>
                Logado como <strong>{userName ?? auth.user?.profile.preferred_username ?? "?"}</strong>{" "}
                <span
                  style={{
                    backgroundColor: isAdmin ? "#dcfce7" : "#fef3c7",
                    color: isAdmin ? "#166534" : "#92400e",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontWeight: 700,
                  }}
                >
                  {isAdmin ? "ADMIN" : "USER"}
                </span>
              </>
            ) : (
              <span style={{ color: "#b91c1c" }}>Não autenticado</span>
            )}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
            Roles: <code>{roles.join(", ") || "nenhuma"}</code>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {!auth.isAuthenticated ? (
            <button type="button" onClick={handleLogin} style={btn("#22c55e")}>
              Entrar com Keycloak
            </button>
          ) : (
            <button type="button" onClick={handleLogout} style={btn("#ef4444")}>
              Sair (Logout Keycloak)
            </button>
          )}
          <button type="button" onClick={handleTestToast} style={btn("#3b82f6")}>
            Disparar Toast
          </button>
        </div>
      </div>
    </ClientBoundary>
  );
}

function btn(bg: string): React.CSSProperties {
  return {
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    backgroundColor: bg,
    color: "#ffffff",
    border: "none",
  };
}
