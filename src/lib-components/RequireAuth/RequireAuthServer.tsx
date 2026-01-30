import type { ReactNode } from "react";

import { Auth } from "@/auth";
import type { CinnamonSession } from "@/auth/types";
import { ForbiddenPage } from "../ForbiddenPage/ForbiddenPage";

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
    return onUnauthenticated();
  }

  if (!Auth.hasAccess(session, permittedRoles)) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}
