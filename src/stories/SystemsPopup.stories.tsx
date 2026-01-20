import type { Meta, StoryObj } from "@storybook/react";
import { SystemsPopup } from "@/components/SystemsPopup/SystemsPopup";
import { testSystems } from "./sampleData/SampleData";

const meta: Meta<typeof SystemsPopup> = {
  title: "Components/SystemsPopup",
  component: SystemsPopup,
  args: {
    systemsList: testSystems,
  },
};
export default meta;

type Story = StoryObj<typeof SystemsPopup>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-[60vh] bg-background p-8 text-foreground flex items-start justify-center">
      <SystemsPopup {...args} />
    </div>
  ),
};
