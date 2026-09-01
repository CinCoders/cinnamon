import type { Meta, StoryObj } from "@storybook/react";
import { ToastContainer, toast } from "@/components/Toast/Toast";
import { Button } from "@/components/ui/button";

const meta: Meta = {
  title: "Components/Toast",
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <ToastContainer topInitialPosition={0} toastProps={{ position: "top-right" }} />
      <Button onClick={() => toast("Toast padrão")}>Default</Button>
      <Button onClick={() => toast.success("Sucesso!")}>Success</Button>
      <Button onClick={() => toast.error("Erro!")}>Error</Button>
      <Button onClick={() => toast.warning("Atenção!")}>Warning</Button>
      <Button onClick={() => toast.info("Info")}>Info</Button>
    </div>
  ),
};
