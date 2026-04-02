import type { Meta, StoryObj } from "@storybook/react";
import { ForbiddenPage } from "@/lib-components/ForbiddenPage/ForbiddenPage";

const meta: Meta<typeof ForbiddenPage> = {
  title: "Lib Components/ForbiddenPage",
  component: ForbiddenPage,
  parameters: {
    docs: { page: null },
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ForbiddenPage>;

export const Default: Story = {
  args: {
    auth: {
      user: {
        profile: {
          email: "test@gmail.com",
        },
      },
      signoutRedirect: () => Promise.resolve(),
    },
    publicURL: "/",
  },
};

export const WithoutAuth: Story = {
  args: {
    auth: undefined,
    publicURL: "/",
  },
};
