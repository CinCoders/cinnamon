import type { ComponentType, SVGProps } from "react";
import {
  Home,
  FileText,
  Calendar,
  CalendarClock,
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
  ListChecks,
  NotebookPen,
  CircleCheck,
  Bell,
  Wrench,
  Megaphone,
  Package,
  Newspaper,
  Settings,
  LogOut,
  Search,
} from "lucide-react";

const iconRegistry = {
  home: Home,
  file: FileText,
  calendar: Calendar,
  calendarClock: CalendarClock,
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
  listChecks: ListChecks,
  notebook: NotebookPen,
  checkCircle: CircleCheck,
  bell: Bell,
  wrench: Wrench,
  megaphone: Megaphone,
  package: Package,
  newspaper: Newspaper,
  settings: Settings,
  logout: LogOut,
  search: Search,
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
