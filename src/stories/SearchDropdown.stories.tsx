import type { Meta, StoryObj } from "@storybook/react";
import { SearchDropdown } from "@/components/SearchDropdown/SearchDropdown";

const meta = {
  title: "Components/SearchDropdown",
  component: SearchDropdown,
  args: {
    inputLabelList: ["Nome", "Email", "CPF"],
    searchFunction: (s: string) => console.log("searchFunction:", s),
  },
  render: (args) => (
    <div className="min-h-[70vh] bg-background p-8 text-foreground">
      <div className="mx-auto w-full max-w-4xl">
        {/* “Anchor” simulando a barra onde o dropdown nasce */}
        <div className="relative rounded-md border border-border bg-muted p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Clique/Interaja nos campos e pressione Buscar.
            </p>
            <span className="text-xs text-muted-foreground">Toolbar mock</span>
          </div>

          {/* aqui o absolute do dropdown fica com contexto */}
          <SearchDropdown {...args} />
        </div>
      </div>
    </div>
  ),

} satisfies Meta<typeof SearchDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
