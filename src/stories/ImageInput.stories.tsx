import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ImageInput } from "@/lib-components/ImageInput/ImageInput";

const meta: Meta<typeof ImageInput> = {
  title: "Lib Components/ImageInput",
  component: ImageInput,
  args: {
    id: "storybook-image-input",
    required: false,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof ImageInput>;

function Stateful(args: React.ComponentProps<typeof ImageInput>) {
  const [file, setFile] = React.useState<File | null>(null);

  return (
    <div className="flex w-40 flex-col items-center gap-4 pt-4 text-center">
      <ImageInput {...args} file={file} setFile={setFile} />

      <div className="flex w-full flex-col text-sm">
        <span className="font-medium">Nome do arquivo:</span>
        <span>{file?.name ?? "exemplo.png"}</span>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: (args) => Stateful(args),
};

export const Disabled: Story = {
  render: (args) => Stateful(args),
  args: {
    disabled: true,
  },
};
