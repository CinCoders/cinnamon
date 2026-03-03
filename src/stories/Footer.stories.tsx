import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "@/lib-components/Footer/Footer";

const meta = {
  title: "Lib Components/Footer",
  component: Footer,
  parameters: { docs: { page: null } },
  args: {
    title: "FOOTER TITLE",
    telephone: "(xx) xxxx-xxxx",
    telephoneComplement: "Internal number: xxxx / xxxx",
    email: "sample@email.com",
    link: "https://www.google.com",
    textLink: "Website",
    description: "Footer's description with \n line break",
    copyrightText: "CIn UFPE |  All rights reserved",
    largeFooter: true,
    appVersion: "2.2.2",
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
