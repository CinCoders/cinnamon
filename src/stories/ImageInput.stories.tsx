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
  const [file, setFile] = React.useState<File | undefined>(undefined);

  return (
    <div className="mx-auto w-full max-w-xs">
      <ImageInput
        {...args}
        file={file}
        setFile={setFile as React.Dispatch<React.SetStateAction<File>>}
      />
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
