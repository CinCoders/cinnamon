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

/** CIn internal-app defaults: CIn logo + technical-support block. */
export const Default: Story = {};

export const WithColumnsAndSocials: Story = {
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
      {
        title: "Legal",
        links: [
          { label: "Privacy policy", href: "#privacy" },
          { label: "Terms", href: "#terms" },
        ],
      },
    ],
    socialLinks: [
      { label: "GitHub", href: "https://github.com/cincoders" },
      { label: "Instagram", href: "https://instagram.com" },
    ],
  },
};

export const CustomSupport: Story = {
  args: {
    description: "Sistema de Ranqueamento de Produtividade",
    support: {
      title: "Fale Conosco",
      telephone: "(81) 3333-4444",
      email: "prorank@cin.ufpe.br",
    },
  },
};

export const NoSupport: Story = {
  args: { support: null },
};

export const Compact: Story = {
  args: { largeFooter: false },
};
