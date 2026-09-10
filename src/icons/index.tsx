import type { ComponentType } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Home09Icon,
  File01Icon,
  Calendar03Icon,
  CalendarCheckIn01Icon,
  UserMultipleIcon,
  DashboardSquare01Icon,
  UserSettings01Icon,
  UserSearch01Icon,
  MortarboardIcon,
  TaskDone01Icon,
  CheckListIcon,
  PrinterIcon,
  Building03Icon,
  GridViewIcon,
  Book02Icon,
  Notification03Icon,
  Wrench01Icon,
  Megaphone01Icon,
  PackageIcon,
  News01Icon,
  Settings02Icon,
  Logout03Icon,
  Search01Icon,
  NoteEditIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

/**
 * Registry de ícones da lib. As chaves são a API pública (`CinnamonIconId`);
 * os valores são o SVG-data do `@hugeicons/core-free-icons`, renderizado via
 * `<HugeiconsIcon icon={...} />`. Trocar o pacote de ícones é uma mudança
 * localizada a este arquivo.
 */
const iconRegistry = {
  home: Home09Icon,
  file: File01Icon,
  calendar: Calendar03Icon,
  calendarClock: CalendarCheckIn01Icon,
  users: UserMultipleIcon,
  layout: DashboardSquare01Icon,
  userCog: UserSettings01Icon,
  userSearch: UserSearch01Icon,
  graduation: MortarboardIcon,
  clipboard: TaskDone01Icon,
  userCheck: CheckListIcon,
  printer: PrinterIcon,
  landmark: Building03Icon,
  grid: GridViewIcon,
  book: Book02Icon,
  listChecks: CheckListIcon,
  notebook: NoteEditIcon,
  checkCircle: CheckmarkCircle02Icon,
  bell: Notification03Icon,
  wrench: Wrench01Icon,
  megaphone: Megaphone01Icon,
  package: PackageIcon,
  newspaper: News01Icon,
  settings: Settings02Icon,
  logout: Logout03Icon,
  search: Search01Icon,
} as const satisfies Record<string, IconSvgElement>;

export type CinnamonIconId = keyof typeof iconRegistry;

/**
 * Resolve um `CinnamonIconId` para um componente `{ className?: string }`,
 * pronto para renderizar. Retorna `undefined` para id ausente/desconhecido —
 * o caller decide o fallback.
 */
export function resolveCinnamonIcon(
  iconId?: CinnamonIconId,
): ComponentType<{ className?: string }> | undefined {
  if (!iconId) return undefined;
  const data = iconRegistry[iconId];
  if (!data) return undefined;
  return function CinnamonRegistryIcon({ className }: { className?: string }) {
    return <HugeiconsIcon icon={data} className={className} strokeWidth={2} />;
  };
}

export function getAvailableIconIds(): CinnamonIconId[] {
  return Object.keys(iconRegistry) as CinnamonIconId[];
}
