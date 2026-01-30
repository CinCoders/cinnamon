import type { CinnamonSession } from "./types";

/**
 * Regra:
 * - Não autenticado => sem acesso
 * - '*' => acesso total
 * - Caso contrário => precisa ter pelo menos 1 role permitida
 */
export function hasAccess(
  session: CinnamonSession | null | undefined,
  permittedRoles: string[]
): boolean {
  if (!session?.isAuthenticated) return false;

  if (permittedRoles.includes("*")) return true;

  const roles = session.roles ?? [];
  for (const role of permittedRoles) {
    if (roles.includes(role)) return true;
  }
  return false;
}
