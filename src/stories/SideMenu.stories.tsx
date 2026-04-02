import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SideMenu } from "@/components/SideMenu/SideMenu";
import { Button } from "@/components/ui/button";
import { testLinks } from "./sampleData/SampleData";

const meta = {
  title: "Lib Components/SideMenu",
  component: SideMenu,
  args: {
    links: testLinks,
    top: "64px",
    visibility: false,
    setVisibility: () => {},
  },
  argTypes: {
    setVisibility: { control: false },
    visibility: { control: false },
  },
} satisfies Meta<typeof SideMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);

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
          Área de conteúdo (simula uma página).
        </div>
      </div>
    );
  },
};
