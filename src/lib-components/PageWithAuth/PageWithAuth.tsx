"use client";

import type { OidcAuthLike } from "@/auth";
import { Page, type PageProps } from "../Page/Page";
import { RequireAuth } from "../RequireAuth";

interface PageWithAuthProps extends PageProps {
  authProps: {
    // Alterado na v2: PageWithAuth continua aceitando o fluxo client,
    // mas o tipo agora deixa explícito que isso é uma camada de adaptação.
    auth: OidcAuthLike;
    publicURL?: string; // mantido por compat, pode ser ignorado no v2
    permittedRoles: string[];
  };
}

export function PageWithAuth({ authProps, children, ...pageProps }: PageWithAuthProps) {
  const { auth, publicURL, permittedRoles } = authProps;

  return (
    <RequireAuth auth={auth} publicURL={publicURL} permittedRoles={permittedRoles}>
      <Page {...pageProps}>{children}</Page>
    </RequireAuth>
  );
}
