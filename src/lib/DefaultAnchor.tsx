import type { LinkComponent } from "@/interfaces";

/**
 * Fallback quando nenhum `linkComponent` é injetado: `<a>` cru.
 * Definido em module scope para manter a identidade estável entre renders.
 */
export const DefaultAnchor: LinkComponent = (props) => <a {...props} />;
