import type { CinnamonSession, OidcAuthLike } from "./types";
import { sessionFromOidcAuth } from "./keycloak";

type SessionLike = CinnamonSession | OidcAuthLike | null | undefined;

function isCinnamonSession(subject: SessionLike): subject is CinnamonSession {
  return !!subject && "roles" in subject;
}

function isOidcAuthLike(subject: SessionLike): subject is OidcAuthLike {
  return (
    !!subject &&
    "isAuthenticated" in subject &&
    "isLoading" in subject &&
    "signinRedirect" in subject
  );
}

function normalizeSession(subject: SessionLike): CinnamonSession | null {
  if (!subject) return null;

  if (isCinnamonSession(subject)) {
    return subject;
  }

  if (isOidcAuthLike(subject)) {
    return sessionFromOidcAuth(subject);
  }

  return null;
}

/**
 * Regra:
 * - Não autenticado => sem acesso
 * - '*' => acesso total
 * - Caso contrário => precisa ter pelo menos 1 role permitida
 */
export function hasAccess(subject: SessionLike, permittedRoles: string[]): boolean {
  const session = normalizeSession(subject);
  if (!session?.isAuthenticated) return false;

  if (permittedRoles.includes("*")) return true;

  const roles = session.roles ?? [];
  for (const role of permittedRoles) {
    if (roles.includes(role)) return true;
  }
  return false;
}
