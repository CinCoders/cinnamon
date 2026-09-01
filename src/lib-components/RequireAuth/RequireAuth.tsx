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
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  useEffect(() => {
    if (!auth.isLoading) {
      setLoadingTimedOut(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setLoadingTimedOut(true), 6000);
    return () => window.clearTimeout(timeoutId);
  }, [auth.isLoading]);

  useEffect(() => {
    if (auth.isAuthenticated || auth.isLoading) return;

    const timeoutId = window.setTimeout(() => {
      void auth.signinRedirect();
    }, 500);

    return () => window.clearTimeout(timeoutId);
    // auth.signinRedirect é estável no react-oidc-context; só re-agendamos quando o estado muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, auth.isLoading]);

  // === LOADING ===
  if (auth.isLoading) {
    if (!loadingTimedOut) {
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
