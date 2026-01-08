import type { Meta, StoryObj } from "@storybook/react";
import { CinBadge } from "@/components/CinBadge";

const meta: Meta<typeof CinBadge> = {
  title: "SBM/Components/CinBadge",
  component: CinBadge,
};
export default meta;

export const Default: StoryObj<typeof CinBadge> = {
  args: { label: "Server-safe" },
};