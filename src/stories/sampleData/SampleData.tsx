import type { SidebarData, System, User } from "@/interfaces";

export const testSidebar: SidebarData = {
  navMain: [
    { id: 0, title: "Home", href: "#", iconId: "home" },
    { id: 1, title: "Contact", href: "#", iconId: "file" },
  ],
  navGroups: [
    {
      id: "reports",
      label: "Reports",
      defaultOpen: true,
      items: [
        { id: 2, title: "Register/Edit", href: "#" },
        { id: 3, title: "List", href: "#" },
      ],
    },
  ],
};

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
    iconId: "layout",
    description: "SIPAC Process Management System",
    href: "#",
  },
  {
    title: "User Management",
    iconId: "userCog",
    description: "User Management System",
    href: "#",
  },
  {
    title: "Human Resources",
    iconId: "users",
    description: "Human Resources Management System",
    href: "#",
  },
  {
    title: "Allocation",
    iconId: "calendar",
    description: "Course Scheduling and Planning System",
    href: "#",
  },
  {
    title: "Graduate Selection",
    iconId: "userCheck",
    description: "Graduate Admissions System",
    href: "#",
  },
  {
    title: "Input Analysis",
    iconId: "userSearch",
    description: "Badge-based Input Analysis System",
    href: "#",
  },
  {
    title: "FrequenCIn",
    iconId: "clipboard",
    description: "Student Attendance System",
    href: "#",
  },
  {
    title: "Prints",
    iconId: "printer",
    description: "Balance and Print Log Inquiry System",
    href: "#",
  },
  {
    title: "Research System",
    iconId: "landmark",
    description: "Research Indicators Survey and Analysis System",
    href: "#",
  },
  {
    title: "SGA",
    iconId: "graduation",
    description: "Selection Demand Data Survey and Analysis System.",
    href: "#",
  },
];

export function searchFunction(searchString: string) {
  console.log(searchString);
}

export const testInputLabels = ["Name", "CPF (National ID)", "Login"];
