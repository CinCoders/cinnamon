import { Page, PageProps } from '../Page';
import Keycloak from 'keycloak-js';
import { RequireAuth } from '../RequireAuth';

interface PageWithAuthProps extends PageProps {
  auth: {
    keycloak: Keycloak;
    initialized: boolean;
    permittedRoles: string[];
  };
}

export function PageWithAuth({
  auth,
  navbar,
  footer,
  centralized = false,
  haveToast = false,
  createNavbarContext = true,
  components,
  children
}: PageWithAuthProps) {
  const { keycloak, initialized, permittedRoles } = auth;
  return (
    <RequireAuth
      keycloak={keycloak}
      initialized={initialized}
      permittedRoles={permittedRoles}
    >
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
