import type { Meta, StoryObj } from "@storybook/react";
import { CinCounter } from "@/components/CinCounter";

const meta: Meta<typeof CinCounter> = {
  title: "SBM/Lib Components/CinCounter",
  component: CinCounter,
};
export default meta;

export const Default: StoryObj<typeof CinCounter> = {};