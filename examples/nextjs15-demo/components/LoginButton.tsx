"use client";

import React from "react";
import { useAuth } from "./AuthProvider";

export function LoginButton() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <p style={{ color: "#64748b" }}>Carregando sessão…</p>;
  }

  if (auth.isAuthenticated) {
    return (
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: "#166534", fontWeight: 600 }}>
          Já autenticado como {auth.user?.profile.preferred_username}.
        </span>
        <a href="/" className="demo-btn demo-btn-primary">Ir para a Home →</a>
        <button
          type="button"
          onClick={() => {
            void fetch("/api/auth/session", { method: "DELETE" }).then(() => auth.signoutRedirect());
          }}
          className="demo-btn demo-btn-secondary"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => auth.signinRedirect()}
      className="demo-btn demo-btn-primary"
      style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", boxSizing: "border-box" }}
    >
      🔐 Entrar com Keycloak (Authorization Code + PKCE)
    </button>
  );
}
