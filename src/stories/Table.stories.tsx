import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "@/components/ui/table";
import { BasicTable } from "./table-examples/BasicTable";
import { CardVariantTable } from "./table-examples/CardVariantTable";
import { FlightsDataTable } from "./table-examples/FlightsDataTable";
import { FramedTable } from "./table-examples/FramedTable";
import { SelectableDataTable } from "./table-examples/SelectableDataTable";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Basic: Story = {
  render: () => <BasicTable />,
};

export const Framed: Story = {
  render: () => <FramedTable />,
};

export const CardVariant: Story = {
  render: () => <CardVariantTable />,
};

export const WithRowSelection: Story = {
  render: () => <SelectableDataTable />,
};

export const WithSortingPaginationAndExport: Story = {
  render: () => <FlightsDataTable />,
};
