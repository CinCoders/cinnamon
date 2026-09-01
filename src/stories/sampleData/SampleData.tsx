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
} from "lucide-react";

import type { SideMenuLink, System, User } from "@/interfaces";

const iconClass = "h-7 w-7 text-primary"; // ajusta se quiser

export const testLinks: SideMenuLink[] = [
  { id: 0, title: "Home", href: "#", IconComponent: () => <Home className={iconClass} /> },
  {
    id: 1,
    title: "Contact",
    href: "#",
    IconComponent: () => <FileText className={iconClass} />,
    children: [
      { id: 2, title: "Register/Edit", href: "#" },
      { id: 3, title: "List", href: "#" },
    ],
  },
];

export const testUser: User = {
  name: "Test User",
  email: "test@gmail.com",
  positions: [
    {
      id: 1,
      name: "Position 1",
      roles: [
        { id: 1, name: "Role 1", description: "Role 1" },
        { id: 2, name: "Role 2", description: "Role 2" },
      ],
    },
    {
      id: 2,
      name: "Position 2",
      roles: [
        { id: 1, name: "Role 1", description: "Role 1" },
        { id: 2, name: "Role 2", description: "Role 2" },
      ],
    },
    { id: 3, name: "Position 3" },
  ],
};

export const testSystems: System[] = [
  {
    title: "Dashboard",
    IconComponent: LayoutDashboard,
    description: "SIPAC Process Management System",
    href: "#",
  },
  {
    title: "User Management",
    IconComponent: UserCog,
    description: "User Management System",
    href: "#",
  },
  {
    title: "Human Resources",
    IconComponent: Users,
    description: "Human Resources Management System",
    href: "#",
  },
  {
    title: "Allocation",
    IconComponent: Calendar,
    description: "Course Scheduling and Planning System",
    href: "#",
  },
  {
    title: "Graduate Selection",
    IconComponent: UserCheck,
    description: "Graduate Admissions System",
    href: "#",
  },
  {
    title: "Input Analysis",
    IconComponent: UserSearch,
    description: "Badge-based Input Analysis System",
    href: "#",
  },
  {
    title: "FrequenCIn",
    IconComponent: ClipboardCheck,
    description: "Student Attendance System",
    href: "#",
  },
  {
    title: "Prints",
    IconComponent: Printer,
    description: "Balance and Print Log Inquiry System",
    href: "#",
  },
  {
    title: "Research System",
    IconComponent: Landmark,
    description: "Research Indicators Survey and Analysis System",
    href: "#",
  },
  {
    title: "SGA",
    IconComponent: GraduationCap,
    description: "Selection Demand Data Survey and Analysis System.",
    href: "#",
  },
];

export function searchFunction(searchString: string) {
  console.log(searchString);
}

export const testInputLabels = ["Name", "CPF (National ID)", "Login"];
