import React from "react";
import Link from "next/link";
import { Footer } from "@cincoders/cinnamon";
import { getServerSession } from "../lib/auth-server";
import { ServerBoundary } from "../components/ServerBoundary";
import { ClientBoundary } from "../components/ClientBoundary";
import { NavbarClientWrapper } from "../components/NavbarClientWrapper";
import { SessionPanel } from "../components/SessionPanel";
import { LoginView } from "../components/LoginView";

export const dynamic = "force-dynamic";

interface MetricsResponse {
  generatedAt: string;
  server: {
    uptimeSeconds: number;
    nodeVersion: string;
    platform: string;
    memoryUsageMB: number;
    environment: string;
  };
  kpi: {
    totalUsers: number;
    activeSessions: number;
    totalRequestsToday: number;
    averageResponseTimeMs: number;
    errorRate: string;
    uptime: string;
  };
}

async function fetchServerMetrics(): Promise<MetricsResponse> {
  try {
    const res = await fetch("http://localhost:3000/api/metrics", {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return {
    generatedAt: new Date().toISOString(),
    server: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      environment: process.env.NODE_ENV ?? "development",
    },
    kpi: {
      totalUsers: 1420,
      activeSessions: 87,
      totalRequestsToday: 38490,
      averageResponseTimeMs: 42,
      errorRate: "0.04%",
      uptime: "99.98%",
    },
  };
}

type TestPage = {
  href: string;
  title: string;
  kind: "Server Component" | "Client Component" | "Server + Client";
  validates: string;
  covers: string[];
  access?: string;
};

const TEST_PAGES: TestPage[] = [
  {
    href: "/client-page",
    title: "PageWithAuth — página privada client",
    kind: "Client Component",
    validates:
      "Guard único de página privada no fluxo client: loading, redirect automático pro Keycloak, ForbiddenPage e render do conteúdo. Tudo importado do pacote publicado.",
    covers: ["PageWithAuth", "Navbar", "Footer", "react-oidc-context"],
    access: "requer role user",
  },
  {
    href: "/graficos",
    title: "PageWithAuthServer — página privada server-first",
    kind: "Server Component",
    validates:
      "getServerSession() valida o JWT contra o JWKS do realm; PageWithAuthServer bloqueia com redirect (não logado) ou ForbiddenPage 403 (sem role).",
    covers: ["PageWithAuthServer", "@cincoders/cinnamon/server"],
    access: "requer role admin",
  },
  {
    href: "/server-entry",
    title: "Entry ./server — PageWithAuthServer isolado",
    kind: "Server Component",
    validates:
      "Importa só do entry @cincoders/cinnamon/server. Dois PageWithAuthServer lado a lado (concedido vs ForbiddenPage) contra a sessão real.",
    covers: ["@cincoders/cinnamon/server", "PageWithAuthServer"],
  },
  {
    href: "/server-import-client",
    title: "RSC boundary — server importa do entry principal",
    kind: "Server Component",
    validates:
      "Um Server Component importa Navbar/Footer do entry principal @cincoders/cinnamon. Se preserveModules/rollup-preserve-directives regredirem, o build quebra aqui.",
    covers: ["preserveModules", "rollup-preserve-directives", "Navbar", "Footer"],
  },
  {
    href: "/interativo",
    title: "Toast + hidratação SSR→client",
    kind: "Server + Client",
    validates:
      "Server Component busca dados iniciais por SSR e entrega como props pro client, que fica interativo (useState, filtros em tempo real, ToastContainer da lib).",
    covers: ["ToastContainer", "toast", "hidratação SSR→client"],
    access: "admin + user",
  },
  {
    href: "/login",
    title: "Tela de login / logout",
    kind: "Server + Client",
    validates:
      "Server Component com botão client que dispara signinRedirect() (Authorization Code + PKCE). Sem redirect automático.",
    covers: ["signinRedirect", "signoutRedirect", "onSigninCallback"],
  },
];

function TestIndex() {
  return (
    <div style={{ marginTop: "1rem", backgroundColor: "#ffffff", padding: "1rem", borderRadius: "8px" }}>
      <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1rem", color: "#334155" }}>
        📋 Índice de testes — uma página por item validado
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
        {TEST_PAGES.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              backgroundColor: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>{page.title}</span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "9999px",
                  whiteSpace: "nowrap",
                  color: page.kind === "Server Component" ? "#991b1b" : page.kind === "Client Component" ? "#1e40af" : "#3730a3",
                  backgroundColor: page.kind === "Server Component" ? "#fee2e2" : page.kind === "Client Component" ? "#dbeafe" : "#e0e7ff",
                }}
              >
                {page.kind}
              </span>
            </div>

            <code style={{ fontSize: "0.75rem", color: "#475569" }}>{page.href}</code>

            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, lineHeight: 1.4 }}>{page.validates}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "auto" }}>
              {page.covers.map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: "0.65rem",
                    fontFamily: "ui-monospace, monospace",
                    color: "#334155",
                    backgroundColor: "#e2e8f0",
                    padding: "1px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>

            {page.access && (
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#b45309" }}>🔒 {page.access}</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const session = await getServerSession();

  // Se o usuário não estiver autenticado, a tela principal é a Tela de Login (Server Component)
  if (!session.isAuthenticated) {
    return <LoginView />;
  }

  const metrics = await fetchServerMetrics();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavbarClientWrapper session={session} title="Início" />

      <main className="demo-container" style={{ flex: 1 }}>
        {/* Painel de Controle de Sessão (Client Component com Borda Azul) */}
        <SessionPanel roles={session.roles ?? []} userName={session.user?.name} />

        {/* Bloco Principal do Servidor (Server Component com Borda Vermelha) */}
        <ServerBoundary
          title="Dashboard Principal (Server Component)"
          description="Página Home acessível por ambas as roles (admin e user). Os dados abaixo foram buscados no servidor diretamente da API interna /api/metrics durante a renderização RSC."
        >
          <div className="demo-grid">
            <div className="demo-card" style={{ borderLeft: "4px solid #ef4444" }}>
              <div className="demo-kpi-label">Usuários Cadastrados</div>
              <div className="demo-kpi-val">{metrics.kpi.totalUsers.toLocaleString()}</div>
              <div style={{ fontSize: "0.75rem", color: "#16a34a" }}>↑ +12% este mês</div>
            </div>

            <div className="demo-card" style={{ borderLeft: "4px solid #3b82f6" }}>
              <div className="demo-kpi-label">Sessões Ativas</div>
              <div className="demo-kpi-val">{metrics.kpi.activeSessions}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Tempo real (OIDC)</div>
            </div>

            <div className="demo-card" style={{ borderLeft: "4px solid #10b981" }}>
              <div className="demo-kpi-label">Requisições Hoje</div>
              <div className="demo-kpi-val">{metrics.kpi.totalRequestsToday.toLocaleString()}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Latência média: {metrics.kpi.averageResponseTimeMs}ms</div>
            </div>

            <div className="demo-card" style={{ borderLeft: "4px solid #f59e0b" }}>
              <div className="demo-kpi-label">Uptime do Servidor</div>
              <div className="demo-kpi-val">{metrics.kpi.uptime}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Node: {metrics.server.nodeVersion}</div>
            </div>
          </div>

          <TestIndex />
        </ServerBoundary>

        {/* Componente Client Embutido na Home */}
        <ClientBoundary
          title="Componente Interativo da Home (Client Component)"
          description="Este componente demonstra a hidratação no browser e comunicação interativa dentro da página Home."
          interactiveProbe={true}
        >
          <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "8px" }}>
            <p style={{ fontSize: "0.875rem", color: "#334155", margin: "0 0 0.5rem 0" }}>
              Verificação visual da composição híbrida: Server Component externo (borda vermelha) contendo e coordenando Client Components (borda azul).
            </p>
          </div>
        </ClientBoundary>
      </main>

      <Footer appVersion="0.1.0" />
    </div>
  );
}
