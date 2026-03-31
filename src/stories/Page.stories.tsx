import type { Meta, StoryObj } from "@storybook/react";
import { Page } from "../lib-components/Page/Page";
import { testLinks, testSystems, testUser } from "./sampleData/SampleData";

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
  footerTitle: string;
  footerTelephone: string;
  footerTelephoneComplement: string;
  footerEmail: string;
  footerLink: string;
  footerTextLink: string;
  footerDescription: string;
  footerCopyrightText: string;
};

const meta: Meta<PageStoryArgs> = {
  title: "Lib Components/Page",
  component: Page as unknown as React.ComponentType<any>, // cast simples p/ Page aceitar story-args
  parameters: { docs: { page: null } },

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
    footerTitle: { control: "text", table: { category: "Footer" } },
    footerTelephone: { control: "text", table: { category: "Footer" } },
    footerTelephoneComplement: {
      control: "text",
      table: { category: "Footer" },
    },
    footerEmail: { control: "text", table: { category: "Footer" } },
    footerLink: { control: "text", table: { category: "Footer" } },
    footerTextLink: { control: "text", table: { category: "Footer" } },
    footerDescription: { control: "text", table: { category: "Footer" } },
    footerCopyrightText: { control: "text", table: { category: "Footer" } },
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

    footerTitle: "FOOTER TITLE",
    footerTelephone: "(xx) xxxx-xxxx",
    footerTelephoneComplement: "Internal number: xxxx / xxxx",
    footerEmail: "sample@email.com",
    footerLink: "https://www.google.com",
    footerTextLink: "Site",
    footerDescription: "Footer's description with \n line break",
    footerCopyrightText: "CIn UFPE | All rights reserved",
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
        sideMenuLinks: testLinks,
        systemsList: args.systemsListPopup ? testSystems : [],
        //IconComponent: () => <Wrench className="h-6 w-6 text-[#db1e2f]" />,
        IconComponent: undefined,
      }}
      footer={{
        title: args.footerTitle,
        telephone: args.footerTelephone,
        telephoneComplement: args.footerTelephoneComplement,
        email: args.footerEmail,
        link: args.footerLink,
        textLink: args.footerTextLink,
        description: args.footerDescription,
        copyrightText: args.footerCopyrightText,
      }}
      centralized={args.centralized}
      createNavbarContext={false}
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
