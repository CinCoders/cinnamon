import type { Meta, StoryObj } from "@storybook/react";
import { UserPopup } from "@/components/UserPopup/UserPopup";

const meta: Meta<typeof UserPopup> = {
  title: "Lib Components/UserPopup",
  component: UserPopup,
};
export default meta;

type Story = StoryObj<typeof UserPopup>;

export const Default: Story = {
  args: {
    accountManagementUrl: "https://example.com/account",
    user: {
      name: "Gustavo",
      email: "gustavo@exemplo.com",
      positions: [
        {
          id: "1",
          name: "Position 1",
          roles: [
            { id: "r1", name: "Role 1", description: "Role 1" },
            { id: "r2", name: "Role 2", description: "Role 2" },
          ],
        },
        {
          id: "2",
          name: "Position 2",
          roles: [
            { id: "r1", name: "Role 1", description: "Role 1" },
            { id: "r2", name: "Role 2", description: "Role 2" },
          ],
        },
        {
          id: "3",
          name: "Position 3",
          roles: [],
        },
      ],
    },
  },
};
