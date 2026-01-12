import type { Meta, StoryObj } from "@storybook/react";
import { UserPopup } from "@/components/UserPopup/UserPopup";

const meta: Meta<typeof UserPopup> = {
  title: "Components/UserPopup",
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
          name: "Admin",
          roles: [
            { id: "r1", name: "Owner", description: "Acesso total" },
            { id: "r2", name: "Billing", description: "Faturas e cobrança" },
          ],
        },
        {
          id: "2",
          name: "Viewer",
          roles: [],
        },
      ],
    },
  },
};
