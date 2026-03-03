import type { ReactNode } from "react";
import type { CinnamonSession } from "@/auth/types";

import { Page, type PageProps } from "../Page";
import { RequireAuthServer } from "../RequireAuth";

type Props = PageProps & {
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
}: Props) {
  return (
    <RequireAuthServer
      session={authProps.session}
      permittedRoles={authProps.permittedRoles}
      onUnauthenticated={authProps.onUnauthenticated}
    >
      {/* Page é client. Se você quiser Page “server-safe”, eu já te explico abaixo */}
      <Page {...pageProps}>{children as any}</Page>
    </RequireAuthServer>
  );
}
