import type { CinnamonSession, OidcAuthLike } from "./types";
import { sessionFromOidcAuth } from "./keycloak";

type SessionLike = CinnamonSession | OidcAuthLike | null | undefined;

function normalizeSession(subject: SessionLike): CinnamonSession | null {
  if (!subject) return null;

  if ("roles" in subject) {
    return subject as CinnamonSession;
  }

  if ("user" in subject || "isAuthenticated" in subject) {
    return sessionFromOidcAuth(subject as OidcAuthLike);
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
