import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "@/lib-components/Navbar/Navbar";
import type { NavbarProps } from "@/lib-components/Navbar/Navbar";
import { testLinks, testSystems, testUser } from "./sampleData/SampleData";
import { Wrench } from "lucide-react";

/**
 * Aqui criamos um tipo da STORY
 * que estende as props reais do Navbar
 * + props auxiliares da story
 */
type NavbarStoryArgs = NavbarProps & {
  systemsListPopup: boolean; // só para controlar via Storybook
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
    sideMenuLinks: testLinks,
    title: "Cinnamon",
    systemsList: [],
    IconComponent: () => <Wrench className="h-6 w-6 text-[#db1e2f]" />,

    // 👇 propriedade exclusiva da story
    systemsListPopup: true,
  },

  argTypes: {
    systemsListPopup: {
      control: "boolean",
      description: "Mostra/oculta o popup de sistemas (injeta systemsList).",
      table: { category: "Story" },
    },

    systemsList: { control: false },
  },
};

export default meta;
type Story = StoryObj<NavbarStoryArgs>;

export const Default: Story = {
  render: (args) => (
    <Navbar
      {...args}
      systemsList={args.systemsListPopup ? testSystems : []}
      user={args.hiddenUser ? undefined : args.user}
    />
  ),
};
