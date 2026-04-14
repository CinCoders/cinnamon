"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ForbiddenPage } from "../ForbiddenPage/ForbiddenPage";
import { hasAccess, sessionFromOidcAuth, type OidcAuthLike } from "@/auth";

type Props = {
  // Alterado na v2: o client ainda pode receber OIDC, mas apenas como adaptação
  // para o contrato central CinnamonSession.
  auth: OidcAuthLike;
  publicURL?: string;
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

export function RequireAuth({ auth, publicURL, permittedRoles, children }: Props) {
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    if (!auth.isLoading) {
      setWaiting(true);
      return;
    }

    if (!waiting) return;

    const timeoutId = window.setTimeout(() => setWaiting(false), 6000);
    return () => window.clearTimeout(timeoutId);
  }, [auth.isLoading, waiting]);

  useEffect(() => {
    if (auth.isAuthenticated || auth.isLoading) return;

    const timeoutId = window.setTimeout(() => {
      void auth.signinRedirect();
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [auth.isAuthenticated, auth.isLoading, auth]);

  // === LOADING ===
  if (auth.isLoading) {
    if (waiting) {
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
    return <ForbiddenPage auth={auth} publicURL={publicURL} />;
  }

  // === NOT AUTHENTICATED ===
  return <FullPageLoading />;
}
