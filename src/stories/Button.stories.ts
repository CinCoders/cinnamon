import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Button",
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Link: Story = {
  args: { variant: "link" },
};

export const Bordo: Story = {
  args: { variant: "bordo" },
};

export const Verde: Story = {
  args: { variant: "verde" },
};

export const Azul: Story = {
  args: { variant: "azul" },
};

export const Amarelo: Story = {
  args: { variant: "amarelo" },
};

export const Neutro: Story = {
  args: { variant: "neutro" },
};
