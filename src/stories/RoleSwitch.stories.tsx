import type { Meta, StoryObj } from "@storybook/react";
import { RoleSwitch } from "@/lib-components/RoleSwitch/RoleSwitch";
import type { CinnamonSession } from "@/auth/types";

function session(roles: string[]): CinnamonSession {
  return { isAuthenticated: true, roles };
}

const meta: Meta<typeof RoleSwitch> = {
  title: "Lib Components/RoleSwitch",
  component: RoleSwitch,
  args: {
    cases: [
      { roles: ["admin"], children: "Você é administrador: acesso total ao sistema." },
      { roles: ["user"], children: "Você é um usuário comum." },
    ],
    fallback: "Nenhuma role reconhecida (visitante).",
  },
};

export default meta;

type Story = StoryObj<typeof RoleSwitch>;

export const Admin: Story = {
  args: { auth: session(["admin"]) },
};

export const User: Story = {
  args: { auth: session(["user"]) },
};

export const Visitor: Story = {
  args: { auth: session([]) },
};
