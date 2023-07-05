import { Page, PageProps } from '../Page';
import { RequireAuth } from '../RequireAuth';
import { AuthContextProps } from 'react-oidc-context';

interface PageWithAuthProps extends PageProps {
  authProps: {
    auth: AuthContextProps;
    authInitializing: boolean;
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
  children
}: PageWithAuthProps) {
  const { auth, authInitializing, permittedRoles } = authProps;
  return (
    <RequireAuth
      auth={auth}
      authInitializing={authInitializing}
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
