import type { ReactNode } from "react";
import type { CinnamonSession } from "@/auth/types";

import { PageServer, type PageServerProps } from "../Page";
import { RequireAuthServer } from "../RequireAuth";

type PageWithAuthServerProps = PageServerProps & {
  authProps: {
    session: CinnamonSession | null;
    permittedRoles: string[];
    onUnauthenticated: () => never;
  };
  children: ReactNode;
};

export function PageWithAuthServer({
  authProps,
  children,
  ...pageProps
}: PageWithAuthServerProps) {
  return (
    <RequireAuthServer
      session={authProps.session}
      permittedRoles={authProps.permittedRoles}
      onUnauthenticated={authProps.onUnauthenticated}
    >
      <PageServer {...pageProps}>{children}</PageServer>
    </RequireAuthServer>
  );
}
