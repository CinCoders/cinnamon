"use client";

import React, { useState, useEffect } from "react";

interface ClientBoundaryProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  interactiveProbe?: boolean;
}

/**
 * Client Component Boundary
 * Borda azul conforme especificação.
 * Executa e hidrata no navegador, com suporte a estado, hooks e eventos do DOM.
 */
export function ClientBoundary({
  title,
  description,
  children,
  interactiveProbe = false,
}: ClientBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clientTime, setClientTime] = useState<string>("");

  useEffect(() => {
    setIsHydrated(true);
    setClientTime(
      new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }, []);

  return (
    <div
      style={{
        border: "2px solid #3b82f6",
        borderRadius: "12px",
        padding: "1.25rem",
        margin: "1rem 0",
        backgroundColor: "rgba(239, 246, 255, 0.4)",
        boxShadow: "0 1px 3px rgba(59, 130, 246, 0.1)",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
          paddingBottom: "0.75rem",
          marginBottom: "1rem",
          borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.25rem 0.6rem",
              borderRadius: "9999px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <span style={{ fontSize: "0.65rem" }}>🔵</span> Client Component
          </span>
          {title && (
            <span style={{ fontWeight: 600, color: "#1e40af", fontSize: "0.95rem" }}>
              {title}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.75rem",
            color: "#1d4ed8",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span>
            Status:{" "}
            <strong>
              {isHydrated ? `Hidratado (${clientTime})` : "Pré-renderizando SSR..."}
            </strong>
          </span>
          {interactiveProbe && (
            <>
              <span>•</span>
              <button
                type="button"
                onClick={() => setClickCount((c) => c + 1)}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Testar Interatividade (Cliques: {clickCount})
              </button>
            </>
          )}
        </div>
      </div>

      {description && (
        <p
          style={{
            fontSize: "0.825rem",
            color: "#1e3a8a",
            margin: "0 0 1rem 0",
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>
      )}

      <div>{children}</div>
    </div>
  );
}
