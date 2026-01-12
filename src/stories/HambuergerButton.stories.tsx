import type { Meta, StoryObj } from "@storybook/react";
import { HamburgerButton } from "@/components/HamburgerButton/HamburgerButton";
import { useState } from "react";

const meta: Meta<typeof HamburgerButton> = {
  title: "Lib Components/HamburgerButton",
  component: HamburgerButton,
  args: { isOpen: false },
};
export default meta;

type Story = StoryObj<typeof HamburgerButton>;

export const Default: Story = {};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-6 bg-background text-foreground">
        <HamburgerButton isOpen={open} onClick={() => setOpen((v) => !v)} />
      </div>
    );
  },
};
