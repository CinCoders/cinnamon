export { Button, buttonVariants } from "./components/ui/button";
export { RequireAuth, RequireAuthServer } from "./lib-components/RequireAuth";
export {
  Page,
  PageServer,
  type PageProps,
  type PageServerProps,
} from "./lib-components/Page";
export {
  PageWithAuth,
  PageWithAuthServer,
} from "./lib-components/PageWithAuth";
export { Navbar } from "./lib-components/Navbar/Navbar";
export { Footer } from "./lib-components/Footer/Footer";
export * from "./lib/utils";
export { ForbiddenPage } from "./lib-components/ForbiddenPage/ForbiddenPage";
export * from "./auth";
// Mantemos namespaces por compatibilidade pública, mas o barrel interno de auth
// deixa de ser auto-referencial para evitar ambiguidade no contrato.
export * as Auth from "./auth";
export * as AuthUtils from "./auth";
