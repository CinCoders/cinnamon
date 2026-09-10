// Public API — v2 (icons entry).
//
// Two ways to use icons from the library, without adding `@hugeicons/*` to the
// consumer's own dependencies:
//
//   1. `Icon` + `CinnamonIconId` — the curated, typed registry. This is what
//      the Navbar / Footer / Sidebar props reference (`iconId`).
//   2. The full `@hugeicons/core-free-icons` set, re-exported below. Both this
//      package and `@hugeicons/react` are `sideEffects: false` and split one
//      module per icon, so `import { Home09Icon } from "@cincoders/cinnamon/icons"`
//      tree-shakes to just that icon.

export { Icon } from "./lib-components/IconRender";
export type { IconProps } from "./lib-components/IconRender";

export {
  resolveCinnamonIcon,
  getAvailableIconIds,
} from "./icons";
export type { CinnamonIconId } from "./icons";

export { HugeiconsIcon } from "@hugeicons/react";
export type { IconSvgElement } from "@hugeicons/react";

// The full free icon set (icon-data objects, rendered via `<HugeiconsIcon icon={...} />`).
export * from "@hugeicons/core-free-icons";
