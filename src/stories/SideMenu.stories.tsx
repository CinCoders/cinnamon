import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Home, FileText, Settings, Users } from "lucide-react";
import { SideMenu, type SideMenuProps } from "@/components/SideMenu/SideMenu";
import { Button } from "@/components/ui/button";
import type { SideMenuLink } from "@/interfaces";

const iconClass = "h-7 w-7 text-primary";

const storyLinks: SideMenuLink[] = [
  { id: 0, title: "Home", href: "/home", IconComponent: () => <Home className={iconClass} /> },
  { id: 1, title: "Users", href: "/users", IconComponent: () => <Users className={iconClass} /> },
  {
    id: 2,
    title: "Reports",
    href: "/reports",
    IconComponent: () => <FileText className={iconClass} />,
    children: [
      { id: 3, title: "Monthly", href: "/reports/monthly" },
      { id: 4, title: "Yearly", href: "/reports/yearly" },
    ],
  },
  { id: 5, title: "Settings", href: "/settings", IconComponent: () => <Settings className={iconClass} /> },
];

const meta = {
  title: "Lib Components/SideMenu",
  component: SideMenu,
  args: {
    links: storyLinks,
    top: "64px",
    visibility: false,
    setVisibility: () => {},
    activeHref: "/users",
  },
  argTypes: {
    setVisibility: { control: false },
    visibility: { control: false },
    activeHref: {
      control: "select",
      options: [
        undefined,
        "/home",
        "/users",
        "/reports",
        "/reports/monthly",
        "/settings",
      ],
    },
  },
} satisfies Meta<typeof SideMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function SideMenuDemo(args: SideMenuProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-[70vh] bg-background text-foreground">
      <div
        className="flex h-[64px] items-center justify-center border-b border-border"
        style={{ position: "relative", zIndex: 10 }}
      >
        <Button onClick={() => setOpen((v) => !v)}>
          {open ? "Close SideMenu" : "Open SideMenu"}
        </Button>
      </div>

      <SideMenu {...args} visibility={open} setVisibility={setOpen} />

      <div className="p-6 text-sm text-muted-foreground">
        Área de conteúdo (simula uma página). O trilho vermelho segue o item
        de `activeHref`; ao passar o mouse, um trilho tracejado cinza segue o
        item sob hover.
      </div>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <SideMenuDemo {...args} />,
};
