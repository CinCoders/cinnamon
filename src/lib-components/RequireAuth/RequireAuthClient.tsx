"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { AuthContextProps } from "react-oidc-context";

import { ForbiddenPage } from "../ForbiddenPage/ForbiddenPage";
import { Auth } from "@/auth";

type Props = {
  auth: AuthContextProps;
  permittedRoles: string[];
  children: ReactNode;
};

function FullPageLoading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span>Carregando...</span>
    </div>
  );
}

export function RequireAuthClient({ auth, permittedRoles, children }: Props) {
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h3>Não foi possível estabelecer conexão com a página.</h3>
      </div>
    );
  }

  // === SESSION ===
  const session = auth.user
    ? {
        isAuthenticated: auth.isAuthenticated,
        roles: Auth.rolesFromKeycloakAccessToken(auth.user.access_token),
        user: {
          email: auth.user.profile?.email,
          name: auth.user.profile?.name,
          username: auth.user.profile?.preferred_username,
        },
      }
    : { isAuthenticated: false, roles: [] };

  // === ACCESS ===
  if (Auth.hasAccess(session, permittedRoles)) {
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
