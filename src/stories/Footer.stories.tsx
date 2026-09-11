import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "@/lib-components/Footer/Footer";

const meta = {
  title: "Lib Components/Footer",
  component: Footer,
  parameters: { docs: { page: null }, layout: "fullscreen" },
  args: {
    appVersion: "2.2.2",
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default variant: CInCoders. Site + socials in the social row, contact under the logo. */
export const CInCoders: Story = { name: "CInCoders" };

/** CIn variant: CIn socials, "Recursos" column, low-emphasis support strip. */
export const CIn: Story = {
  name: "CIn",
  args: { variant: "cin" },
};

/** Contact address/email moved below the right-aligned columns. */
export const ContactUnderColumns: Story = {
  args: { contactPlacement: "columns" },
};

export const CustomColumns: Story = {
  args: {
    linkColumns: [
      {
        title: "Links",
        links: [
          { label: "Home", href: "#home" },
          { label: "About", href: "#about" },
          { label: "Docs", href: "#docs" },
        ],
      },
    ],
  },
};

export const NoSupport: Story = {
  args: { variant: "cin", support: null },
};

/** The bottom-bar line is configurable. Pass `null` to drop it entirely. */
export const CustomCopyright: Story = {
  args: { copyrightText: "CIn UFPE | All rights reserved" },
};

export const Compact: Story = {
  args: { largeFooter: false },
};
