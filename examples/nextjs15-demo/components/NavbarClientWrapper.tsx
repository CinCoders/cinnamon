"use client";

import React from "react";
import Link from "next/link";
import { Navbar, type CinnamonSession, type LinkComponent } from "@cincoders/cinnamon";
import { useAuth } from "./AuthProvider";
import { toOidcAuthLike } from "../lib/oidc";

interface NavbarClientWrapperProps {
  /** Server-validated session, used only for the debug strip above the Navbar. */
  session: CinnamonSession;
  title?: string;
}

const NextLinkAdapter: LinkComponent = ({ href, children, ...rest }) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);

export function NavbarClientWrapper({
  session,
  title = "Cinnamon v2 — Next 15 Demo",
}: NavbarClientWrapperProps) {
  // Real Keycloak auth object from react-oidc-context — same session the server validated.
  const auth = toOidcAuthLike(useAuth());

  const sideMenuLinks = [
    { id: 1, title: "🏠 Início (Home)", href: "/" },
    { id: 2, title: "📊 Gráficos & Métricas (Apenas Admin)", href: "/graficos" },
    { id: 3, title: "⚡ Componentes Interativos (Client)", href: "/interativo" },
    { id: 4, title: "🔒 Tela de Login / Logout", href: "/login" },
  ];

  const systemsList = [
    { title: "Dashboard Geral", href: "/", description: "Página principal acessível a Admin e User" },
    {
      title: "Métricas & Gráficos",
      href: "/graficos",
      description: "Área restrita exclusiva para Administradores",
      visibleRole: "admin",
    },
    {
      title: "Ferramentas Interativas",
      href: "/interativo",
      description: "Testes com Dialog, Toast, ImageInput e State",
    },
  ];

  return (
    <div
      style={{
        border: "2px solid #3b82f6",
        borderRadius: "8px",
        marginBottom: "1rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#2563eb",
          color: "#ffffff",
          padding: "4px 12px",
          fontSize: "11px",
          fontWeight: 700,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>🔵 CLIENT COMPONENT: Cinnamon Navbar (auth Keycloak real)</span>
        <span>
          Sessão validada no servidor: <strong>{session.user?.name ?? "Visitante"}</strong> (Roles:{" "}
          {session.roles?.join(", ") || "nenhuma"})
        </span>
      </div>
      <Navbar
        title={title}
        auth={auth}
        linkComponent={NextLinkAdapter}
        sideMenuLinks={sideMenuLinks}
        systemsList={systemsList}
        haveSearchBar={true}
        searchFunction={(q) => console.log("[Demo Navbar] Pesquisando:", q)}
      />
    </div>
  );
}
