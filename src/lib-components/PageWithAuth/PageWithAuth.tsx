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

export function PageWithAuth({
  authProps,
  navbar,
  footer,
  centralized = false,
  haveToast = false,
  createNavbarContext = true,
  components,
  children,
}: PageWithAuthProps) {
  const { auth, permittedRoles } = authProps;

  return (
    <RequireAuth auth={auth} permittedRoles={permittedRoles}>
      <Page
        navbar={navbar}
        footer={footer}
        centralized={centralized}
        haveToast={haveToast}
        components={components}
        createNavbarContext={createNavbarContext}
      >
        {children}
      </Page>
    </RequireAuth>
  );
}
