import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "@/lib-components/Text/Text";

const meta: Meta<typeof Text> = {
  title: "Lib Components/Text",
  component: Text,
  args: {
    children: "Módulo de Exemplo (Tarefas)",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["title", "subtitle", "description"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Title: Story = {
  args: { variant: "title" },
};

export const Subtitle: Story = {
  args: { variant: "subtitle", children: "Subtítulo de exemplo" },
};

export const Description: Story = {
  args: {
    variant: "description",
    children:
      "Esta página exemplifica o padrão de listagem via hook + service, formulário modal, e controle de acesso (RBAC).",
  },
};
