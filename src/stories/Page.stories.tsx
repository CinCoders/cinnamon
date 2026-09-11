import type { Meta, StoryObj } from "@storybook/react";
import type * as React from "react";
import { Page } from "../lib-components/Page/Page";
import { testSidebar, testSystems, testUser } from "./sampleData/SampleData";

type PageStoryArgs = {
  // Children
  width: string;
  height: string;
  color: string;

  // Page
  centralized: boolean;

  // Navbar (viram navbar={{...}})
  title: string;
  h1: boolean;
  isLandingPage: boolean;
  haveSearchBar: boolean;
  hiddenUser: boolean;
  systemsListPopup: boolean;

  // Footer (viram footer={{...}})
  footerDescription: string;
  footerSupportTitle: string;
  footerTelephone: string;
  footerEmail: string;
  footerAppVersion: string;
};

const meta: Meta<PageStoryArgs> = {
  title: "Lib Components/Page",
  component: Page as unknown as React.ComponentType<PageStoryArgs>,
  parameters: { docs: { page: null }, layout: "fullscreen" },

  argTypes: {
    centralized: { control: "boolean", table: { category: "Page" } },

    // Children
    width: { control: "text", table: { category: "Children" } },
    height: { control: "text", table: { category: "Children" } },
    color: { control: "color", table: { category: "Children" } },

    // Navbar
    title: { control: "text", table: { category: "Navbar" } },
    h1: { control: "boolean", table: { category: "Navbar" } },
    isLandingPage: { control: "boolean", table: { category: "Navbar" } },
    haveSearchBar: { control: "boolean", table: { category: "Navbar" } },
    hiddenUser: { control: "boolean", table: { category: "Navbar" } },
    systemsListPopup: { control: "boolean", table: { category: "Navbar" } },

    // Footer
    footerDescription: { control: "text", table: { category: "Footer" } },
    footerSupportTitle: { control: "text", table: { category: "Footer" } },
    footerTelephone: { control: "text", table: { category: "Footer" } },
    footerEmail: { control: "text", table: { category: "Footer" } },
    footerAppVersion: { control: "text", table: { category: "Footer" } },
  },

  args: {
    width: "150px",
    height: "150px",
    color: "#000000",
    centralized: false,

    title: "Cinnamon",
    h1: true,
    isLandingPage: false,
    haveSearchBar: true,
    hiddenUser: false,
    systemsListPopup: true,

    footerDescription: "Centro de Informática — UFPE",
    footerSupportTitle: "Suporte Técnico",
    footerTelephone: "(81) 2126-8430",
    footerEmail: "helpdesk@cin.ufpe.br",
    footerAppVersion: "1.4.0",
  },
};

export default meta;
type Story = StoryObj<PageStoryArgs>;

export const Default: Story = {
  render: (args) => (
    <Page
      navbar={{
        isLandingPage: args.isLandingPage,
        haveSearchBar: args.haveSearchBar,
        hiddenUser: args.hiddenUser,
        user: args.hiddenUser ? undefined : testUser,
        h1: args.h1,
        title: args.title,
        sidebar: testSidebar,
        systemsList: args.systemsListPopup ? testSystems : [],
      }}
      footer={{
        description: args.footerDescription,
        support: {
          title: args.footerSupportTitle,
          telephone: args.footerTelephone,
          email: args.footerEmail,
        },
        appVersion: args.footerAppVersion,
      }}
      centralized={args.centralized}
    >
      <div
        style={{
          width: args.width,
          height: args.height,
          backgroundColor: args.color,
          padding: "20px 40px",
        }}
      />
    </Page>
  ),
};
