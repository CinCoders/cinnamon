"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  type CinnamonSession,
  type LinkComponent,
  type SidebarData,
} from "@cincoders/cinnamon";
import { useAuth } from "./AuthProvider";
import { toOidcAuthLike } from "../lib/oidc";

// Ícones vêm da própria cinnamon via `iconId` — o consumidor não precisa
// instalar um pacote de ícones. Os favoritos usam uma bolinha colorida local.
const dot = (color: string) =>
  function Dot() {
    return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
  };

const sidebar: SidebarData = {
  appName: "Cinnamon Demo",
  navMain: [
    { id: "overview", title: "Overview", href: "/", iconId: "layout" },
    { id: "tasks", title: "Tasks", href: "#", iconId: "listChecks" },
    { id: "meetings", title: "Meetings", href: "#", iconId: "calendarClock" },
    { id: "notes", title: "Notes", href: "#", iconId: "notebook" },
    { id: "calendar", title: "Calendar", href: "#", iconId: "calendar" },
    { id: "completed", title: "Completed", href: "#", iconId: "checkCircle" },
    { id: "notifications", title: "Notifications", href: "#", iconId: "bell" },
  ],
  navGroups: [
    {
      id: "favorites",
      label: "Favorites",
      defaultOpen: true,
      items: [
        { id: "design", title: "Design", href: "#", IconComponent: dot("bg-green-400 dark:bg-green-300") },
        { id: "development", title: "Development", href: "#", IconComponent: dot("bg-blue-400 dark:bg-blue-300") },
        { id: "workshop", title: "Workshop", href: "#", IconComponent: dot("bg-orange-400 dark:bg-orange-300") },
        { id: "personal", title: "Personal", href: "#", IconComponent: dot("bg-red-400 dark:bg-red-300") },
      ],
    },
    {
      id: "teams",
      label: "Teams",
      items: [
        { id: "engineering", title: "Engineering", href: "#", iconId: "wrench" },
        { id: "marketing", title: "Marketing", href: "#", iconId: "megaphone" },
      ],
    },
    {
      id: "topics",
      label: "Topics",
      items: [
        { id: "product-updates", title: "Product Updates", href: "#", iconId: "package" },
        { id: "company-news", title: "Company News", href: "#", iconId: "newspaper" },
      ],
    },
  ],
};

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
  title = "Início",
}: NavbarClientWrapperProps) {
  // Real Keycloak auth object from react-oidc-context — same session the server validated.
  const auth = toOidcAuthLike(useAuth());
  const pathname = usePathname();

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
        sidebar={sidebar}
        activeHref={pathname}
        systemsList={systemsList}
      />
    </div>
  );
}
