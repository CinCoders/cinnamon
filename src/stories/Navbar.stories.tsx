import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "@/lib-components/Navbar/Navbar";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";
import { testNotifications, testSidebar, testSystems, testUser } from "./sampleData/SampleData";

/**
 * Aqui criamos um tipo da STORY
 * que estende as props reais do Navbar
 * + props auxiliares da story
 */
type NavbarStoryArgs = NavbarProps & {
  systemsListPopup: boolean; // só para controlar via Storybook
  notificationsPopup: boolean; // idem, para notifications
};

const meta: Meta<NavbarStoryArgs> = {
  title: "Lib Components/Navbar",
  component: Navbar,
  parameters: { docs: { page: null }, layout: "fullscreen" },

  args: {
    h1: true,
    isLandingPage: false,
    haveSearchBar: false,
    hiddenUser: false,
    user: testUser,
    sidebar: testSidebar,
    title: "Cinnamon",
    systemsList: [],
    accountManagementUrl: "#",
    notificationsUrl: "#",

    // 👇 propriedades exclusivas da story
    systemsListPopup: true,
    notificationsPopup: true,
  },

  argTypes: {
    systemsListPopup: {
      control: "boolean",
      description: "Mostra/oculta o popup de sistemas (injeta systemsList).",
      table: { category: "Story" },
    },
    notificationsPopup: {
      control: "boolean",
      description: "Mostra/oculta o sino de avisos (injeta notifications). Deixar a prop `notifications` como `undefined` esconde o sino inteiro.",
      table: { category: "Story" },
    },

    systemsList: { control: false },
    notifications: { control: false },
  },
};

export default meta;
type Story = StoryObj<NavbarStoryArgs>;

export const Default: Story = {
  render: (args) => (
    <Navbar
      {...args}
      systemsList={args.systemsListPopup ? testSystems : []}
      notifications={args.notificationsPopup ? testNotifications : undefined}
      user={args.hiddenUser ? undefined : args.user}
    />
  ),
};
