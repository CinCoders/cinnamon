import { Page, type PageProps } from "../Page/Page";
import { RequireAuthServer } from "../RequireAuth";
import type { CinnamonSession } from "@/auth/types";

type Props = PageProps & {
  authProps: {
    session: CinnamonSession | null;
    permittedRoles: string[];
    onUnauthenticated: () => never;
  };
};

export function PageWithAuthServer({
  // authProps,
  // navbar,
  // footer,
  // centralized = false,
  // haveToast = false,
  // createNavbarContext = true,
  // components,
  // children,
}: Props) {
  return (
    <>
    </>
    // <RequireAuthServer
    //   session={authProps.session}
    //   permittedRoles={authProps.permittedRoles}
    //   onUnauthenticated={authProps.onUnauthenticated}
    // >
    //   <Page
    //     navbar={navbar}
    //     footer={footer}
    //     centralized={centralized}
    //     haveToast={haveToast}
    //     components={components}
    //     createNavbarContext={createNavbarContext}
    //   >
    //     {children}
    //   </Page>
    // </RequireAuthServer>
  );
}
