import React from "react";
import { redirect } from "next/navigation";
import { PageWithAuthServer } from "@cincoders/cinnamon/server";
import { getServerSession } from "../../lib/auth-server";
import { ServerBoundary } from "../../components/ServerBoundary";
import { NavbarClientWrapper } from "../../components/NavbarClientWrapper";
import { SessionPanel } from "../../components/SessionPanel";
import { InteractiveChartClient } from "../../components/InteractiveChartClient";

export const dynamic = "force-dynamic";

async function fetchMetricsData() {
  try {
    const res = await fetch("http://localhost:3000/api/metrics?delay=50", { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {}

  return {
    weeklyRequests: [
      { day: "Seg", requests: 4200, users: 510, avgLatencyMs: 38 },
      { day: "Ter", requests: 5800, users: 620, avgLatencyMs: 41 },
      { day: "Qua", requests: 6400, users: 710, avgLatencyMs: 45 },
      { day: "Qui", requests: 7100, users: 780, avgLatencyMs: 39 },
      { day: "Sex", requests: 6900, users: 750, avgLatencyMs: 44 },
      { day: "Sáb", requests: 2800, users: 310, avgLatencyMs: 32 },
      { day: "Dom", requests: 1900, users: 240, avgLatencyMs: 30 },
    ],
    roleDistribution: [
      { role: "admin", count: 18, percentage: 12, label: "Administradores" },
      { role: "user", count: 112, percentage: 76, label: "Usuários Padrão" },
      { role: "sys_hr-employee", count: 18, percentage: 12, label: "RH Especialistas" },
    ],
    responseTimesByHour: [
      { hour: "08h", latency: 28 },
      { hour: "10h", latency: 54 },
      { hour: "12h", latency: 68 },
      { hour: "14h", latency: 62 },
      { hour: "16h", latency: 49 },
      { hour: "18h", latency: 36 },
      { hour: "20h", latency: 24 },
    ],
  };
}

// Página privada server-first: `PageWithAuthServer` é o único guard.
// - não autenticado  → onUnauthenticated() → redirect("/login")
// - autenticado sem a role `admin` → ForbiddenPageServer (403), renderizado no servidor
// - autenticado com `admin` → renderiza PageServer + o conteúdo
export default async function GraficosPage() {
  const session = await getServerSession();

  return (
    <PageWithAuthServer
      authProps={{
        session,
        permittedRoles: ["admin"],
        onUnauthenticated: () => redirect("/login"),
      }}
      footer={{}}
      // Navbar client com o auth real do Keycloak (o PageServer padrão não tem OidcAuthLike no server).
      components={{ navbar: <NavbarClientWrapper session={session} title="Cinnamon Demo — Gráficos & Métricas" /> }}
    >
      <SessionPanel roles={session.roles ?? []} userName={session.user?.name} />

      <ServerBoundary
        title="Métricas do Servidor & Análise de Tráfego (Server Component)"
        description="Acesso concedido pela role 'admin' via PageWithAuthServer. Dados obtidos por SSR em /api/metrics."
      >
        <AsyncServerCharts />
      </ServerBoundary>
    </PageWithAuthServer>
  );
}

async function AsyncServerCharts() {
  const metrics = await fetchMetricsData();

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", color: "#1e293b" }}>
            👥 Distribuição de Usuários por Role
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {metrics.roleDistribution.map((item: { role: string; label: string; count: number; percentage: number }) => (
              <div key={item.role}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  <span>{item.label} (<code>{item.role}</code>)</span>
                  <strong>{item.count} ({item.percentage}%)</strong>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${item.percentage}%`, height: "100%", backgroundColor: item.role === "admin" ? "#ef4444" : "#3b82f6" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", color: "#1e293b" }}>
            ⏱️ Latência Média por Horário (Server-Computed)
          </h4>
          <div style={{ display: "flex", alignItems: "flex-end", height: "110px", gap: "0.5rem", padding: "0.5rem 0" }}>
            {metrics.responseTimesByHour.map((item: { hour: string; latency: number }) => (
              <div key={item.hour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                <div style={{ width: "100%", height: `${(item.latency / 80) * 100}%`, backgroundColor: "#f59e0b", borderRadius: "3px 3px 0 0" }} />
                <span style={{ fontSize: "0.65rem", color: "#64748b", marginTop: "4px" }}>{item.hour}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InteractiveChartClient initialData={metrics.weeklyRequests} />
    </div>
  );
}
