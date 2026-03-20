import type { ComponentType, SVGProps } from "react";
import {
  Home,
  FileText,
  Calendar,
  Users,
  LayoutDashboard,
  UserCog,
  UserSearch,
  GraduationCap,
  ClipboardCheck,
  UserCheck,
  Printer,
  Landmark,
  Grid,
  BookOpen,
} from "lucide-react";

const iconRegistry = {
  home: Home,
  file: FileText,
  calendar: Calendar,
  users: Users,
  layout: LayoutDashboard,
  userCog: UserCog,
  userSearch: UserSearch,
  graduation: GraduationCap,
  clipboard: ClipboardCheck,
  userCheck: UserCheck,
  printer: Printer,
  landmark: Landmark,
  grid: Grid,
  book: BookOpen,
} as const;

export type CinnamonIconId = keyof typeof iconRegistry;

export function resolveCinnamonIcon(
  iconId?: CinnamonIconId,
): ComponentType<SVGProps<SVGSVGElement>> | undefined {
  if (!iconId) return undefined;
  return iconRegistry[iconId];
}

export function getAvailableIconIds(): CinnamonIconId[] {
  return Object.keys(iconRegistry) as CinnamonIconId[];
}
