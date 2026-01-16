import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Dialog, type DialogProps } from "@/lib-components/Dialog";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Dialog> = {
  title: "Lib Components/Dialog",
  component: Dialog,
  argTypes: {
    type: {
      options: ["information", "alert", "decision", "confirmation", "error"],
      control: { type: "radio" },
    },
    visibility: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

function Stateful(args: Omit<DialogProps, "setVisibility">) {
  const [open, setOpen] = useState(args.visibility ?? false);

  useEffect(() => {
    setOpen(args.visibility ?? false);
  }, [args.visibility]);

  const withoutFns = args.type === "alert" || args.type === "information";

  return (
    <div className="min-h-[60vh] w-full bg-background text-foreground flex items-center justify-center">
      <Button onClick={() => setOpen(true)}>Show Dialog</Button>

      <Dialog
        {...(args as any)}
        visibility={open}
        setVisibility={setOpen}
        {...(!withoutFns && {
          rejectFunction: () => setOpen(false),
          acceptFunction: () => setOpen(false),
        })}
      />
    </div>
  );
}

export const DialogInformation: Story = {
  render: (args) => Stateful(args as any),
  args: {
    type: "information",
    title: "Information Dialog Title",
    children: "Information dialog message.",
    acceptLabel: "Confirmar",
  },
};

export const DialogAlert: Story = {
  render: (args) => Stateful(args as any),
  args: {
    type: "alert",
    title: "Alert Message Title",
    children: "Alert dialog message.",
  },
};

export const DialogDecision: Story = {
  render: (args) => Stateful(args as any),
  args: {
    type: "decision",
    title: "Decision Dialog Title",
    children: "Decision dialog message.",
  },
};

export const DialogConfirmation: Story = {
  render: (args) => Stateful(args as any),
  args: {
    type: "confirmation",
    title: "Confirmation Dialog Title",
    children: "Confirmation dialog message.",
  },
};

export const DialogError: Story = {
  render: (args) => Stateful(args as any),
  args: {
    type: "error",
    title: "Error Dialog Title",
    children: "Error dialog message.",
  },
};
