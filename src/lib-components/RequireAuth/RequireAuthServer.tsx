import type { ReactNode } from "react";

import { hasAccess } from "@/auth";
import type { CinnamonSession } from "@/auth/types";
import { ForbiddenPageServer } from "../ForbiddenPage/ForbiddenPageServer";

type Props = {
  session: CinnamonSession | null;
  permittedRoles: string[];
  children: ReactNode;

  /**
   * No Next/App Router você vai passar:
   *   onUnauthenticated={() => redirect(loginUrl)}
   *
   * Mantemos a Cinnamon agnóstica: ela não chama next/navigation direto.
   * 
   * Server-side action: em Next, você passa algo que chama redirect(loginUrl).
   * Ex.: onUnauthenticated={() => redirect(loginUrl)}
   */
  onUnauthenticated: () => never;
};

export function RequireAuthServer({
  session,
  permittedRoles,
  onUnauthenticated,
  children,
}: Props) {
  if (!session?.isAuthenticated) {
    // Espera-se que onUnauthenticated lance (ex.: redirect() do Next).
    // Se não lançar, não renderizamos o retorno: evita crash do React com undefined.
    onUnauthenticated();
    return null;
  }

  // Server já opera diretamente no contrato oficial CinnamonSession.
  if (!hasAccess(session, permittedRoles)) {
    return <ForbiddenPageServer />;
  }

  return <>{children}</>;
}
