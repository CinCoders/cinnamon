"use client";

import React, { useState } from "react";
import { ClientBoundary } from "./ClientBoundary";

interface ChartPoint {
  day: string;
  requests: number;
  users: number;
  avgLatencyMs: number;
}

interface InteractiveChartClientProps {
  initialData: ChartPoint[];
}

export function InteractiveChartClient({ initialData }: InteractiveChartClientProps) {
  const [metric, setMetric] = useState<"requests" | "users" | "avgLatencyMs">("requests");
  const [data, setData] = useState<ChartPoint[]>(initialData);
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [filterRange, setFilterRange] = useState<"all" | "workdays" | "weekend">("all");

  const filteredData = data.filter((d) => {
    if (filterRange === "workdays") return ["Seg", "Ter", "Qua", "Qui", "Sex"].includes(d.day);
    if (filterRange === "weekend") return ["Sáb", "Dom"].includes(d.day);
    return true;
  });

  const maxValue = Math.max(...filteredData.map((d) => d[metric]), 1);

  function getMetricLabel(key: typeof metric) {
    if (key === "requests") return "Requisições";
    if (key === "users") return "Usuários Ativos";
    return "Latência Média (ms)";
  }

  function getBarColor(key: typeof metric) {
    if (key === "requests") return "#3b82f6";
    if (key === "users") return "#10b981";
    return "#f59e0b";
  }

  function handleRandomize() {
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        requests: Math.round(item.requests * (0.8 + Math.random() * 0.4)),
        users: Math.round(item.users * (0.8 + Math.random() * 0.4)),
        avgLatencyMs: Math.round(item.avgLatencyMs * (0.8 + Math.random() * 0.4)),
      }))
    );
  }

  return (
    <ClientBoundary
      title="Gráfico Interativo de Performance (Client Component)"
      description="Este componente gerencia estado dinâmico (useState), filtros reativos e manipulação de eventos do mouse no cliente para alternar métricas em tempo real."
      interactiveProbe={true}
    >
      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", alignSelf: "center" }}>Métrica:</span>
            <button
              type="button"
              onClick={() => setMetric("requests")}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: metric === "requests" ? "#3b82f6" : "#f1f5f9",
                color: metric === "requests" ? "#ffffff" : "#334155",
                border: "1px solid #cbd5e1",
              }}
            >
              Requisições
            </button>
            <button
              type="button"
              onClick={() => setMetric("users")}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: metric === "users" ? "#10b981" : "#f1f5f9",
                color: metric === "users" ? "#ffffff" : "#334155",
                border: "1px solid #cbd5e1",
              }}
            >
              Usuários
            </button>
            <button
              type="button"
              onClick={() => setMetric("avgLatencyMs")}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: metric === "avgLatencyMs" ? "#f59e0b" : "#f1f5f9",
                color: metric === "avgLatencyMs" ? "#ffffff" : "#334155",
                border: "1px solid #cbd5e1",
              }}
            >
              Latência (ms)
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <select
              value={filterRange}
              onChange={(e) => setFilterRange(e.target.value as any)}
              style={{
                padding: "4px 8px",
                fontSize: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
              }}
            >
              <option value="all">Semana Completa</option>
              <option value="workdays">Dias Úteis (Seg-Sex)</option>
              <option value="weekend">Final de Semana (Sáb-Dom)</option>
            </select>

            <button
              type="button"
              onClick={handleRandomize}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: "#64748b",
                color: "#ffffff",
                border: "none",
              }}
            >
              🔄 Simular Tráfego
            </button>
          </div>
        </div>

        {/* Gráfico de Barras SVG Interativo */}
        <div style={{ height: "200px", display: "flex", alignItems: "flex-end", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid #e2e8f0" }}>
          {filteredData.map((item, index) => {
            const heightPercent = Math.round((item[metric] / maxValue) * 100);
            const isHovered = activeBar === index;
            return (
              <div
                key={item.day}
                onMouseEnter={() => setActiveBar(index)}
                onMouseLeave={() => setActiveBar(null)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                {isHovered && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: `${heightPercent + 8}%`,
                      backgroundColor: "#1e293b",
                      color: "#ffffff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      whiteSpace: "nowrap",
                      zIndex: 10,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <strong>{item.day}:</strong> {item[metric].toLocaleString()} {metric === "avgLatencyMs" ? "ms" : ""}
                  </div>
                )}

                <div
                  style={{
                    width: "100%",
                    maxWidth: "48px",
                    height: `${Math.max(heightPercent, 4)}%`,
                    backgroundColor: getBarColor(metric),
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.3s ease, opacity 0.2s ease",
                    opacity: isHovered ? 1 : 0.85,
                  }}
                />
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", marginTop: "0.5rem" }}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}>
          <span>Exibindo: <strong>{getMetricLabel(metric)}</strong></span>
          <span>Passe o mouse sobre as barras para ver valores pontuais</span>
        </div>
      </div>
    </ClientBoundary>
  );
}
