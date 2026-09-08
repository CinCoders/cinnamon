import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Home, FileText, Settings, Users } from "lucide-react";
import { SideMenu, type SideMenuProps } from "@/components/SideMenu/SideMenu";
import { Button } from "@/components/ui/button";
import type { SidebarData } from "@/interfaces";

const iconClass = "h-4 w-4 text-primary";

const storyData: SidebarData = {
  navMain: [
    { id: 0, title: "Home", href: "/home", IconComponent: () => <Home className={iconClass} /> },
    { id: 5, title: "Settings", href: "/settings", IconComponent: () => <Settings className={iconClass} /> },
  ],
  navGroups: [
    {
      id: "admin",
      label: "Admin",
      defaultOpen: true,
      items: [
        { id: 1, title: "Users", href: "/users", IconComponent: () => <Users className={iconClass} /> },
        { id: 2, title: "Reports", href: "/reports", IconComponent: () => <FileText className={iconClass} /> },
      ],
    },
  ],
};

const meta = {
  title: "Lib Components/SideMenu",
  component: SideMenu,
  args: {
    data: storyData,
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
      options: [undefined, "/home", "/users", "/reports", "/settings"],
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
        Área de conteúdo (simula uma página). A sidebar abre num Drawer a
        partir do botão de menu.
      </div>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <SideMenuDemo {...args} />,
};
