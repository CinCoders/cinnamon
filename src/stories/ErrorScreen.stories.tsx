import type { Meta, StoryObj } from "@storybook/react";
import { ErrorScreen, httpErrors } from "@/lib-components/ErrorScreen/ErrorScreen";

const meta: Meta<typeof ErrorScreen> = {
  title: "Lib Components/ErrorScreen",
  component: ErrorScreen,
  args: {
    errorType: httpErrors.NOTFOUND_404,
  },
  argTypes: {
    errorType: {
      control: { type: "select" },
      options: [
        httpErrors.NOTFOUND_404,
        httpErrors.COMINGSOON_501,
        httpErrors.INACTIVE_503,
        httpErrors.MAINTENANCE_503,
      ],
      mapping: {
        NOTFOUND_404: httpErrors.NOTFOUND_404,
        COMINGSOON_501: httpErrors.COMINGSOON_501,
        INACTIVE_503: httpErrors.INACTIVE_503,
        MAINTENANCE_503: httpErrors.MAINTENANCE_503,
      },
      labels: {
        [httpErrors.NOTFOUND_404]: "NOTFOUND_404",
        [httpErrors.COMINGSOON_501]: "COMINGSOON_501",
        [httpErrors.INACTIVE_503]: "INACTIVE_503",
        [httpErrors.MAINTENANCE_503]: "MAINTENANCE_503",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorScreen>;

export const NotFound: Story = {
  args: {
    errorType: httpErrors.NOTFOUND_404,
  },
};

export const ComingSoon: Story = {
  args: {
    errorType: httpErrors.COMINGSOON_501,
  },
};

export const Inactive: Story = {
  args: {
    errorType: httpErrors.INACTIVE_503,
  },
};

export const Maintenance: Story = {
  args: {
    errorType: httpErrors.MAINTENANCE_503,
  },
};
