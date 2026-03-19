"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ForbiddenPage } from "../ForbiddenPage/ForbiddenPage";
import { hasAccess, sessionFromOidcAuth, type OidcAuthLike } from "@/auth";

type Props = {
  // Alterado na v2: o client ainda pode receber OIDC, mas apenas como adaptação
  // para o contrato central CinnamonSession.
  auth: OidcAuthLike;
  permittedRoles: string[];
  children: ReactNode;
};

function FullPageLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span>Carregando...</span>
    </div>
  );
}

export function RequireAuth({ auth, permittedRoles, children }: Props) {
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    if (auth.isLoading && !waiting) setWaiting(true);
  }, [auth.isLoading, waiting]);

  // === LOADING ===
  if (auth.isLoading) {
    if (waiting) {
      setTimeout(() => setWaiting(false), 6000);
      return <FullPageLoading />;
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h3>Não foi possível estabelecer conexão com a página.</h3>
      </div>
    );
  }

  // === SESSION ===
  // Alterado na v2: a autorização client agora passa explicitamente
  // pela transformação provider -> CinnamonSession.
  const session = sessionFromOidcAuth(auth);

  // === ACCESS ===
  if (hasAccess(session, permittedRoles)) {
    return children;
  }

  // === FORBIDDEN ===
  if (auth.isAuthenticated) {
    return <ForbiddenPage />;
  }

  // === NOT AUTHENTICATED ===
  setTimeout(() => auth.signinRedirect(), 500);
  return <FullPageLoading />;
}
