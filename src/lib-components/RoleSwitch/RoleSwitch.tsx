import type { ReactNode } from "react";
import type { CinnamonSession, OidcAuthLike } from "@/auth/types";
import { hasAccess } from "@/auth/hasAccess";

export interface RoleSwitchCase {
  /** Roles autorizadas para este caso. Use '*' para "qualquer usuário autenticado". */
  roles: string[];
  children: ReactNode;
}

export interface RoleSwitchProps {
  /** Sessão do usuário — aceita tanto o contrato interno quanto `OidcAuthLike`. */
  auth: CinnamonSession | OidcAuthLike | null | undefined;
  /** Casos avaliados em ordem; o primeiro cujo `roles` bate com a sessão é renderizado. */
  cases: RoleSwitchCase[];
  /** Renderizado quando nenhum caso bate (ex.: visitante sem role). */
  fallback?: ReactNode;
}

/**
 * Renderiza conteúdo diferente conforme as roles do usuário logado.
 * Útil para textos/blocos que variam por perfil (admin vs. usuário comum, etc.).
 */
export function RoleSwitch({ auth, cases, fallback = null }: RoleSwitchProps) {
  for (const roleCase of cases) {
    if (hasAccess(auth, roleCase.roles)) {
      return <>{roleCase.children}</>;
    }
  }
  return <>{fallback}</>;
}
