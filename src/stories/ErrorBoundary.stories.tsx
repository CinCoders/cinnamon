import type { Meta, StoryObj } from "@storybook/react";
import { Page } from "@/lib-components/Page/Page";
import { testSidebar, testSystems, testUser } from "./sampleData/SampleData";

function Bomb(): never {
  throw new Error("Something went wrong while rendering.");
}

const meta: Meta<typeof Page> = {
  title: "Lib Components/ErrorBoundary",
  component: Page,
  parameters: { docs: { page: null }, layout: "fullscreen" },
  args: {
    navbar: {
      title: "Cinnamon",
      h1: true,
      user: testUser,
      sidebar: testSidebar,
      systemsList: testSystems,
    },
    footer: {
      description: "Centro de Informática — UFPE",
      support: { title: "Suporte Técnico", telephone: "(81) 2126-8430", email: "helpdesk@cin.ufpe.br" },
      appVersion: "1.4.0",
    },
    errorBoundaryProps: {
      supportEmail: "support@example.com",
      appName: "Storybook Demo",
      appVersion: "1.0.0",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Page>;

export const CaughtError: Story = {
  render: (args) => (
    <Page {...args}>
      <Bomb />
    </Page>
  ),
};

export const NoSupportEmail: Story = {
  args: {
    errorBoundaryProps: { supportEmail: undefined },
  },
  render: (args) => (
    <Page {...args}>
      <Bomb />
    </Page>
  ),
};
