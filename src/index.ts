export { Button, buttonVariants } from "./components/ui/button";
// ... exports existentes
export { RequireAuth, RequireAuthServer } from "./lib-components/RequireAuth";
//export { PageWithAuthServer } from "./lib-components/PageWithAuth/PageWithAuthServer";
// mantenha o PageWithAuth atual (client) também
// export { PageWithAuth } from "./lib-components/PageWithAuth/PageWithAuthServer"; // legado (SPA)
export { Page } from "./lib-components/Page";
export {
  PageWithAuth,
  PageWithAuthServer,
} from "./lib-components/PageWithAuth";
export * from "./lib/utils";
