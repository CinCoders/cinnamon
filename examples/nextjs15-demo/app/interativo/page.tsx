import React from "react";
import { Footer } from "@cincoders/cinnamon";
import { getServerSession } from "../../lib/auth-server";
import { ServerBoundary } from "../../components/ServerBoundary";
import { NavbarClientWrapper } from "../../components/NavbarClientWrapper";
import { SessionPanel } from "../../components/SessionPanel";
import { InteractivePlaygroundClient } from "../../components/InteractivePlaygroundClient";
import { LoginView } from "../../components/LoginView";

export const dynamic = "force-dynamic";

async function fetchInitialUsers() {
  try {
    const res = await fetch("http://localhost:3000/api/interactive-data", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data.items;
    }
  } catch {}

  return [
    {
      id: "1",
      name: "Ada Lovelace",
      email: "ada@cin.ufpe.br",
      role: "admin",
      department: "Engenharia de Software",
      status: "Ativo",
      lastLogin: "Hoje, 14:32",
    },
    {
      id: "2",
      name: "Alan Turing",
      email: "alan@cin.ufpe.br",
      role: "user",
      department: "Ciência da Computação",
      status: "Ativo",
      lastLogin: "Hoje, 11:15",
    },
    {
      id: "3",
      name: "Margaret Hamilton",
      email: "margaret@cin.ufpe.br",
      role: "admin",
      department: "Sistemas Críticos",
      status: "Ativo",
      lastLogin: "Ontem, 18:40",
    },
  ];
}

export default async function InterativoPage() {
  const session = await getServerSession();

  if (!session.isAuthenticated) {
    return <LoginView />;
  }

  const initialUsers = await fetchInitialUsers();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavbarClientWrapper session={session} title="Cinnamon Demo — Componentes Interativos" />

      <main className="demo-container" style={{ flex: 1 }}>
        <SessionPanel roles={session.roles ?? []} userName={session.user?.name} />

        {/* Server Shell (Borda Vermelha) */}
        <ServerBoundary
          title="Shell da Página Interativa (Server Component)"
          description="Página acessível tanto para 'admin' quanto para 'user'. O Server Component busca a carga inicial de dados em /api/interactive-data e a entrega pronta para o Client Component interativo abaixo."
        >
          <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "8px", border: "1px solid #fecaca", marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#7f1d1d" }}>
              <strong>SSR Data Hydration:</strong> {initialUsers.length} registros pré-carregados no servidor e repassados como props para hidratação instantânea.
            </div>
          </div>

          {/* Client Playground (Borda Azul) */}
          <InteractivePlaygroundClient initialUsers={initialUsers} />
        </ServerBoundary>
      </main>

      <div style={{ border: "2px solid #3b82f6", borderRadius: "8px", margin: "1rem" }}>
        <div style={{ background: "#2563eb", color: "#ffffff", padding: "2px 10px", fontSize: "10px", fontWeight: 700 }}>
          🔵 CLIENT COMPONENT: Cinnamon Footer
        </div>
        <Footer variant="cin" appVersion="0.1.0" />
      </div>
    </div>
  );
}
